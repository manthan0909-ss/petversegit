import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Badge, Card, EmptyState, btn } from "@/components/ui";
import { usePetVerse, inr } from "@/lib/petverse";
import { ORDER_STEPS, TAG_PRODUCTS, useQrOrders, type TagVariant } from "@/lib/qr-orders";
import { cn } from "@/lib/utils";

const input =
  "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition focus:border-primary";

const PAYMENTS = ["UPI (Google Pay / PhonePe)", "Credit / Debit card", "Net banking", "Cash on delivery"];

/**
 * QR collar-tag store. Ordering, payment and shipping are simulated for the
 * demo — clearly labelled so nobody expects a real parcel.
 */
export function QrTagStore({ compact = false }: { compact?: boolean }) {
  const { pets, selectedPet } = usePetVerse();
  const { orders, placeOrder, advance, cancelOrder } = useQrOrders();

  const [variant, setVariant] = useState<TagVariant | null>(null);
  const [petId, setPetId] = useState(selectedPet.id);
  const [engraving, setEngraving] = useState("");
  const [address, setAddress] = useState("Flat 402, Green Residency, Sector 21, Pune 411045");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [payment, setPayment] = useState(PAYMENTS[0]!);
  const [placedId, setPlacedId] = useState<string | null>(null);

  const product = TAG_PRODUCTS.find((p) => p.id === variant);
  const pet = pets.find((p) => p.id === petId) ?? selectedPet;
  const placed = orders.find((o) => o.id === placedId);

  function close() {
    setVariant(null);
    setPlacedId(null);
    setEngraving("");
  }

  return (
    <section aria-labelledby="qr-tag-store" className="mt-2">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="qr-tag-store" className="font-display text-xl font-bold">
            Smart QR Pet ID Tags 🏷
          </h2>
          <p className="text-sm text-muted-foreground">
            A real metal tag for your pet's collar. Anyone who finds them scans it and can reach
            you — without ever seeing your phone number or address.
          </p>
        </div>
        <Badge tone="peach">Demo order · no real payment or delivery</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TAG_PRODUCTS.map((p) => (
          <Card key={p.id} hover className="flex flex-col">
            <div className="flex h-28 items-center justify-center rounded-xl bg-secondary text-5xl" aria-hidden>
              {p.emoji}
            </div>
            <h3 className="mt-3 font-display text-base font-bold leading-snug">{p.name}</h3>
            <p className="text-xs text-muted-foreground">{p.material}</p>
            <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
            <ul className="mt-3 space-y-1 text-xs">
              {p.perks.map((perk) => (
                <li key={perk} className="flex gap-2">
                  <span aria-hidden className="text-primary">✓</span>
                  {perk}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between pt-4">
              <span>
                <span className="font-display text-lg font-bold">{inr(p.price)}</span>{" "}
                <span className="text-xs text-muted-foreground line-through">{inr(p.mrp)}</span>
              </span>
              <button
                className={cn(btn.primary, "!px-4 !py-2 text-xs")}
                onClick={() => { setVariant(p.id); setPlacedId(null); }}
              >
                Order tag
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* My tag orders */}
      {!compact && (
        <div className="mt-8">
          <h3 className="font-display text-lg font-bold">My Tag Orders</h3>
          {orders.length === 0 ? (
            <EmptyState
              icon="📦"
              title="No tag orders yet"
              body="Order a QR tag above and you'll be able to follow it from payment to delivery right here."
            />
          ) : (
            <ul className="mt-3 space-y-3">
              {orders.map((o) => {
                const stepIndex = ORDER_STEPS.findIndex((s) => s.status === o.status);
                return (
                  <li key={o.id}>
                    <Card>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display font-bold">{o.variantName}</p>
                          <p className="text-xs text-muted-foreground">
                            Order {o.id} · for {o.petName} · tag {o.tagId} · {inr(o.price)} paid by {o.paymentMethod}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Delivering to {o.address} · arriving by {o.eta}
                          </p>
                          {o.engraving && (
                            <p className="mt-1 text-xs text-muted-foreground">Engraving: “{o.engraving}”</p>
                          )}
                        </div>
                        <Badge tone={o.status === "activated" ? "green" : "purple"}>
                          {ORDER_STEPS[stepIndex]?.label ?? "Processing"}
                        </Badge>
                      </div>

                      {/* Tracking steps */}
                      <ol className="mt-4 grid gap-2 sm:grid-cols-5">
                        {ORDER_STEPS.map((s, i) => (
                          <li
                            key={s.status}
                            className={cn(
                              "rounded-xl px-3 py-2 text-center text-xs",
                              i <= stepIndex ? "bg-secondary font-semibold text-primary" : "bg-muted text-muted-foreground",
                            )}
                          >
                            <span aria-hidden className="block text-base">{s.icon}</span>
                            {s.label}
                          </li>
                        ))}
                      </ol>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {o.status !== "activated" && (
                          <button
                            className={cn(btn.outline, "!px-4 !py-2 text-xs")}
                            onClick={() => {
                              advance(o.id);
                              toast.success("Order updated", { description: "Demo delivery moved to the next step." });
                            }}
                          >
                            ⏩ Advance demo delivery
                          </button>
                        )}
                        <Link to="/qr" className={cn(btn.grape, "!px-4 !py-2 text-xs")}>Manage QR Pet ID</Link>
                        <button
                          className={cn(btn.ghost, "!px-4 !py-2 text-xs text-destructive")}
                          onClick={() => { cancelOrder(o.id); toast("Order removed"); }}
                        >
                          Remove
                        </button>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Order sheet */}
      {variant && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/50 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label="Order a QR tag">
          <div className="max-h-full w-full max-w-md overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-lift">
            {placed ? (
              <div className="text-center">
                <p className="text-5xl" aria-hidden>🎉</p>
                <h3 className="mt-3 font-display text-xl font-bold">Tag ordered!</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Order {placed.id} · {placed.variantName} for {placed.petName}. Arriving by {placed.eta}.
                </p>
                <p className="mt-3 rounded-xl bg-muted px-3 py-2 text-sm">
                  Tag ID <strong>{placed.tagId}</strong> is already linked to {placed.petName}'s profile, so it works
                  the moment it arrives.
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  This is a demo order — no money was taken and nothing will be shipped.
                </p>
                <div className="mt-5 flex gap-2">
                  <Link to="/qr" className={cn(btn.grape, "flex-1")} onClick={close}>Open QR Pet ID</Link>
                  <button className={cn(btn.outline, "flex-1")} onClick={close}>Done</button>
                </div>
              </div>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const order = placeOrder({
                    petId: pet.id,
                    petName: pet.name,
                    variant,
                    engraving: variant === "custom" ? engraving || `${pet.name} · Pune` : undefined,
                    address,
                    phone,
                    paymentMethod: payment,
                  });
                  setPlacedId(order.id);
                  toast.success("Demo payment successful", { description: `${inr(order.price)} · ${order.paymentMethod}` });
                }}
              >
                <h3 className="font-display text-lg font-bold">Order {product?.name}</h3>
                <p className="text-sm text-muted-foreground">{product?.material} · {inr(product?.price ?? 0)}</p>

                <label className="block text-sm font-semibold" htmlFor="tag-pet">Which pet is this tag for?</label>
                <select id="tag-pet" className={input} value={petId} onChange={(e) => setPetId(e.target.value)}>
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>{p.emoji} {p.name} · {p.breed}</option>
                  ))}
                </select>

                {variant === "custom" && (
                  <>
                    <label className="block text-sm font-semibold" htmlFor="tag-engraving">Engraving text</label>
                    <input
                      id="tag-engraving"
                      className={input}
                      value={engraving}
                      onChange={(e) => setEngraving(e.target.value)}
                      placeholder={`${pet.name} · Pune`}
                      maxLength={24}
                    />
                  </>
                )}

                <label className="block text-sm font-semibold" htmlFor="tag-address">Delivery address</label>
                <textarea id="tag-address" rows={3} className={input} value={address} onChange={(e) => setAddress(e.target.value)} required />

                <label className="block text-sm font-semibold" htmlFor="tag-phone">Contact number</label>
                <input id="tag-phone" className={input} value={phone} onChange={(e) => setPhone(e.target.value)} required />

                <label className="block text-sm font-semibold" htmlFor="tag-payment">Payment method</label>
                <select id="tag-payment" className={input} value={payment} onChange={(e) => setPayment(e.target.value)}>
                  {PAYMENTS.map((p) => <option key={p}>{p}</option>)}
                </select>

                <div className="rounded-xl bg-muted px-3 py-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Tag</span><span>{inr(product?.price ?? 0)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-primary">Free</span></div>
                  <div className="mt-1 flex justify-between font-display font-bold"><span>Total</span><span>{inr(product?.price ?? 0)}</span></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Demo checkout — no real payment is taken and no tag is shipped.
                </p>

                <div className="flex gap-2 pt-1">
                  <button type="button" className={cn(btn.outline, "flex-1")} onClick={close}>Cancel</button>
                  <button className={cn(btn.primary, "flex-1")}>Pay {inr(product?.price ?? 0)}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
