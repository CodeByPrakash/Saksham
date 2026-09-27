"use client";

import { useEffect } from "react";

export function GoogleTranslateScript() {
  useEffect(() => {
    // Clear any conflicting googtrans cookies from prior sessions
    if (typeof document !== "undefined") {
      try {
        const hostname = window.location.hostname;
        document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = `googtrans=; path=/; domain=${hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        document.cookie = `googtrans=; path=/; domain=.${hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      } catch {}
    }
  }, []);

  return null;
}

