"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  GraduationCap,
  Briefcase,
  MessageSquare,
  User,
  Bell,
  Mic,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  Check,
  CheckCircle2,
  FileText,
  Building2,
  HelpCircle,
  Phone,
  BarChart3,
  Sprout,
  Wifi,
  Battery
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

export function MobileDashboard() {
  const [activeTab, setActiveTab] = useState<"home" | "training" | "jobs" | "messages" | "profile">("home");
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState<boolean>(false);
  const [isSchemesModalOpen, setIsSchemesModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const handleOpenCourse = (course: CourseItem) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleQuickAction = (actionId: string) => {
    if (actionId === "action-1") {
      // Find Skill Training
      setSelectedCourse(RECOMMENDED_COURSES[0]);
      setIsCourseModalOpen(true);
    } else if (actionId === "action-2") {
      // Job Opportunities
      setSelectedCourse(RECOMMENDED_COURSES[1]);
      setIsCourseModalOpen(true);
    } else if (actionId === "action-3") {
      // Self-Employment Ideas
      setIsSchemesModalOpen(true);
    } else if (actionId === "action-4") {
      // Find Centers Near You
      setSelectedCourse(RECOMMENDED_COURSES[0]);
      setIsCourseModalOpen(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF6EE] text-slate-800 flex flex-col justify-between pb-24 select-none font-sans max-w-md mx-auto relative">
      
      {/* ========================================================================= */}
      {/* 2. TOP APP BAR (Logo, Notification Bell, User Avatar with Chevron)        */}
      {/* ========================================================================= */}
      <header className="px-5 py-2 flex items-center justify-between shrink-0">
        {/* Brand Logo & Tagline */}
        <div
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="size-9 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
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
            <span className="text-lg font-extrabold tracking-tight text-slate-900 font-heading leading-tight">
              Jeevika<span className="text-purple-600">Setu</span>
            </span>
            <span className="text-[9.5px] font-semibold text-slate-500 tracking-tight leading-none mt-0.5">
              Skills Today · Better Tomorrow
            </span>
          </div>
        </div>

        {/* Right Actions: Bell & Avatar with Chevron */}
        <div className="flex items-center gap-2.5">
          {/* White round notification bell */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsVoiceModalOpen(true)}
            className="relative size-10 rounded-full bg-white border border-[#EDE7D9] shadow-2xs flex items-center justify-center text-slate-700 cursor-pointer"
          >
            <Bell className="size-4.5" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </motion.button>

          {/* User Avatar + Dropdown chevron */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-1 bg-white p-1 pr-2 rounded-full border border-[#EDE7D9] shadow-2xs cursor-pointer"
          >
            <div className="relative size-8 rounded-full overflow-hidden border border-purple-200">
              <Image
                src={CURRENT_BENEFICIARY.avatarUrl}
                alt={CURRENT_BENEFICIARY.name}
                fill
                className="object-cover object-top"
              />
            </div>
            <ChevronDown className="size-3.5 text-slate-500" />
          </motion.button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN DASHBOARD CONTENT (Exact 1:1 Match to Reference Image)            */}
      {/* ========================================================================= */}
      <main className="flex-1 px-4 py-2 space-y-4">
        
        {/* ======================================================================= */}
        {/* A. HERO CARD: Seamless Village Background + Text + 3D Characters        */}
        {/* ======================================================================= */}
        <div className="relative overflow-hidden rounded-[32px] border border-[#EDE7D9] p-5 shadow-xs min-h-[220px] flex flex-col justify-between">
          
          {/* Full-width seamless village scenery background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/landingPage/bg_1_landing.webp"
              alt="Village Landscape"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Soft cream gradient blend on left so text & buttons have 100% crystal contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE]/95 via-45% to-transparent pointer-events-none" />
          </div>

          {/* Content Overlaid on Left */}
          <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
            {/* Greeting Header */}
            <div className="space-y-0.5 max-w-[210px]">
              <p className="text-xs font-semibold text-slate-600">Welcome back,</p>
              <h2 className="text-xl font-extrabold text-slate-900 font-heading flex items-center gap-1.5 leading-tight">
                <span>{CURRENT_BENEFICIARY.name}</span>
                <span className="animate-wave inline-block origin-bottom-right">👋</span>
              </h2>
              <p className="text-[11px] text-slate-600 font-medium leading-snug pt-0.5">
                Let's continue your journey towards a brighter future.
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

            {/* Purple Glowing CTA Button: Talk to JeevikaSetu */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsVoiceModalOpen(true)}
              className="w-fit flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-md shadow-purple-600/30 cursor-pointer"
            >
              <Mic className="size-3.5 animate-pulse text-white" />
              <span>Talk to JeevikaSetu</span>
              <ArrowRight className="size-3.5 text-white" />
            </motion.button>
          </div>

          {/* Right 3D Character Artwork: Savitri Devi + Robot Assistant */}
          <div className="absolute right-0 bottom-0 w-48 h-48 flex items-end justify-center pointer-events-none z-10">
            {/* Savitri Devi with smartphone */}
            <div className="relative w-32 h-full">
              <Image
                src="/landingPage/person_1_landing.webp"
                alt="Savitri Devi"
                fill
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

        {/* ======================================================================= */}
        {/* B. "YOUR PROGRESS" CARD (Donut Chart 60% + Checklist)                   */}
        {/* ======================================================================= */}
        <div className="bg-white rounded-[28px] border border-[#EDE7D9] shadow-2xs p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm font-heading">
              Your Progress
            </h3>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="size-3" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Circular Donut Chart 60% */}
            <div className="relative size-24 shrink-0 flex items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Active Purple Progress Ring 60% */}
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
                  Profile Completed
                </span>
              </div>
            </div>

            {/* Checklist Stepper */}
            <div className="space-y-1.5 flex-1">
              {/* 1. Basic Information (Done) */}
              <div className="flex items-center gap-2">
                <div className="size-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="size-2.5 stroke-[3]" />
                </div>
                <span className="text-xs font-semibold text-slate-800">Basic Information</span>
              </div>

              {/* 2. Skills Assessment (Done) */}
              <div className="flex items-center gap-2">
                <div className="size-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="size-2.5 stroke-[3]" />
                </div>
                <span className="text-xs font-semibold text-slate-800">Skills Assessment</span>
              </div>

              {/* 3. Recommendations (Active Purple Radio) */}
              <div className="flex items-center gap-2">
                <div className="size-4.5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <span className="size-1.5 rounded-full bg-white"></span>
                </div>
                <span className="text-xs font-extrabold text-slate-900">Recommendations</span>
              </div>

              {/* 4. Enrolled in Training (Pending) */}
              <div className="flex items-center gap-2">
                <div className="size-4.5 rounded-full border-2 border-slate-300 shrink-0"></div>
                <span className="text-xs font-medium text-slate-400">Enrolled in Training</span>
              </div>

              {/* 5. Certification & Placement (Pending) */}
              <div className="flex items-center gap-2">
                <div className="size-4.5 rounded-full border-2 border-slate-300 shrink-0"></div>
                <span className="text-xs font-medium text-slate-400">Certification & Placement</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* C. "QUICK ACTIONS" SECTION (4 Colored Squircles)                        */}
        {/* ======================================================================= */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm font-heading">
              Quick Actions
            </h3>
            <button
              onClick={() => setIsSchemesModalOpen(true)}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 cursor-pointer"
            >
              See All
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {/* 1. Skill Training */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAction("action-1")}
              className="bg-[#EFF4FE] p-2.5 py-3 rounded-2xl border border-blue-100/80 shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer min-h-[96px] group transition-all"
            >
              <div className="size-10 rounded-full bg-[#DCE7FD] flex items-center justify-center text-blue-600 mb-2 group-hover:scale-105 transition-transform">
                <GraduationCap className="size-5.5 fill-blue-600 text-blue-600" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 leading-tight">
                Skill<br />Training
              </span>
            </motion.div>

            {/* 2. Job Opportunities */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAction("action-2")}
              className="bg-[#FFF4ED] p-2.5 py-3 rounded-2xl border border-orange-100/80 shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer min-h-[96px] group transition-all"
            >
              <div className="size-10 rounded-full bg-[#FFE7D9] flex items-center justify-center text-orange-600 mb-2 group-hover:scale-105 transition-transform">
                <Briefcase className="size-5.5 fill-orange-500 text-orange-600" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 leading-tight">
                Job<br />Opportunities
              </span>
            </motion.div>

            {/* 3. Self-Employment */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAction("action-3")}
              className="bg-[#EDFAF3] p-2.5 py-3 rounded-2xl border border-emerald-100/80 shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer min-h-[96px] group transition-all"
            >
              <div className="size-10 rounded-full bg-[#D6F5E3] flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-105 transition-transform">
                <Sprout className="size-5.5 fill-emerald-500 text-emerald-600" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 leading-tight">
                Self-<br />Employment
              </span>
            </motion.div>

            {/* 4. Find Centers */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAction("action-4")}
              className="bg-[#EFF4FE] p-2.5 py-3 rounded-2xl border border-blue-100/80 shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer min-h-[96px] group transition-all"
            >
              <div className="size-10 rounded-full bg-[#DCE7FD] flex items-center justify-center text-blue-600 mb-2 group-hover:scale-105 transition-transform">
                <MapPin className="size-5.5 fill-blue-600 text-blue-600" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 leading-tight">
                Find<br />Centers
              </span>
            </motion.div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* D. "RECOMMENDED FOR YOU" SECTION (10-Skill Carousel with Snap Scroll)    */}
        {/* ======================================================================= */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-sm font-heading">
                Recommended for You
              </h3>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full">
                10 Skills
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedCourse(RECOMMENDED_COURSES[0]);
                setIsCourseModalOpen(true);
              }}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 cursor-pointer"
            >
              See All
            </button>
          </div>

          {/* Smooth Snap Carousel */}
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pt-1 no-scrollbar -mx-1 px-1">
            {RECOMMENDED_COURSES.map((course, idx) => (
              <motion.div
                key={course.id}
                whileTap={{ scale: 0.98 }}
                className="w-[200px] shrink-0 snap-start bg-white rounded-3xl border border-[#EDE7D9] shadow-2xs overflow-hidden flex flex-col justify-between group transition-all"
              >
                {/* Course Image & Badge */}
                <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
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
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs leading-snug line-clamp-2 h-8">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold mt-1">
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

                  <button
                    onClick={() => handleOpenCourse(course)}
                    className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-extrabold py-1.5 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Carousel Hint & Counter */}
          <div className="flex items-center justify-between px-1 text-[10px] font-semibold text-slate-400">
            <span>← Swipe horizontally to explore 10 skills →</span>
            <span className="text-purple-600 font-bold">1 of 10</span>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* E. "UPCOMING STEPS" SECTION (Complete Skills Assessment Card)           */}
        {/* ======================================================================= */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm font-heading">
              Upcoming Steps
            </h3>
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 cursor-pointer"
            >
              See All
            </button>
          </div>

          {/* Stepper Card */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsVoiceModalOpen(true)}
            className="bg-white p-3.5 rounded-3xl border border-[#EDE7D9] shadow-2xs flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-600/30">
                <Mic className="size-5.5 animate-pulse" />
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight">
                  Complete Skills Assessment
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Take a short voice interview
                </p>
              </div>
            </div>

            <div className="size-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ChevronRight className="size-4" />
            </div>
          </motion.div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 4. FLOATING BOTTOM DOCK NAVBAR (Home, Training, Jobs, Messages, Profile)   */}
      {/* ========================================================================= */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#EDE7D9] py-2 px-4 flex items-center justify-around shadow-lg max-w-md mx-auto">
        {[
          { id: "home" as const, label: "Home", icon: Home },
          { id: "training" as const, label: "Training", icon: GraduationCap },
          { id: "jobs" as const, label: "Jobs", icon: Briefcase },
          { id: "messages" as const, label: "Messages", icon: MessageSquare },
          { id: "profile" as const, label: "Profile", icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "profile") setIsProfileModalOpen(true);
                if (tab.id === "messages") setIsVoiceModalOpen(true);
                if (tab.id === "training") {
                  setSelectedCourse(RECOMMENDED_COURSES[0]);
                  setIsCourseModalOpen(true);
                }
                if (tab.id === "jobs") {
                  setSelectedCourse(RECOMMENDED_COURSES[1]);
                  setIsCourseModalOpen(true);
                }
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                isActive ? "text-purple-600 font-extrabold" : "text-slate-400 font-semibold"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? "bg-purple-100/80 text-purple-700 shadow-2xs" : ""
                }`}
              >
                <Icon className={`size-5 ${isActive ? "fill-purple-600 text-purple-600" : ""}`} />
              </div>
              <span className="text-[10px] leading-none">{tab.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Global Modals for Rich Interactivity */}
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
