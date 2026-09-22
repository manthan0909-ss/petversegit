import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Card, ComingSoon, PageHeader, btn } from "@/components/ui";
import { usePetVerse } from "@/lib/petverse";
import { pvHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

export const Route = createFileRoute("/_app/ai")({
  staticData: { sitemap: true },
  head: pvHead("AI Pet Assistant", "Smarter Guidance for Better Pet Care — breed ID, food, behaviour and symptom guidance.", { path: "/ai" }),
  component: AIAssistant,
});

const FEATURES = [
  { icon: "🤖", t: "Breed Identification" },
  { icon: "🍖", t: "Food Recommendations" },
  { icon: "❤️", t: "Care Guidance" },
  { icon: "🐕", t: "Behaviour Tips" },
  { icon: "🔎", t: "Basic Symptom Guidance" },
  { icon: "🔔", t: "Personalized Reminders" },
  { icon: "📊", t: "Personalized Insights" },
];

interface Msg { role: "user" | "ai"; text: string }

function reply(q: string, petName: string, breed: string, weight: number): string {
  const l = q.toLowerCase();
  if (l.includes("food") || l.includes("eat") || l.includes("diet"))
    return `For a ${breed} at ${weight} kg, aim for roughly ${Math.round(weight * 25)}–${Math.round(weight * 30)} g of quality dry food a day, split across two meals. Choose a formula with real meat as the first ingredient and glucosamine for joint support. Keep treats under 10% of daily calories, and always fresh water available. ${petName}'s recorded allergies are worth double-checking on any new label.`;
  if (l.includes("vaccin"))
    return `${petName}'s next vaccination is the rabies booster, due tomorrow at 10:00 AM. After that, the DHPPiL booster falls on 12 September. Both are already set as reminders — I'll nudge you a day before each.`;
  if (l.includes("activity") || l.includes("exercise") || l.includes("walk"))
    return `A ${breed} does best with 60–90 minutes of activity daily. Try: a brisk 30-min morning walk, 15 minutes of fetch or tug in the evening, and two short sniff-walks. Add a puzzle feeder for mental exercise — it tires them out more than you'd expect.`;
  if (l.includes("scratch") || l.includes("itch"))
    return `Frequent scratching usually points to fleas/ticks, dry skin, or a food sensitivity. Check for flea dirt at the tail base, look for redness between the toes, and note whether it started after a food change. A gentle oatmeal or anti-tick shampoo can help short term. If the skin is broken, smelly, or the scratching lasts more than a few days, please see a vet — this needs a proper diagnosis.`;
  if (l.includes("breed"))
    return `Based on your profile, ${petName} is a ${breed}. Typical traits: high sociability, moderate-to-high energy, and a coat that needs weekly brushing. Watch for hip/elbow issues and ear infections in this breed.`;
  return `Here's what I'd suggest for ${petName} (${breed}, ${weight} kg): keep a steady feeding and walking routine, brush weekly, and log weight monthly so we can spot trends early. Tell me more about what you're noticing — behaviour, appetite, or a symptom — and I'll give more specific guidance.`;
}

export default function AIAssistant() {
  const { selectedPet } = usePetVerse();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: `Hi Abhishek! I'm PetVerse AI 🤖 Ask me anything about ${selectedPet.name}'s food, health, behaviour or care routine.` },
  ]);
  const [input, setInput] = useState("");

  const quick = [
    `What food is suitable for ${selectedPet.name}?`,
    `When is ${selectedPet.name}'s next vaccination?`,
    `How can I improve ${selectedPet.name}'s daily activity?`,
    "My pet is scratching a lot. What should I do?",
  ];

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: reply(text, selectedPet.name, selectedPet.breed, selectedPet.weight) }]);
    }, 500);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="PetVerse AI 🤖"
        subtitle="Smarter Guidance for Better Pet Care."
        action={<Badge tone="purple">Personalized for {selectedPet.name}</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card tint="purple" className="flex h-[560px] flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {msgs.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <p
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                    m.role === "user"
                      ? "gradient-grape text-white"
                      : "bg-muted",
                  )}
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {quick.map((q) => (
              <button key={q} onClick={() => send(q)} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold transition hover:border-grape hover:text-grape">
                {q}
              </button>
            ))}
          </div>

          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder={`Ask about ${selectedPet.name}…`}
              className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button className={cn(btn.grape, "!px-4")} aria-label="Send"><Send className="h-4 w-4" /></button>
          </form>
          <p className="mt-2 text-[11px] text-muted-foreground">
            PetVerse AI provides general guidance and does not replace professional veterinary advice.
          </p>
        </Card>

        <div className="space-y-4">
          <Card tint="green">
            <h2 className="font-display font-bold">What I can help with</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {FEATURES.map((f) => (
                <li key={f.t} className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                  <span>{f.icon}</span> {f.t}
                </li>
              ))}
            </ul>
          </Card>
          <Card tint="blue">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display font-bold">AI Health Prediction</h2>
              <ComingSoon />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Analyse symptoms, health history, behaviour, weight and activity to flag risk indicators and
              suggest when a professional check-up may be needed.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
