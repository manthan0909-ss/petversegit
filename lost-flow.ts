/* ============================================================
   PetVerse lost-pet safety flow (demo).

   This store is shared between the signed-in app (`/_app/*`) and the
   PUBLIC finder page (`/scan/$petId`) — which lives outside the app
   provider tree and is usually opened on a different device/tab after
   scanning the physical collar tag. It is therefore backed by
   localStorage + a change event so both trees (and both tabs) stay in
   sync. Swap the read/write helpers for Firestore later without
   touching any UI.
   ============================================================ */

import { useCallback, useSyncExternalStore } from "react";

export type SafetyStatus = "safe" | "lost" | "recovered";

export interface FinderReport {
  location: string;
  note?: string | undefined;
  at: string;
  sharedLocation: boolean;
}

export interface PetSafety {
  status: SafetyStatus;
  lastSeen?: string | undefined;
  lostAt?: string | undefined;
  scans: number;
  finder?: FinderReport | undefined;
}

export interface FlowEvent {
  id: string;
  petId: string;
  kind: "safety" | "scan" | "location" | "recovered";
  icon: string;
  title: string;
  body: string;
  time: string;
}

export interface FlowState {
  pets: Record<string, PetSafety>;
  events: FlowEvent[];
}

const KEY = "petverse.lostflow.v1";
const EVENT = "petverse:lostflow";
const EMPTY: FlowState = { pets: {}, events: [] };

/** Tag ID printed on the physical collar tag, e.g. PV-BRUNO-001. */
export function tagIdFor(petId: string, index = 0) {
  return `PV-${petId.toUpperCase()}-${String(index + 1).padStart(3, "0")}`;
}

function read(): FlowState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as FlowState;
    return { pets: parsed.pets ?? {}, events: parsed.events ?? [] };
  } catch {
    return EMPTY;
  }
}

let cache: FlowState | null = null;

function snapshot(): FlowState {
  if (cache === null) cache = read();
  return cache;
}

function write(next: FlowState) {
  cache = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — in-memory only */
    }
    window.dispatchEvent(new Event(EVENT));
  }
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const onChange = () => {
    cache = read();
    cb();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function now() {
  return new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function petState(state: FlowState, petId: string): PetSafety {
  return state.pets[petId] ?? { status: "safe", scans: 0 };
}

function update(petId: string, patch: Partial<PetSafety>, event?: Omit<FlowEvent, "id" | "time" | "petId">) {
  const state = snapshot();
  const nextPet = { ...petState(state, petId), ...patch };
  const events = event
    ? [{ ...event, petId, id: `f${Date.now()}${Math.random().toString(16).slice(2, 6)}`, time: now() }, ...state.events].slice(0, 30)
    : state.events;
  write({ pets: { ...state.pets, [petId]: nextPet }, events });
}

/* ---------------- public hook ---------------- */

export function useLostFlow() {
  const state = useSyncExternalStore(subscribe, snapshot, () => EMPTY);

  const markLost = useCallback((petId: string, petName: string, lastSeen: string) => {
    update(
      petId,
      { status: "lost", lastSeen, lostAt: now(), finder: undefined },
      {
        kind: "safety",
        icon: "🚨",
        title: `${petName} is marked as LOST`,
        body: `Last seen at ${lastSeen}. The QR tag now shows the "may be lost" alert to anyone who scans it.`,
      },
    );
  }, []);

  const recordScan = useCallback((petId: string, petName: string) => {
    const current = petState(snapshot(), petId);
    update(
      petId,
      { scans: current.scans + 1 },
      {
        kind: "scan",
        icon: "🏷",
        title: `${petName}'s QR tag was scanned`,
        body: `Tag ${tagIdFor(petId)} was scanned by someone using their phone camera.`,
      },
    );
  }, []);

  const shareFinderLocation = useCallback(
    (petId: string, petName: string, report: { location: string; note?: string; sharedLocation: boolean }) => {
      update(
        petId,
        { finder: { ...report, at: now() } },
        {
          kind: "location",
          icon: "📍",
          title: `Someone reported ${petName}'s location`,
          body: report.sharedLocation
            ? `Reported location: ${report.location}. Open the map to see exactly where ${petName} was found.`
            : `A finder contacted you about ${petName} without sharing a location.`,
        },
      );
    },
    [],
  );

  const markRecovered = useCallback((petId: string, petName: string) => {
    update(
      petId,
      { status: "recovered" },
      {
        kind: "recovered",
        icon: "🎉",
        title: `${petName} is home safe`,
        body: `${petName} was marked as recovered. The QR tag is back to its normal safe profile.`,
      },
    );
  }, []);

  const reset = useCallback((petId: string) => {
    update(petId, { status: "safe", lastSeen: undefined, lostAt: undefined, finder: undefined });
  }, []);

  const clearEvents = useCallback(() => {
    write({ ...snapshot(), events: [] });
  }, []);

  return {
    safetyOf: (petId: string) => petState(state, petId),
    events: state.events,
    markLost,
    recordScan,
    shareFinderLocation,
    markRecovered,
    reset,
    clearEvents,
  };
}
