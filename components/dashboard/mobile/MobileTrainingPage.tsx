"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  GraduationCap,
  Wrench,
  Sprout,
  Briefcase,
  Store,
  Clock,
  MapPin,
  ChevronRight,
  ArrowRight,
  Laptop,
  CheckCircle2,
  Sparkles,
  Heart,
  Volume2,
  HelpCircle,
  Coins,
  ShieldCheck,
  TrendingUp,
  X
} from "lucide-react";
import { CourseItem } from "../DashboardShared";
import { CourseDetailModal } from "../CourseDetailModal";
import { BeneficiaryProfileData } from "@/components/onboarding/PersonalVoiceOnboarding";
import {
  getPersonalizedTrainingCourses,
  NSQFCourseExtra,
  SECTOR_DEFINITIONS,
  ALL_EXPANDED_NSQF_COURSES,
  TrainingCategory,
  getSafeCourseImage
} from "@/lib/skillTrainingGenerator";

interface MobileTrainingPageProps {
  onOpenCourse?: (course: CourseItem) => void;
  onOpenVoiceAssistant?: (prompt?: string) => void;
  beneficiaryProfile?: BeneficiaryProfileData | null;
}

export type { NSQFCourseExtra };

export function MobileTrainingPage({
  onOpenCourse,
  onOpenVoiceAssistant,
  beneficiaryProfile
}: MobileTrainingPageProps) {
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState<boolean>(false);

  // Dynamic Skill & Course Generation from Worker Profile
  const { detectedCourses, allCourses, detectedSkillName } = useMemo(() => {
    return getPersonalizedTrainingCourses(beneficiaryProfile || null, ALL_EXPANDED_NSQF_COURSES);
  }, [beneficiaryProfile]);

  // Filter courses based on search & category
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const matchesCategory =
        activeCategory === "all" ||
        course.sectorId === activeCategory ||
        course.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        course.location.toLowerCase().includes(q) ||
        course.qpCode.toLowerCase().includes(q) ||
        course.sectorName.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [allCourses, searchQuery, activeCategory]);

  // Group filtered courses section-wise for rich structured browsing
  const sectorGroups = useMemo(() => {
    const map: Record<string, { sector: any; courses: NSQFCourseExtra[] }> = {};

    SECTOR_DEFINITIONS.filter((s) => s.id !== "all").forEach((sec) => {
      map[sec.id] = { sector: sec, courses: [] };
    });

    filteredCourses.forEach((c) => {
      const sId = c.sectorId || "green_energy_tech";
      if (!map[sId]) {
        map[sId] = {
          sector: {
            id: sId,
            name: c.sectorName || "Vocational & Technical Trades",
            iconName: "wrench",
            badgeColor: "purple",
            gradient: "from-purple-600 to-indigo-600",
            description: "Certified skill training programs."
          },
          courses: []
        };
      }
      map[sId].courses.push(c);
    });

    return Object.values(map).filter((g) => g.courses.length > 0);
  }, [filteredCourses]);

  const handleSelectCourse = (course: CourseItem) => {
    if (onOpenCourse) {
      onOpenCourse(course);
    } else {
      setSelectedCourse(course);
      setIsCourseModalOpen(true);
    }
  };

  const getSectorIcon = (iconName: string) => {
    switch (iconName) {
      case "wrench":
        return Wrench;
      case "sprout":
        return Sprout;
      case "store":
        return Store;
      case "heart":
        return Heart;
      case "laptop":
        return Laptop;
      default:
        return GraduationCap;
    }
  };

  return (
    <div className="space-y-4 pb-6 select-none animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: "Skill Training Hub" with Quick AI Copilot Access         */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-[32px] border border-[#EDE7D9] p-5 shadow-xs min-h-[200px] flex flex-col justify-between">
        {/* Full-width sunny village learning backdrop */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landingPage/bg_3_landing.webp"
            alt="Skill Training Center Backdrop"
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            className="object-cover object-center"
            priority
          />
          {/* Soft cream gradient overlay on left for high-contrast text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE]/95 via-50% to-transparent pointer-events-none" />
        </div>

        {/* Content Overlaid on Left */}
        <div className="relative z-10 flex flex-col justify-center h-full max-w-[220px] space-y-2 my-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100/90 border border-purple-200 text-purple-800 text-[10px] font-extrabold w-fit">
            <Sparkles className="size-3 text-purple-600" />
            <span>PM-AJAY 100% Free</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading tracking-tight leading-tight">
            Skill Training & Livelihoods
          </h1>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {allCourses.length} NSDC & PM-AJAY certified courses with ₹3,500/mo stipend.
          </p>

          <button
            onClick={() => onOpenVoiceAssistant?.("मुझे कौन सा कौशल प्रशिक्षण चुनना चाहिए? कृपया मेरी योग्यता और पीएम-अजय अनुदान के अनुसार बताएं।")}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold shadow-xs cursor-pointer transition-all active:scale-95 w-fit"
          >
            <Volume2 className="size-3.5" />
            <span>Ask AI Course Advisor</span>
          </button>
        </div>

        {/* Right 3D Character Artwork */}
        <div className="absolute right-0 bottom-0 w-40 h-48 flex items-end justify-center pointer-events-none z-10">
          <div className="relative w-36 h-full">
            <Image
              src="/landingPage/person_3_landing.webp"
              alt="Skill Training Student"
              fill
              sizes="150px"
              className="object-contain object-bottom drop-shadow-md"
              priority
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC DETECTED SKILL SPOTLIGHT BANNER (if any worker skill detected) */}
      {/* ========================================================================= */}
      {detectedCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-lg border border-purple-400/40 space-y-2.5 relative overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-2 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-2xl bg-purple-500/30 border border-purple-400/50 flex items-center justify-center text-purple-300 shrink-0">
                <Sparkles className="size-4.5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 block">
                  PM-AJAY AI Skill Match Engine
                </span>
                <h3 className="text-sm font-extrabold text-white leading-tight">
                  ✨ Matched: {detectedSkillName}
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9px] font-black uppercase shrink-0">
              100% Free Grant
            </span>
          </div>

          <p className="text-[11px] text-purple-100/90 leading-relaxed relative z-10">
            A dedicated NSQF Level 4 training program with ₹3,500/mo DBT stipend and ₹35,000 tool kit subsidy has been generated for your background.
          </p>

          <div className="flex items-center gap-2 pt-1 relative z-10">
            <button
              onClick={() => handleSelectCourse(detectedCourses[0])}
              type="button"
              className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-[0.98]"
            >
              <Sparkles className="size-3.5 text-amber-300" />
              <span>Open {detectedCourses[0].title.split("(")[0].trim()} Page</span>
              <ArrowRight className="size-3.5" />
            </button>

            <button
              onClick={() => onOpenVoiceAssistant?.(`मुझे ${detectedCourses[0].title} के पाठ्यक्रम, स्टाइपेंड और केंद्र के बारे में विस्तार से बताएं।`)}
              type="button"
              className="size-10 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-purple-200 hover:text-white cursor-pointer transition-colors shrink-0"
              title="Ask AI Copilot about this course"
            >
              <Volume2 className="size-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. SEARCH & VOICE FILTER BAR                                              */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white border border-[#EDE7D9] rounded-2xl px-3.5 py-2.5 shadow-2xs focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
          <Search className="size-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search solar, drones, tailoring, nursing, CSC..."
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

        {/* AI Voice Prompt Trigger Button */}
        <button
          onClick={() => onOpenVoiceAssistant?.("मुझे पास के कौशल प्रशिक्षण केंद्र और कोर्स की सूची दिखाएं।")}
          type="button"
          className="size-10 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center cursor-pointer transition-colors shadow-2xs shrink-0"
          title="Voice Search via AI Copilot"
        >
          <Volume2 className="size-4.5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. SECTOR CATEGORY CAROUSEL / FILTER PILLS (Section-Wise Navigation)      */}
      {/* ========================================================================= */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar -mx-1 px-1">
        {SECTOR_DEFINITIONS.map((sec) => {
          const Icon = getSectorIcon(sec.iconName);
          const isActive = activeCategory === sec.id;
          const count =
            sec.id === "all"
              ? allCourses.length
              : allCourses.filter((c) => c.sectorId === sec.id || c.category === sec.category).length;

          return (
            <motion.button
              key={sec.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(sec.id)}
              className={`px-3 py-2 rounded-2xl border text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-all ${
                isActive
                  ? "bg-purple-600 border-purple-700 text-white shadow-sm font-extrabold"
                  : "bg-white border-[#EDE7D9] text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className={`size-3.5 ${isActive ? "text-white" : "text-purple-600"}`} />
              <span>{sec.shortName}</span>
              <span
                className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 5. SECTION-WISE COURSE CATALOG & CARDS                                    */}
      {/* ========================================================================= */}
      <div className="space-y-6 pt-1">
        {sectorGroups.length > 0 ? (
          sectorGroups.map((group) => {
            const SectorIcon = getSectorIcon(group.sector.iconName);

            return (
              <div key={group.sector.id} className="space-y-3">
                {/* Sector Section Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                      <SectorIcon className="size-3.5" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-sm font-heading leading-tight">
                        {group.sector.name}
                      </h2>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {group.courses.length} Certified Programs • 100% PM-AJAY Grant
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveCategory(group.sector.id)}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View Sector</span>
                    <ChevronRight className="size-3" />
                  </button>
                </div>

                {/* Sector Courses List */}
                <div className="space-y-3">
                  {group.courses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileTap={{ scale: 0.98 }}
                      className={`bg-white p-3.5 rounded-3xl border shadow-2xs hover:shadow-md transition-all flex flex-col gap-3 group cursor-pointer ${
                        course.isDetectedSkill
                          ? "border-purple-400 ring-2 ring-purple-400/20 bg-gradient-to-b from-purple-50/30 to-white"
                          : "border-[#EDE7D9] hover:border-purple-200"
                      }`}
                      onClick={() => handleSelectCourse(course)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Course Thumbnail Image with Badge */}
                        <div className="relative w-24 sm:w-28 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                          <Image
                            src={getSafeCourseImage(course.image, course.title, course.category)}
                            alt={course.title}
                            fill
                            sizes="112px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-1.5 left-1.5">
                            <span
                              className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs ${
                                course.badgeColor === "blue"
                                  ? "bg-blue-600 text-white"
                                  : course.badgeColor === "amber"
                                  ? "bg-amber-500 text-white"
                                  : course.badgeColor === "purple"
                                  ? "bg-purple-600 text-white"
                                  : "bg-emerald-600 text-white"
                              }`}
                            >
                              {course.badge}
                            </span>
                          </div>
                        </div>

                        {/* Course Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[9.5px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                              NSQF Level {course.nsqfLevel} • {course.qpCode}
                            </span>
                            <span className="text-[9.5px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Coins className="size-2.5" />
                              <span>₹3,500/mo</span>
                            </span>
                          </div>

                          <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                            {course.title}
                          </h3>

                          <p className="text-[10.5px] text-slate-500 font-medium line-clamp-2 leading-tight">
                            {course.shortDesc}
                          </p>

                          <div className="flex items-center gap-3 text-[9.5px] text-slate-500 font-semibold pt-1">
                            <span className="flex items-center gap-0.5 shrink-0">
                              <Clock className="size-2.5 text-slate-400" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-0.5 truncate">
                              <MapPin className="size-2.5 text-slate-400" />
                              {course.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Course Card Footer Actions: Open Page + AI Copilot */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenVoiceAssistant?.(`मुझे ${course.title} के बारे में विस्तार से बताएं। इसमें क्या सिखाया जाएगा और कौन सी नौकरी मिलेगी?`);
                          }}
                          type="button"
                          className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10.5px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Volume2 className="size-3 text-purple-600" />
                          <span>Ask AI</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCourse(course);
                          }}
                          type="button"
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-purple-900 text-white text-[11px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>View Training Page</span>
                          <ArrowRight className="size-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-[#EDE7D9] text-center space-y-3">
            <GraduationCap className="size-10 text-slate-300 mx-auto" />
            <h4 className="font-extrabold text-slate-800 text-sm">No Courses Found</h4>
            <p className="text-xs text-slate-500">
              Try changing your search query or select "All Courses" to explore the full catalog.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Course Detail Modal Fallback */}
      <CourseDetailModal
        course={selectedCourse}
        isOpen={isCourseModalOpen}
        onClose={() => {
          setIsCourseModalOpen(false);
          setSelectedCourse(null);
        }}
      />
    </div>
  );
}
