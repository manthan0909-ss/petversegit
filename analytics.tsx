import { useRouterState } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export const CONSENT_KEY = "petverse.consent.v1";
export type ConsentValue = "granted" | "denied";

export type AnalyticsEvent = {
  name: string;
  props?: Record<string, string | number | boolean | null>;
  ts: string;
  path: string;
};

/** Configured at build time; empty means "log only, ship nothing". */
const ENDPOINT = (import.meta.env["VITE_ANALYTICS_ENDPOINT"] as string | undefined) ?? "";
const SITE_ID = (import.meta.env["VITE_ANALYTICS_SITE_ID"] as string | undefined) ?? "petverse";

type Ctx = {
  consent: ConsentValue | null;
  setConsent: (value: ConsentValue) => void;
  track: (name: string, props?: AnalyticsEvent["props"]) => void;
  events: AnalyticsEvent[];
};

const AnalyticsContext = createContext<Ctx | null>(null);

function readConsent(): ConsentValue | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<ConsentValue | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const queue = useRef<AnalyticsEvent[]>([]);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    setConsentState(readConsent());
  }, []);

  const send = useCallback((event: AnalyticsEvent) => {
    if (!ENDPOINT) {
      if (import.meta.env.DEV) console.info("[analytics]", event.name, event.props ?? {});
      return;
    }
    const body = JSON.stringify({ siteId: SITE_ID, ...event });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
        return;
      }
    } catch {
      /* fall through to fetch */
    }
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  }, []);

  const track = useCallback<Ctx["track"]>(
    (name, props) => {
      const event: AnalyticsEvent = {
        name,
        ...(props ? { props } : {}),
        ts: new Date().toISOString(),
        path: typeof window === "undefined" ? "" : window.location.pathname,
      };
      setEvents((prev) => [...prev.slice(-49), event]);
      if (readConsent() === "granted") send(event);
      else if (readConsent() === null) queue.current = [...queue.current.slice(-19), event];
    },
    [send],
  );

  const setConsent = useCallback(
    (value: ConsentValue) => {
      try {
        localStorage.setItem(CONSENT_KEY, value);
      } catch {
        /* storage unavailable */
      }
      setConsentState(value);
      if (value === "granted") {
        queue.current.forEach(send);
      }
      queue.current = [];
    },
    [send],
  );

  // Page views — one per path change, after hydration.
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    track("page_view", { path: pathname, referrer: document.referrer || null });
  }, [pathname, track]);

  return (
    <AnalyticsContext.Provider value={{ consent, setConsent, track, events }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error("useAnalytics must be used inside AnalyticsProvider");
  return ctx;
}

/** Safe outside the provider (e.g. static sections) — no-ops instead of throwing. */
export function useTrack() {
  const ctx = useContext(AnalyticsContext);
  return ctx?.track ?? (() => undefined);
}
