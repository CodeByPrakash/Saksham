"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { OnboardingProgressDots } from "./OnboardingProgressDots";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";

interface SlideOneProps {
  onNext: () => void;
  onSkip: () => void;
  isNativeMobile?: boolean;
}

export function SlideOne({ onNext, onSkip, isNativeMobile = false }: SlideOneProps) {
  return (
    <div
      className={`relative flex flex-col justify-between w-full mx-auto bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] overflow-hidden text-slate-900 select-none ${isNativeMobile
        ? "h-full max-h-[100dvh] px-5 pt-4 pb-0"
        : "h-full max-w-md rounded-[44px] shadow-2xl border-[8px] border-slate-900/10 px-5 pt-3 pb-0"
        }`}
    >
      {/* Background Ambient Cloud Puffs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-4 -left-6 w-40 h-20 bg-white/70 rounded-full blur-xl animate-float" />
        <div className="absolute top-16 -right-6 w-48 h-24 bg-white/60 rounded-full blur-2xl animate-float-delayed" />
      </div>

      {/* Top Header with Step Badge, Language Selector & Skip */}
      <div className="w-full flex items-center justify-between pt-1 pb-1 z-20 shrink-0">
        {!isNativeMobile ? (
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-white/60 px-2.5 py-0.5 rounded-full">
            <span>9:41</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-purple-800 border border-amber-100/80 shadow-2xs">
            <span className="size-1.5 rounded-full bg-purple-600 animate-pulse"></span>
            <span>PM-AJAY</span>
          </div>
        )}

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

      {/* Brand Logo & Title Area */}
      <div className="flex flex-col items-center text-center pt-1 z-10 shrink-0">
        {/* Custom Saksham Logo Emblem */}
        <div className="flex flex-col items-center mb-1">
          <div className="relative size-11 sm:size-12 mb-0.5 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <circle cx="50" cy="40" r="14" fill="#F59E0B" />
              <path d="M50 14 L50 20" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
              <path d="M28 22 L33 27" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
              <path d="M72 22 L67 27" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
              <circle cx="50" cy="52" r="5" fill="#3B82F6" />
              <path d="M42 66 C42 58, 58 58, 58 66 Z" fill="#3B82F6" />
              <circle cx="35" cy="56" r="4.5" fill="#10B981" />
              <path d="M28 70 C28 63, 42 63, 42 70 Z" fill="#10B981" />
              <circle cx="65" cy="56" r="4.5" fill="#F97316" />
              <path d="M58 70 C58 63, 72 63, 72 70 Z" fill="#F97316" />
            </svg>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-heading">
              Sak<span className="text-purple-600">sham</span>
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">
            Skills Today • Better Tomorrow
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mt-0.5 font-heading drop-shadow-2xs">
          Your Voice to a<br />Brighter Future
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-[290px] mt-1.5">
          An AI-powered voice assistant for livelihood mapping and skill recommendations under PM-AJAY.
        </p>
      </div>

      {/* Hero Illustration with Layered Artwork and Character */}
      <div className="relative flex-1 min-h-0 w-full flex items-end justify-center overflow-visible my-1 z-10">
        {/* Village Backdrop Image with Soft Mist Blend */}
        <div className="absolute inset-0 top-1 overflow-hidden rounded-3xl opacity-95">
          <Image
            src={isNativeMobile ? "/landingPage/bg_1_landing_mob.webp" : "/landingPage/bg_1_landing.webp"}
            alt="Village backdrop"
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            quality={90}
            className="object-cover object-bottom"
            priority
            loading="eager"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRm4BAABXRUJQVlA4WAoAAAAQAAAADAAAEwAAQUxQSKYAAAAFgFvbtmpl7fvdUiLLqYAWSBlUQSWUQT2Enrm7O9wVPOghIiagBJG/K5RWm19FFvqDt/L9M7h7en79XJsaXD9cHfc3rm5PP6eT3u/P+8ctvfpZEiutj9Lplp+2gV8pSZVIFEJM0AggAUQikaaGfyUVggKINKtEGgZpRht8pZVg1RLWVvgqpg3Vurq8NG/vcu/q+vD867TOLU697a7fCKT90568fgQCVlA4IKIAAADwBACdASoNABQAPu1iqU2ppaOiMAgBMB2JbACdMoMYPYAQV4xB5VD5aMYSc0PAc0AA/OU9tZ19ps3FIH/eptTVyyTE6fh7MXJHznXu3lc9/2C0lskkwXr5p5hm2f3a9OEXzQmVnTE+EUaEM33ZSESw3pU7yAru3Ge0LFU2YKpy6GGlKOgBSboLnqfv3AkNXUQOV3vDNlrjmyf09IS7U2ZNAAA="
          />
          {/* Top Foggy Mist Cloud Blend */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FAF6EE] via-[#FAF6EE]/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FAF6EE] via-[#FAF6EE]/60 to-transparent" />
        </div>

        {/* 3D Character (Woman with smartphone) */}
        <div className="relative z-10 w-[240px] sm:w-[270px] h-[95%] max-h-[290px] mb-[-6px]">
          <div className="relative w-full h-full [mask-image:linear-gradient(to_bottom,black_0%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_90%,transparent_100%)]">
            <Image
              src={isNativeMobile ? "/landingPage/person_1_landing_mob.webp" : "/landingPage/person_1_landing.webp"}
              alt="Beneficiary speaking with voice assistant"
              fill
              sizes="(max-width: 768px) 270px, 300px"
              quality={90}
              className="object-contain object-bottom drop-shadow-xl"
              priority
              loading="eager"
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRkYCAABXRUJQVlA4WAoAAAAQAAAAEwAAEwAAQUxQSP8AAAABkGvb2rFX+0NsO7mGpE1ldi7t5Bilb+BURmfbtlWe0kb7ve+zv6f4/jfXEBETgJQBOk69PNhdCh9uHyuoqvppEn4KDwG6VIy1VnUAQQJZAa7FEUlG8Yd0z4PvrekDHqlJ0GoLAqB556Ym3HFE8XaEwOy6qUZ8V5tK9yGE1zx14W3uZTWOjV4IDxV/dXRSI4okRpAGhDjEZ6fVUEia+G4mPB+1/2NVOo1eyw4CtKsV6xLRenhe/nu1XI691IAQSxpRHKTRM16Q+S62LiGtPRpihxo6RUjRlehXI8sRke/jtb8YGXGQtPoxrUOTJIUUUmh1uuj1z8O3nqkVESElcQcAVlA4ICABAACwBgCdASoUABQAPu1ur1KppiQiqAgBMB2JbACdMoR1AP0qvsADpd0aBs7xcIc8C1qEAWh2+tcu/JF/5ZqTgAD9Kau3vkY5fnTXr/+4zF9/DXa8NuuL8ZGju3MdNfA6UDbVJZGnM5RZOxN5UFGnYRq66ezyBLjPH1WYI9vQJRiFgxUtqQZB+FKzuD/l8k5yWvBS4GrK4B2S15pKp8hbVVWlgOHbYcwY00FXndGsk6DNKTlrCjJAf0fgS65DJLSv8vkGPE7Pw6dcQzGlRs/oOH4yKslv4nZkjVgx16CJnFQvbZ352I34BSW5TpiOUb74a6AV/D1kT8x8+XhnfZ+zB/y41ON1L6kJuw3u907JpeFYpCO557T+FIL3JtzLSHxcgAA="
            />
          </div>

          {/* Speech Bubble / Floating Pill: Speak in your language */}
          <div className="absolute -left-2 sm:-left-3 bottom-10 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl rounded-bl-sm shadow-xl border border-amber-100/90 animate-pulse-glow">
            <div className="flex items-center justify-center size-6 rounded-full bg-purple-100 text-purple-700">
              <Mic className="size-3.5 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
              Speak in your language
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Rounded White Card Container matching reference image */}
      <div className="w-[calc(100%+40px)] -mx-5 bg-white rounded-t-[36px] sm:rounded-t-[40px] shadow-[0_-10px_35px_rgba(0,0,0,0.06)] border-t border-slate-100/90 pt-3.5 pb-4 px-6 sm:px-7 flex flex-col items-center gap-3 z-20 shrink-0">
        {/* 1. Centered Top Progress Dots with Framer Motion Layout Animation */}
        <div className="pt-0.5">
          <OnboardingProgressDots currentStep={0} />
        </div>

        {/* 2. Main Full-Width Get Started Pill Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 420, damping: 25 }}
          onClick={onNext}
          className="w-full h-13 rounded-full bg-gradient-to-r from-[#6B34EB] via-[#7539F4] to-[#8042F6] hover:from-[#5E2DD8] hover:to-[#7335EC] text-white text-[15px] sm:text-base font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer border border-purple-400/20"
        >
          <span>Get Started</span>
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <ArrowRight className="size-5 stroke-[2.2]" />
          </motion.span>
        </motion.button>

        {/* 3. Footer Tagline */}
        <p className="text-xs font-semibold text-[#60567B]/80 text-center tracking-normal">
          Inclusive • Accessible • Empowering
        </p>
      </div>
    </div>
  );
}


