import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge, Card, PageHeader, StatCard, btn } from "@/components/ui";
import { INSURANCE, usePetVerse, inr } from "@/lib/petverse";
import { pvHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/finance")({
  staticData: { sitemap: true },
  head: pvHead("Pet Finance & Insurance", "Understand. Plan. Care Better. Track pet expenses, set budgets and compare insurance.", { path: "/finance" }),
  component: Finance,
});

const CATEGORIES = ["Food", "Vet", "Medicine", "Grooming", "Boarding", "Accessories", "Training", "Other"];
const CAT_COLORS: Record<string, string> = {
  Food: "pastel-green", Vet: "pastel-rose", Medicine: "pastel-purple", Grooming: "pastel-blue",
  Boarding: "pastel-teal", Accessories: "pastel-peach", Training: "pastel-yellow", Other: "muted",
};
const BUDGET = 6000;

export default function Finance() {
  const { selectedPet, expenses, addExpense } = usePetVerse();
  const [added, setAdded] = useState(false);
  const petExpenses = expenses.filter((e) => e.petId === selectedPet.id);
  const total = petExpenses.reduce((s, e) => s + e.amount, 0);

  const byCat = useMemo(() => {
    const m = new Map<string, number>();
    petExpenses.forEach((e) => m.set(e.category, (m.get(e.category) ?? 0) + e.amount));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [petExpenses]);

  const max = Math.max(1, ...byCat.map(([, v]) => v));
  const input = "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Understand. Plan. Care Better. 💰"
        subtitle={`Pet finance for ${selectedPet.name}`}
        action={<Badge tone="green">This Month</Badge>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon="💰" value={inr(total)} label="Spent this month" />
        <StatCard icon="📊" value={inr(BUDGET)} label="Monthly budget" />
        <StatCard icon="📈" value={inr(Math.max(0, BUDGET - total))} label="Remaining" />
        <StatCard icon="🧾" value={String(petExpenses.length)} label="Transactions" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card tint="green">
          <h2 className="font-display text-lg font-bold">Expense Breakdown</h2>
          <div className="mt-4 space-y-3">
            {byCat.length === 0 && <p className="text-sm text-muted-foreground">No expenses logged yet for {selectedPet.name}.</p>}
            {byCat.map(([cat, amt]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{cat}</span>
                  <span>{inr(amt)}</span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(amt / max) * 100}%`, backgroundColor: `var(--color-${CAT_COLORS[cat] ?? "primary"})`, filter: "saturate(2.2) brightness(0.85)" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
            <span className="font-display font-bold">Total</span>
            <span className="font-display text-2xl font-extrabold">{inr(total)}</span>
          </div>
          <div className="mt-3">
            <p className="mb-1 text-xs text-muted-foreground">Budget used — {Math.round((total / BUDGET) * 100)}%</p>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full gradient-brand" style={{ width: `${Math.min(100, (total / BUDGET) * 100)}%` }} />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card tint="blue">
            <h2 className="font-display text-lg font-bold">Add an Expense</h2>
            <form
              className="mt-3 space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                addExpense({
                  petId: selectedPet.id,
                  category: String(f.get("category")),
                  label: String(f.get("label")),
                  amount: Number(f.get("amount")),
                  date: String(f.get("date")),
                });
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
                e.currentTarget.reset();
              }}
            >
              <div className="grid grid-cols-2 gap-2">
                <select name="category" className={input}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
                <input name="amount" type="number" min="1" required placeholder="Amount ₹" className={input} />
                <input name="label" required maxLength={60} placeholder="What was it for?" className={input} />
                <input name="date" required placeholder="Date" className={input} />
              </div>
              <button className={cn(btn.primary, "w-full !py-2 text-xs")}>{added ? "✅ Expense added!" : "Track Expense"}</button>
            </form>
          </Card>

          <Card tint="peach">
            <h2 className="font-display text-lg font-bold">Expense History</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {petExpenses.map((e) => (
                <li key={e.id} className="flex items-center justify-between rounded-xl bg-muted px-3 py-2.5">
                  <span>
                    <span className="block font-semibold">{e.label}</span>
                    <span className="text-xs text-muted-foreground">{e.category} · {e.date}</span>
                  </span>
                  <span className="font-display font-bold">{inr(e.amount)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Insurance */}
      <h2 className="mt-10 font-display text-2xl font-bold">🏥 Pet Insurance</h2>
      <p className="mt-1 text-sm text-muted-foreground">Compare plans from PetVerse partners and pick the right cover.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {INSURANCE.map((p) => (
          <Card key={p.id} hover {...(p.best ? { tint: "green" as const } : {})} className={cn(p.best && "ring-2 ring-primary")}>
            {p.best && <Badge tone="green" className="mb-2">Recommended</Badge>}
            <h3 className="font-display text-lg font-bold">{p.partner}</h3>
            <p className="mt-1 font-display text-2xl font-extrabold text-primary">{p.price}</p>
            <p className="text-xs text-muted-foreground">Cover up to {p.cover}</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {p.benefits.map((b) => <li key={b}>✅ {b}</li>)}
            </ul>
            <button className={cn(p.best ? btn.primary : btn.outline, "mt-4 w-full !py-2 text-xs")}>Compare plan</button>
          </Card>
        ))}
      </div>
    </div>
  );
}
