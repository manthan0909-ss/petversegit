import { createFileRoute } from "@tanstack/react-router";
import { Badge, Card, ComingSoon, PageHeader, StatCard, btn } from "@/components/ui";
import { usePetVerse } from "@/lib/petverse";
import { pvHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/fun")({
  staticData: { sitemap: false },
  head: pvHead("Fun & Engagement", "Streaks, badges, challenges, milestones and AI pet portraits — care that feels rewarding.", { path: "/fun", noindex: true }),
  component: Fun,
});

const BADGES = [
  { icon: "🔥", t: "7 Day Care Streak", got: true },
  { icon: "💉", t: "Vaccination Hero", got: true },
  { icon: "🚶", t: "1000 Steps Walked", got: true },
  { icon: "🏷", t: "QR Protected", got: true },
  { icon: "🧠", t: "Quiz Champion", got: false },
  { icon: "🏆", t: "30 Day Streak", got: false },
];

const CHALLENGES = [
  { t: "Walk 5 km this week", p: 72, r: "50 points" },
  { t: "Log every meal for 7 days", p: 40, r: "Badge + 10% off" },
  { t: "Complete a grooming session", p: 100, r: "Completed ✅" },
];

const MILESTONES = [
  { icon: "🎂", t: "Bruno turns 5", d: "12 March 2027" },
  { icon: "❤️", t: "3 years together", d: "18 April 2027" },
  { icon: "🎓", t: "Finished basic training", d: "Achieved" },
];

export default function Fun() {
  const { selectedPet } = usePetVerse();
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="PetVerse Rewards 🎉"
        subtitle="Fun on top, health and safety at the core."
        action={<Badge tone="peach">🔥 7 Day Care Streak</Badge>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon="🔥" value="7 days" label="Care streak" />
        <StatCard icon="🎯" value="1,240" label="PetVerse points" />
        <StatCard icon="🏅" value="4 / 6" label="Badges earned" />
        <StatCard icon="🎁" value="₹300" label="Rewards unlocked" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card tint="peach">
          <h2 className="font-display text-lg font-bold">🏅 Badges</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {BADGES.map((b) => (
              <div key={b.t} className={cn("rounded-2xl border border-border p-3 text-center", b.got ? "bg-pastel-yellow" : "bg-muted opacity-50")}>
                <span className="text-2xl">{b.icon}</span>
                <p className="mt-1 text-[10px] font-bold leading-tight">{b.t}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card tint="green">
          <h2 className="font-display text-lg font-bold">🎯 Challenges</h2>
          <div className="mt-4 space-y-4">
            {CHALLENGES.map((c) => (
              <div key={c.t}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{c.t}</span>
                  <span className="text-xs text-muted-foreground">{c.p}%</span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full gradient-brand" style={{ width: `${c.p}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Reward: {c.r}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card tint="purple">
          <h2 className="font-display text-lg font-bold">❤️ Milestones & Birthdays</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {MILESTONES.map((m) => (
              <li key={m.t} className="flex items-center gap-3 rounded-xl bg-muted px-3 py-2.5">
                <span className="text-xl">{m.icon}</span>
                <span>
                  <span className="block font-semibold">{m.t}</span>
                  <span className="text-xs text-muted-foreground">{m.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card tint="blue" className="lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold">🎨 AI Pet Portraits</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Turn {selectedPet.name}'s best photo into a painted portrait, sticker pack or birthday card.
              </p>
            </div>
            <ComingSoon />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {["🖼", "🎨", "🃏", "🎂"].map((e) => (
              <div key={e} className="flex h-20 items-center justify-center rounded-2xl bg-secondary text-3xl">{e}</div>
            ))}
          </div>
        </Card>

        <Card tint="peach">
          <h2 className="font-display text-lg font-bold">🧠 Quiz of the Day</h2>
          <p className="mt-2 text-sm font-semibold">How often should an adult dog be dewormed?</p>
          <div className="mt-3 space-y-2">
            {["Every month", "Every 3 months", "Once a year"].map((o) => (
              <button key={o} className={cn(btn.outline, "w-full !justify-start text-xs")}>{o}</button>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-muted p-3 text-xs">
            📊 <strong>Poll:</strong> What should we build next? GPS collar (58.7%) · AI health (22%) · CCTV (19.3%)
          </div>
        </Card>

        <Card tint="green" className="lg:col-span-3">
          <h2 className="font-display text-lg font-bold">📸 Photo Sharing</h2>
          <p className="mt-1 text-sm text-muted-foreground">Share {selectedPet.name}'s moments with the PetVerse community.</p>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {["🐶", "🎾", "🌊", "🛁", "🚗", "😴"].map((e) => (
              <div key={e} className="flex h-24 items-center justify-center rounded-2xl bg-secondary text-3xl">{e}</div>
            ))}
          </div>
          <button className={cn(btn.primary, "mt-4")}>📷 Upload a photo</button>
        </Card>
      </div>
    </div>
  );
}
