import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "JeevikaSetu — AI Livelihood Intelligence Platform",
  description: "AI-powered livelihood decision and execution platform under PM-AJAY. From what a beneficiary can say, to what they can learn, to where they can earn.",
  icons: {
    icon: "/favicon.ico",
  },
};

import { GoogleTranslateScript } from "@/components/navigation/GoogleTranslateScript";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Preload critical onboarding slide artwork to ensure 0ms instantaneous slide transitions */}
        <link rel="preload" as="image" href="/landingPage/bg_1_landing.png" />
        <link rel="preload" as="image" href="/landingPage/person_1_landing.png" />
        <link rel="preload" as="image" href="/landingPage/bg_2_landing.png" />
        <link rel="preload" as="image" href="/landingPage/person_2_landing.png" />
        <link rel="preload" as="image" href="/landingPage/ai_2_landing.png" />
        <link rel="preload" as="image" href="/landingPage/bg_3_landing.png" />
        <link rel="preload" as="image" href="/landingPage/person_3_landing.png" />
      </head>
      <body
        className={`${plusJakarta.variable} ${outfit.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-full flex flex-col selection:bg-purple-500 selection:text-white`}
      >
        <GoogleTranslateScript />
        {children}
      </body>
    </html>
  );
}
