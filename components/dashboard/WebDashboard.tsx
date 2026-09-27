"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Star,
  GraduationCap,
  Briefcase,
  Sprout,
  BarChart3,
  MessageSquare,
  HelpCircle,
  Phone,
  Mic,
  Bell,
  Globe,
  ChevronDown,
  ArrowRight,
  ChevronRight,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Building2,
  Sparkles,
  Edit3,
  Search
} from "lucide-react";
import {
  CURRENT_BENEFICIARY,
  RECOMMENDED_COURSES,
  QUICK_ACTIONS,
  UPCOMING_STEPS,
  CourseItem,
  QuickActionItem
} from "./DashboardShared";
import { VoiceAssistantModal } from "./VoiceAssistantModal";
import { CourseDetailModal } from "./CourseDetailModal";
import { SchemesModal } from "./SchemesModal";
import { ProfileModal } from "./ProfileModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function WebDashboard() {
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState<boolean>(false);
  const [isSchemesModalOpen, setIsSchemesModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>("English");
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const sidebarMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "My Profile", icon: User },
    { id: "recommendations", label: "Recommendations", icon: Star },
    { id: "training", label: "Training Programs", icon: GraduationCap },
    { id: "jobs", label: "Job Opportunities", icon: Briefcase },
    { id: "self_employment", label: "Self-Employment", icon: Sprout },
    { id: "progress", label: "My Progress", icon: BarChart3 },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "help", label: "Help & Support", icon: HelpCircle },
  ];

  const handleOpenCourse = (course: CourseItem) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleQuickAction = (action: QuickActionItem) => {
    if (action.category === "schemes") {
      setIsSchemesModalOpen(true);
    } else if (action.category === "training" || action.category === "jobs") {
      setSelectedCourse(RECOMMENDED_COURSES[0]);
      setIsCourseModalOpen(true);
    } else if (action.category === "enterprise" || action.category === "self_employment") {
      setIsSchemesModalOpen(true);
    } else {
      setIsVoiceModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-slate-800 flex justify-center p-3 sm:p-5 lg:p-6 select-none font-sans">
      <div className="w-full max-w-[1440px] flex gap-5 xl:gap-6">

        {/* ========================================================================= */}
        {/* LEFT SIDEBAR (Cream/White Card with Curved Corners)                      */}
        {/* ========================================================================= */}
        <aside className="w-60 xl:w-64 shrink-0 bg-white/95 backdrop-blur-md rounded-[32px] border border-[#EDE7D9] shadow-sm flex flex-col justify-between p-5 self-start sticky top-5 h-[calc(100vh-40px)]">

          <div className="space-y-6">
            {/* Saksham-AI Logo */}
            <div className="flex flex-col items-start px-2 cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <div className="size-9 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs group-hover:scale-105 transition-transform">
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

                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
                    Saksham <span className="text-purple-600">AI</span>
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 tracking-tight mt-1 pl-0.5">
                Skills Today · Better Tomorrow
              </span>
            </div>

            {/* Sidebar Navigation Menu */}
            <nav className="space-y-1">
              {sidebarMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveMenu(item.id);
                      if (item.id === "profile") setIsProfileModalOpen(true);
                      if (item.id === "recommendations" || item.id === "training") setSelectedCourse(RECOMMENDED_COURSES[0]), setIsCourseModalOpen(true);
                      if (item.id === "self_employment") setIsSchemesModalOpen(true);
                      if (item.id === "messages") setIsVoiceModalOpen(true);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs xl:text-sm font-bold transition-all cursor-pointer text-left ${isActive
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/25 font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                      }`}
                  >
                    <Icon className={`size-4 xl:size-4.5 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Illustrated Card */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-100/60 to-orange-50/80 p-3 shadow-xs">
            {/* Village scenery backdrop */}
            <div className="relative h-20 w-full rounded-xl overflow-hidden mb-2.5">
              <Image
                src="/landingPage/bg_1_landing.webp"
                alt="Village scene"
                fill
                className="object-cover object-bottom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2">
                <span className="text-[10px] font-bold text-white leading-tight">
                  Start a voice conversation in your language
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsVoiceModalOpen(true)}
              className="w-full flex items-center justify-between gap-1.5 bg-white hover:bg-purple-50 text-purple-700 px-3 py-2 rounded-xl text-xs font-bold border border-purple-200/70 shadow-2xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <div className="size-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Phone className="size-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-extrabold text-slate-900 leading-tight">
                    Talk to Saksham-AI
                  </span>
                  <span className="text-[9px] text-slate-500">24/7 AI Voice Copilot</span>
                </div>
              </div>
              <ChevronRight className="size-3.5 text-purple-600" />
            </motion.button>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN DASHBOARD CONTENT AREA                                               */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">

          {/* Top Header Bar */}
          <header className="flex items-center justify-between gap-4 py-1">
            <div>
              <p className="text-xs font-semibold text-slate-500">Welcome back,</p>
              <h1 className="text-2xl xl:text-3xl font-extrabold text-slate-900 tracking-tight font-heading flex items-center gap-2">
                <span>{CURRENT_BENEFICIARY.name}</span>
                <span className="animate-wave inline-block origin-bottom-right">👋</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Let's build a brighter future together.
              </p>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200/90 px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
                >
                  <Globe className="size-3.5 text-purple-600" />
                  <span>{selectedLang}</span>
                  <ChevronDown className="size-3 text-slate-400" />
                </button>

                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-30">
                    {["English", "हिन्दी (Hindi)", "ଓଡ଼ିଆ (Odia)", "संताली (Santhali)"].map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setSelectedLang(l.split(" ")[0]);
                          setIsLangOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer"
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVoiceModalOpen(true)}
                className="relative size-10 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 flex items-center justify-center text-slate-700 shadow-2xs cursor-pointer"
              >
                <Bell className="size-4.5" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </motion.button>

              {/* Savitri Devi Profile Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 p-1.5 pr-3 rounded-2xl shadow-2xs transition-all cursor-pointer"
                >
                  <div className="relative size-8 rounded-xl overflow-hidden border border-purple-200">
                    <Image
                      src={CURRENT_BENEFICIARY.avatarUrl}
                      alt={CURRENT_BENEFICIARY.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-900 hidden sm:inline">
                    {CURRENT_BENEFICIARY.name}
                  </span>
                  <ChevronDown className="size-3 text-slate-400" />
                </button>
              </div>
            </div>
          </header>

          {/* ========================================================================= */}
          {/* 2-COLUMN MAIN BODY: Center Left Feed (68%) & Right Sidebar Info (32%)     */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ----------------------------------------------------------------------- */}
            {/* CENTER / LEFT COLUMN (lg:col-span-8)                                   */}
            {/* ----------------------------------------------------------------------- */}
            <div className="lg:col-span-8 flex flex-col gap-6">

              {/* 1. HERO AI ASSISTANT BANNER */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] border border-[#EDE7D9] shadow-sm p-6 xl:p-8 flex items-center justify-between min-h-[220px]"
              >
                {/* Background village artwork blend */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none">
                  <Image
                    src="/landingPage/bg_2_landing.webp"
                    alt="Village Background"
                    fill
                    className="object-cover object-right"
                  />
                </div>

                {/* Left Text Content */}
                <div className="relative z-10 max-w-md space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-extrabold text-[11px] tracking-wide uppercase">
                    <Sparkles className="size-3 text-purple-600" />
                    Your AI Livelihood Assistant
                  </span>

                  <h2 className="text-2xl xl:text-3xl font-black text-slate-900 font-heading tracking-tight leading-tight">
                    Speak. Explore. Grow.
                  </h2>

                  <p className="text-xs xl:text-sm text-slate-600 font-medium leading-relaxed">
                    Get personalized skill training, job opportunities and self-employment ideas in your language.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white px-5 py-2.5 rounded-2xl text-xs xl:text-sm font-bold shadow-lg shadow-purple-600/30 cursor-pointer mt-1"
                  >
                    <Mic className="size-4 animate-pulse" />
                    <span>Start a Conversation</span>
                    <ArrowRight className="size-4" />
                  </motion.button>
                </div>

                {/* Right 3D Character Illustration with AI Robot & Soundwaves */}
                <div className="relative z-10 hidden sm:flex items-end justify-center w-64 xl:w-72 h-44 xl:h-48 shrink-0">
                  {/* Savitri Devi 3D Character */}
                  <div className="relative w-36 xl:w-40 h-full">
                    <Image
                      src="/landingPage/person_2_landing.webp"
                      alt="Savitri Devi"
                      fill
                      className="object-contain object-bottom drop-shadow-md"
                      priority
                    />
                  </div>

                  {/* AI Robot Companion with sound waves */}
                  <div className="relative w-24 xl:w-28 h-32 mb-2 animate-float">
                    <Image
                      src="/landingPage/ai_2_landing.webp"
                      alt="AI Assistant Bot"
                      fill
                      className="object-contain drop-shadow-lg"
                      priority
                    />
                    {/* Pulsing soundwaves */}
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* 2. "WHAT WOULD YOU LIKE TO DO TODAY?" SECTION */}
              <div className="space-y-3.5">
                <h3 className="text-base xl:text-lg font-extrabold text-slate-900 font-heading tracking-tight">
                  What would you like to do today?
                </h3>

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
                  {QUICK_ACTIONS.slice(0, 4).map((action, idx) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      whileHover={{ y: -3, scale: 1.01 }}
                      onClick={() => handleQuickAction(action)}
                      className="bg-white p-4 rounded-3xl border border-[#EDE7D9] shadow-2xs hover:shadow-md hover:border-purple-200 transition-all cursor-pointer flex flex-col justify-between group h-36"
                    >
                      <div className="flex items-start justify-between">
                        <div className={`size-11 rounded-2xl ${action.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                          {action.iconName === "training" && <GraduationCap className={`size-6 ${action.iconColor}`} />}
                          {action.iconName === "job" && <Briefcase className={`size-6 ${action.iconColor}`} />}
                          {action.iconName === "enterprise" && <Sprout className={`size-6 ${action.iconColor}`} />}
                          {action.iconName === "center" && <MapPin className={`size-6 ${action.iconColor}`} />}
                        </div>

                        <div className="size-7 rounded-full bg-purple-50 group-hover:bg-purple-600 group-hover:text-white text-purple-600 flex items-center justify-center transition-colors">
                          <ChevronRight className="size-3.5" />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs xl:text-sm font-heading leading-tight">
                          {action.title}
                        </h4>
                        <p className="text-[10px] xl:text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                          {action.subtitle}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 3. "RECOMMENDED FOR YOU" SECTION */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base xl:text-lg font-extrabold text-slate-900 font-heading tracking-tight">
                      Recommended For You
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Based on your profile, interests and local opportunities
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCourse(RECOMMENDED_COURSES[0]);
                      setIsCourseModalOpen(true);
                    }}
                    className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <span>See More</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {RECOMMENDED_COURSES.slice(0, 3).map((course, idx) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.1 + idx * 0.07 }}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-3xl border border-[#EDE7D9] shadow-2xs hover:shadow-lg hover:border-purple-200 transition-all overflow-hidden flex flex-col justify-between group"
                    >
                      {/* Course Image & Badge */}
                      <div className="relative h-32 xl:h-36 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 right-2.5">
                          <span
                            className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs ${course.badgeColor === "blue"
                                ? "bg-blue-600 text-white"
                                : course.badgeColor === "amber"
                                  ? "bg-amber-500 text-white"
                                  : "bg-emerald-600 text-white"
                              }`}
                          >
                            {course.badge}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs xl:text-sm font-heading leading-snug">
                            {course.title}
                          </h4>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold mt-1.5">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3 text-slate-400" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3 text-slate-400" />
                              {course.location}
                            </span>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleOpenCourse(course)}
                          className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-800 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>View Details</span>
                          <ArrowRight className="size-3" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------------------------- */}
            {/* RIGHT COLUMN (lg:col-span-4): Profile, Progress, Upcoming Steps        */}
            {/* ----------------------------------------------------------------------- */}
            <div className="lg:col-span-4 flex flex-col gap-5">

              {/* 1. PROFILE SUMMARY CARD */}
              <div className="bg-white rounded-3xl border border-[#EDE7D9] shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 rounded-2xl overflow-hidden border border-purple-200">
                      <Image
                        src={CURRENT_BENEFICIARY.avatarUrl}
                        alt={CURRENT_BENEFICIARY.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm xl:text-base font-heading">
                        {CURRENT_BENEFICIARY.name}
                      </h4>
                      <p className="text-[10px] font-bold text-purple-700">
                        {CURRENT_BENEFICIARY.beneficiaryType}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:underline cursor-pointer bg-purple-50 px-2.5 py-1 rounded-xl"
                  >
                    <Edit3 className="size-3" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Profile Details List */}
                <div className="space-y-2 text-xs text-slate-600 font-medium pt-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-purple-600 shrink-0" />
                    <span>{CURRENT_BENEFICIARY.district}, {CURRENT_BENEFICIARY.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="size-3.5 text-blue-600 shrink-0" />
                    <span>{CURRENT_BENEFICIARY.education}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sprout className="size-3.5 text-emerald-600 shrink-0" />
                    <span>Family Occupation: {CURRENT_BENEFICIARY.familyOccupation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="size-3.5 text-amber-600 shrink-0" />
                    <span>Looking for: {CURRENT_BENEFICIARY.lookingFor}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileModalOpen(true)}
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View Complete Profile</span>
                  <ArrowRight className="size-3.5" />
                </motion.button>
              </div>

              {/* 2. "YOUR PROGRESS" CARD (Donut Chart 60% + Checklist) */}
              <div className="bg-white rounded-3xl border border-[#EDE7D9] shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm font-heading">
                    Your Progress
                  </h4>
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Circular SVG Donut Chart */}
                  <div className="relative size-24 shrink-0 flex items-center justify-center">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                      {/* Background circle */}
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Progress circle 60% */}
                      <path
                        className="text-purple-600"
                        strokeDasharray="60, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-base font-black text-slate-900 leading-none">60%</span>
                      <span className="text-[8px] font-bold text-slate-400 leading-tight mt-0.5 max-w-[45px]">
                        Profile Done
                      </span>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-1.5 flex-1">
                    {CURRENT_BENEFICIARY.progressSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {step.status === "completed" && (
                          <div className="size-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <Check className="size-2.5 stroke-[3]" />
                          </div>
                        )}
                        {step.status === "active" && (
                          <div className="size-4 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                            <span className="size-1.5 rounded-full bg-white animate-ping"></span>
                          </div>
                        )}
                        {step.status === "pending" && (
                          <div className="size-4 rounded-full border border-slate-300 shrink-0"></div>
                        )}
                        <span
                          className={`font-semibold text-[11px] truncate ${step.status === "active"
                              ? "text-purple-700 font-extrabold"
                              : step.status === "completed"
                                ? "text-slate-800"
                                : "text-slate-400"
                            }`}
                        >
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. "UPCOMING STEPS" CARD */}
              <div className="bg-white rounded-3xl border border-[#EDE7D9] shadow-2xs p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm font-heading">
                    Upcoming Steps
                  </h4>
                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2.5">
                  {UPCOMING_STEPS.map((step, idx) => (
                    <motion.div
                      key={step.id}
                      whileHover={{ x: 2 }}
                      onClick={() => {
                        if (step.iconName === "mic") setIsVoiceModalOpen(true);
                        else if (step.iconName === "book") {
                          setSelectedCourse(RECOMMENDED_COURSES[0]);
                          setIsCourseModalOpen(true);
                        } else if (step.iconName === "file") setIsSchemesModalOpen(true);
                        else setIsVoiceModalOpen(true);
                      }}
                      className="p-2.5 rounded-2xl bg-slate-50 hover:bg-purple-50/60 border border-slate-200/70 hover:border-purple-200 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${step.color === "purple"
                              ? "bg-purple-100 text-purple-700"
                              : step.color === "amber"
                                ? "bg-amber-100 text-amber-700"
                                : step.color === "blue"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-emerald-100 text-emerald-700"
                            }`}
                        >
                          {step.iconName === "mic" && <Mic className="size-4" />}
                          {step.iconName === "book" && <GraduationCap className="size-4" />}
                          {step.iconName === "pin" && <MapPin className="size-4" />}
                          {step.iconName === "file" && <FileText className="size-4" />}
                        </div>

                        <div>
                          <h5 className="font-bold text-slate-900 text-xs leading-tight group-hover:text-purple-700 transition-colors">
                            {step.title}
                          </h5>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {step.subtitle}
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="size-4 text-slate-400 group-hover:text-purple-600 transition-transform group-hover:translate-x-0.5" />
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Global Interactive Modals */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      <CourseDetailModal
        course={selectedCourse}
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
      />

      <SchemesModal
        isOpen={isSchemesModalOpen}
        onClose={() => setIsSchemesModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
