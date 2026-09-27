"use client";

import React from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Sprout,
  BarChart3,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Cloud
} from "lucide-react";
import { motion } from "framer-motion";
import { OnboardingProgressDots } from "./OnboardingProgressDots";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";

interface SlideThreeProps {
  onComplete: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onSelectPathway?: (type: string) => void;
  isNativeMobile?: boolean;
}

export function SlideThree({
  onComplete,
  onPrev,
  onSkip,
  onSelectPathway,
  isNativeMobile = false,
}: SlideThreeProps) {
  return (
    <div
      className={`relative flex flex-col justify-between w-full mx-auto bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] overflow-hidden text-slate-900 select-none ${
        isNativeMobile
          ? "h-full max-h-[100dvh] px-5 pt-4 pb-0"
          : "h-full max-w-md rounded-[44px] shadow-2xl border-[8px] border-slate-900/10 px-5 pt-3 pb-0"
      }`}
    >
      {/* Background Village Canvas (bg_3_landing.png) with Foggy Clouds Blend */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/landingPage/bg_3_landing.png"
          alt="Village scenic background"
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          quality={95}
          className="object-cover object-center opacity-70"
          priority
        />

        {/* Top Foggy Mist Cloud Gradient */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#FAF6EE] via-[#FAF6EE]/90 to-transparent backdrop-blur-[1px]" />

        {/* Bottom Foggy Mist Cloud Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FAF6EE] via-[#FAF6EE]/95 to-transparent backdrop-blur-[1.5px]" />

        {/* Soft Dreamy Ambient Cloud Glows */}
        <div className="absolute top-8 -left-8 w-44 h-20 bg-white/80 rounded-full blur-xl animate-float" />
        <div className="absolute top-20 -right-8 w-52 h-24 bg-white/75 rounded-full blur-2xl animate-float-delayed" />
      </div>

      {/* Top Header with Step Badge, Language Selector & Skip */}
      <div className="w-full flex items-center justify-between pt-1 pb-1 z-20 shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-800 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-full shadow-2xs border border-amber-100/80">
          <Cloud className="size-3 text-purple-600" />
          <span>Step 3 of 3</span>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector variant="icon" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSkip}
            type="button"
            className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-2.5 py-1 bg-white/60 backdrop-blur-sm rounded-lg"
          >
            Skip
          </motion.button>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="flex flex-col items-center text-center pt-1 z-10 shrink-0">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight font-heading drop-shadow-2xs">
          Get Personalized<br />Skill & Livelihood Paths
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-[320px] mt-1.5">
          Receive NSQF-aligned training options, local job opportunities and self-employment ideas that match your goals.
        </p>
      </div>

      {/* Center 3D Scene: person_3_landing.png on Left, 3 Pathway Cards on Right */}
      <div className="relative flex-1 min-h-0 w-full flex items-end justify-center overflow-visible z-10 my-1">
        <div className="relative w-full h-full max-h-[380px] min-h-[260px] flex items-end justify-between">
          
          {/* 1. Left: Young Beneficiary (person_3_landing.png) Docked to Bottom with Subtle Fade */}
          <div className="absolute left-[-16px] sm:left-[-10px] bottom-[-6px] sm:bottom-[-2px] w-[52%] sm:w-[48%] h-[98%] sm:h-full z-10 pointer-events-none">
            <div className="relative w-full h-full [mask-image:linear-gradient(to_bottom,black_0%,black_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_88%,transparent_100%)]">
              <Image
                src="/landingPage/person_3_landing.png"
                alt="Beneficiary looking at livelihood opportunities"
                fill
                sizes="(max-width: 768px) 55vw, 260px"
                quality={95}
                className="object-contain object-bottom drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* 2. Right: 3 Pathway Cards Stack (matching image.png) */}
          <div className="absolute right-0 top-1 bottom-2 w-[55%] sm:w-[54%] flex flex-col justify-between gap-2 z-20">
            {/* Card 1: Skill Training */}
            <motion.div
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onClick={() => onSelectPathway?.("skill_training")}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-md shadow-slate-900/5 border border-amber-100/90 cursor-pointer flex items-center justify-between gap-2 group"
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                {/* 3D Blue Cap Emblem */}
                <div className="size-9 sm:size-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 shrink-0">
                  <GraduationCap className="size-5 text-white drop-shadow-xs" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs sm:text-[13px] font-extrabold text-slate-900 leading-tight">
                    Skill Training
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1 sm:line-clamp-2">
                    NSQF-aligned courses near you
                  </span>
                </div>
              </div>
              <ChevronRight className="size-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </motion.div>

            {/* Card 2: Job Opportunities */}
            <motion.div
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onClick={() => onSelectPathway?.("job_opportunities")}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-md shadow-slate-900/5 border border-amber-100/90 cursor-pointer flex items-center justify-between gap-2 group"
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                {/* 3D Orange Briefcase Emblem */}
                <div className="size-9 sm:size-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/30 shrink-0">
                  <Briefcase className="size-5 text-white drop-shadow-xs" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs sm:text-[13px] font-extrabold text-slate-900 leading-tight">
                    Job Opportunities
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1 sm:line-clamp-2">
                    Local and regional openings
                  </span>
                </div>
              </div>
              <ChevronRight className="size-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </motion.div>

            {/* Card 3: Self-Employment */}
            <motion.div
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onClick={() => onSelectPathway?.("self_employment")}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-md shadow-slate-900/5 border border-amber-100/90 cursor-pointer flex items-center justify-between gap-2 group"
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                {/* 3D Green Sprout Emblem */}
                <div className="size-9 sm:size-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/30 shrink-0">
                  <Sprout className="size-5 text-white drop-shadow-xs" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs sm:text-[13px] font-extrabold text-slate-900 leading-tight">
                    Self-Employment
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1 sm:line-clamp-2">
                    Enterprise ideas and scheme support
                  </span>
                </div>
              </div>
              <ChevronRight className="size-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Rounded White Card Container matching reference image */}
      <div className="w-[calc(100%+40px)] -mx-5 bg-white rounded-t-[36px] sm:rounded-t-[40px] shadow-[0_-10px_35px_rgba(0,0,0,0.06)] border-t border-slate-100/90 pt-4 pb-4 px-6 sm:px-7 flex flex-col gap-3.5 z-20 shrink-0">
        {/* Top: 3 Feature/Trust Badges Bar with subtle vertical dividers */}
        <div className="grid grid-cols-3 gap-1 text-center w-full">
          {/* Badge 1 */}
          <div className="flex flex-col items-center gap-1">
            <div className="size-9 rounded-full bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center shadow-2xs">
              <BarChart3 className="size-4.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">
              Based on<br />Your Profile
            </span>
          </div>

          {/* Badge 2 with Left & Right Dividers */}
          <div className="flex flex-col items-center gap-1 border-x border-slate-100">
            <div className="size-9 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shadow-2xs">
              <MapPin className="size-4.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">
              Region-Specific<br />Opportunities
            </span>
          </div>

          {/* Badge 3 */}
          <div className="flex flex-col items-center gap-1">
            <div className="size-9 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shadow-2xs">
              <ShieldCheck className="size-4.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">
              Trusted<br />Government Schemes
            </span>
          </div>
        </div>

        {/* Bottom Row: Circular Back, 3-Dot Indicator (Step 3 Active), & Get Started CTA */}
        <div className="w-full flex items-center justify-between pt-0.5">
          {/* Left: Circular Back Button with Tap Spring */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            onClick={onPrev}
            aria-label="Previous slide"
            className="size-12 sm:size-12.5 rounded-full bg-white shadow-md shadow-slate-200/70 border border-slate-100 flex items-center justify-center text-slate-800 hover:bg-slate-50 cursor-pointer shrink-0"
          >
            <ChevronLeft className="size-5.5 text-slate-800 stroke-[2.4]" />
          </motion.button>

          {/* Center: 3-Dot Progress Indicator with Framer Motion Layout Animation */}
          <OnboardingProgressDots currentStep={2} />

          {/* Right: Get Started Final Pill Button with Tap Spring */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            onClick={onComplete}
            className="h-12 sm:h-12.5 px-6 sm:px-7 rounded-full bg-gradient-to-r from-[#6B34EB] via-[#7539F4] to-[#8042F6] hover:from-[#5E2DD8] hover:to-[#7335EC] text-white text-[15px] sm:text-base font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer border border-purple-400/20 shrink-0"
          >
            <span>Get Started</span>
            <ArrowRight className="size-4.5 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

