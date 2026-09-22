/* ============================================================
   PetVerse QR collar-tag orders (demo).

   Stores tag orders locally so the Marketplace, the QR Pet ID page and
   Notifications all show the same order. Payments and shipping are
   SIMULATED — swap these helpers for Lovable Cloud + a real payment
   provider later without touching any UI.
   ============================================================ */

import { useCallback, useSyncExternalStore } from "react";
import { tagIdFor } from "./lost-flow";

export type TagVariant = "basic" | "premium" | "custom";
export type OrderStatus = "paid" | "printing" | "shipped" | "delivered" | "activated";

export interface TagProduct {
  id: TagVariant;
  name: string;
  price: number;
  mrp: number;
  emoji: string;
  material: string;
  blurb: string;
  perks: string[];
}

export const TAG_PRODUCTS: TagProduct[] = [
  {
    id: "basic",
    name: "PetVerse QR Tag · Basic",
    price: 249,
    mrp: 399,
    emoji: "🏷",
    material: "Anodised aluminium · 32 mm",
    blurb: "Lightweight everyday tag with a laser-etched QR code.",
    perks: ["Waterproof & rustproof", "Laser-etched QR (never fades)", "Free profile updates for life"],
  },
  {
    id: "premium",
    name: "PetVerse QR Tag · Premium",
    price: 499,
    mrp: 799,
    emoji: "🥇",
    material: "Stainless steel · 35 mm",
    blurb: "Tougher steel tag with NFC tap-to-scan alongside the QR code.",
    perks: ["Steel body, scratch resistant", "NFC tap + QR scan", "Priority lost-pet alerts", "1-year replacement"],
  },
  {
    id: "custom",
    name: "PetVerse QR Tag · Custom",
    price: 699,
    mrp: 999,
    emoji: "🎨",
    material: "Steel + colour enamel · 35 mm",
    blurb: "Your pet's name and your city engraved, in your choice of colour.",
    perks: ["Name & city engraving", "Choose tag colour", "NFC tap + QR scan", "1-year replacement"],
  },
];

export interface TagOrder {
  id: string;
  petId: string;
  petName: string;
  variant: TagVariant;
  variantName: string;
  price: number;
  engraving?: string | undefined;
  address: string;
  phone: string;
  paymentMethod: string;
  tagId: string;
  status: OrderStatus;
  placedAt: string;
  eta: string;
}

const KEY = "petverse.qrorders.v1";
const EVENT = "petverse:qrorders";

export const ORDER_STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: "paid", label: "Payment confirmed", icon: "💳" },
  { status: "printing", label: "Tag being engraved", icon: "🛠" },
  { status: "shipped", label: "Shipped", icon: "🚚" },
  { status: "delivered", label: "Delivered", icon: "📦" },
  { status: "activated", label: "Tag activated", icon: "✅" },
];

function read(): TagOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TagOrder[]) : [];
  } catch {
    return [];
  }
}

function write(orders: TagOrder[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(orders));
  } catch {
    /* storage unavailable — keep the demo running */
  }
  window.dispatchEvent(new Event(EVENT));
}

let cache: TagOrder[] | null = null;

function snapshot(): TagOrder[] {
  if (cache === null) cache = read();
  return cache;
}

function subscribe(cb: () => void) {
  const handler = () => {
    cache = read();
    cb();
  };
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function commit(next: TagOrder[]) {
  cache = next;
  write(next);
}

const EMPTY: TagOrder[] = [];

export interface PlaceOrderInput {
  petId: string;
  petName: string;
  variant: TagVariant;
  engraving?: string | undefined;
  address: string;
  phone: string;
  paymentMethod: string;
}

export function useQrOrders() {
  const orders = useSyncExternalStore(subscribe, snapshot, () => EMPTY);

  const placeOrder = useCallback((input: PlaceOrderInput): TagOrder => {
    const product = TAG_PRODUCTS.find((p) => p.id === input.variant) ?? TAG_PRODUCTS[0]!;
    const current = snapshot();
    const eta = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
    const order: TagOrder = {
      id: `PV-ORD-${String(current.length + 1041).padStart(4, "0")}`,
      petId: input.petId,
      petName: input.petName,
      variant: input.variant,
      variantName: product.name,
      price: product.price,
      engraving: input.engraving,
      address: input.address,
      phone: input.phone,
      paymentMethod: input.paymentMethod,
      tagId: tagIdFor(input.petId, current.filter((o) => o.petId === input.petId).length),
      status: "paid",
      placedAt: new Date().toISOString(),
      eta: eta.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    };
    commit([order, ...current]);
    return order;
  }, []);

  /** Demo helper: move an order to the next fulfilment step. */
  const advance = useCallback((id: string) => {
    commit(
      snapshot().map((o) => {
        if (o.id !== id) return o;
        const i = ORDER_STEPS.findIndex((s) => s.status === o.status);
        const next = ORDER_STEPS[Math.min(i + 1, ORDER_STEPS.length - 1)]!;
        return { ...o, status: next.status };
      }),
    );
  }, []);

  const cancelOrder = useCallback((id: string) => {
    commit(snapshot().filter((o) => o.id !== id));
  }, []);

  const ordersFor = useCallback(
    (petId: string) => orders.filter((o) => o.petId === petId),
    [orders],
  );

  return { orders, ordersFor, placeOrder, advance, cancelOrder };
}
