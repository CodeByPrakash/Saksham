"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mic,
  ArrowRight,
  Home,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MobilePhoneMockup } from "@/components/demo/MobilePhoneMockup";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-slate-900 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Demo Header */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer select-none">
            <div className="size-9 shrink-0 relative group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="Sakhyam AI Logo"
                fill
                className="object-contain"
                sizes="36px"
                priority
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 font-heading">
                Sakh<span className="text-purple-600">yam</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">
                PM-AJAY
              </span>
            </div>
          </Link>

          {/* Action Navigation */}
          <div className="flex items-center gap-2.5">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="font-bold text-xs h-9 px-3.5 rounded-xl bg-white hover:bg-slate-50 border-slate-300 text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Home className="size-3.5" />
                <span>Landing Page</span>
              </Button>
            </Link>

            <Link href="/">
              <Button
                variant="gradient"
                size="sm"
                className="font-bold text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 shadow-sm shadow-purple-600/30 cursor-pointer"
              >
                <Mic className="size-3.5" />
                <span>Try Voice Profiler</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Showcase Section */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <Badge variant="purple" className="text-xs">
            PM-AJAY AI System Demo
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Live Platform Walkthrough
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Watch the demonstration video directly inside the mobile phone interface.
          </p>
        </div>

        {/* Mobile Phone Mockup with YouTube Video */}
        <div className="w-full flex items-center justify-center py-2">
          <MobilePhoneMockup
            videoId="xRLAAr7CCCY"
            videoTitle="Sakhyam AI - PM-AJAY Live Voice Intelligence Demo"
          />
        </div>

        {/* Bottom Home CTA */}
        <div className="flex items-center gap-3 pt-2">
          <Link href="/">
            <Button
              variant="gradient"
              className="font-bold text-xs h-10 px-6 rounded-xl shadow-md shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Landing Page</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-6 px-4 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          Sakhyam-AI — AI Livelihood Intelligence Platform (PM-AJAY)
        </p>
      </footer>
    </div>
  );
}
