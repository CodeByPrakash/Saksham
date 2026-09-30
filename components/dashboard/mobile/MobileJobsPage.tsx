"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Briefcase,
  Building,
  Building2,
  GraduationCap,
  Sprout,
  Clock,
  MapPin,
  ChevronRight,
  ArrowRight,
  Star,
  ThumbsUp,
  TrendingUp,
  Wrench,
  Store,
  Laptop,
  Users,
  X,
  Mic,
  MicOff,
  Sparkles,
  Award,
  Zap,
  Phone,
  CheckCircle2,
  Volume2,
  IndianRupee,
  BookOpen
} from "lucide-react";
import { JobItem, RECOMMENDED_JOBS } from "../DashboardShared";

interface MobileJobsPageProps {
  onOpenJob: (job: JobItem) => void;
  onOpenTrainingCourse?: (courseId: string) => void;
}

export type JobCategory =
  | "all"
  | "government"
  | "private"
  | "apprenticeship"
  | "self_employment"
  | "green_tech"
  | "agriculture"
  | "crafts_textiles"
  | "digital_services"
  | "healthcare"
  | "food_processing";

export const EXPLORE_JOB_SECTORS = [
  {
    id: "sec-green",
    title: "Solar & Green\nEnergy",
    count: "45+ Jobs",
    icon: Zap,
    category: "green_tech" as JobCategory,
    bgColor: "bg-amber-50/80 border-amber-100",
    iconBg: "bg-amber-100 text-amber-600",
    color: "amber"
  },
  {
    id: "sec-agri",
    title: "Drone, Agri\n& Allied",
    count: "120+ Jobs",
    icon: Sprout,
    category: "agriculture" as JobCategory,
    bgColor: "bg-emerald-50/80 border-emerald-100",
    iconBg: "bg-emerald-100 text-emerald-600",
    color: "emerald"
  },
  {
    id: "sec-craft",
    title: "Handloom &\nCraft SHG",
    count: "75+ Jobs",
    icon: Store,
    category: "crafts_textiles" as JobCategory,
    bgColor: "bg-pink-50/80 border-pink-100",
    iconBg: "bg-pink-100 text-pink-600",
    color: "pink"
  },
  {
    id: "sec-tech",
    title: "Technical &\nElectrical",
    count: "95+ Jobs",
    icon: Wrench,
    category: "private" as JobCategory,
    bgColor: "bg-blue-50/80 border-blue-100",
    iconBg: "bg-blue-100 text-blue-600",
    color: "blue"
  },
  {
    id: "sec-health",
    title: "Healthcare &\nAyush Care",
    count: "35+ Jobs",
    icon: Users,
    category: "healthcare" as JobCategory,
    bgColor: "bg-rose-50/80 border-rose-100",
    iconBg: "bg-rose-100 text-rose-600",
    color: "rose"
  },
  {
    id: "sec-digital",
    title: "CSC, IT &\nDigital Ops",
    count: "60+ Jobs",
    icon: Laptop,
    category: "digital_services" as JobCategory,
    bgColor: "bg-purple-50/80 border-purple-100",
    iconBg: "bg-purple-100 text-purple-600",
    color: "purple"
  }
];

const QUICK_VOICE_PROMPTS = [
  { label: "☀️ Solar Jobs", query: "solar" },
  { label: "🚁 Drone Pilot", query: "drone" },
  { label: "⚡ Electrician", query: "electrician" },
  { label: "🧵 Tailoring SHG", query: "tailor" },
  { label: "🏥 Hospital GDA", query: "gda" },
  { label: "🌾 Food & Mills", query: "food processing" },
  { label: "🏛️ Govt/DISCOM", query: "government" },
  { label: "💰 ₹35K Grant", query: "subsidy" }
];

export function MobileJobsPage({ onOpenJob, onOpenTrainingCourse }: MobileJobsPageProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<JobCategory>("all");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const categories = [
    { id: "all" as JobCategory, label: "All Jobs", icon: Briefcase },
    { id: "green_tech" as JobCategory, label: "Green Energy", icon: Zap },
    { id: "agriculture" as JobCategory, label: "Agri & Drone", icon: Sprout },
    { id: "government" as JobCategory, label: "Govt / PSU", icon: Building },
    { id: "apprenticeship" as JobCategory, label: "Apprentice", icon: GraduationCap },
    { id: "self_employment" as JobCategory, label: "Self Employ", icon: Store }
  ];

  // Voice Recognition setup
  const startVoiceSearch = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceToast("Voice recognition not supported on this browser.");
      setTimeout(() => setVoiceToast(null), 3000);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "hi-IN"; // Supports Hindi/English/Odia accent

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceToast("🎤 Listening... Speak job or trade name...");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        setVoiceToast(`🔍 Searched: "${transcript}"`);
        setTimeout(() => setVoiceToast(null), 3000);

        // Auto-match category
        const lower = transcript.toLowerCase();
        if (/solar|सोलर|सौर|suryamitra/i.test(lower)) {
          setActiveCategory("green_tech");
        } else if (/drone|ड्रोन|krishi|कृषि|खेती|dairy|mushroom|poultry/i.test(lower)) {
          setActiveCategory("agriculture");
        } else if (/govt|सरकारी|discom|railway|ongc|psu/i.test(lower)) {
          setActiveCategory("government");
        } else if (/apprentice|अप्रेंटिस|naps/i.test(lower)) {
          setActiveCategory("apprenticeship");
        } else if (/shg|self|उद्यम|दुकान|tailor|सिलाई/i.test(lower)) {
          setActiveCategory("self_employment");
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceToast("Could not recognize voice. Please try again.");
        setTimeout(() => setVoiceToast(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Filter jobs based on search query & selected category
  const filteredJobs = useMemo(() => {
    return RECOMMENDED_JOBS.filter((job) => {
      let matchesCategory = false;
      if (activeCategory === "all") {
        matchesCategory = true;
      } else if (activeCategory === "green_tech") {
        matchesCategory = job.sectorId === "sec-green" || /solar|ev|clean|battery|renewable/i.test(job.title + " " + job.sectorName);
      } else if (activeCategory === "agriculture") {
        matchesCategory = job.sectorId === "sec-agri" || /drone|agri|dairy|mushroom|poultry|fish|farm/i.test(job.title + " " + job.sectorName);
      } else if (activeCategory === "crafts_textiles") {
        matchesCategory = job.sectorId === "sec-crafts" || /tailor|apparel|handloom|bamboo|pottery|craft/i.test(job.title + " " + job.sectorName);
      } else if (activeCategory === "digital_services") {
        matchesCategory = job.sectorId === "sec-digital" || /csc|data|it|cctv|computer|telecom/i.test(job.title + " " + job.sectorName);
      } else if (activeCategory === "healthcare") {
        matchesCategory = job.sectorId === "sec-health" || /health|gda|hospital|nurse|ayush|medical/i.test(job.title + " " + job.sectorName);
      } else if (activeCategory === "food_processing") {
        matchesCategory = job.sectorId === "sec-agro" || /food|oil|spice|millet|bakery|processing/i.test(job.title + " " + job.sectorName);
      } else {
        matchesCategory = job.category === activeCategory;
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        (job.sectorName && job.sectorName.toLowerCase().includes(q)) ||
        (job.qpCode && job.qpCode.toLowerCase().includes(q)) ||
        (job.voiceKeywords && job.voiceKeywords.some((k) => k.toLowerCase().includes(q))) ||
        job.skills.some((s) => s.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="space-y-4 pb-4 select-none animate-in fade-in duration-200">
      {/* Voice feedback toast */}
      <AnimatePresence>
        {voiceToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-4 right-4 z-50 bg-purple-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-lg border border-purple-400/30 flex items-center gap-2 backdrop-blur-md"
          >
            <Sparkles className="size-4 text-amber-300 animate-pulse shrink-0" />
            <span className="flex-1 truncate">{voiceToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. HERO BANNER: "Job & Livelihood Opportunities" + 3D Artwork              */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-[32px] border border-[#EDE7D9] p-5 shadow-xs min-h-[210px] flex flex-col justify-between">
        {/* Full-width sunny village learning backdrop */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landingPage/bg_2_landing.webp"
            alt="Rural Career Center Backdrop"
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            className="object-cover object-center"
            priority
          />
          {/* Soft cream gradient overlay on left for high-contrast text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE]/95 via-50% to-transparent pointer-events-none" />
        </div>

        {/* Content Overlaid on Left */}
        <div className="relative z-10 flex flex-col justify-center h-full max-w-[220px] space-y-1.5 my-auto">
          <div className="inline-flex items-center gap-1 bg-amber-100/90 border border-amber-300/60 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded-full w-fit">
            <Sparkles className="size-2.5 text-amber-600" />
            <span>36+ NSQF & PM-AJAY Jobs</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading tracking-tight leading-tight">
            Jobs &amp;<br />Opportunities
          </h1>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Verified wage jobs, apprenticeships, and subsidized self-employment linked directly to your training skills.
          </p>
        </div>

        {/* Right 3D Character Artwork */}
        <div className="absolute right-0 bottom-0 w-44 h-48 flex items-end justify-center pointer-events-none z-10">
          <div className="relative w-36 h-full">
            <Image
              src="/landingPage/person_3_landing.webp"
              alt="Youth Job Seeker"
              fill
              sizes="150px"
              className="object-contain object-bottom drop-shadow-md"
              priority
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & VOICE SEARCH BAR                                              */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2">
        {/* Search Input Box */}
        <div className="flex-1 flex items-center gap-2 bg-white border border-[#EDE7D9] rounded-2xl px-3.5 py-2.5 shadow-2xs focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
          <Search className="size-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trade, solar, drone, tailor..."
            className="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Voice Recognition Mic Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={isListening ? stopVoiceSearch : startVoiceSearch}
          className={`size-11 rounded-2xl border shadow-2xs flex items-center justify-center cursor-pointer transition-all ${
            isListening
              ? "bg-rose-500 text-white border-rose-600 animate-pulse ring-4 ring-rose-200"
              : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
          }`}
          title="Voice Search Jobs (Hindi, Odia, English)"
          aria-label="Voice Search"
        >
          {isListening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
        </motion.button>

        {/* Filter Reset Button */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            setActiveCategory("all");
            setSearchQuery("");
          }}
          className={`size-11 rounded-2xl bg-white border border-[#EDE7D9] shadow-2xs flex items-center justify-center cursor-pointer transition-colors ${
            activeCategory !== "all" || searchQuery
              ? "text-purple-700 border-purple-300 bg-purple-50"
              : "text-slate-700 hover:text-purple-700"
          }`}
          aria-label="Reset filters"
          title="Reset Filters"
        >
          <SlidersHorizontal className="size-4.5" />
        </motion.button>
      </div>

      {/* Quick Voice / Keyword Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {QUICK_VOICE_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSearchQuery(prompt.query);
            }}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap border transition-all cursor-pointer ${
              searchQuery.toLowerCase() === prompt.query.toLowerCase()
                ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                : "bg-white text-slate-700 border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/50"
            }`}
          >
            {prompt.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 3. CATEGORY TABS (Squircles in Horizontal Row)                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-2 py-2.5 rounded-2xl border shadow-2xs flex flex-col items-center justify-between text-center cursor-pointer min-h-[76px] transition-all ${
                isActive
                  ? "bg-[#ECE7FE] border-purple-200 text-purple-700 font-extrabold shadow-sm"
                  : "bg-white border-[#EDE7D9] text-slate-600 font-bold hover:bg-slate-50"
              }`}
            >
              <div
                className={`size-7 rounded-full flex items-center justify-center mb-1 transition-colors ${
                  isActive ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                <Icon className="size-3.5" />
              </div>
              <span className="text-[9px] leading-tight font-bold">
                {cat.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. "EXPLORE SECTOR OPPORTUNITIES" HORIZONTAL CARDS                         */}
      {/* ========================================================================= */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm font-heading flex items-center gap-1.5">
            <span>Specialized Sectors</span>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
              {RECOMMENDED_JOBS.length} Openings
            </span>
          </h3>
          <button
            onClick={() => setActiveCategory("all")}
            className="text-[11px] font-bold text-purple-700 hover:text-purple-800 flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="size-3" />
          </button>
        </div>

        {/* Horizontal Sector Cards */}
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 no-scrollbar">
          {EXPLORE_JOB_SECTORS.map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeCategory === sec.category;
            return (
              <motion.div
                key={sec.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveCategory(isSelected ? "all" : sec.category);
                }}
                className={`min-w-[110px] p-2.5 rounded-2xl border shadow-2xs flex flex-col items-center justify-between text-center cursor-pointer group transition-all ${
                  isSelected
                    ? "bg-purple-100/90 border-purple-400 ring-2 ring-purple-300"
                    : "bg-white border-[#EDE7D9] hover:border-purple-200"
                }`}
              >
                <div className={`size-8 rounded-full flex items-center justify-center mb-1 ${sec.iconBg}`}>
                  <Icon className="size-4" />
                </div>
                <h5 className="font-bold text-slate-900 text-[10px] leading-tight whitespace-pre-line">
                  {sec.title}
                </h5>
                <span className="text-[9px] text-purple-700 font-extrabold mt-1 flex items-center gap-0.5">
                  <span>{sec.count}</span>
                  <ChevronRight className="size-2.5" />
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. "JOBS FOR YOU" LIST SECTION                                            */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm font-heading">
              Opportunities For You ({filteredJobs.length})
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Matched to your skill profile, NSQF certification &amp; district
            </p>
          </div>
          {(activeCategory !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* List of Job Cards */}
        <div className="space-y-3">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenJob(job)}
                className="bg-white p-3.5 rounded-3xl border border-[#EDE7D9] shadow-2xs flex flex-col gap-2.5 cursor-pointer group hover:border-purple-300 hover:shadow-xs transition-all"
              >
                {/* Top Section: Thumbnail + Header Details */}
                <div className="flex items-start gap-3">
                  {/* Job Thumbnail Image with Badge */}
                  <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src={job.image}
                      alt={job.title}
                      fill
                      sizes="96px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Badge top left */}
                    <div className="absolute top-1 left-1">
                      <span
                        className={`text-[7.5px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-0.5 ${
                          job.badgeColor === "emerald"
                            ? "bg-emerald-600 text-white"
                            : job.badgeColor === "purple"
                            ? "bg-purple-600 text-white"
                            : job.badgeColor === "amber"
                            ? "bg-amber-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {job.badgeIcon === "star" && <Star className="size-2 fill-white" />}
                        {job.badgeIcon === "thumbs_up" && <ThumbsUp className="size-2 fill-white" />}
                        {job.badgeIcon === "chart" && <TrendingUp className="size-2" />}
                        {job.badgeIcon === "building" && <Building className="size-2" />}
                        <span>{job.badge}</span>
                      </span>
                    </div>
                  </div>

                  {/* Job Header & Company Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug truncate">
                          {job.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 font-semibold truncate">
                          {job.company}
                        </p>
                      </div>

                      {/* Sector / Type Pill */}
                      {job.sectorName && (
                        <span className="shrink-0 text-[8.5px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md border border-slate-200/60">
                          {job.sectorName}
                        </span>
                      )}
                    </div>

                    {/* Metadata line: Type, Location, NSQF */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] text-slate-600 font-medium pt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Briefcase className="size-3 text-slate-400" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-slate-400" />
                        {job.location}
                      </span>
                      {job.nsqfLevel && (
                        <span className="flex items-center gap-0.5 text-purple-700 font-bold bg-purple-50 px-1 rounded text-[9px]">
                          <Award className="size-2.5 text-purple-600" />
                          NSQF L{job.nsqfLevel}
                        </span>
                      )}
                    </div>

                    {/* Salary or Grant */}
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900 pt-0.5">
                      <span className="text-emerald-600">💵</span>
                      <span className="text-emerald-700 font-extrabold">{job.salary}</span>
                      {job.subsidyGrant && (
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-extrabold">
                          {job.subsidyGrant}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Prerequisite Training Course Link (if available) */}
                {job.trainingCourseId && (
                  <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5 text-amber-900 font-medium truncate">
                      <BookOpen className="size-3 text-amber-700 shrink-0" />
                      <span className="truncate">
                        Prerequisite: <strong className="font-bold">{job.trainingCourseId.replace('nsqf-course-', '').replace(/-/g, ' ').toUpperCase()}</strong>
                      </span>
                    </div>
                    {onOpenTrainingCourse && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTrainingCourse(job.trainingCourseId!);
                        }}
                        className="text-amber-800 hover:text-amber-950 font-bold underline shrink-0 cursor-pointer text-[9.5px]"
                      >
                        View Course
                      </button>
                    )}
                  </div>
                )}

                {/* Bottom Row: Skill Tags + Apply Button */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1 min-w-0">
                    {job.skills.slice(0, 3).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[9px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg shrink-0 truncate max-w-[110px]"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="text-[8.5px] font-medium text-slate-400 self-center">
                        +{job.skills.length - 3}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenJob(job);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-[#EDE7D9] text-center space-y-2">
              <p className="text-xs font-bold text-slate-700">No job openings found for &ldquo;{searchQuery}&rdquo;</p>
              <p className="text-[11px] text-slate-500">Try searching for &quot;solar&quot;, &quot;drone&quot;, &quot;electrician&quot;, or &quot;tailor&quot;.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="text-xs font-bold text-purple-700 hover:underline pt-1 inline-block"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
