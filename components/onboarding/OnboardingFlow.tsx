"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SlideOne } from "./SlideOne";
import { SlideTwo } from "./SlideTwo";
import { SlideThree } from "./SlideThree";
import { LanguageSelectScreen } from "./LanguageSelectScreen";
import {
  Mic,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Briefcase,
  MapPin,
  Heart,
  PlayCircle,
  Smartphone,
  Film
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MobilePhoneMockup } from "@/components/demo/MobilePhoneMockup";

interface OnboardingFlowProps {
  onFinish: (targetMode?: "beneficiary" | "field_worker" | "government") => void;
  onBackToLanding?: () => void;
  isMobile?: boolean;
  initialLanguage?: string;
  onLanguageChange?: (langCode: string) => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export function OnboardingFlow({
  onFinish,
  onBackToLanding,
  isMobile = false,
  initialLanguage = "hi",
  onLanguageChange
}: OnboardingFlowProps) {
  const [activeWebStep, setActiveWebStep] = useState<number>(0);
  const [mobileSlide, setMobileSlide] = useState<number>(-1);
  const [direction, setDirection] = useState<number>(1);
  const [isSimulatingVoice, setIsSimulatingVoice] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    (initialLanguage || "hi").toLowerCase()
  );

  useEffect(() => {
    if (initialLanguage) {
      setCurrentLanguage(initialLanguage.toLowerCase());
    }
  }, [initialLanguage]);

  const handleLanguageUpdate = (code: string) => {
    const norm = code.toLowerCase();
    setCurrentLanguage(norm);
    onLanguageChange?.(norm);
  };

  const goToSlide = (nextSlide: number) => {
    setDirection(nextSlide > mobileSlide ? 1 : -1);
    setMobileSlide(nextSlide);
  };

  const handleBackToLanding = () => {
    if (onBackToLanding) {
      onBackToLanding();
    } else {
      setMobileSlide(-1);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const [heroViewMode, setHeroViewMode] = useState<"demo" | "voice">("demo");

  const [activeVoicePhrase, setActiveVoicePhrase] = useState<string>(
    "खेती करता हूं और थोड़ा बहुत मोटर और पंप का काम भी कर लेता हूं।"
  );
  const [extractedTags, setExtractedTags] = useState<string[]>([
    "Submersible Pump Diagnostics (NSQF L3)",
    "Motor Wiring & Repair (QP: ELE/Q5901)",
    "Hand Tool Safety Standards",
    "Agri-Equipment Maintenance"
  ]);

  const samplePhrases = [
    {
      label: "Rural Farmer & Mechanic (Odia/Hindi)",
      text: "खेती करता हूं और थोड़ा बहुत मोटर और पंप का काम भी कर लेता हूं। गांव के पास ही काम चाहिए।",
      tags: ["Pump Troubleshooting (NSQF L3)", "Motor Wiring (QP: ELE/Q5901)", "Agri-Tools Maintenance"]
    },
    {
      label: "Artisan & Tailor (Mayurbhanj)",
      text: "मैं घर पर हाथ से बांस की टोकरी और चटाई बनाती हूँ। सिलाई मशीन भी अच्छे से चलाती हूँ।",
      tags: ["Natural Fiber Weaving (NSQF L3)", "Apparel Stitching (QP: AMH/Q0102)", "SHG Micro-Enterprise"]
    },
    {
      label: "Electronics Hobbyist (Varanasi)",
      text: "दुकान पर बैठकर मोबाइल स्क्रीन और चार्जिंग पोर्ट रिपेयर करता हूँ, ड्रोन और सोलर भी सीखना है।",
      tags: ["SMD Component Desoldering (NSQF L4)", "Circuit Diagnostics", "Solar PV Installation"]
    }
  ];

  const handleSimulateVoice = (phrase: { label: string; text: string; tags: string[] }) => {
    setActiveVoicePhrase(phrase.text);
    setIsSimulatingVoice(true);
    setTimeout(() => {
      setExtractedTags(phrase.tags);
      setIsSimulatingVoice(false);
    }, 1200);
  };

  const renderInteractiveSlides = (isNative: boolean) => (
    <div className={`w-full ${isNative ? "h-full max-h-[100dvh]" : "h-[620px] max-w-[380px]"} relative flex flex-col overflow-hidden`}>
      <AnimatePresence custom={direction} mode="wait" initial={false}>
        {mobileSlide === -1 && (
          <motion.div
            key="slide-lang"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 350, damping: 32 },
              opacity: { duration: 0.2 },
            }}
            className="w-full h-full"
          >
            <LanguageSelectScreen
              onLanguageSelected={(code) => {
                handleLanguageUpdate(code);
                goToSlide(0);
              }}
              onBackToLanding={handleBackToLanding}
              initialLanguage={currentLanguage}
              isMobile={isNative}
            />
          </motion.div>
        )}
        {mobileSlide === 0 && (
          <motion.div
            key="slide-0"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 350, damping: 32 },
              opacity: { duration: 0.2 },
            }}
            className="w-full h-full"
          >
            <SlideOne
              onNext={() => goToSlide(1)}
              onSkip={() => onFinish("beneficiary")}
              isNativeMobile={isNative}
              language={currentLanguage}
              onLanguageChange={handleLanguageUpdate}
            />
          </motion.div>
        )}
        {mobileSlide === 1 && (
          <motion.div
            key="slide-1"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 350, damping: 32 },
              opacity: { duration: 0.2 },
            }}
            className="w-full h-full"
          >
            <SlideTwo
              onNext={() => goToSlide(2)}
              onPrev={() => goToSlide(0)}
              onSkip={() => onFinish("beneficiary")}
              isNativeMobile={isNative}
              language={currentLanguage}
              onLanguageChange={handleLanguageUpdate}
            />
          </motion.div>
        )}
        {mobileSlide === 2 && (
          <motion.div
            key="slide-2"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 350, damping: 32 },
              opacity: { duration: 0.2 },
            }}
            className="w-full h-full"
          >
            <SlideThree
              onComplete={() => onFinish("beneficiary")}
              onPrev={() => goToSlide(1)}
              onSkip={() => onFinish("beneficiary")}
              onSelectPathway={() => onFinish("beneficiary")}
              isNativeMobile={isNative}
              language={currentLanguage}
              onLanguageChange={handleLanguageUpdate}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center select-none overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. MOBILE NATIVE VIEW (Rendered immediately via CSS on phones)            */}
      {/* ========================================================================= */}
      <div className={`w-full flex-col items-center h-full max-h-[100dvh] overflow-hidden ${isMobile ? "flex" : "flex md:hidden"}`}>
        <div className="w-full max-w-md h-full max-h-[100dvh] relative flex flex-col overflow-hidden">
          {renderInteractiveSlides(true)}
        </div>
      </div>

      {/* Hidden Asset Prefetcher: Forces browser to warm cache for Slide 1, 2, 3 seamlessly */}
      <div className="hidden pointer-events-none opacity-0 select-none -z-50" aria-hidden="true">
        <Image src="/landingPage/bg_1_landing_mob.webp" alt="" width={1} height={1} priority quality={90} />
        <Image src="/landingPage/person_1_landing_mob.webp" alt="" width={1} height={1} priority quality={90} />
        <Image src="/landingPage/bg_2_landing_mob.webp" alt="" width={1} height={1} priority quality={90} />
        <Image src="/landingPage/person_2_landing_mob.webp" alt="" width={1} height={1} priority quality={90} />
        <Image src="/landingPage/ai_2_landing_mob.webp" alt="" width={1} height={1} priority quality={90} />
        <Image src="/landingPage/bg_3_landing_mob.webp" alt="" width={1} height={1} priority quality={90} />
        <Image src="/landingPage/person_3_landing_mob.webp" alt="" width={1} height={1} priority quality={90} />
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP / TABLET WEB ONBOARDING (Rendered on md+ screens)              */}
      {/* ========================================================================= */}
      {!isMobile && (
        <div className="hidden md:flex w-full flex-col items-center space-y-12">
          {/* Hero Section with bg_component.png as Scenic Canvas */}
          <section className="relative w-full min-h-[680px] lg:min-h-[760px] flex items-center justify-center overflow-hidden border-b border-slate-200">
            {/* Background Widescreen Village Illustration */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/landingPage/bg_component.webp"
                alt="Rural village sunrise landscape with sun and cottages"
                fill
                className="object-cover object-bottom"
                priority
              />
              {/* Fully blended continuous gradient across the entire width (no hard vertical cut-off) */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />
            </div>

            {/* Hero Foreground Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Column */}
              <div className="w-full lg:max-w-xl space-y-6 text-white text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-semibold">
                  <span className="size-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                    PM-AJAY INITIATIVE
                  </span>
                  <span className="text-white/60">•</span>
                  <span className="text-purple-200">Skill India Intelligence Layer</span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-heading drop-shadow-md">
                    Your Voice to a <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-purple-300">
                      Brighter Future
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-purple-100 font-medium leading-relaxed max-w-lg">
                    "From what a beneficiary can say, to what they can learn, to where they can earn."
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-lg">
                  An AI-powered voice platform that listens to your real everyday work in your own language — Hindi, Odia, Santhali, or English — discovers your informal skills, and maps you to verified NSQF training, jobs, and PM-AJAY micro-enterprise grants.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Button
                    onClick={() => onFinish("beneficiary")}
                    variant="gradient"
                    size="lg"
                    className="h-13 px-8 text-base font-bold shadow-xl shadow-purple-600/40 flex items-center gap-2 cursor-pointer"
                  >
                    <Mic className="size-5" />
                    <span>Try Voice Profiler</span>
                    <ArrowRight className="size-5" />
                  </Button>

                  <Button
                    onClick={() => onFinish("government")}
                    variant="glass"
                    size="lg"
                    className="h-13 px-6 text-sm font-bold bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md cursor-pointer"
                  >
                    <span>District Govt Dashboard</span>
                  </Button>
                </div>

                {/* Trust Highlights */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15 text-left">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                      100% Voice-First
                    </span>
                    <span className="text-xs text-slate-200">No typing or app literacy required</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                      NSQF Aligned
                    </span>
                    <span className="text-xs text-slate-200">National Qualification codes</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
                      Convergence
                    </span>
                    <span className="text-xs text-slate-200">PM-AJAY, SIDH, NCS & e-Shram</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Mobile Phone SVG with YouTube Video Demo */}
              <div className="relative w-full max-w-md lg:max-w-lg flex items-center justify-center">
                <div className="scale-95 sm:scale-100 origin-center transition-all">
                  <MobilePhoneMockup
                    videoId="xRLAAr7CCCY"
                    videoTitle="Sakhyam AI - PM-AJAY Live Voice Intelligence Demo"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 3. THE 3-STEP JOURNEY SHOWCASE FOR WEB                                    */}
          {/* ========================================================================= */}
          <section className="w-full max-w-7xl px-4 space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <Badge variant="purple" className="text-xs">
                How Sakhyam Works
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
                From Spoken Voice to Sustainable Income
              </h2>
              <p className="text-sm text-slate-600">
                Explore the three interconnected intelligence stages designed for genuine inclusion under PM-AJAY.
              </p>
            </div>

            {/* 3 Step Interactive Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setActiveWebStep(0)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${activeWebStep === 0
                  ? "bg-purple-50/70 border-purple-600 shadow-md scale-[1.02]"
                  : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
              >
                <div className="space-y-2">
                  <div className="size-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                    01
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg font-heading">
                    Voice Livelihood Interview
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A 10-minute natural conversation in Odia/Hindi. No forms or typing. Uncovers informal skills from daily experience.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-purple-700">
                  <span>Explore Voice Profiler</span>
                  <ChevronRight className="size-4" />
                </div>
              </div>

              <div
                onClick={() => setActiveWebStep(1)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${activeWebStep === 1
                  ? "bg-purple-50/70 border-purple-600 shadow-md scale-[1.02]"
                  : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
              >
                <div className="space-y-2">
                  <div className="size-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    02
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg font-heading">
                    Skill & Interest Discovery
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    AI Bot maps colloquial expressions to formal NSQF Qualification Packs & local district opportunities.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-purple-700">
                  <span>Explore AI Ontology</span>
                  <ChevronRight className="size-4" />
                </div>
              </div>

              <div
                onClick={() => setActiveWebStep(2)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${activeWebStep === 2
                  ? "bg-purple-50/70 border-purple-600 shadow-md scale-[1.02]"
                  : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
              >
                <div className="space-y-2">
                  <div className="size-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    03
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg font-heading">
                    3 Parallel Livelihood Paths
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Side-by-side comparison of Fast Income (35 Days), Career Growth, and Self-Employment with PM-AJAY capital support.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-purple-700">
                  <span>Explore Pathways</span>
                  <ChevronRight className="size-4" />
                </div>
              </div>
            </div>

            {/* Active Step Showcase Panel */}
            <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10">
              {activeWebStep === 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-5">
                    <Badge variant="purple" className="text-xs">
                      Screen 1 Showcase • Voice-First Accessibility
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading leading-tight">
                      "I do farming and repair water pumps"
                      <span className="notranslate text-purple-600 text-lg sm:text-xl font-bold block mt-1" translate="no">
                        "खेती करता हूं और मोटर पंप भी ठीक कर लेता हूं"
                      </span>
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Instead of presenting a daunting 20-page form, Sakhyam engages the candidate in a friendly spoken dialogue. The AI detects occupation, latent experience, mobility constraints, and income urgency.
                    </p>

                    <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-800 block">
                        Try Sample Spoken Phrases:
                      </span>
                      <div className="flex flex-col gap-2">
                        {samplePhrases.map((phrase, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSimulateVoice(phrase)}
                            className="text-left p-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all cursor-pointer flex items-center justify-between gap-2"
                          >
                            <span className="font-medium text-slate-800 notranslate" translate="no">
                              🗣️ "{phrase.text}"
                            </span>
                            <span className="text-[10px] font-bold text-purple-600 shrink-0">
                              Simulate AI
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => onFinish("beneficiary")}
                      variant="gradient"
                      className="font-bold text-xs h-11 px-6 rounded-xl"
                    >
                      Open Live Beneficiary Voice Engine
                    </Button>
                  </div>

                  <div className="relative w-full h-[360px] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
                    <Image
                      src="/landingPage/bg_1_landing.webp"
                      alt="Village backdrop"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        Gram Panchayat Voice Terminal
                      </span>
                      <p className="text-xs text-slate-200 font-medium">
                        Works on low-cost smartphones, WhatsApp voice notes, or toll-free IVR.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeWebStep === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-5">
                    <Badge variant="purple" className="text-xs">
                      Screen 2 Showcase • AI Skill Discovery
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading leading-tight">
                      Hidden & Informal Skill Extraction Engine
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Converts informal capabilities into recognized NSQF Qualification Packs (QPs). The AI Bot greets the beneficiary in their dialect: <em className="notranslate font-bold text-purple-700 not-italic" translate="no">"नमस्कार! मैं आपकी सहायता के लिए यहाँ हूँ"</em>.
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-blue-900">
                          <GraduationCap className="size-4" />
                          <span>Education Background</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">School level, literacy, language strengths.</p>
                      </div>

                      <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-purple-900">
                          <Briefcase className="size-4" />
                          <span>Current Work & Skills</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">Informal repair, farming, weaving, electrical.</p>
                      </div>

                      <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-orange-900">
                          <MapPin className="size-4" />
                          <span>Local Opportunities</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">Jobs and training within 15-50 km.</p>
                      </div>

                      <div className="p-3 bg-red-50 rounded-2xl border border-red-100 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-red-900">
                          <Heart className="size-4 text-red-500 fill-current" />
                          <span>Your Interests</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">Aspirations, wage job vs self-employment.</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full h-[360px] flex items-center justify-center bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] rounded-3xl border border-amber-200/80 p-4 overflow-hidden shadow-md">
                    {/* Background scenic village canvas with foggy mist */}
                    <div className="absolute inset-0 z-0">
                      <Image
                        src="/landingPage/bg_2_landing.webp"
                        alt="Village landscape"
                        fill
                        className="object-cover object-center opacity-70"
                      />
                      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAF6EE] via-[#FAF6EE]/80 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FAF6EE] via-[#FAF6EE]/90 to-transparent" />
                    </div>

                    <div className="relative w-full h-full max-w-[340px] z-10">
                      {/* Left: Person with smooth top-to-bottom opacity mask */}
                      <div className="absolute left-0 bottom-0 w-[55%] h-[90%] z-10">
                        <div className="relative w-full h-full [mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_98%)]">
                          <Image
                            src="/landingPage/person_2_landing.webp"
                            alt="Beneficiary speaking with AI Bot"
                            fill
                            className="object-contain object-bottom drop-shadow-xl"
                          />
                        </div>
                      </div>
                      {/* Right: AI Bot */}
                      <div className="absolute right-2 top-8 w-[48%] h-[68%] z-20 animate-float">
                        <Image
                          src="/landingPage/ai_2_landing.webp"
                          alt="AI Robot Assistant"
                          fill
                          className="object-contain drop-shadow-2xl"
                        />
                      </div>
                      {/* Speech Bubble */}
                      <div className="notranslate absolute right-0 top-0 z-30 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-2xl rounded-bl-sm text-[11px] font-bold shadow-lg border border-purple-400/40" translate="no">
                        नमस्कार! मैं आपकी सहायता के लिए यहाँ हूँ
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeWebStep === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-5">
                    <Badge variant="purple" className="text-xs">
                      Screen 3 Showcase • 3 Parallel Pathways
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading leading-tight">
                      Personalized Livelihood Decision Matrix
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Rather than pushing a generic course, Sakhyam presents three viable, constraint-verified pathways side-by-side:
                    </p>

                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                            ⚡
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block">Fast Income (35 Days)</span>
                            <span className="text-slate-600">Suryamitra Solar PV Installer • 42 Local Openings</span>
                          </div>
                        </div>
                        <Badge variant="warning" className="text-[10px]">94% Match</Badge>
                      </div>

                      <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                            🚀
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block">Career Growth & Apprenticeship</span>
                            <span className="text-slate-600">Industrial Motor & EV Powertrain Specialist</span>
                          </div>
                        </div>
                        <Badge variant="purple" className="text-[10px]">89% Match</Badge>
                      </div>

                      <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                            🌱
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block">Self-Employment (PM-AJAY Grant)</span>
                            <span className="text-slate-600">Village Agri-Pump & Solar Repair Clinic Hub</span>
                          </div>
                        </div>
                        <Badge variant="success" className="text-[10px]">91% Match</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full h-[360px] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
                    <Image
                      src="/landingPage/screen_3_full.png"
                      alt="Winding pathway to a brighter tomorrow"
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 4. LIVE INTERACTIVE VOICE SANDBOX (Desktop)                               */}
          {/* ========================================================================= */}
          <section className="w-full max-w-7xl px-4 py-8">
            <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-purple-800/40 space-y-8">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <Badge variant="purple" className="bg-purple-500/30 text-purple-200 border-purple-400/40 text-xs">
                  Live AI Voice Demo Sandbox
                </Badge>
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
                  Try Speaking in Vernacular Speech
                </h3>
                <p className="text-sm text-purple-200">
                  See how unstructured regional audio instantly maps into official NSQF capability codes.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-1 flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center space-y-4">
                  <div className="relative">
                    {isSimulatingVoice && (
                      <div className="absolute -inset-3 rounded-full bg-purple-500/30 animate-ping" />
                    )}
                    <button
                      onClick={() => handleSimulateVoice(samplePhrases[0])}
                      className={`size-16 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer ${isSimulatingVoice
                        ? "bg-red-500 scale-110"
                        : "bg-purple-600 hover:bg-purple-500"
                        }`}
                    >
                      <Mic className="size-7" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white block">
                      {isSimulatingVoice ? "Analyzing Speech..." : "Tap to Test Spoken Voice"}
                    </span>
                    <span className="text-[11px] text-purple-200">
                      Sambalpuri • Sadri • Bhojpuri • Hindi
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-200">Captured Spoken Input:</span>
                    <span className="text-[10px] text-emerald-400 font-bold">100% Verified</span>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl text-xs text-white font-medium italic notranslate" translate="no">
                    "{activeVoicePhrase}"
                  </div>

                  <span className="text-xs font-bold text-purple-200 block pt-2">
                    Auto-Discovered NSQF & QP Capability Clusters:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {extractedTags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs font-bold bg-purple-500/30 text-purple-200 border border-purple-400/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="size-3.5 text-emerald-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                <span className="text-xs text-purple-200">
                  Ready to explore full beneficiary profiles, field worker copilot, or district dashboards?
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => onFinish("beneficiary")}
                    variant="gradient"
                    className="font-bold text-xs h-10 px-5"
                  >
                    Open Beneficiary Engine
                  </Button>
                  <Button
                    onClick={() => onFinish("government")}
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold text-xs h-10 px-5"
                  >
                    Govt Intelligence
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}