"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader, AppMode } from "@/components/navigation/AppHeader";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { LoginPage } from "@/components/auth/LoginPage";
import {
  PersonalVoiceOnboarding,
  BeneficiaryProfileData
} from "@/components/onboarding/PersonalVoiceOnboarding";
import { BeneficiaryExperience } from "@/components/beneficiary/BeneficiaryExperience";
import { FieldWorkerCopilot } from "@/components/field-worker/FieldWorkerCopilot";
import { GovernmentDashboard } from "@/components/government/GovernmentDashboard";
import { useIsMobile } from "@/lib/useIsMobile";
import { ShieldCheck, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type FlowStage = "onboarding" | "login" | "personal_onboarding" | "dashboard";

export default function Home() {
  const [flowStage, setFlowStage] = useState<FlowStage>("onboarding");
  const [currentMode, setCurrentMode] = useState<AppMode>("beneficiary");
  const [language, setLanguage] = useState<string>("hi");
  const [beneficiaryProfile, setBeneficiaryProfile] = useState<BeneficiaryProfileData | null>(null);

  const isMobile = useIsMobile();

  // Load any previously spoken/saved profile on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("Sakhyam_beneficiary_profile");
      if (saved) {
        setBeneficiaryProfile(JSON.parse(saved));
      }
    } catch { }
  }, []);

  const handleOnboardingComplete = () => {
    setFlowStage("login");
  };

  const handleLoginSuccess = (
    role: "beneficiary" | "field_worker" | "government",
    profileData?: BeneficiaryProfileData
  ) => {
    setCurrentMode(role);
    if (profileData) {
      setBeneficiaryProfile(profileData);
      try {
        localStorage.setItem("Sakhyam_beneficiary_profile", JSON.stringify(profileData));
      } catch { }
    }
    if (role === "beneficiary") {
      setFlowStage("personal_onboarding");
    } else {
      setFlowStage("dashboard");
    }
  };

  const handlePersonalOnboardingComplete = (profileData: BeneficiaryProfileData) => {
    setBeneficiaryProfile(profileData);
    try {
      localStorage.setItem("Sakhyam_beneficiary_profile", JSON.stringify(profileData));
    } catch { }
    setFlowStage("dashboard");
  };

  const handleBackToOnboarding = () => {
    setFlowStage("onboarding");
  };

  const handleLogout = () => {
    setFlowStage("login");
  };

  return (
    <div
      className={`flex flex-col text-slate-900 selection:bg-purple-500 selection:text-white ${flowStage === "onboarding" || flowStage === "login" || flowStage === "personal_onboarding"
          ? "bg-[#FAF6EE]"
          : "bg-slate-50 min-h-screen"
        } ${flowStage === "onboarding"
          ? "h-screen md:min-h-screen overflow-hidden md:overflow-visible"
          : "min-h-screen"
        }`}
    >
      {/* ========================================================================= */}
      {/* SINGLE UNIFIED RESPONSIVE TREE (Never duplicate mounted components in React) */}
      {/* ========================================================================= */}
      {isMobile ? (
        /* 1. MOBILE VIEW CONTAINER */
        <div
          className={`flex w-full flex-col ${flowStage === "onboarding"
              ? "fixed inset-0 h-[100dvh] max-h-[100dvh] overflow-hidden z-50 bg-[#FAF6EE]"
              : "min-h-[100dvh]"
            }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {flowStage === "onboarding" && (
              <motion.main
                key="mobile-onboarding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="w-full h-full max-h-[100dvh] overflow-hidden flex flex-col"
              >
                <OnboardingFlow
                  onFinish={handleOnboardingComplete}
                  isMobile={true}
                  initialLanguage={language}
                  onLanguageChange={setLanguage}
                />
              </motion.main>
            )}

            {flowStage === "login" && (
              <motion.main
                key="mobile-login"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="w-full min-h-[100dvh] flex flex-col"
              >
                <LoginPage
                  onLoginSuccess={handleLoginSuccess}
                  onBackToOnboarding={handleBackToOnboarding}
                  isMobile={true}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              </motion.main>
            )}

            {flowStage === "personal_onboarding" && (
              <motion.main
                key="mobile-personal-onboarding"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="w-full min-h-[100dvh] flex flex-col"
              >
                <PersonalVoiceOnboarding
                  onComplete={handlePersonalOnboardingComplete}
                  onSkip={() => setFlowStage("dashboard")}
                  onBack={() => setFlowStage("login")}
                  initialLanguage={language.toLowerCase()}
                  onLanguageChange={setLanguage}
                />
              </motion.main>
            )}

            {flowStage === "dashboard" && (
              <motion.div
                key="mobile-dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full min-h-[100dvh] flex flex-col"
              >
                {currentMode !== "beneficiary" && (
                  <AppHeader
                    currentMode={currentMode}
                    onModeChange={setCurrentMode}
                    language={language}
                    onLanguageChange={setLanguage}
                    onLogout={handleLogout}
                    isLoggedIn={true}
                  />
                )}

                <main className={`flex-1 ${currentMode !== "beneficiary" ? "pb-16" : ""}`}>
                  {currentMode === "beneficiary" && (
                    <BeneficiaryExperience beneficiaryProfile={beneficiaryProfile} />
                  )}
                  {currentMode === "field_worker" && <FieldWorkerCopilot />}
                  {currentMode === "government" && <GovernmentDashboard />}
                </main>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* 2. DESKTOP / TABLET VIEW CONTAINER */
        <div className="flex w-full flex-col min-h-screen">
          {!(
            (flowStage === "dashboard" && currentMode === "beneficiary") ||
            flowStage === "personal_onboarding"
          ) && (
              <AppHeader
                currentMode={
                  flowStage === "login"
                    ? "onboarding"
                    : flowStage === "onboarding"
                      ? "onboarding"
                      : currentMode
                }
                onModeChange={(mode) => {
                  if (mode === "onboarding") {
                    setFlowStage("onboarding");
                  } else {
                    setCurrentMode(mode);
                    setFlowStage("dashboard");
                  }
                }}
                language={language}
                onLanguageChange={setLanguage}
                onLogout={handleLogout}
                isLoggedIn={flowStage === "dashboard"}
              />
            )}

          <main
            className={`flex-1 ${flowStage === "dashboard" && currentMode !== "beneficiary" ? "pb-16" : ""
              }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {flowStage === "onboarding" && (
                <motion.div
                  key="desktop-onboarding"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <OnboardingFlow
                    onFinish={handleOnboardingComplete}
                    isMobile={false}
                    initialLanguage={language}
                    onLanguageChange={setLanguage}
                  />
                </motion.div>
              )}

              {flowStage === "login" && (
                <motion.div
                  key="desktop-login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <LoginPage
                    onLoginSuccess={handleLoginSuccess}
                    onBackToOnboarding={handleBackToOnboarding}
                    isMobile={false}
                    language={language}
                    onLanguageChange={setLanguage}
                  />
                </motion.div>
              )}

              {flowStage === "personal_onboarding" && (
                <motion.div
                  key="desktop-personal-onboarding"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <PersonalVoiceOnboarding
                    onComplete={handlePersonalOnboardingComplete}
                    onSkip={() => setFlowStage("dashboard")}
                    onBack={() => setFlowStage("login")}
                    initialLanguage={language.toLowerCase()}
                    onLanguageChange={setLanguage}
                  />
                </motion.div>
              )}

              {flowStage === "dashboard" && (
                <motion.div
                  key="desktop-dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {currentMode === "beneficiary" && (
                    <BeneficiaryExperience beneficiaryProfile={beneficiaryProfile} />
                  )}
                  {currentMode === "field_worker" && <FieldWorkerCopilot />}
                  {currentMode === "government" && <GovernmentDashboard />}
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {flowStage !== "login" &&
            flowStage !== "personal_onboarding" &&
            !(flowStage === "dashboard" && currentMode === "beneficiary") && (
              <footer className="w-full bg-white border-t border-slate-200/80 py-8 px-4 text-xs text-slate-500">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col gap-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-slate-800 font-heading">
                      <span>Sakhyam-AI — AI Livelihood Intelligence Platform</span>
                      <Badge variant="purple" className="text-[10px]">
                        PM-AJAY Standard
                      </Badge>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Intelligence layer operating above Skill India Digital Hub (SIDH), NCS, e-Shram, PM-DAKSH & BHASHINI.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="size-3.5 text-emerald-600" />
                      Explainable AI (No Hallucinations)
                    </span>
                    <span className="flex items-center gap-1">
                      <HeartHandshake className="size-3.5 text-purple-600" />
                      100% Low-Literacy Inclusion
                    </span>
                  </div>
                </div>
              </footer>
            )}
        </div>
      )}
    </div>
  );
}
