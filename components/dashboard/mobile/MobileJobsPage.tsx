"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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
  X
} from "lucide-react";
import { JobItem, RECOMMENDED_JOBS } from "../DashboardShared";

interface MobileJobsPageProps {
  onOpenJob: (job: JobItem) => void;
}

export type JobCategory = "all" | "government" | "private" | "apprenticeship" | "self_employment";

export const EXPLORE_JOB_SECTORS = [
  {
    id: "sec-1",
    title: "Agriculture\n& Allied",
    count: "120+ Jobs",
    icon: Sprout,
    bgColor: "bg-emerald-50/80 border-emerald-100",
    iconBg: "bg-emerald-100 text-emerald-600",
    color: "emerald"
  },
  {
    id: "sec-2",
    title: "Technical\nTrades",
    count: "95+ Jobs",
    icon: Wrench,
    bgColor: "bg-amber-50/80 border-amber-100",
    iconBg: "bg-amber-100 text-amber-600",
    color: "amber"
  },
  {
    id: "sec-3",
    title: "Service\nSector",
    count: "80+ Jobs",
    icon: Store,
    bgColor: "bg-purple-50/80 border-purple-100",
    iconBg: "bg-purple-100 text-purple-600",
    color: "purple"
  },
  {
    id: "sec-4",
    title: "IT & Digital\nJobs",
    count: "60+ Jobs",
    icon: Laptop,
    bgColor: "bg-blue-50/80 border-blue-100",
    iconBg: "bg-blue-100 text-blue-600",
    color: "blue"
  },
  {
    id: "sec-5",
    title: "Community\n& Field Work",
    count: "40+ Jobs",
    icon: Users,
    bgColor: "bg-rose-50/80 border-rose-100",
    iconBg: "bg-rose-100 text-rose-600",
    color: "rose"
  }
];

export function MobileJobsPage({ onOpenJob }: MobileJobsPageProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<JobCategory>("all");

  const categories = [
    { id: "all" as JobCategory, label: "All Jobs", icon: Briefcase },
    { id: "government" as JobCategory, label: "Government", icon: Building },
    { id: "private" as JobCategory, label: "Private", icon: Building2 },
    { id: "apprenticeship" as JobCategory, label: "Apprenticeship", icon: GraduationCap },
    { id: "self_employment" as JobCategory, label: "Self-Employment", icon: Sprout },
  ];

  // Filter jobs based on search query & selected category
  const filteredJobs = useMemo(() => {
    return RECOMMENDED_JOBS.filter((job) => {
      const matchesCategory =
        activeCategory === "all" || job.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="space-y-4 pb-4 select-none animate-in fade-in duration-200">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: "Job Opportunities" + 3D Learner Artwork                  */}
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
        <div className="relative z-10 flex flex-col justify-center h-full max-w-[210px] space-y-1.5 my-auto">
          <h1 className="text-2xl font-black text-slate-900 font-heading tracking-tight leading-tight">
            Job<br />Opportunities
          </h1>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Find local and regional job opportunities based on your skills, interests and training profile.
          </p>
        </div>

        {/* Right 3D Character Artwork: Student holding notebook & backpack */}
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
            placeholder="Search jobs, companies or skills..."
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
          onClick={() => setActiveCategory(activeCategory === "all" ? "government" : "all")}
          className="size-11 rounded-2xl bg-white border border-[#EDE7D9] shadow-2xs flex items-center justify-center text-slate-700 hover:text-purple-700 cursor-pointer transition-colors"
          aria-label="Filter jobs"
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
              className={`p-2 py-3 rounded-2xl border shadow-2xs flex flex-col items-center justify-between text-center cursor-pointer min-h-[88px] transition-all ${
                isActive
                  ? "bg-[#ECE7FE] border-purple-200 text-purple-700 font-extrabold shadow-sm"
                  : "bg-white border-[#EDE7D9] text-slate-600 font-bold hover:bg-slate-50"
              }`}
            >
              <div
                className={`size-8 rounded-full flex items-center justify-center mb-1 transition-colors ${
                  isActive ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                <Icon className="size-4" />
              </div>
              <span className="text-[9.5px] leading-tight font-bold">
                {cat.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. "JOBS FOR YOU" SECTION (Full-Width Job Cards with Logo & Apply CTA)    */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm font-heading">
              Jobs For You
            </h3>
            <p className="text-[10.5px] text-slate-500 font-medium">
              Based on your profile, skills and location
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

        {/* List of Full-Width Job Cards */}
        <div className="space-y-3">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenJob(job)}
                className="bg-white p-3.5 rounded-3xl border border-[#EDE7D9] shadow-2xs flex flex-col gap-3 cursor-pointer group hover:border-purple-200 transition-all"
              >
                {/* Top Section: Photo + Details + Company Logo */}
                <div className="flex items-start gap-3">
                  {/* Job Thumbnail Image with Badge */}
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
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
                        <p className="text-[11px] text-slate-500 font-semibold truncate">
                          {job.company}
                        </p>
                      </div>

                      {/* Company Emblem / Logo */}
                      <div className="shrink-0 size-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1">
                        {job.companyLogoType === "shree" && (
                          <div className="text-[8px] font-black text-blue-700 tracking-tighter leading-none text-center">
                            SHREE<br />PWR
                          </div>
                        )}
                        {job.companyLogoType === "sakhi" && (
                          <div className="text-[8px] font-black text-rose-600 tracking-tighter leading-none text-center">
                            🌸<br />SAKHI
                          </div>
                        )}
                        {job.companyLogoType === "ahaar" && (
                          <div className="text-[8px] font-black text-emerald-600 tracking-tighter leading-none text-center">
                            🌿<br />AHAAR
                          </div>
                        )}
                        {job.companyLogoType === "odisha" && (
                          <div className="text-[7.5px] font-black text-slate-800 tracking-tighter leading-none text-center">
                            🏛️<br />GOVT
                          </div>
                        )}
                        {job.companyLogoType === "default" && (
                          <Building2 className="size-4 text-purple-600" />
                        )}
                      </div>
                    </div>

                    {/* Metadata line: Full Time, Location, Salary */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] text-slate-600 font-medium pt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Briefcase className="size-3 text-slate-400" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-slate-400" />
                        {job.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-900 pt-0.5">
                      <span>⏱️</span>
                      <span>{job.salary}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Skill Tags + Apply Button */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1 min-w-0">
                    {job.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[9.5px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg shrink-0"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenJob(job);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Apply</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-[#EDE7D9] text-center space-y-2">
              <p className="text-xs font-bold text-slate-700">No job openings found matching your criteria</p>
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
      {/* 5. "EXPLORE MORE OPPORTUNITIES" SECTION                                    */}
      {/* ========================================================================= */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm font-heading">
            Explore More Opportunities
          </h3>
          <button
            onClick={() => setActiveCategory("all")}
            className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-0.5 cursor-pointer"
          >
            <span>See All</span>
            <ArrowRight className="size-3" />
          </button>
        </div>

        {/* 5 Horizontal Sector Cards */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {EXPLORE_JOB_SECTORS.map((sec) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpenJob(RECOMMENDED_JOBS[0])}
                className={`min-w-[105px] p-2.5 rounded-2xl border shadow-2xs flex flex-col items-center justify-between text-center cursor-pointer group bg-white border-[#EDE7D9] hover:border-purple-200 transition-all`}
              >
                <div className={`size-8 rounded-full flex items-center justify-center mb-1.5 ${sec.iconBg}`}>
                  <Icon className="size-4" />
                </div>
                <h5 className="font-bold text-slate-900 text-[10px] leading-tight whitespace-pre-line">
                  {sec.title}
                </h5>
                <span className="text-[9px] text-slate-500 font-semibold mt-1 flex items-center gap-0.5">
                  <span>{sec.count}</span>
                  <ChevronRight className="size-2.5" />
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
