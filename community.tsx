import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Card, DemoMap, PageHeader, btn } from "@/components/ui";
import { PLACES, usePetVerse } from "@/lib/petverse";
import { pvHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Share2, Flag } from "lucide-react";

export const Route = createFileRoute("/_app/community")({
  staticData: { sitemap: true },
  head: pvHead("Community", "Because Pet Care Is Better Together — adoption, rescue, tips, events and pet-friendly places.", { path: "/community" }),
  component: Community,
});

const ADOPTION = [
  { name: "Laddoo", breed: "Indie pup · 3 mo", city: "Pune", emoji: "🐶" },
  { name: "Mishti", breed: "Kitten · 2 mo", city: "Mumbai", emoji: "🐱" },
  { name: "Rocky", breed: "Lab mix · 2 yr", city: "Bengaluru", emoji: "🦮" },
  { name: "Coco", breed: "Cocker Spaniel · 4 yr", city: "Delhi", emoji: "🐕" },
];

const EVENTS = [
  { t: "Sunday Puppy Social", d: "31 Aug · 7:00 AM · Cubbon Bark Park", n: "42 going" },
  { t: "Free Vaccination Camp", d: "5 Sep · 10:00 AM · City Vet Hospital", n: "118 going" },
  { t: "Adoption Drive", d: "12 Sep · 4:00 PM · AllPaws Store", n: "76 going" },
];

const ARTICLES = [
  { t: "Monsoon care: 7 things every Indian pet parent should do", tag: "Seasonal" },
  { t: "Reading dog body language — a beginner's guide", tag: "Behaviour" },
  { t: "How much should you really budget for a pet in India?", tag: "Finance" },
];

export default function Community() {
  const { posts, likePost } = usePetVerse();
  const [tab, setTab] = useState<"feed" | "adopt" | "events" | "places">("feed");
  const [posted, setPosted] = useState(false);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Because Pet Care Is Better Together 👥" subtitle="Adoption, rescue, tips, events and pet-friendly places" />

      <div className="mb-5 flex flex-wrap gap-2">
        {([["feed", "💬 Community Feed"], ["adopt", "🏠 Adoption & Rescue"], ["events", "📅 Events & Meetups"], ["places", "🌳 Pet-Friendly Places"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={cn("rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold transition hover:bg-muted", tab === k && "border-primary bg-primary text-primary-foreground")}>{l}</button>
        ))}
      </div>

      {tab === "feed" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Card tint="green">
              <form onSubmit={(e) => { e.preventDefault(); setPosted(true); setTimeout(() => setPosted(false), 2500); e.currentTarget.reset(); }}>
                <textarea
                  rows={2}
                  maxLength={500}
                  required
                  placeholder="Ask a question or share a tip with the community…"
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">📷 Photo · 🏷 Tag</span>
                  <button className={cn(btn.primary, "!px-4 !py-2 text-xs")}>{posted ? "✅ Posted!" : "Share post"}</button>
                </div>
              </form>
            </Card>

            {posts.map((p) => (
              <Card key={p.id} hover>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-lg">{p.avatar}</span>
                  <div>
                    <p className="text-sm font-bold">{p.author}</p>
                    <p className="text-xs text-muted-foreground">{p.time} ago</p>
                  </div>
                  <Badge tone="blue" className="ml-auto">{p.tag}</Badge>
                </div>
                <p className="mt-3 text-sm">{p.text}</p>
                <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                  <button onClick={() => likePost(p.id)} className="flex items-center gap-1.5 transition hover:text-destructive">
                    <Heart className="h-4 w-4" /> {p.likes}
                  </button>
                  <span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4" /> {p.comments}</span>
                  <span className="flex items-center gap-1.5"><Share2 className="h-4 w-4" /> Share</span>
                  <button className="ml-auto flex items-center gap-1.5 transition hover:text-foreground" title="Report this post">
                    <Flag className="h-3.5 w-3.5" /> Report
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card tint="blue">
              <h2 className="font-display font-bold">📰 News & Articles</h2>
              <ul className="mt-3 space-y-2">
                {ARTICLES.map((a) => (
                  <li key={a.t} className="rounded-xl bg-muted px-3 py-2.5">
                    <Badge tone="grey">{a.tag}</Badge>
                    <p className="mt-1 text-sm font-semibold leading-snug">{a.t}</p>
                  </li>
                ))}
              </ul>
            </Card>
            <Card tint="peach">
              <h2 className="font-display font-bold">⭐ Top Reviews</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                "PawSpa grooming was excellent — gentle with my anxious beagle." ⭐⭐⭐⭐⭐
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                "Dr. Mehra explained everything clearly. Booked in 30 seconds." ⭐⭐⭐⭐⭐
              </p>
            </Card>
            <Card className="bg-pastel-rose">
              <p className="text-xs">
                🛡 PetVerse moderates community content. Report anything unsafe, and our team reviews it
                within 24 hours.
              </p>
            </Card>
          </div>
        </div>
      )}

      {tab === "adopt" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ADOPTION.map((a) => (
            <Card key={a.name} hover tint="green" className="text-center">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pastel-green text-4xl">{a.emoji}</span>
              <h3 className="mt-3 font-display text-lg font-bold">{a.name}</h3>
              <p className="text-xs text-muted-foreground">{a.breed}</p>
              <Badge tone="grey" className="mt-2">📍 {a.city}</Badge>
              <button className={cn(btn.primary, "mt-4 w-full !py-2 text-xs")}>Meet {a.name}</button>
            </Card>
          ))}
          <Card tint="purple" className="sm:col-span-2 lg:col-span-4">
            <h2 className="font-display font-bold">❤️ Foster & Rescue Network</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Find rescue organizations, offer a foster home, raise a rescue request or volunteer your time.
              PetVerse connects rescuers, fosters and adopters in one place.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className={cn(btn.grape, "!px-4 !py-2 text-xs")}>Become a foster</button>
              <button className={cn(btn.outline, "!px-4 !py-2 text-xs")}>Raise a rescue request</button>
              <button className={cn(btn.outline, "!px-4 !py-2 text-xs")}>Volunteer</button>
            </div>
          </Card>
        </div>
      )}

      {tab === "events" && (
        <div className="grid gap-4 sm:grid-cols-3">
          {EVENTS.map((e) => (
            <Card key={e.t} hover tint="peach">
              <h3 className="font-display font-bold">{e.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{e.d}</p>
              <Badge tone="green" className="mt-2">{e.n}</Badge>
              <button className={cn(btn.primary, "mt-4 w-full !py-2 text-xs")}>I'm going</button>
            </Card>
          ))}
        </div>
      )}

      {tab === "places" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <DemoMap
            className="h-[420px]"
            label="PetVerse Nearby · Google Maps API ready"
            pins={[
              { emoji: "🩺", top: "22%", left: "30%", label: "Vet" },
              { emoji: "🌳", top: "48%", left: "58%", label: "Park" },
              { emoji: "☕", top: "70%", left: "28%", label: "Café" },
              { emoji: "🏨", top: "35%", left: "76%", label: "Hotel" },
              { emoji: "🏠", top: "62%", left: "48%", label: "You" },
            ]}
          />
          <div className="space-y-2">
            <h2 className="font-display text-lg font-bold">PetVerse Nearby</h2>
            {PLACES.map((p) => (
              <Card key={p.id} hover className="!p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge tone="grey">{p.type}</Badge>
                    <p className="mt-1 font-display text-sm font-bold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">⭐ {p.rating} · {p.distance} · {p.info}</p>
                  </div>
                  <button className={cn(btn.outline, "!px-3 !py-1.5 text-xs")}>Directions</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
