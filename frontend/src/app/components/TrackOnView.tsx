"use client";

import { useEffect } from "react";
import { track, type TrackEvent } from "@/utils/analytics";

// Fires an event once when the page is opened, but not again when the parent
// reloads the page or comes back to it with the browser's back/forward.
export default function TrackOnView({ event }: { event: TrackEvent }) {
  useEffect(() => {
    try {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      if (nav && (nav.type === "reload" || nav.type === "back_forward")) return;
    } catch {
      // older browsers: just send it
    }
    track(event);
  }, [event]);

  return null;
}
