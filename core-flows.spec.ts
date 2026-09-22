import { test, expect, type Page } from "@playwright/test";

/** Navigate and wait until React has hydrated, so clicks are not dropped. */
async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

/** Dismiss the consent banner so it never covers CTAs (retries until hydrated). */
async function acceptCookies(page: Page) {
  const banner = page.getByRole("region", { name: "Cookie consent" });
  const accept = page.getByRole("button", { name: "Accept all" });
  await expect(async () => {
    if (await banner.count()) await accept.click({ timeout: 2000 });
    await expect(banner).toHaveCount(0);
  }).toPass({ timeout: 20000 });
}

test.describe("PetVerse core flows", () => {
  test("landing page loads with brand messaging and consent banner", async ({ page }) => {
    await open(page, "/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Everything Your Pet Needs");
    await expect(page.getByRole("region", { name: "Cookie consent" })).toBeVisible();
    await acceptCookies(page);
    await expect(page.getByRole("region", { name: "Cookie consent" })).toHaveCount(0);
  });

  test("onboarding flow completes and lands on the dashboard", async ({ page }) => {
    await open(page, "/onboarding");
    await acceptCookies(page);

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Namaste");
    await page.getByLabel("Owner name").fill("Abhishek Patil");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("button", { name: "🐶 Dog" }).click();
    await page.getByTestId("pet-name").fill("Bruno");
    await page.getByRole("button", { name: "Add pet & continue" }).click();

    await expect(page.getByRole("heading", { name: "You're all set!" })).toBeVisible();
    await page.getByRole("button", { name: /Go to my dashboard/ }).click();

    await expect(page).toHaveURL(/\/home$/);
  });

  test("selecting a pet updates the app shell", async ({ page }) => {
    await open(page, "/home");
    await acceptCookies(page);

    const switcher = page.getByTestId("pet-switcher");
    const options = page.locator('[data-testid^="pet-option-"]');
    await expect(async () => {
      await switcher.click();
      await expect(options.first()).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 20000 });

    const second = options.nth(1);
    const name = ((await second.textContent()) ?? "").trim();
    await second.click();
    await expect(switcher).toContainText(name.split("\n")[0]!.slice(0, 4));
  });

  test("booking a service shows a confirmation", async ({ page }) => {
    await open(page, "/services");
    await acceptCookies(page);

    const dialog = page.getByRole("dialog");
    await expect(async () => {
      await page.getByTestId("book-service").first().click();
      await expect(dialog).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 20000 });
    await expect(dialog).toContainText("Confirm your booking");

    await page.getByTestId("confirm-booking").click();
    await expect(page.getByTestId("booking-confirmed")).toBeVisible();

    await page.getByRole("button", { name: "Done" }).click();
    await expect(page.getByText("Upcoming Appointments")).toBeVisible();
  });

  test("keyboard users can reach main content via skip link", async ({ page }) => {
    await open(page, "/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  });
});
