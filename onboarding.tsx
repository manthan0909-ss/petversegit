import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogoFull } from "@/components/Logo";
import { Badge, btn } from "@/components/ui";
import { useTrack } from "@/lib/analytics";
import { pvHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  staticData: { sitemap: false },
  head: pvHead("Welcome — Set Up Your Pets", "Add your pets to PetVerse in under a minute.", { path: "/onboarding", noindex: true }),
  component: Onboarding,
});

const PET_TYPES = ["🐶 Dog", "🐱 Cat", "🐦 Bird", "🐰 Rabbit", "🐹 Hamster", "🐟 Fish", "🦜 Parrot", "🐢 Other"];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [petType, setPetType] = useState("🐶 Dog");
  const navigate = useNavigate();
  const track = useTrack();
  const input =
    "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring";

  return (
    <div className="flex min-h-screen items-center justify-center bg-pastel-green/40 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <LogoFull />
          <Badge tone="blue">Step {step + 1} of 3</Badge>
        </div>
        <div className="rounded-3xl border border-border bg-card p-7 shadow-lift">
          <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full gradient-brand transition-all" style={{ width: `${((step + 1) / 3) * 100}%` }} />
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <h1 className="font-display text-2xl font-bold">Namaste! What should we call you? 👋</h1>
              <input aria-label="Owner name" defaultValue="Abhishek Patil" placeholder="Owner name" className={input} />
              <input aria-label="City" placeholder="City (optional)" className={input} />
              <input aria-label="Phone number" placeholder="Phone (optional)" className={input} />
              <button className={cn(btn.primary, "w-full")} onClick={() => { track("onboarding_step", { step: 1 }); setStep(1); }}>Continue</button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h1 className="font-display text-2xl font-bold">Who's your pet? 🐾</h1>
              <div className="grid grid-cols-4 gap-2">
                {PET_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setPetType(t)}
                    className={cn(
                      "rounded-xl border border-border px-2 py-2.5 text-xs font-semibold transition hover:bg-muted",
                      petType === t && "border-primary bg-secondary ring-2 ring-primary",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input aria-label="Pet name" data-testid="pet-name" placeholder="Pet name *" defaultValue="Bruno" className={input} />
              <div className="grid grid-cols-2 gap-3">
                <input aria-label="Breed" defaultValue="Golden Retriever" placeholder="Breed" className={input} />
                <input aria-label="Age" placeholder="Age" className={input} />
                <select aria-label="Gender" className={input} defaultValue="Male">
                  <option>Male</option><option>Female</option>
                </select>
                <input aria-label="Weight in kilograms" placeholder="Weight (kg)" className={input} />
              </div>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-5 text-sm text-muted-foreground transition hover:border-primary hover:text-primary">
                📷 Add a photo (optional)
                <input type="file" accept="image/*" aria-label="Pet photo" className="hidden" />
              </label>
              <div className="flex gap-3">
                <button className={cn(btn.primary, "flex-1")} onClick={() => { track("onboarding_pet_added", { petType }); setStep(2); }}>Add pet & continue</button>
                <button className={btn.ghost} onClick={() => setStep(2)}>Skip for now</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 text-center">
              <p className="text-5xl">🎉</p>
              <h1 className="font-display text-2xl font-bold">You're all set!</h1>
              <p className="text-sm text-muted-foreground">
                You can add more pets anytime from My Pets. Each pet gets its own health records,
                reminders, QR Pet ID and more.
              </p>
              <div className="flex flex-col gap-3">
                <button className={cn(btn.primary, "w-full")} onClick={() => setStep(1)}>
                  + Add another pet
                </button>
                <button className={cn(btn.navy, "w-full")} onClick={() => { track("onboarding_completed", { petType }); navigate({ to: "/home" }); }}>
                  Go to my dashboard →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
