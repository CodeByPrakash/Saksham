"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mic, ArrowRight } from "lucide-react";
import { CURRENT_BENEFICIARY, BeneficiaryData } from "../DashboardShared";

interface MobileHeroCardProps {
  onStartVoice: () => void;
  beneficiary?: BeneficiaryData;
}

export function MobileHeroCard({ onStartVoice, beneficiary }: MobileHeroCardProps) {
  const currentName = beneficiary?.name || CURRENT_BENEFICIARY.name;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[#EDE7D9] p-5 shadow-xs min-h-[220px] flex flex-col justify-between">
      {/* Full-width seamless village scenery background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/landingPage/bg_1_landing.webp"
          alt="Village Landscape"
          fill
          sizes="(max-width: 768px) 100vw, 450px"
          className="object-cover object-center"
          priority
        />
        {/* Soft cream gradient blend on left so text & buttons have 100% contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE]/95 via-45% to-transparent pointer-events-none" />
      </div>

      {/* Content Overlaid on Left */}
      <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
        {/* Greeting Header */}
        <div className="space-y-0.5 max-w-[210px]">
          <p className="text-xs font-semibold text-slate-600">Welcome back,</p>
          <h2 className="text-xl font-extrabold text-slate-900 font-heading flex items-center gap-1.5 leading-tight">
            <span>{currentName}</span>
            <span className="inline-block origin-bottom-right">👋</span>
          </h2>
          <p className="text-[11px] text-slate-600 font-medium leading-snug pt-0.5">
            Let&apos;s continue your journey towards a brighter future.
          </p>
        </div>

        {/* Speech bubble card: "Your AI Livelihood Assistant" */}
        <div className="relative max-w-[190px]">
          <div className="bg-white/95 backdrop-blur-xs p-3 rounded-2xl rounded-bl-sm border border-purple-100 shadow-sm space-y-0.5">
            <h4 className="font-extrabold text-slate-900 text-xs leading-tight">
              Your AI<br />Livelihood Assistant
            </h4>
            <p className="text-[10px] text-slate-500 font-medium">
              Speak. Explore. Grow.
            </p>
          </div>
        </div>

        {/* Purple Glowing CTA Button: Talk to Saksham-AI */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onStartVoice}
          className="w-fit flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-md shadow-purple-600/30 cursor-pointer"
        >
          <Mic className="size-3.5 animate-pulse text-white" />
          <span>Talk to Saksham-AI</span>
          <ArrowRight className="size-3.5 text-white" />
        </motion.button>
      </div>

      {/* Right 3D Character Artwork: Savitri Devi + Robot Assistant */}
      <div className="absolute right-0 bottom-0 w-48 h-48 flex items-end justify-center pointer-events-none z-10">
        {/* Dynamic Beneficiary Character with smartphone */}
        <div className="relative w-32 h-full">
          <Image
            src={beneficiary?.avatarUrl || "/landingPage/person_1_landing.webp"}
            alt={currentName}
            fill
            sizes="130px"
            className="object-contain object-bottom drop-shadow-md"
            priority
          />
        </div>

        {/* Cute AI Bot with sound waves */}
        <div className="relative w-20 h-24 -ml-8 mb-3 animate-float">
          <Image
            src="/landingPage/ai_2_landing.webp"
            alt="AI Bot"
            fill
            sizes="80px"
            className="object-contain drop-shadow-md"
            priority
          />
          {/* Pulsing soundwave beacon */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
          </span>
        </div>
      </div>
    </div>
  );
}
