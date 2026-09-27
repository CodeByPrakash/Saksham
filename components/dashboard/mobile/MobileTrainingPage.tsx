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
  X
} from "lucide-react";
import { CourseItem, RECOMMENDED_COURSES } from "../DashboardShared";
import { CourseDetailModal } from "../CourseDetailModal";

interface MobileTrainingPageProps {
  onOpenCourse?: (course: CourseItem) => void;
}

export type TrainingCategory = "all" | "technical" | "agriculture" | "service" | "self_employment";

export interface NSQFCourseExtra extends CourseItem {
  category: TrainingCategory;
  shortDesc: string;
}

export const ALL_NSQF_COURSES: NSQFCourseExtra[] = [
  {
    ...RECOMMENDED_COURSES[0],
    category: "technical",
    shortDesc: "Learn electrical installation, maintenance and safety."
  },
  {
    ...RECOMMENDED_COURSES[1],
    category: "self_employment",
    shortDesc: "Learn stitching, garment making and small business skills."
  },
  {
    ...RECOMMENDED_COURSES[2],
    category: "agriculture",
    shortDesc: "Learn food processing, packaging and value addition."
  },
  {
    ...RECOMMENDED_COURSES[3],
    category: "technical",
    shortDesc: "Rooftop solar PV installation, inverter connection & grid safety."
  },
  {
    ...RECOMMENDED_COURSES[4],
    category: "service",
    shortDesc: "Hospital patient care assistance, vital checks and PHC healthcare."
  },
  {
    ...RECOMMENDED_COURSES[5],
    category: "self_employment",
    shortDesc: "Bamboo handicraft design, eco-products & TRIFED market linkage."
  },
  {
    ...RECOMMENDED_COURSES[6],
    category: "technical",
    shortDesc: "Smartphone hardware repair, SMD micro-soldering & diagnostics."
  },
  {
    ...RECOMMENDED_COURSES[7],
    category: "agriculture",
    shortDesc: "Organic bio-fertilizer production, vermicompost & FPO tie-ups."
  },
  {
    ...RECOMMENDED_COURSES[8],
    category: "technical",
    shortDesc: "Electric 2-wheeler BLDC motor repair and battery management."
  },
  {
    ...RECOMMENDED_COURSES[9],
    category: "service",
    shortDesc: "Skincare, bridal grooming, and setting up rural beauty parlours."
  }
];

export const EXPLORE_MORE_COURSES = [
  {
    id: "exp-1",
    title: "Computer Basics (NSQF Level 3)",
    duration: "3 Months",
    iconName: "laptop",
    color: "blue",
    bgColor: "bg-blue-50 border-blue-100",
    iconBg: "bg-blue-100 text-blue-600"
  },
  {
    id: "exp-2",
    title: "Organic Farming (NSQF Level 3)",
    duration: "4 Months",
    iconName: "sprout",
    color: "emerald",
    bgColor: "bg-emerald-50 border-emerald-100",
    iconBg: "bg-emerald-100 text-emerald-600"
  }
];

export function MobileTrainingPage({ onOpenCourse }: MobileTrainingPageProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<TrainingCategory>("all");
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState<boolean>(false);

  const categories = [
    { id: "all" as TrainingCategory, label: "All\nCourses", icon: GraduationCap },
    { id: "technical" as TrainingCategory, label: "Technical\nSkills", icon: Wrench },
    { id: "agriculture" as TrainingCategory, label: "Agriculture\n& Allied", icon: Sprout },
    { id: "service" as TrainingCategory, label: "Service\nSector", icon: Briefcase },
    { id: "self_employment" as TrainingCategory, label: "Self-\nEmployment", icon: Store },
  ];

  // Filter courses based on search & category
  const filteredCourses = useMemo(() => {
    return ALL_NSQF_COURSES.filter((course) => {
      const matchesCategory =
        activeCategory === "all" || course.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        course.location.toLowerCase().includes(q) ||
        course.qpCode.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const handleSelectCourse = (course: CourseItem) => {
    if (onOpenCourse) {
      onOpenCourse(course);
    } else {
      setSelectedCourse(course);
      setIsCourseModalOpen(true);
    }
  };

  return (
    <div className="space-y-4 pb-4 select-none">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: "Skill Training" + Cheerful Student Artwork               */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-[32px] border border-[#EDE7D9] p-5 shadow-xs min-h-[210px] flex flex-col justify-between">
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
        <div className="relative z-10 flex flex-col justify-center h-full max-w-[210px] space-y-1.5 my-auto">
          <h1 className="text-2xl font-black text-slate-900 font-heading tracking-tight leading-tight">
            Skill Training
          </h1>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Learn new skills, get certified and build a brighter future.
          </p>
        </div>

        {/* Right 3D Character Artwork: Student holding notebook & backpack */}
        <div className="absolute right-0 bottom-0 w-44 h-48 flex items-end justify-center pointer-events-none z-10">
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
      {/* 2. SEARCH & FILTER BAR                                                    */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2.5">
        {/* Search Input Box */}
        <div className="flex-1 flex items-center gap-2 bg-white border border-[#EDE7D9] rounded-2xl px-3.5 py-3 shadow-2xs focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
          <Search className="size-4.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for courses, trades or skills..."
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

        {/* Filter Button */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => setActiveCategory(activeCategory === "all" ? "technical" : "all")}
          className="size-11 rounded-2xl bg-white border border-[#EDE7D9] shadow-2xs flex items-center justify-center text-slate-700 hover:text-purple-700 cursor-pointer transition-colors"
          aria-label="Filter courses"
        >
          <SlidersHorizontal className="size-4.5" />
        </motion.button>
      </div>

      {/* ========================================================================= */}
      {/* 3. CATEGORY TABS (5 Squircles in Horizontal Row)                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-5 gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-2 py-3 rounded-2xl border shadow-2xs flex flex-col items-center justify-between text-center cursor-pointer min-h-[96px] transition-all ${
                isActive
                  ? "bg-[#ECE7FE] border-purple-200 text-purple-700 font-extrabold shadow-sm"
                  : "bg-white border-[#EDE7D9] text-slate-600 font-bold hover:bg-slate-50"
              }`}
            >
              <div
                className={`size-9 rounded-full flex items-center justify-center mb-1 transition-colors ${
                  isActive ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                <Icon className="size-4.5" />
              </div>
              <span className="text-[10px] leading-tight whitespace-pre-line">
                {cat.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. "RECOMMENDED FOR YOU" SECTION (Full-Width NSQF Course Cards)           */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm font-heading">
              Recommended for You
            </h3>
            <p className="text-[10.5px] text-slate-500 font-medium">
              Based on your profile, interests and local opportunities
            </p>
          </div>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-0.5 cursor-pointer"
          >
            <span>See All</span>
            <ArrowRight className="size-3" />
          </button>
        </div>

        {/* List of Full-Width Course Cards */}
        <div className="space-y-3">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectCourse(course)}
                className="bg-white p-3 rounded-3xl border border-[#EDE7D9] shadow-2xs flex items-center gap-3 cursor-pointer group hover:border-purple-200 transition-all"
              >
                {/* Course Thumbnail Image with Badge */}
                <div className="relative w-28 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="112px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badge top left */}
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
                  <h4 className="font-extrabold text-slate-900 text-xs leading-snug truncate">
                    {course.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-2 leading-tight">
                    {course.shortDesc}
                  </p>

                  <div className="flex items-center gap-2 text-[9.5px] text-slate-500 font-semibold pt-1">
                    <span className="flex items-center gap-0.5 shrink-0">
                      <Clock className="size-2.5 text-slate-400" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-0.5 truncate">
                      <MapPin className="size-2.5 text-slate-400" />
                      {course.location}
                    </span>
                    <span className="bg-emerald-100/90 text-emerald-800 px-1.5 py-0.5 rounded text-[8.5px] font-extrabold shrink-0">
                      NSQF
                    </span>
                  </div>
                </div>

                {/* Right Action Chevron */}
                <div className="size-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <ChevronRight className="size-4" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-[#EDE7D9] text-center space-y-2">
              <p className="text-xs font-bold text-slate-700">No courses match your query</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="text-xs font-bold text-purple-700 hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. "EXPLORE MORE COURSES" SECTION                                         */}
      {/* ========================================================================= */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm font-heading">
            Explore More Courses
          </h3>
          <button
            onClick={() => handleSelectCourse(ALL_NSQF_COURSES[4])}
            className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-0.5 cursor-pointer"
          >
            <span>See All</span>
            <ArrowRight className="size-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. Computer Basics */}
          <motion.div
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectCourse(ALL_NSQF_COURSES[6])}
            className="bg-white p-3 rounded-2xl border border-[#EDE7D9] shadow-2xs flex items-center justify-between cursor-pointer group hover:border-blue-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Laptop className="size-4.5" />
              </div>
              <div className="min-w-0">
                <h5 className="font-extrabold text-slate-900 text-[11px] leading-tight truncate">
                  Computer Basics (NSQF Level 3)
                </h5>
                <span className="text-[9.5px] text-slate-500 font-semibold flex items-center gap-0.5 mt-0.5">
                  <Clock className="size-2.5" />
                  3 Months
                </span>
              </div>
            </div>

            <div className="size-5 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 ml-1">
              <ChevronRight className="size-3" />
            </div>
          </motion.div>

          {/* 2. Organic Farming */}
          <motion.div
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectCourse(ALL_NSQF_COURSES[7])}
            className="bg-white p-3 rounded-2xl border border-[#EDE7D9] shadow-2xs flex items-center justify-between cursor-pointer group hover:border-emerald-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Sprout className="size-4.5" />
              </div>
              <div className="min-w-0">
                <h5 className="font-extrabold text-slate-900 text-[11px] leading-tight truncate">
                  Organic Farming (NSQF Level 3)
                </h5>
                <span className="text-[9.5px] text-slate-500 font-semibold flex items-center gap-0.5 mt-0.5">
                  <Clock className="size-2.5" />
                  4 Months
                </span>
              </div>
            </div>

            <div className="size-5 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 ml-1">
              <ChevronRight className="size-3" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Internal Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourse}
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
      />
    </div>
  );
}
