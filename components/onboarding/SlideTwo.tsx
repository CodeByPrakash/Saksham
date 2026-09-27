"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ArrowRight, GraduationCap, Briefcase, MapPin, Heart, Cloud } from "lucide-react";
import { motion } from "framer-motion";
import { OnboardingProgressDots } from "./OnboardingProgressDots";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";

interface SlideTwoProps {
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isNativeMobile?: boolean;
}

export function SlideTwo({ onNext, onPrev, onSkip, isNativeMobile = false }: SlideTwoProps) {
  return (
    <div
      className={`relative flex flex-col justify-between w-full mx-auto bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] overflow-hidden text-slate-900 select-none ${
        isNativeMobile
          ? "h-full max-h-[100dvh] px-5 pt-4 pb-0"
          : "h-full max-w-md rounded-[44px] shadow-2xl border-[8px] border-slate-900/10 px-5 pt-3 pb-0"
      }`}
    >
      {/* Background Village Canvas (bg_2_landing.png) with Foggy Clouds Blend */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/landingPage/bg_2_landing.png"
          alt="Village landscape backdrop"
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          quality={95}
          className="object-cover object-center opacity-70"
          priority
        />

        {/* Top Foggy Mist Cloud Gradient */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#FAF6EE] via-[#FAF6EE]/90 to-transparent backdrop-blur-[1.5px]" />

        {/* Bottom Foggy Mist Cloud Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FAF6EE] via-[#FAF6EE]/95 to-transparent backdrop-blur-[2px]" />

        {/* Soft Dreamy Ambient Cloud Glows */}
        <div className="absolute top-8 -left-8 w-44 h-20 bg-white/80 rounded-full blur-xl animate-float" />
        <div className="absolute top-20 -right-8 w-52 h-24 bg-white/75 rounded-full blur-2xl animate-float-delayed" />
        <div className="absolute bottom-16 left-1/4 w-48 h-16 bg-white/70 rounded-full blur-xl animate-pulse-glow" />
      </div>

      {/* Top Header with Step Badge, Language Selector & Skip */}
      <div className="w-full flex items-center justify-between pt-1 pb-1 z-20 shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-800 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-full shadow-2xs border border-amber-100/80">
          <Cloud className="size-3 text-purple-600" />
          <span>Step 2 of 3</span>
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

      {/* Title & Copy */}
      <div className="flex flex-col items-center text-center pt-1 z-10 shrink-0">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight font-heading drop-shadow-2xs">
          Tell Us About<br />Your Skills & Interests
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-[310px] mt-1.5">
          Have a simple voice conversation in your language. No forms. No typing. Just speak naturally.
        </p>
      </div>

      {/* Center 3D Scene: Docked to Bottom, Solid Opaque Person on Left-Bottom, AI Bot in Center/Right */}
      <div className="relative flex-1 min-h-0 w-full flex items-end justify-center overflow-visible z-10 mb-[-6px]">
        <div className="relative w-full h-full max-h-[420px] min-h-[280px] flex items-end justify-center">
          
          {/* 1. Left Bottom: Person with Smartphone Docked to Bottom with Subtle Lower-Edge Fade */}
          <div className="absolute left-[-14px] sm:left-[-6px] bottom-[-6px] sm:bottom-[-2px] w-[62%] sm:w-[58%] h-[96%] sm:h-[98%] z-10">
            <div className="relative w-full h-full [mask-image:linear-gradient(to_bottom,black_0%,black_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_88%,transparent_100%)]">
              <Image
                src="/landingPage/person_2_landing.png"
                alt="Person holding smartphone"
                fill
                sizes="(max-width: 768px) 65vw, 320px"
                quality={95}
                className="object-contain object-bottom drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* 2. Center-Right: Cute AI Robot */}
          <div className="absolute right-[2%] top-[6%] w-[50%] h-[68%] z-20 animate-float">
            <Image
              src="/landingPage/ai_2_landing.png"
              alt="AI Voice Assistant Bot"
              fill
              sizes="(max-width: 768px) 50vw, 240px"
              quality={95}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* 3. Speech Bubble from AI Bot */}
          <div className="absolute right-[2%] top-[-8px] sm:top-[-4px] z-30 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white px-3.5 py-1.5 rounded-2xl rounded-bl-sm shadow-xl border border-purple-400/50 animate-pulse-glow max-w-[160px] sm:max-w-[180px]">
            <p className="text-[11px] sm:text-xs font-extrabold leading-tight">
              नमस्कार!
            </p>
            <p className="text-[9.5px] sm:text-[10.5px] font-medium text-purple-100 leading-tight mt-0.5">
              मैं आपकी सहायता के लिए यहाँ हूँ
            </p>
          </div>

          {/* 4. Floating Badges */}
          {/* Badge: Education Background (Top Left) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="absolute left-0 top-2 sm:top-4 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-lg border border-amber-100/90 animate-pulse-glow"
          >
            <div className="size-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <GraduationCap className="size-3" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 whitespace-nowrap">
              Education Background
            </span>
          </motion.div>

          {/* Badge: Current Work & Skills (Middle Right) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="absolute right-[-4px] top-[42%] z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-lg border border-amber-100/90 animate-pulse-glow"
          >
            <div className="size-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <Briefcase className="size-3" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 whitespace-nowrap">
              Current Work & Skills
            </span>
          </motion.div>

          {/* Badge: Local Opportunities (Bottom Right) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="absolute right-0 bottom-8 sm:bottom-10 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-lg border border-amber-100/90 animate-pulse-glow"
          >
            <div className="size-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <MapPin className="size-3" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 whitespace-nowrap">
              Local Opportunities
            </span>
          </motion.div>

          {/* Badge: Your Interests (Bottom Center near phone) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="absolute left-[36%] bottom-1 sm:bottom-2 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-lg border border-amber-100/90 animate-pulse-glow"
          >
            <div className="size-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
              <Heart className="size-3 fill-current" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 whitespace-nowrap">
              Your Interests
            </span>
          </motion.div>
        </div>
      </div>

      {/* Bottom Rounded White Card Container matching reference image */}
      <div className="w-[calc(100%+40px)] -mx-5 bg-white rounded-t-[36px] sm:rounded-t-[40px] shadow-[0_-10px_35px_rgba(0,0,0,0.06)] border-t border-slate-100/90 py-3.5 px-6 sm:px-7 flex items-center justify-between z-20 shrink-0">
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
        <OnboardingProgressDots currentStep={1} />

        {/* Right: Next Pill Button with Tap Spring */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          onClick={onNext}
          className="h-12 sm:h-12.5 px-6 sm:px-7 rounded-full bg-gradient-to-r from-[#6B34EB] via-[#7539F4] to-[#8042F6] hover:from-[#5E2DD8] hover:to-[#7335EC] text-white text-[15px] sm:text-base font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer border border-purple-400/20 shrink-0"
        >
          <span>Next</span>
          <ArrowRight className="size-4.5 stroke-[2.2]" />
        </motion.button>
      </div>
    </div>
  );
}


