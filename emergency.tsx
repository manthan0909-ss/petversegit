import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Card, DemoMap, PageHeader, btn } from "@/components/ui";
import { PLACES, usePetVerse } from "@/lib/petverse";
import { pvHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/emergency")({
  staticData: { sitemap: true },
  head: pvHead("Emergency SOS", "When Every Second Counts — nearby emergency vets, medical info and instant contacts.", { path: "/emergency" }),
  component: Emergency,
});

const CONTACTS = [
  { icon: "🩺", label: "PetCare 24×7 Clinic", sub: "1.2 km · open now", tel: "+91 98765 43210" },
  { icon: "🚑", label: "City Animal Ambulance", sub: "Partner service · ETA 12 min", tel: "+91 98765 11223" },
  { icon: "👤", label: "Abhishek (Owner)", sub: "Primary contact", tel: "+91 98765 00000" },
  { icon: "👨‍👩‍👧", label: "Family — Sneha", sub: "Secondary contact", tel: "+91 98765 55555" },
];

export default function Emergency() {
  const { selectedPet } = usePetVerse();
  const [active, setActive] = useState(false);
  const emergencyVets = PLACES.filter((p) => p.type.includes("Vet") || p.type.includes("Emergency"));

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="🚨 Emergency SOS"
        subtitle="When Every Second Counts."
        action={<Badge tone="red">Speed over decoration</Badge>}
      />

      <button
        onClick={() => setActive((a) => !a)}
        className={cn(
          "w-full rounded-3xl bg-destructive px-6 py-8 text-center text-destructive-foreground shadow-lift transition active:scale-[0.99]",
          !active && "animate-pulse-ring",
        )}
      >
        <p className="font-display text-3xl font-extrabold">{active ? "SOS ACTIVE" : "ACTIVATE EMERGENCY SOS"}</p>
        <p className="mt-1 text-sm opacity-90">
          {active
            ? `${selectedPet.name}'s medical info & your location are ready to share.`
            : `Instantly surface ${selectedPet.name}'s medical info, contacts and nearest vets.`}
        </p>
      </button>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card tint="red">
          <h2 className="font-display text-lg font-bold">{selectedPet.name}'s Emergency Card</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="rounded-xl bg-muted px-3 py-2">🐾 {selectedPet.species} · {selectedPet.breed} · {selectedPet.gender}</li>
            <li className="rounded-xl bg-muted px-3 py-2">⚖️ Weight: <strong>{selectedPet.weight} kg</strong> · Age {selectedPet.age}</li>
            <li className="rounded-xl bg-destructive/10 px-3 py-2 font-semibold text-destructive">
              ⚠ Allergies: {selectedPet.allergies.join(", ") || "None recorded"}
            </li>
            <li className="rounded-xl bg-muted px-3 py-2">📝 {selectedPet.notes}</li>
            <li className="rounded-xl bg-muted px-3 py-2">🆔 Pet ID: <strong>{selectedPet.petCode}</strong></li>
          </ul>
          <div className="mt-4 flex gap-2">
            <button className={cn(btn.navy, "flex-1 !py-2 text-xs")}>📤 Share pet profile with vet</button>
            <Link to="/passport" className={cn(btn.outline, "!py-2 text-xs")}>🪪 Passport</Link>
          </div>
        </Card>

        <Card tint="red">
          <h2 className="font-display text-lg font-bold">Emergency Contacts</h2>
          <ul className="mt-3 space-y-2">
            {CONTACTS.map((c) => (
              <li key={c.label} className="flex items-center gap-3 rounded-xl bg-muted px-3 py-2.5">
                <span className="text-xl">{c.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{c.label}</span>
                  <span className="text-xs text-muted-foreground">{c.sub}</span>
                </span>
                <a href={`tel:${c.tel.replace(/\s/g, "")}`} className={cn(btn.danger, "!px-3 !py-1.5 text-xs")}>📞 Call</a>
              </li>
            ))}
          </ul>
        </Card>

        <Card tint="red" className="lg:col-span-2">
          <h2 className="font-display text-lg font-bold">Nearby Emergency Vets</h2>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <DemoMap
              className="h-56"
              label="Your current location · nearest 24×7 clinics"
              pins={[
                { emoji: "🏠", top: "60%", left: "35%", label: "You" },
                { emoji: "🩺", top: "28%", left: "60%", label: "1.2 km" },
                { emoji: "🚨", top: "70%", left: "72%", label: "2.9 km" },
              ]}
            />
            <ul className="space-y-2">
              {emergencyVets.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-2 rounded-xl bg-muted px-3 py-2.5">
                  <span>
                    <span className="block text-sm font-semibold">{v.name}</span>
                    <span className="text-xs text-muted-foreground">⭐ {v.rating} · {v.distance} · {v.info}</span>
                  </span>
                  <button className={cn(btn.navy, "!px-3 !py-1.5 text-xs")}>Directions</button>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <Card className="mt-6 bg-pastel-yellow">
        <p className="text-sm">
          🩺 PetVerse helps you reach help faster but is not a substitute for veterinary treatment. In a
          life-threatening emergency, call the nearest clinic immediately.
        </p>
      </Card>
    </div>
  );
}
