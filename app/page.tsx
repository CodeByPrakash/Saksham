"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader, AppMode } from "@/components/navigation/AppHeader";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { LoginPage } from "@/components/auth/LoginPage";
import { BeneficiaryExperience } from "@/components/beneficiary/BeneficiaryExperience";
import { FieldWorkerCopilot } from "@/components/field-worker/FieldWorkerCopilot";
import { GovernmentDashboard } from "@/components/government/GovernmentDashboard";
import { ShieldCheck, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type FlowStage = "onboarding" | "login" | "dashboard";

export default function Home() {
  const [flowStage, setFlowStage] = useState<FlowStage>("onboarding");
  const [currentMode, setCurrentMode] = useState<AppMode>("beneficiary");
  const [language, setLanguage] = useState<string>("EN");

  const handleOnboardingComplete = () => {
    setFlowStage("login");
  };

  const handleLoginSuccess = (role: "beneficiary" | "field_worker" | "government") => {
    setCurrentMode(role);
    setFlowStage("dashboard");
  };

  const handleBackToOnboarding = () => {
    setFlowStage("onboarding");
  };

  const handleLogout = () => {
    setFlowStage("login");
  };

  return (
    <div className={`flex flex-col text-slate-900 selection:bg-purple-500 selection:text-white ${
      flowStage === "onboarding" || flowStage === "login"
        ? "bg-[#FAF6EE]"
        : "bg-slate-50 min-h-screen"
    } ${flowStage === "onboarding" ? "h-screen md:min-h-screen overflow-hidden md:overflow-visible" : "min-h-screen"}`}>
      {/* ========================================================================= */}
      {/* 1. MOBILE RESPONSIVE LAYOUT (Strict sequence without header/footer clutter)*/}
      {/* ========================================================================= */}
      <div className={`flex md:hidden w-full flex-col ${flowStage === "onboarding" ? "fixed inset-0 h-[100dvh] max-h-[100dvh] overflow-hidden z-50 bg-[#FAF6EE]" : "min-h-[100dvh]"}`}>
        <AnimatePresence mode="wait" initial={false}>
          {/* Step 1: Pure Onboarding - ONLY the 3 Slides. Zero distractions */}
          {flowStage === "onboarding" && (
            <motion.main
              key="mobile-onboarding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="w-full h-full max-h-[100dvh] overflow-hidden flex flex-col"
            >
              <OnboardingFlow onFinish={handleOnboardingComplete} isMobile={true} />
            </motion.main>
          )}

          {/* Step 2: Login Page */}
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
              />
            </motion.main>
          )}

          {/* Step 3: Dashboard */}
          {flowStage === "dashboard" && (
            <motion.div
              key="mobile-dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full min-h-[100dvh] flex flex-col"
            >
              <AppHeader
                currentMode={currentMode}
                onModeChange={setCurrentMode}
                language={language}
                onLanguageChange={setLanguage}
                onLogout={handleLogout}
                isLoggedIn={true}
              />

              <main className="flex-1 pb-16">
                {currentMode === "beneficiary" && <BeneficiaryExperience />}
                {currentMode === "field_worker" && <FieldWorkerCopilot />}
                {currentMode === "government" && <GovernmentDashboard />}
              </main>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP / TABLET LAYOUT (>= 768px with full web suite)                */}
      {/* ========================================================================= */}
      <div className="hidden md:flex w-full flex-col min-h-screen">
        {/* Desktop Header */}
        <AppHeader
          currentMode={flowStage === "login" ? "onboarding" : (flowStage === "onboarding" ? "onboarding" : currentMode)}
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

        {/* Main Content Area */}
        <main className={`flex-1 ${flowStage === "dashboard" ? "pb-16" : ""}`}>
          <AnimatePresence mode="wait" initial={false}>
            {flowStage === "onboarding" && (
              <motion.div
                key="desktop-onboarding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <OnboardingFlow onFinish={handleOnboardingComplete} isMobile={false} />
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
                {currentMode === "beneficiary" && <BeneficiaryExperience />}
                {currentMode === "field_worker" && <FieldWorkerCopilot />}
                {currentMode === "government" && <GovernmentDashboard />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Desktop Footer (Only on Onboarding showcase & Dashboard, never on login screen) */}
        {flowStage !== "login" && (
          <footer className="w-full bg-white border-t border-slate-200/80 py-8 px-4 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-slate-800 font-heading">
                  <span>JeevikaSetu — AI Livelihood Intelligence Platform</span>
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
    </div>
  );
}
