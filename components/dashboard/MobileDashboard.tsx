"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  GraduationCap,
  Briefcase,
  Sprout,
  MapPin,
  Building2,
  ChevronRight,
  ArrowRight,
  Check
} from "lucide-react";
import {
  CURRENT_BENEFICIARY,
  RECOMMENDED_COURSES,
  RECOMMENDED_JOBS,
  QUICK_ACTIONS,
  UPCOMING_STEPS,
  CourseItem,
  JobItem
} from "./DashboardShared";
import {
  MobileHeader,
  MobileHeroCard,
  MobileProgressCard,
  MobileQuickActions,
  MobileRecommendedSkills,
  MobileUpcomingSteps,
  MobileBottomNav,
  MobileTrainingPage,
  MobileTrainingDetailPage,
  MobileJobsPage,
  MobileJobDetailPage,
  MobileTab
} from "./mobile";
import { VoiceAssistantModal } from "./VoiceAssistantModal";
import { SchemesModal } from "./SchemesModal";
import { ProfileModal } from "./ProfileModal";
import { GlobalVoiceNavigator } from "@/components/navigation/GlobalVoiceNavigator";
import { VoiceNavIntent } from "@/lib/ai/voiceNavigation";
import { BeneficiaryProfileData } from "@/components/onboarding/PersonalVoiceOnboarding";

interface MobileDashboardProps {
  initialTab?: MobileTab;
  initialCourseId?: string;
  initialJobId?: string;
  beneficiaryProfile?: BeneficiaryProfileData | null;
}

export function MobileDashboard({
  initialTab = "home",
  initialCourseId,
  initialJobId,
  beneficiaryProfile
}: MobileDashboardProps) {
  const [activeTab, setActiveTab] = useState<MobileTab>(initialTab);
  const [localProfile, setLocalProfile] = useState<BeneficiaryProfileData | null>(() => {
    if (beneficiaryProfile) return beneficiaryProfile;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("saksham_beneficiary_profile");
        if (saved) return JSON.parse(saved);
      } catch { }
    }
    return null;
  });

  const activeProfile = beneficiaryProfile || localProfile;
  const currentBeneficiaryData = {
    ...CURRENT_BENEFICIARY,
    name: activeProfile?.fullName || CURRENT_BENEFICIARY.name,
    district: activeProfile?.district || CURRENT_BENEFICIARY.district,
    state: activeProfile?.state || CURRENT_BENEFICIARY.state,
    education: activeProfile?.education || CURRENT_BENEFICIARY.education,
    lookingFor: activeProfile?.aspiration || CURRENT_BENEFICIARY.lookingFor
  };

  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(() => {
    if (initialCourseId) {
      return RECOMMENDED_COURSES.find(c => c.id === initialCourseId) || null;
    }
    return null;
  });
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(() => {
    if (initialJobId) {
      return RECOMMENDED_JOBS.find(j => j.id === initialJobId) || null;
    }
    return null;
  });
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [voiceAssistantInitialPrompt, setVoiceAssistantInitialPrompt] = useState<string>("");
  const [isSchemesModalOpen, setIsSchemesModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const handleOpenCourse = (course: CourseItem) => {
    setSelectedJob(null);
    setSelectedCourse(course);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseCourseDetail = () => {
    setSelectedCourse(null);
  };

  const handleOpenJob = (job: JobItem) => {
    setSelectedCourse(null);
    setSelectedJob(job);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseJobDetail = () => {
    setSelectedJob(null);
  };

  const handleQuickAction = (actionId: string) => {
    setSelectedCourse(null);
    setSelectedJob(null);
    if (actionId === "action-1") {
      setActiveTab("training");
    } else if (actionId === "action-2") {
      setActiveTab("jobs");
    } else if (actionId === "action-3") {
      setIsSchemesModalOpen(true);
    } else if (actionId === "action-4") {
      setSelectedCourse(RECOMMENDED_COURSES[0]);
    }
  };

  const handleBottomTabSelect = (tab: MobileTab) => {
    setSelectedCourse(null);
    setSelectedJob(null);
    setActiveTab(tab);
    if (tab === "profile") setIsProfileModalOpen(true);
    if (tab === "messages") setIsVoiceModalOpen(true);
  };

  const handleOpenVoiceWithPrompt = (prompt?: string) => {
    if (prompt) {
      setVoiceAssistantInitialPrompt(prompt);
    }
    setIsVoiceModalOpen(true);
  };

  /**
   * Universal Voice Navigation for Mobile
   */
  const handleVoiceNavigate = (intent: VoiceNavIntent) => {
    if (intent.course) {
      handleOpenCourse(intent.course);
      return;
    }

    if (intent.job) {
      handleOpenJob(intent.job);
      return;
    }

    setSelectedCourse(null);
    setSelectedJob(null);

    switch (intent.target) {
      case "home":
      case "dashboard":
        setActiveTab("home");
        break;
      case "training":
        setActiveTab("training");
        break;
      case "jobs":
        setActiveTab("jobs");
        break;
      case "recommendations":
        setActiveTab("training");
        break;
      case "schemes":
      case "self_employment":
        setIsSchemesModalOpen(true);
        break;
      case "profile":
        setIsProfileModalOpen(true);
        break;
      case "progress":
        setActiveTab("profile");
        break;
      case "centers":
        handleOpenCourse(RECOMMENDED_COURSES[0]);
        break;
      case "messages":
        setIsVoiceModalOpen(true);
        break;
      default:
        setActiveTab("home");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF6EE] text-slate-800 flex flex-col justify-between pb-24 select-none font-sans max-w-md mx-auto relative">
      
      {/* 1. TOP APP BAR */}
      <MobileHeader
        beneficiary={currentBeneficiaryData}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogoClick={() => {
          setSelectedCourse(null);
          setSelectedJob(null);
          setActiveTab("home");
        }}
      />

      {/* 2. UNIVERSAL VOICE NAVIGATION BAR FOR MOBILE */}
      <div className="px-4 pt-1">
        <GlobalVoiceNavigator
          currentLanguage="hi"
          onNavigate={handleVoiceNavigate}
          onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
        />
      </div>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 px-4 py-2 space-y-4">
        <AnimatePresence mode="wait">
          {/* DEDICATED TRAINING DETAIL PAGE */}
          {selectedCourse ? (
            <motion.div
              key={`detail-course-${selectedCourse.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <MobileTrainingDetailPage
                course={selectedCourse}
                onBack={handleCloseCourseDetail}
                onOpenVoiceAssistant={handleOpenVoiceWithPrompt}
              />
            </motion.div>
          ) : selectedJob ? (
            <motion.div
              key={`detail-job-${selectedJob.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <MobileJobDetailPage
                job={selectedJob}
                onBack={handleCloseJobDetail}
                onOpenVoiceAssistant={handleOpenVoiceWithPrompt}
              />
            </motion.div>
          ) : activeTab === "home" ? (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* A. Hero Card */}
              <MobileHeroCard
                beneficiary={currentBeneficiaryData}
                onStartVoice={() => setIsVoiceModalOpen(true)}
              />

              {/* B. Your Progress Card */}
              <MobileProgressCard onViewAll={() => setIsProfileModalOpen(true)} />

              {/* C. Quick Actions (4 Squircles) */}
              <MobileQuickActions
                onSelectAction={handleQuickAction}
                onSeeAll={() => setIsSchemesModalOpen(true)}
              />

              {/* D. Recommended for You (Personalized & Detected Skill Carousel) */}
              <MobileRecommendedSkills
                beneficiaryProfile={activeProfile}
                onOpenCourse={handleOpenCourse}
                onSeeAll={() => {
                  setActiveTab("training");
                }}
              />

              {/* E. Upcoming Steps */}
              <MobileUpcomingSteps
                onStartStep={() => setIsVoiceModalOpen(true)}
                onSeeAll={() => setIsVoiceModalOpen(true)}
              />
            </motion.div>
          ) : activeTab === "training" ? (
            <motion.div
              key="tab-training"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MobileTrainingPage
                beneficiaryProfile={activeProfile}
                onOpenCourse={handleOpenCourse}
                onOpenVoiceAssistant={handleOpenVoiceWithPrompt}
              />
            </motion.div>
          ) : activeTab === "jobs" ? (
            <motion.div
              key="tab-jobs"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MobileJobsPage onOpenJob={handleOpenJob} />
            </motion.div>
          ) : activeTab === "messages" ? (
            <motion.div
              key="tab-messages"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <MobileHeroCard
                onStartVoice={() => setIsVoiceModalOpen(true)}
                beneficiary={currentBeneficiaryData}
              />
              <MobileUpcomingSteps
                onStartStep={() => setIsVoiceModalOpen(true)}
                onSeeAll={() => setIsVoiceModalOpen(true)}
              />
            </motion.div>
          ) : activeTab === "profile" ? (
            <motion.div
              key="tab-profile"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-3xl border border-[#EDE7D9] p-5 shadow-2xs text-center flex flex-col items-center space-y-3">
                <div className="relative size-20 rounded-full overflow-hidden border-2 border-purple-300 shadow-md bg-purple-800">
                  <Image
                    src={currentBeneficiaryData.avatarUrl}
                    alt={currentBeneficiaryData.name}
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                  />
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 font-heading">
                    {currentBeneficiaryData.name}
                  </h3>
                  <span className="inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 mt-1">
                    {currentBeneficiaryData.beneficiaryType}
                  </span>
                </div>

                <div className="w-full text-left bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-bold text-slate-900">{currentBeneficiaryData.district}, {currentBeneficiaryData.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Education:</span>
                    <span className="font-bold text-slate-900">{currentBeneficiaryData.education}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">NSQF Skill Course:</span>
                    <span className="font-bold text-purple-700">{activeProfile?.nsqfCourse || "Solar PV Agri-Pump Specialist"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">PM-AJAY Grant:</span>
                    <span className="font-bold text-emerald-600">{activeProfile?.grantEligibility || "₹35,000 Subsidy"}</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsProfileModalOpen(true)}
                  className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-2xl text-xs shadow-md"
                >
                  View Livelihood Passport & Profile
                </motion.button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* 4. FLOATING BOTTOM DOCK NAVBAR WITH CENTER VOICE BUTTON */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={handleBottomTabSelect}
        onVoiceClick={() => setIsVoiceModalOpen(true)}
      />

      {/* 5. GLOBAL INTERACTIVE MODALS */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        initialPrompt={voiceAssistantInitialPrompt}
        onNavigateTarget={handleVoiceNavigate}
        beneficiaryName={currentBeneficiaryData.name}
        district={`${currentBeneficiaryData.district}, ${currentBeneficiaryData.state}`}
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
      />
    </div>
  );
}
