"use client";

import React from "react";
import { Signal, Wifi } from "lucide-react";

interface MobilePhoneMockupProps {
  videoId?: string;
  videoTitle?: string;
  className?: string;
}

export function MobilePhoneMockup({
  videoId = "xRLAAr7CCCY",
  videoTitle = "Sakhyam AI - PM-AJAY Live Voice Intelligence Demo",
  className = "",
}: MobilePhoneMockupProps) {
  // Direct clean YouTube embed URL with user's video link
  const embedSrc = `https://www.youtube.com/embed/${videoId}?si=nfqEA1ifRz47KK3h&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer Phone Hardware Chassis (SVG / CSS Mockup) */}
      <div className="relative group">
        {/* Subtle Ambient Back Glow */}
        <div className="absolute -inset-6 rounded-[68px] blur-2xl opacity-60 bg-gradient-to-tr from-purple-600/30 via-indigo-600/20 to-amber-500/20 pointer-events-none" />

        <div
          className="relative w-[300px] sm:w-[340px] md:w-[360px] h-[600px] sm:h-[680px] md:h-[720px] rounded-[48px] sm:rounded-[54px] p-[10px] sm:p-[11px] shadow-2xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-[3px] border-slate-700/80"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.25)"
          }}
        >
          {/* Side Hardware Buttons (Left: Volume Keys) */}
          <div className="absolute -left-[5px] top-24 w-[4px] h-8 rounded-l-md bg-slate-700 shadow-md" />
          <div className="absolute -left-[5px] top-36 w-[4px] h-12 rounded-l-md bg-slate-700 shadow-md" />
          <div className="absolute -left-[5px] top-52 w-[4px] h-12 rounded-l-md bg-slate-700 shadow-md" />

          {/* Side Hardware Buttons (Right: Power Key) */}
          <div className="absolute -right-[5px] top-32 w-[4px] h-16 rounded-r-md bg-slate-700 shadow-md" />

          {/* Inner Display Bezel */}
          <div className="relative w-full h-full bg-black rounded-[38px] sm:rounded-[44px] overflow-hidden flex flex-col justify-between border border-slate-800/80 shadow-inner">

            {/* Top Device Bar & Dynamic Island */}
            <div className="relative z-30 w-full pt-2.5 px-5 pb-1.5 flex items-center justify-between text-white/90 text-xs font-semibold select-none bg-gradient-to-b from-black/90 via-black/40 to-transparent">
              {/* Left Clock */}
              <span className="text-[12px] font-bold tracking-tight font-sans pl-1">09:41</span>

              {/* Dynamic Island Pill (Camera Notch) */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2 flex items-center justify-between px-2.5 w-[105px] sm:w-[115px] h-[24px] bg-black rounded-full border border-white/10 shadow-md">
                <div className="size-2 rounded-full bg-slate-900 border border-slate-700/60 flex items-center justify-center">
                  <span className="size-0.5 rounded-full bg-blue-900/80" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8.5px] font-bold text-slate-300">Sakhyam</span>
                </div>
              </div>

              {/* Right Status Icons */}
              <div className="flex items-center gap-1.5 text-white/80 pr-1">
                <Signal className="size-3" />
                <span className="text-[9px] font-extrabold tracking-tighter">5G</span>
                <Wifi className="size-3" />
                <div className="flex items-center">
                  <div className="w-4 h-2 rounded-2xs border border-white/80 p-0.5 flex items-center">
                    <div className="w-full h-full bg-emerald-400 rounded-3xs" />
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded YouTube Video Container */}
            <div className="relative flex-1 w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <iframe
                src={embedSrc}
                title={videoTitle}
                className="w-full h-full object-cover border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />

              {/* Subtle Glass Glare Reflection (Non-blocking) */}
              <div
                className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-50 z-20"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 80%)"
                }}
              />
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="relative z-30 w-full py-1.5 flex items-center justify-center bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none">
              <div className="w-28 sm:w-32 h-1 bg-white/70 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
