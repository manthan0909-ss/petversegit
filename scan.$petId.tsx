import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { LogoFull } from "@/components/Logo";
import { Badge, Card, DemoMap, PetAvatar, btn } from "@/components/ui";
import { PETS } from "@/lib/petverse";
import { tagIdFor, useLostFlow } from "@/lib/lost-flow";
import { pvHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/scan/$petId")({
  staticData: { sitemap: false },
  head: pvHead("Help This Pet Get Home", "You scanned a PetVerse Smart QR Pet ID. Help reunite this pet with their family — safely.", { noindex: true }),
  component: ScanPage,
});

const FINDER_SPOTS = [
  "Lake Road, near the park gate",
  "MG Metro Station exit 2",
  "Green Avenue, Sector 21",
];

/** Public safe page a finder sees after scanning the physical collar QR tag. */
export default function ScanPage() {
  const { petId } = Route.useParams();
  const pet = PETS.find((p) => p.id === petId) ?? PETS[0]!;
  const petIndex = PETS.findIndex((p) => p.id === pet.id);
  const { safetyOf, recordScan, shareFinderLocation } = useLostFlow();
  const safety = safetyOf(pet.id);
  const [step, setStep] = useState<"idle" | "contact" | "found" | "shared">("idle");
  const [spot, setSpot] = useState(FINDER_SPOTS[0]!);
  const [withLocation, setWithLocation] = useState(true);
  const logged = useRef(false);

  /* A real scan of the physical tag opens this URL — log it once for the owner. */
  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    recordScan(pet.id, pet.name);
  }, [pet.id, pet.name, recordScan]);

  const notifyOwner = (sharedLocation: boolean, note?: string) => {
    shareFinderLocation(pet.id, pet.name, {
      location: sharedLocation ? spot : "Not shared",
      sharedLocation,
      ...(note ? { note } : {}),
    });
    setWithLocation(sharedLocation);
    setStep("shared");
    toast.success(`${pet.name}'s owner has been notified`, {
      description: sharedLocation ? `Location shared: ${spot}` : "Message sent without a location.",
    });
  };

  const isLost = safety.status === "lost";

  return (
    <div className="min-h-dvh bg-pastel-teal/50">
      <header className="flex items-center justify-center border-b border-border bg-card py-3">
        <LogoFull />
      </header>

      <main id="main-content" className="mx-auto max-w-md px-4 py-8">
        <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-lift">
          <Badge tone="green">🏷 Verified PetVerse QR Pet ID</Badge>
          <div className="mt-5 flex justify-center">
            <PetAvatar emoji={pet.emoji} color={pet.color} size="lg" ring />
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold">{pet.name}</h1>
          <p className="text-muted-foreground">{pet.species} · {pet.breed}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            Tag ID: {tagIdFor(pet.id, petIndex)} · Pet ID: {pet.petCode}
          </p>

          {isLost ? (
            <div className="mt-5 rounded-2xl border-2 border-destructive/40 bg-destructive/10 px-4 py-3">
              <p className="font-display text-lg font-bold text-destructive">⚠️ This pet may be lost</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Reported missing by the family{safety.lastSeen ? ` — last seen near ${safety.lastSeen}` : ""}.
              </p>
            </div>
          ) : (
            <p className="mt-5 rounded-2xl bg-pastel-yellow px-4 py-3 font-display text-lg font-bold">
              Help {pet.name} Get Home 🏡
            </p>
          )}

          <dl className="mt-4 grid grid-cols-3 gap-2 text-left">
            {[
              ["Age", pet.age],
              ["Gender", pet.gender],
              ["Weight", `${pet.weight} kg`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-muted px-3 py-2">
                <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</dt>
                <dd className="text-sm font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          {pet.allergies.length > 0 && (
            <p className="mt-2 rounded-xl bg-pastel-rose px-3 py-2 text-left text-xs">
              ⚠ Allergies: <strong>{pet.allergies.join(", ")}</strong> — please avoid feeding these.
            </p>
          )}

          <div className="mt-5 space-y-3">
            <button className={cn(btn.primary, "w-full min-h-11")} onClick={() => setStep("contact")}>
              📞 Contact Owner
            </button>
            <button className={cn(btn.navy, "w-full min-h-11")} onClick={() => setStep("found")}>
              📍 I Found This Pet
            </button>
            <a href="tel:1962" className={cn(btn.danger, "w-full min-h-11")}>
              🚨 Call Animal Emergency (1962)
            </a>
          </div>

          {step === "contact" && (
            <Card className="mt-5 text-left" tint="green">
              <p className="font-semibold">Safe contact — privacy protected 🔒</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The owner's phone number and home address stay hidden. Send a message through PetVerse and
                the owner is notified instantly.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const note = String(new FormData(e.currentTarget).get("note") ?? "");
                  notifyOwner(false, note);
                }}
              >
                <label className="sr-only" htmlFor="finder-note">Message to the owner</label>
                <textarea
                  id="finder-note"
                  name="note"
                  rows={3}
                  required
                  placeholder={`Hi! I found ${pet.name} near…`}
                  className="mt-3 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button className={cn(btn.primary, "mt-2 w-full min-h-11")}>Send message to owner</button>
              </form>
            </Card>
          )}

          {step === "found" && (
            <Card className="mt-5 text-left" tint="blue">
              <p className="font-semibold">Share your location 📍</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sharing is completely voluntary. Your location is sent to the owner once, so they can reach
                {" "}{pet.name} quickly.
              </p>
              <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-muted-foreground" htmlFor="finder-spot">
                Where did you find {pet.name}?
              </label>
              <select
                id="finder-spot"
                value={spot}
                onChange={(e) => setSpot(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {FINDER_SPOTS.map((s) => <option key={s}>{s}</option>)}
              </select>
              <button
                className={cn(btn.navy, "mt-3 w-full min-h-11")}
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      () => notifyOwner(true),
                      () => notifyOwner(true),
                    );
                  } else {
                    notifyOwner(true);
                  }
                }}
              >
                Allow location & notify owner
              </button>
              <button className={cn(btn.ghost, "mt-1 w-full min-h-11")} onClick={() => notifyOwner(false)}>
                Notify without location
              </button>
            </Card>
          )}

          {step === "shared" && (
            <Card className="mt-5 text-left" tint="green">
              <p className="font-semibold">✅ Owner notified!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                "{pet.name}'s QR Pet ID was scanned{withLocation ? ` and a location was shared: ${spot}` : ""}."
                {" "}Thank you for being a hero. 💚
              </p>
              {withLocation && (
                <DemoMap
                  className="mt-3 h-40"
                  pins={[{ emoji: "📍", top: "45%", left: "55%", label: "You are here" }]}
                  label="Demo location · shared with owner"
                />
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                Please stay with {pet.name} if it is safe to do so. The family can now see this update in
                their PetVerse notifications.
              </p>
            </Card>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          This page never reveals the owner's private address, phone number or documents.{" "}
          <Link to="/" className="font-semibold text-primary hover:underline">What is PetVerse?</Link>
        </p>
      </main>
    </div>
  );
}
