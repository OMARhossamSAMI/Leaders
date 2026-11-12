"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isTracked, trackPageView } from "@/utils/analytics";

// Sends the page view of the first public page opened; Meta and GA4 then count
// every later page change (without a reload) themselves. Renders nothing.
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (isTracked(pathname)) trackPageView();
  }, [pathname]);

  return null;
}
