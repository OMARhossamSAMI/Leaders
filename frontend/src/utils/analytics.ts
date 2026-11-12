// Meta Pixel + Google Analytics 4 for the public site.
//
// Every call is fire-and-forget and wrapped in try/catch: tracking can never
// throw, block, or change what a button or form does.
// No personal data (names, emails, phones) is ever sent as an event parameter.
//
// Google is off until GA_MEASUREMENT_ID is set (the school's "G-XXXXXXX").

export const META_PIXEL_ID = "806465092082619";
export const GA_MEASUREMENT_ID = "";

type Params = Record<string, string | number | boolean | undefined>;

export type TrackEvent =
  | "apply_now"
  | "submit_application"
  | "go_to_reservation"
  | "submit_reservation"
  | "begin_checkout"
  | "assessment_paid"
  | "contact";

// event → Meta calls ([method, name]) + GA4 event names
const EVENTS: Record<
  TrackEvent,
  { meta: Array<["track" | "trackCustom", string]>; ga: string[] }
> = {
  apply_now: { meta: [["trackCustom", "ApplyNow"]], ga: ["apply_now"] },
  submit_application: {
    meta: [
      ["track", "SubmitApplication"],
      ["track", "Lead"],
    ],
    ga: ["submit_application", "generate_lead"],
  },
  go_to_reservation: {
    meta: [["trackCustom", "GoToReservation"]],
    ga: ["go_to_reservation"],
  },
  submit_reservation: {
    meta: [["trackCustom", "SubmitReservation"]],
    ga: ["submit_reservation"],
  },
  begin_checkout: {
    meta: [["track", "InitiateCheckout"]],
    ga: ["begin_checkout"],
  },
  assessment_paid: { meta: [["track", "Schedule"]], ga: ["assessment_paid"] },
  contact: { meta: [["track", "Contact"]], ga: ["contact"] },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type Win = Window & {
  fbq?: any;
  _fbq?: any;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

/** The admin area is never tracked. */
export function isTracked(pathname: string | null | undefined): boolean {
  return !(pathname || "").startsWith("/lic-auth-v9v3tz");
}

function addScript(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

// Meta's own base code, installed on first use.
function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const w = window as Win;
  if (!w.fbq) {
    // Same as Meta's snippet: queue the raw `arguments` until fbevents.js loads.
    const n: any = function () {
      // eslint-disable-next-line prefer-rest-params, prefer-spread
      if (n.callMethod) n.callMethod.apply(n, arguments);
      // eslint-disable-next-line prefer-rest-params
      else n.queue.push(arguments);
    };
    w.fbq = n;
    if (!w._fbq) w._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    // Meta counts the later page changes (no reload) itself, from the browser
    // history; it ignores a second PageView sent from code in the same load.
    addScript("https://connect.facebook.net/en_US/fbevents.js");
    n("init", META_PIXEL_ID);
  }
  w.fbq(...args);
}

// Google's gtag.js, installed on first use (only when an ID is set).
// The first `config` sends the page view; GA4's enhanced measurement counts
// later page changes by itself.
function loadGa(): Win["gtag"] | null {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return null;
  const w = window as Win;
  if (!w.gtag) {
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () {
      // gtag.js expects the `arguments` object itself
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
    addScript(
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`
    );
    w.gtag("js", new Date());
    w.gtag("config", GA_MEASUREMENT_ID);
  }
  return w.gtag;
}

function gtag(...args: unknown[]) {
  const g = loadGa();
  if (g) g(...args);
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function onPublicPage(): boolean {
  return typeof window !== "undefined" && isTracked(window.location.pathname);
}

let pageViewSent = false;

/**
 * The first page view of a visit (full page load). Later page changes without
 * a reload are counted by Meta and GA4 themselves from the browser history.
 */
export function trackPageView(): void {
  try {
    if (pageViewSent || !onPublicPage()) return;
    pageViewSent = true;
    fbq("track", "PageView");
    loadGa(); // GA4 sends its page view when it loads
  } catch {
    // never let tracking break the page
  }
}

/** One of the events in EVENTS. */
export function track(event: TrackEvent, params?: Params): void {
  try {
    if (!onPublicPage()) return;
    const def = EVENTS[event];
    if (!def) return;
    const clean: Params = {};
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== "") clean[k] = v;
      }
    }
    for (const [method, name] of def.meta) fbq(method, name, clean);
    for (const name of def.ga) gtag("event", name, clean);
  } catch {
    // never let tracking break the page
  }
}
