import { Link } from "@tanstack/react-router";
import { useAnalytics } from "@/lib/analytics";
import { btn } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function CookieConsent() {
  const { consent, setConsent } = useAnalytics();
  if (consent !== null) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-2xl border border-border bg-card/98 p-4 shadow-lift backdrop-blur md:bottom-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          <span className="font-semibold text-foreground">We use cookies 🍪</span> — essential ones keep
          PetVerse working; analytics cookies help us see which pet-care features you use most. Read our{" "}
          <Link to="/settings" className="font-semibold text-primary underline underline-offset-2">
            privacy settings
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent("denied")}
            className={cn(btn.outline, "!px-4 !py-2 text-xs")}
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => setConsent("granted")}
            className={cn(btn.primary, "!px-4 !py-2 text-xs")}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
