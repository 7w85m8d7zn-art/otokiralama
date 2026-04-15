"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function createVisitorId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname === "/giris") {
      return;
    }

    const dailyKey = `visit-tracked-${new Date().toISOString().slice(0, 10)}`;
    if (sessionStorage.getItem(dailyKey) === "1") {
      return;
    }

    let visitorId = localStorage.getItem("tasir_visitor_id");
    if (!visitorId) {
      visitorId = createVisitorId();
      localStorage.setItem("tasir_visitor_id", visitorId);
    }

    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId })
    }).finally(() => {
      sessionStorage.setItem(dailyKey, "1");
    });
  }, [pathname]);

  return null;
}
