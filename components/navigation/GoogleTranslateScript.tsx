"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export function GoogleTranslateScript() {
  useEffect(() => {
    window.googleTranslateElementInit = function () {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages:
              "en,hi,or,sat,bho,bn,mr,te,ta,gu,ur,kn,ml,pa,as,mai,doi,kok,ne,sd,sa,es,fr,ar",
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE,
          },
          "google_translate_element"
        );
      }
    };
  }, []);

  return (
    <>
      <div
        id="google_translate_element"
        className="hidden pointer-events-none opacity-0 select-none -z-50"
        aria-hidden="true"
      />
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
