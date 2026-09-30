"use client";

import React, { useState, useMemo } from "react";
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
  Search,
  ShieldCheck,
  Coins,
  Wrench,
  Store,
  Laptop,
  Users,
  Compass,
  Filter
} from "lucide-react";
import {
  CURRENT_BENEFICIARY,
  RECOMMENDED_COURSES,
  RECOMMENDED_JOBS,
  SCHEMES_LIST,
  QUICK_ACTIONS,
  UPCOMING_STEPS,
  CourseItem,
  JobItem,
  QuickActionItem
} from "./DashboardShared";
import { VoiceAssistantModal } from "./VoiceAssistantModal";
import { CourseDetailModal } from "./CourseDetailModal";
import { JobDetailModal } from "./JobDetailModal";
import { SchemesModal } from "./SchemesModal";
import { ProfileModal } from "./ProfileModal";
import { NotificationPopover } from "./NotificationPopover";
import { GlobalVoiceNavigator } from "@/components/navigation/GlobalVoiceNavigator";
import { VoiceNavIntent } from "@/lib/ai/voiceNavigation";
import { BeneficiaryProfileData } from "@/components/onboarding/PersonalVoiceOnboarding";
import {
  getPersonalizedRecommendedCourses,
  getPersonalizedTrainingCourses,
  SECTOR_DEFINITIONS,
  ALL_EXPANDED_NSQF_COURSES,
  NSQFCourseExtra,
  getSafeCourseImage
} from "@/lib/skillTrainingGenerator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getNSQFAgeBracket, getAvatarForGender } from "@/lib/nsqfAge";

interface WebDashboardProps {
  beneficiaryProfile?: BeneficiaryProfileData | null;
}

export function WebDashboard({ beneficiaryProfile }: WebDashboardProps = {}) {
  const [localProfile, setLocalProfile] = useState<BeneficiaryProfileData | null>(() => {
    if (beneficiaryProfile) return beneficiaryProfile;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("Sakhyam_beneficiary_profile");
        if (saved) return JSON.parse(saved);
      } catch { }
    }
    return null;
  });

  const activeProfile = beneficiaryProfile || localProfile;
  const beneficiaryName = activeProfile?.fullName || CURRENT_BENEFICIARY.name;
  const beneficiaryDistrict = activeProfile?.district || CURRENT_BENEFICIARY.district;
  const beneficiaryState = activeProfile?.state || CURRENT_BENEFICIARY.state;

  const currentBeneficiaryData = {
    ...CURRENT_BENEFICIARY,
    name: beneficiaryName,
    district: beneficiaryDistrict,
    state: beneficiaryState,
    education: activeProfile?.education || CURRENT_BENEFICIARY.education,
    lookingFor: activeProfile?.aspiration || CURRENT_BENEFICIARY.lookingFor,
    gender: activeProfile?.gender || CURRENT_BENEFICIARY.gender || "female",
    age: activeProfile?.age || CURRENT_BENEFICIARY.age || 28,
    ageCategory: activeProfile?.ageCategory || getNSQFAgeBracket(activeProfile?.age || CURRENT_BENEFICIARY.age || 28).badgeLabel,
    avatarUrl: activeProfile?.avatarUrl || getAvatarForGender(activeProfile?.gender) || CURRENT_BENEFICIARY.avatarUrl
  };

  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [voiceAssistantInitialPrompt, setVoiceAssistantInitialPrompt] = useState<string>("");
  const [isCourseModalOpen, setIsCourseModalOpen] = useState<boolean>(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState<boolean>(false);
  const [isSchemesModalOpen, setIsSchemesModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>("English");
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);

  // Filters for Training and Jobs
  const [trainingFilter, setTrainingFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Dynamic Personalized & Detected Skill Training Courses
  const { allCourses, detectedCourses, detectedSkillName } = useMemo(() => {
    return getPersonalizedTrainingCourses(activeProfile, ALL_EXPANDED_NSQF_COURSES);
  }, [activeProfile]);

  const displayCourses = allCourses;

  const sidebarMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "recommendations", label: "Recommendations", icon: Star },
    { id: "training", label: "Training Programs", icon: GraduationCap },
    { id: "jobs", label: "Job Opportunities", icon: Briefcase },
    { id: "self_employment", label: "Self-Employment & Grants", icon: Sprout },
    { id: "progress", label: "My Progress (60%)", icon: BarChart3 },
    { id: "profile", label: "My Profile & Passport", icon: User },
    { id: "messages", label: "Voice AI Copilot", icon: MessageSquare },
    { id: "help", label: "Help & Support", icon: HelpCircle }
  ];

  const handleOpenCourse = (course: CourseItem) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleOpenJob = (job: JobItem) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleQuickAction = (action: QuickActionItem) => {
    if (action.category === "schemes" || action.category === "self_employment" || action.category === "enterprise") {
      setIsSchemesModalOpen(true);
    } else if (action.category === "training") {
      setActiveMenu("training");
    } else if (action.category === "jobs") {
      setActiveMenu("jobs");
    } else if (action.category === "centers") {
      setSelectedCourse(RECOMMENDED_COURSES[0]);
      setIsCourseModalOpen(true);
    } else if (action.category === "progress") {
      setActiveMenu("progress");
    } else {
      setIsVoiceModalOpen(true);
    }
  };

  /**
   * Unified Voice Navigation Handler for Web Dashboard
   */
  const handleVoiceNavigate = (intent: VoiceNavIntent) => {
    if (intent.course) {
      setSelectedCourse(intent.course);
      setIsCourseModalOpen(true);
      return;
    }

    if (intent.job) {
      setSelectedJob(intent.job);
      setIsJobModalOpen(true);
      return;
    }

    switch (intent.target) {
      case "home":
      case "dashboard":
        setActiveMenu("dashboard");
        break;
      case "recommendations":
        setActiveMenu("recommendations");
        break;
      case "training":
        setActiveMenu("training");
        break;
      case "jobs":
        setActiveMenu("jobs");
        break;
      case "schemes":
      case "self_employment":
        setIsSchemesModalOpen(true);
        setActiveMenu("self_employment");
        break;
      case "profile":
        setIsProfileModalOpen(true);
        break;
      case "progress":
        setActiveMenu("progress");
        break;
      case "centers":
        setSelectedCourse(RECOMMENDED_COURSES[0]);
        setIsCourseModalOpen(true);
        break;
      case "messages":
        setIsVoiceModalOpen(true);
        break;
      case "set_language":
        if (intent.languageName) {
          setSelectedLang(intent.languageName.split(" ")[0]);
        }
        break;
      default:
        setActiveMenu("dashboard");
    }
  };

  const handleUpdateProfile = (updated: Partial<BeneficiaryProfileData>) => {
    setLocalProfile((prev) => {
      const merged: BeneficiaryProfileData = {
        fullName: updated.fullName !== undefined ? updated.fullName : prev?.fullName || CURRENT_BENEFICIARY.name,
        district: updated.district !== undefined ? updated.district : prev?.district || CURRENT_BENEFICIARY.district,
        state: updated.state !== undefined ? updated.state : prev?.state || CURRENT_BENEFICIARY.state,
        skills: updated.skills !== undefined ? updated.skills : prev?.skills || (updated.nsqfCourse ? [updated.nsqfCourse] : ["Vocational Skill Execution"]),
        nsqfCode: updated.nsqfCode !== undefined ? updated.nsqfCode : prev?.nsqfCode || "NSQF-L4",
        nsqfLevel: updated.nsqfLevel !== undefined ? updated.nsqfLevel : prev?.nsqfLevel || 4,
        nsqfCourse: updated.nsqfCourse !== undefined ? updated.nsqfCourse : prev?.nsqfCourse || "Vocational Trade Specialist",
        education: updated.education !== undefined ? updated.education : prev?.education || CURRENT_BENEFICIARY.education,
        aspiration: updated.aspiration !== undefined ? updated.aspiration : prev?.aspiration || CURRENT_BENEFICIARY.lookingFor,
        recommendedPathway: updated.recommendedPathway !== undefined ? updated.recommendedPathway : prev?.recommendedPathway || "PM-AJAY Micro-Enterprise Hub",
        grantEligibility: updated.grantEligibility !== undefined ? updated.grantEligibility : prev?.grantEligibility || "₹35,000 Capital Subsidy + ₹3,500/mo Stipend",
        matchScore: updated.matchScore !== undefined ? updated.matchScore : prev?.matchScore || 95,
        gender: updated.gender !== undefined ? updated.gender : prev?.gender || "female",
        age: updated.age !== undefined ? updated.age : prev?.age || 28,
        ageCategory: updated.ageCategory !== undefined ? updated.ageCategory : prev?.ageCategory || getNSQFAgeBracket(updated.age || 28).badgeLabel,
        avatarUrl: updated.avatarUrl !== undefined ? updated.avatarUrl : prev?.avatarUrl || getAvatarForGender(updated.gender || "female")
      };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("Sakhyam_beneficiary_profile", JSON.stringify(merged));
          if (merged.nsqfCourse) {
            localStorage.setItem("Sakhyam_detected_job_skill", merged.nsqfCourse);
          }
        } catch { }
      }
      return merged;
    });
  };

  const handleOpenVoiceWithPrompt = (prompt?: string) => {
    if (prompt) {
      setVoiceAssistantInitialPrompt(prompt);
    }
    setIsVoiceModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-slate-800 flex justify-center p-3 sm:p-5 lg:p-6 select-none font-sans">
      <div className="w-full max-w-[1440px] flex gap-5 xl:gap-6">

        {/* ========================================================================= */}
        {/* LEFT SIDEBAR (Cream/White Card with Curved Corners)                      */}
        {/* ========================================================================= */}
        <aside className="w-60 xl:w-64 shrink-0 bg-white/95 backdrop-blur-md rounded-[32px] border border-[#EDE7D9] shadow-sm flex flex-col justify-between p-5 self-start sticky top-5 h-[calc(100vh-40px)]">

          <div className="space-y-6">
            {/* Sakhyam-AI Logo */}
            <div
              onClick={() => setActiveMenu("dashboard")}
              className="flex flex-col items-start px-2 cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="size-9 shrink-0 relative group-hover:scale-105 transition-transform">
                  <Image
                    src="/logo.png"
                    alt="Sakhyam AI Logo"
                    fill
                    className="object-contain"
                    sizes="36px"
                    priority
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
                    Sakhyam <span className="text-purple-600">AI</span>
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
                      if (item.id === "messages") setIsVoiceModalOpen(true);
                      if (item.id === "self_employment") setIsSchemesModalOpen(true);
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

          {/* Bottom Sidebar Illustrated Voice Card */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-100/60 to-orange-50/80 p-3 shadow-xs">
            <div className="relative h-20 w-full rounded-xl overflow-hidden mb-2.5">
              <Image
                src="/landingPage/bg_1_landing.webp"
                alt="Village scene"
                fill
                className="object-cover object-bottom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2">
                <span className="text-[10px] font-bold text-white leading-tight">
                  Voice navigation in Odia & Hindi
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
                    Talk to Voice Copilot
                  </span>
                  <span className="text-[9px] text-slate-500">24/7 Voice & Navigation</span>
                </div>
              </div>
              <ChevronRight className="size-3.5 text-purple-600" />
            </motion.button>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN DASHBOARD CONTENT AREA                                               */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">

          {/* Top Header Bar */}
          <header className="flex items-center justify-between gap-4 py-1">
            <div>
              <p className="text-xs font-semibold text-slate-500">Welcome back,</p>
              <h1 className="text-2xl xl:text-3xl font-extrabold text-slate-900 tracking-tight font-heading flex items-center gap-2">
                <span>{beneficiaryName}</span>
                <span className="animate-wave inline-block origin-bottom-right">👋</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {beneficiaryDistrict}, {beneficiaryState} • NSQF & PM-AJAY Livelihood Intelligence
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-30">
                    {[
                      { code: "en", label: "English" },
                      { code: "hi", label: "हिन्दी (Hindi)" },
                      { code: "or", label: "ଓଡ଼ିଆ (Odia)" },
                      { code: "sat", label: "संताली (Santhali)" },
                      { code: "bho", label: "भोजपुरी (Bhojpuri)" },
                      { code: "bn", label: "বাংলা (Bengali)" },
                      { code: "mr", label: "मराठी (Marathi)" }
                    ].map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setSelectedLang(l.label.split(" ")[0]);
                          setIsLangOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer"
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNotificationOpen(true)}
                className="relative size-10 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 flex items-center justify-center text-slate-700 shadow-2xs cursor-pointer"
                title="Notifications & Alerts (सूचनाएं)"
              >
                <Bell className="size-4.5" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </motion.button>

              {/* Savitri Devi / Beneficiary Profile Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 p-1.5 pr-3 rounded-2xl shadow-2xs transition-all cursor-pointer"
                >
                  <div className="relative size-8 rounded-xl overflow-hidden border border-purple-200">
                    <Image
                      src={CURRENT_BENEFICIARY.avatarUrl}
                      alt={beneficiaryName}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-900 hidden sm:inline">
                    {beneficiaryName}
                  </span>
                  <ChevronDown className="size-3 text-slate-400" />
                </button>
              </div>
            </div>
          </header>

          {/* ========================================================================= */}
          {/* UNIVERSAL VOICE NAVIGATION BAR                                            */}
          {/* ========================================================================= */}
          <GlobalVoiceNavigator
            currentLanguage={selectedLang === "ଓଡ଼ିଆ" ? "or" : selectedLang === "संताली" ? "sat" : "hi"}
            onNavigate={handleVoiceNavigate}
            onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
          />

          {/* ========================================================================= */}
          {/* DYNAMIC TAB ROUTING VIEW                                                  */}
          {/* ========================================================================= */}
          <AnimatePresence mode="wait">

            {/* TAB 1: MAIN DASHBOARD OVERVIEW */}
            {activeMenu === "dashboard" && (
              <motion.div
                key="view-dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* CENTER / LEFT COLUMN (lg:col-span-8) */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                  {/* 1. HERO AI ASSISTANT BANNER */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] border border-[#EDE7D9] shadow-sm p-6 xl:p-8 flex items-center justify-between min-h-[220px]"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none">
                      <Image
                        src="/landingPage/bg_2_landing.webp"
                        alt="Village Background"
                        fill
                        className="object-cover object-right"
                      />
                    </div>

                    <div className="relative z-10 max-w-md space-y-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-extrabold text-[11px] tracking-wide uppercase">
                        <Sparkles className="size-3 text-purple-600" />
                        AI Voice Navigation & Copilot
                      </span>

                      <h2 className="text-2xl xl:text-3xl font-black text-slate-900 font-heading tracking-tight leading-tight">
                        Speak. Explore. Grow.
                      </h2>

                      <p className="text-xs xl:text-sm text-slate-600 font-medium leading-relaxed">
                        Access all training courses, job opportunities, PM-AJAY grants, and center maps manually or by voice.
                      </p>

                      <div className="flex items-center gap-2.5 pt-1">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setIsVoiceModalOpen(true)}
                          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white px-5 py-2.5 rounded-2xl text-xs xl:text-sm font-bold shadow-lg shadow-purple-600/30 cursor-pointer"
                        >
                          <Mic className="size-4 animate-pulse" />
                          <span>Voice Copilot</span>
                          <ArrowRight className="size-4" />
                        </motion.button>

                        <button
                          onClick={() => setActiveMenu("recommendations")}
                          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2.5 rounded-2xl text-xs xl:text-sm font-bold border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Star className="size-3.5 text-amber-500" />
                          <span>My Recommendations</span>
                        </button>
                      </div>
                    </div>

                    <div className="relative z-10 hidden sm:flex items-end justify-center w-72 xl:w-80 h-[210px] xl:h-[235px] -mb-6 xl:-mb-8 shrink-0 pointer-events-none select-none">
                      <div className="relative w-40 xl:w-48 h-full">
                        <Image
                          src={currentBeneficiaryData.avatarUrl}
                          alt={beneficiaryName}
                          fill
                          className="object-contain object-bottom drop-shadow-xl"
                          priority
                        />
                      </div>

                      <div className="relative w-24 xl:w-28 h-32 mb-6 xl:mb-8 -ml-3 animate-float pointer-events-auto">
                        <Image
                          src="/landingPage/ai_2_landing.webp"
                          alt="AI Assistant Bot"
                          fill
                          className="object-contain drop-shadow-lg"
                          priority
                        />
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
                          Based on your profile, interests and local Kalahandi opportunities
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveMenu("recommendations")}
                        className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer hover:underline"
                      >
                        <span>See All Recommendations</span>
                        <ArrowRight className="size-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {displayCourses.slice(0, 3).map((course, idx) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: 0.1 + idx * 0.07 }}
                          whileHover={{ y: -4 }}
                          className="bg-white rounded-3xl border border-[#EDE7D9] shadow-2xs hover:shadow-lg hover:border-purple-200 transition-all overflow-hidden flex flex-col justify-between group"
                        >
                          <div className="relative h-32 xl:h-36 w-full overflow-hidden bg-slate-100">
                            <Image
                              src={getSafeCourseImage(course.image, course.title, course.category)}
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

                {/* RIGHT COLUMN (lg:col-span-4): Profile, Progress, Upcoming Steps */}
                <div className="lg:col-span-4 flex flex-col gap-5">

                  {/* 1. PROFILE SUMMARY CARD */}
                  <div className="bg-white rounded-3xl border border-[#EDE7D9] shadow-2xs p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 rounded-2xl overflow-hidden border border-purple-200">
                          <Image
                            src={currentBeneficiaryData.avatarUrl}
                            alt={beneficiaryName}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm xl:text-base font-heading">
                            {beneficiaryName}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-purple-700">
                              {CURRENT_BENEFICIARY.beneficiaryType}
                            </span>
                            <span className="text-[9.5px] font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                              {currentBeneficiaryData.ageCategory}
                            </span>
                          </div>
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

                    <div className="space-y-2 text-xs text-slate-600 font-medium pt-1">
                      <div className="flex items-center gap-2">
                        <User className="size-3.5 text-indigo-600 shrink-0" />
                        <span className="capitalize font-semibold text-slate-800">{currentBeneficiaryData.gender}</span>
                        <span className="text-slate-300">•</span>
                        <span>Age <strong className="text-slate-800 font-bold">{currentBeneficiaryData.age}</strong></span>
                        <span className="text-slate-300">•</span>
                        <span className="text-purple-700 font-semibold">{currentBeneficiaryData.ageCategory}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-3.5 text-purple-600 shrink-0" />
                        <span>{beneficiaryDistrict}, {beneficiaryState}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="size-3.5 text-blue-600 shrink-0" />
                        <span>{currentBeneficiaryData.education}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sprout className="size-3.5 text-emerald-600 shrink-0" />
                        <span>Family Occupation: {CURRENT_BENEFICIARY.familyOccupation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="size-3.5 text-amber-600 shrink-0" />
                        <span>Looking for: {currentBeneficiaryData.lookingFor}</span>
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
                        onClick={() => setActiveMenu("progress")}
                        className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative size-24 shrink-0 flex items-center justify-center">
                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-100"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
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
                      {UPCOMING_STEPS.map((step) => (
                        <motion.div
                          key={step.id}
                          whileHover={{ x: 2 }}
                          onClick={() => {
                            if (step.iconName === "mic") setIsVoiceModalOpen(true);
                            else if (step.iconName === "book") {
                              setActiveMenu("training");
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
              </motion.div>
            )}

            {/* TAB 2: AI RECOMMENDATIONS HUB */}
            {activeMenu === "recommendations" && (
              <motion.div
                key="view-recommendations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-[32px] shadow-md flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-extrabold uppercase">
                      AI Personalized Matches
                    </span>
                    <h2 className="text-2xl font-black font-heading">
                      Recommended for {beneficiaryName}
                    </h2>
                    <p className="text-xs text-purple-200/80">
                      Based on your {currentBeneficiaryData.education} qualification, {currentBeneficiaryData.lookingFor} interest, and high-demand trades in {beneficiaryDistrict}.
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenVoiceWithPrompt("मेरे लिए कौन से कोर्स और योजनाएं सबसे अच्छी हैं?")}
                    className="flex items-center gap-2 bg-white text-purple-900 font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md cursor-pointer"
                  >
                    <Mic className="size-4 text-purple-600" />
                    <span>Ask AI Recommendations</span>
                  </motion.button>
                </div>

                {/* 1. Top Recommended Courses */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
                      <GraduationCap className="size-5 text-blue-600" />
                      <span>Top NSQF Training Matches (with ₹3,500/mo Stipend)</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {displayCourses.slice(0, 3).map((course) => (
                      <div
                        key={course.id}
                        className="bg-white rounded-3xl border border-[#EDE7D9] shadow-2xs p-4 flex flex-col justify-between space-y-3 hover:shadow-md transition-all group"
                      >
                        <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-100">
                          <Image src={getSafeCourseImage(course.image, course.title, course.category)} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                          <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full">
                            95% Match
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm font-heading">{course.title}</h4>
                          <p className="text-xs text-purple-700 font-bold mt-1">{course.stipend}</p>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenCourse(course)}
                            className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold py-2 rounded-xl"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Top Recommended Jobs */}
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
                    <Briefcase className="size-5 text-emerald-600" />
                    <span>Top Verified Job Matches</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {RECOMMENDED_JOBS.slice(0, 2).map((job) => (
                      <div
                        key={job.id}
                        className="bg-white rounded-3xl border border-[#EDE7D9] shadow-2xs p-5 flex flex-col justify-between space-y-3 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                              ✓ NCS Verified
                            </span>
                            <h4 className="font-extrabold text-slate-900 text-base font-heading mt-1.5">{job.title}</h4>
                            <p className="text-xs text-slate-500 font-medium">{job.company} • {job.location}</p>
                          </div>
                          <span className="text-sm font-extrabold text-purple-700">{job.salary}</span>
                        </div>

                        <p className="text-xs text-slate-600">{job.description}</p>

                        <button
                          onClick={() => handleOpenJob(job)}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs py-2.5 rounded-2xl flex items-center justify-center gap-2 shadow-sm"
                        >
                          <span>Apply for Job</span>
                          <ArrowRight className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Recommended PM-AJAY Schemes */}
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
                    <Sprout className="size-5 text-amber-600" />
                    <span>Recommended PM-AJAY Financial Grants</span>
                  </h3>

                  <div className="bg-white rounded-3xl border border-[#EDE7D9] p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        Pre-Approved Scheme
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base font-heading">
                        PM-AJAY ₹35,000 Micro-Enterprise Grant & Toolkit
                      </h4>
                      <p className="text-xs text-slate-500">
                        100% direct bank grant for purchasing industrial sewing machines, electrical toolkits, and raw materials.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsSchemesModalOpen(true)}
                      className="bg-purple-600 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-md shrink-0 cursor-pointer"
                    >
                      View Grant Details
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: FULL NSQF & PM-AJAY TRAINING PROGRAMS CATALOG */}
            {activeMenu === "training" && (
              <motion.div
                key="view-training"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* 1. Detected Skill Match Spotlight Banner (if worker skill detected) */}
                {detectedCourses.length > 0 && (
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-lg border border-purple-400/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="space-y-1.5 z-10 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase">
                          PM-AJAY 100% Free Grant
                        </span>
                        <span className="text-xs font-bold text-purple-200">
                          ✨ AI Matched Trade: {detectedSkillName}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-white font-heading">
                        {detectedCourses[0].title}
                      </h3>
                      <p className="text-xs text-purple-100/90 leading-relaxed">
                        Dedicated NSQF Level 4 training program synthesized for your background with ₹3,500/month DBT stipend and ₹35,000 tool kit subsidy.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 z-10 shrink-0">
                      <button
                        onClick={() => handleOpenCourse(detectedCourses[0])}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Sparkles className="size-3.5 text-amber-300" />
                        <span>Open Course Details</span>
                      </button>

                      <button
                        onClick={() => handleOpenVoiceWithPrompt(`मुझे ${detectedCourses[0].title} के पाठ्यक्रम, स्टाइपेंड और केंद्र के बारे में विस्तार से बताएं।`)}
                        className="size-10 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-purple-200 hover:text-white cursor-pointer transition-colors"
                        title="Ask AI Copilot"
                      >
                        <Mic className="size-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Header & Sector Navigation Bar */}
                <div className="space-y-3 bg-white p-5 rounded-3xl border border-[#EDE7D9] shadow-2xs">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                        NSQF Skill Training Catalog ({displayCourses.length} Programs)
                      </h2>
                      <p className="text-xs text-slate-500">
                        100% free tuition, ₹3,500/month stipend, hostel accommodation & PM-AJAY micro-enterprise capital grant.
                      </p>
                    </div>

                    {/* Search & Voice AI Trigger */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 w-full md:w-64 focus-within:border-purple-500 focus-within:bg-white transition-all">
                        <Search className="size-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search courses, skills, trades..."
                          className="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
                        />
                      </div>

                      <button
                        onClick={() => handleOpenVoiceWithPrompt("मुझे सभी उपलब्ध कौशल प्रशिक्षण पाठ्यक्रमों के बारे में बताएं।")}
                        className="px-3 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Mic className="size-3.5 text-purple-600" />
                        <span>Ask AI</span>
                      </button>
                    </div>
                  </div>

                  {/* Sector Filter Badges */}
                  <div className="flex gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
                    {SECTOR_DEFINITIONS.map((sec) => {
                      const count =
                        sec.id === "all"
                          ? displayCourses.length
                          : displayCourses.filter((c: any) => c.sectorId === sec.id || c.category === sec.category).length;
                      const isActive = trainingFilter === sec.id;

                      return (
                        <button
                          key={sec.id}
                          onClick={() => setTrainingFilter(sec.id)}
                          className={`px-3 py-1.5 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-all border ${isActive
                            ? "bg-purple-600 border-purple-700 text-white shadow-xs font-extrabold"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                          <span>{sec.name}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isActive ? "bg-white/25 text-white" : "bg-slate-200 text-slate-600"
                              }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Training Course Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {displayCourses
                    .filter((course: any) => {
                      const matchesCategory =
                        trainingFilter === "all" ||
                        course.sectorId === trainingFilter ||
                        course.category === trainingFilter;
                      const q = searchQuery.toLowerCase().trim();
                      const matchesSearch =
                        !q ||
                        course.title.toLowerCase().includes(q) ||
                        course.description.toLowerCase().includes(q) ||
                        (course.shortDesc && course.shortDesc.toLowerCase().includes(q));
                      return matchesCategory && matchesSearch;
                    })
                    .map((course: any) => (
                      <div
                        key={course.id}
                        className="bg-white rounded-3xl border border-[#EDE7D9] shadow-2xs hover:shadow-lg transition-all p-4 flex flex-col justify-between space-y-3 group"
                      >
                        <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-100">
                          <Image src={getSafeCourseImage(course.image, course.title, course.category)} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="bg-purple-600 text-white text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                              NSQF Level {course.nsqfLevel}
                            </span>
                            {course.qpCode && (
                              <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                                {course.qpCode}
                              </span>
                            )}
                          </div>
                          <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                            ₹3,500/mo
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase text-purple-700">
                            {course.sectorName || "Skill Trade"}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-sm font-heading leading-snug line-clamp-2">
                            {course.title}
                          </h4>
                          <p className="text-[11.5px] text-slate-500 line-clamp-2 leading-relaxed">
                            {course.shortDesc || course.description}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium pt-1">
                            <Clock className="size-3 text-slate-400 shrink-0" />
                            <span>{course.duration}</span>
                            <span>•</span>
                            <MapPin className="size-3 text-slate-400 shrink-0" />
                            <span className="truncate">{course.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleOpenVoiceWithPrompt(`मुझे ${course.title} के बारे में बताएं। इसमें क्या सिखाया जाएगा और कौन सी नौकरी या उद्यम शुरू कर सकते हैं?`)}
                            className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Mic className="size-3.5 text-purple-600" />
                            <span>Ask AI</span>
                          </button>

                          <button
                            onClick={() => handleOpenCourse(course)}
                            className="flex-1 bg-slate-900 hover:bg-purple-900 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>View Training Details</span>
                            <ArrowRight className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* TAB 4: JOB OPPORTUNITIES CATALOG */}
            {activeMenu === "jobs" && (
              <motion.div
                key="view-jobs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#EDE7D9] shadow-2xs">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 font-heading">
                      Verified Job Openings (NCS Linked)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Direct employment opportunities with PF, ESI healthcare, and verified salaries.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    {["all", "government", "private"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setJobFilter(f)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${jobFilter === f
                          ? "bg-purple-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                      >
                        {f === "all" ? "All Jobs" : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {RECOMMENDED_JOBS.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-3xl border border-[#EDE7D9] shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            ✓ NCS Verified
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-base font-heading mt-1">{job.title}</h4>
                          <p className="text-xs text-slate-500">{job.company} • {job.location}</p>
                        </div>
                        <span className="text-sm font-extrabold text-purple-700">{job.salary}</span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">{job.description}</p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenJob(job)}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs py-2.5 rounded-2xl flex items-center justify-center gap-2 shadow-sm"
                        >
                          <span>View Job & Apply</span>
                          <ArrowRight className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB 5: SELF EMPLOYMENT & PM-AJAY GRANTS */}
            {activeMenu === "self_employment" && (
              <motion.div
                key="view-self-employment"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-purple-800 text-white p-6 rounded-[32px] shadow-md flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase">
                      Micro-Enterprise Grant Support
                    </span>
                    <h2 className="text-2xl font-black font-heading">
                      PM-AJAY Self-Employment & Capital Grants
                    </h2>
                    <p className="text-xs text-white/90">
                      Get ₹35,000 to ₹50,000 direct grant assistance to set up your own tailoring unit, electrical shop, or food venture.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsSchemesModalOpen(true)}
                    className="bg-white text-orange-950 font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md cursor-pointer"
                  >
                    Open Schemes Modal
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SCHEMES_LIST.map((scheme) => (
                    <div
                      key={scheme.id}
                      className="bg-white rounded-3xl border border-[#EDE7D9] p-5 shadow-2xs flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                          {scheme.status}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm font-heading mt-2">{scheme.name}</h4>
                        <p className="text-xs font-black text-emerald-600 mt-1">{scheme.grantAmount}</p>
                        <p className="text-xs text-slate-500 mt-1">{scheme.eligibility}</p>
                      </div>

                      <button
                        onClick={() => setIsSchemesModalOpen(true)}
                        className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs py-2 rounded-xl"
                      >
                        Apply for Grant
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB 6: PROGRESS JOURNEY */}
            {activeMenu === "progress" && (
              <motion.div
                key="view-progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="bg-white rounded-3xl border border-[#EDE7D9] p-6 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                        {beneficiaryName} · Skills Passport & Verification
                      </h3>
                      <p className="text-xs text-slate-500">60% Completed · SIDH & PM-AJAY Certified Profile</p>
                    </div>

                    <span className="text-xl font-black text-purple-700">60% Complete</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full w-[60%] rounded-full"></div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {CURRENT_BENEFICIARY.progressSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between ${step.status === "completed"
                          ? "bg-emerald-50/60 border-emerald-200"
                          : step.status === "active"
                            ? "bg-purple-50/70 border-purple-200"
                            : "bg-slate-50 border-slate-200"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-6 rounded-full flex items-center justify-center font-bold text-xs ${step.status === "completed"
                              ? "bg-emerald-600 text-white"
                              : step.status === "active"
                                ? "bg-purple-600 text-white animate-pulse"
                                : "bg-slate-300 text-slate-600"
                              }`}
                          >
                            {step.status === "completed" ? "✓" : idx + 1}
                          </div>
                          <span className="text-xs font-bold text-slate-900">{step.title}</span>
                        </div>

                        <span
                          className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${step.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : step.status === "active"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-slate-200 text-slate-500"
                            }`}
                        >
                          {step.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 7: HELP & SUPPORT */}
            {activeMenu === "help" && (
              <motion.div
                key="view-help"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl border border-[#EDE7D9] p-6 shadow-2xs space-y-4"
              >
                <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                  Help & Grievance Redressal
                </h3>
                <p className="text-xs text-slate-600">
                  Toll-Free PM-AJAY Helpline: <span className="font-extrabold text-purple-700">14449</span> • Available in Odia, Hindi and Santhali.
                </p>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="size-6 text-purple-600" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">Direct Voice AI Assistant</h4>
                      <p className="text-[11px] text-slate-500">Ask any question by speaking in your local language.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Open Copilot
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

      {/* Global Interactive Modals */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        initialPrompt={voiceAssistantInitialPrompt}
        onNavigateTarget={handleVoiceNavigate}
        beneficiaryName={beneficiaryName}
        district={`${beneficiaryDistrict}, ${beneficiaryState}`}
      />

      <CourseDetailModal
        course={selectedCourse}
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onOpenVoiceAssistant={handleOpenVoiceWithPrompt}
      />

      <JobDetailModal
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onOpenVoiceAssistant={handleOpenVoiceWithPrompt}
      />

      <SchemesModal
        isOpen={isSchemesModalOpen}
        onClose={() => setIsSchemesModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        beneficiary={currentBeneficiaryData}
        beneficiaryProfile={activeProfile}
        onUpdateProfile={handleUpdateProfile}
      />

      <NotificationPopover
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}
