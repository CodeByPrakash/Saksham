"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Volume2,
  CheckCircle2,
  Lock,
  UserCheck,
  Building2,
  Users,
  Mic,
  KeyRound,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";

interface LoginPageProps {
  onLoginSuccess: (role: "beneficiary" | "field_worker" | "government") => void;
  onBackToOnboarding?: () => void;
  isMobile?: boolean;
}

export function LoginPage({ onLoginSuccess, onBackToOnboarding, isMobile = false }: LoginPageProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>("9876543210");
  const [otp, setOtp] = useState<string>("1234");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<"beneficiary" | "field_worker" | "government">("beneficiary");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isPlayingAudioPrompt, setIsPlayingAudioPrompt] = useState<boolean>(false);

  const handleSendOtp = () => {
    if (phoneNumber.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyAndLogin = (roleToLogin?: "beneficiary" | "field_worker" | "government") => {
    setIsVerifying(true);
    const targetRole = roleToLogin || selectedRole;
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess(targetRole);
    }, 600);
  };

  const playVoiceOtp = () => {
    setIsPlayingAudioPrompt(true);
    setTimeout(() => {
      setIsPlayingAudioPrompt(false);
    }, 3000);
  };

  return (
    <div
      className={`relative w-full flex flex-col items-center bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] text-slate-900 select-none ${
        isMobile ? "min-h-[100dvh] px-4.5 pt-3 pb-8 overflow-y-auto" : "min-h-[calc(100vh-65px)] py-8 px-4 sm:px-8"
      }`}
    >
      {/* Background Ambient Cloud Puffs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-8 -left-10 w-48 h-24 bg-white/70 rounded-full blur-2xl animate-float" />
        <div className="absolute top-32 -right-10 w-56 h-28 bg-amber-100/60 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-16 left-1/3 w-64 h-24 bg-white/80 rounded-full blur-2xl animate-pulse-glow" />
      </div>

      {/* Top Bar */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-1 pb-2">
        {onBackToOnboarding && (
          <button
            onClick={onBackToOnboarding}
            type="button"
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back</span>
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {isMobile && <LanguageSelector variant="icon" />}
          <div className="flex items-center gap-1 bg-purple-100/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-purple-800 border border-purple-200/60">
            <ShieldCheck className="size-3 text-purple-700" />
            <span>PM-AJAY Secure Auth</span>
          </div>
        </div>
      </div>

      {/* Main Login Card Area (Top-to-Bottom Flow) */}
      <div className="w-full max-w-md space-y-4 sm:space-y-5 z-10 pt-1">
        {/* Brand Logo & Welcome */}
        <div className="flex flex-col items-center text-center space-y-1.5">
          <div className="relative size-12 mb-0.5 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
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

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
            Welcome to Jeevika<span className="text-purple-600">Setu</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xs">
            Sign in with your mobile number to access your livelihood passport and opportunities.
          </p>
        </div>

        {/* Role Selector Tabs with Framer Motion Layout Animation */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
            Select Your Role:
          </span>
          <div className="grid grid-cols-3 gap-2 bg-slate-100/90 p-1.5 rounded-2xl relative">
            {(["beneficiary", "field_worker", "government"] as const).map((role) => {
              const isSelected = selectedRole === role;
              const icons = {
                beneficiary: <Mic className="size-4 text-purple-600" />,
                field_worker: <Users className="size-4 text-blue-600" />,
                government: <Building2 className="size-4 text-indigo-600" />,
              };
              const labels = {
                beneficiary: "Beneficiary",
                field_worker: "Field Worker",
                government: "District DSC",
              };

              return (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`relative flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer z-10 ${isSelected ? "text-purple-900 font-extrabold" : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeRoleTabIndicator"
                      className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  {icons[role]}
                  <span>{labels[role]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/80 space-y-4">
          {/* Mobile Number Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Mobile Number / मोबाइल नंबर</span>
              <span className="text-[10px] text-purple-600 font-semibold">e-Shram Linked</span>
            </label>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
              <span className="text-xs font-bold text-slate-500 border-r border-slate-200 pr-2">+91</span>
              <input
                type="tel"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter 10-digit mobile"
                className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none tracking-wider"
              />
              <Phone className="size-4 text-slate-400 shrink-0" />
            </div>
          </div>

          {/* OTP Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                4-Digit OTP / ओटीपी
              </label>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={playVoiceOtp}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="size-3.5" />
                <span>{isPlayingAudioPrompt ? "बोल रहे हैं..." : "Voice OTP"}</span>
              </motion.button>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1 2 3 4"
                className="w-full bg-transparent text-base font-extrabold text-slate-900 focus:outline-none tracking-widest text-center"
              />
              <KeyRound className="size-4 text-purple-600 shrink-0" />
            </div>
            <p className="text-[10px] text-slate-400 text-right">
              Demo OTP: <strong className="text-slate-700">1234</strong>
            </p>
          </div>

          {/* Verify & Login Button with Spring Physics */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 25 }}
            onClick={() => handleVerifyAndLogin()}
            disabled={isVerifying}
            className="w-full h-13 text-sm font-bold rounded-2xl bg-gradient-to-r from-[#6B34EB] via-[#7539F4] to-[#8042F6] hover:from-[#5E2DD8] hover:to-[#7335EC] text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 mt-2 cursor-pointer border border-purple-400/20"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <span className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Verifying Credentials...
              </span>
            ) : (
              <>
                <span>Verify & Enter Dashboard</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </motion.button>

          {/* One-Tap Demo Persona Fast-Logins */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Or Fast-Login as Demo Persona:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              <motion.button
                whileHover={{ scale: 1.015, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVerifyAndLogin("beneficiary")}
                className="text-left p-2 rounded-xl bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200/80 transition-colors cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                    RS
                  </span>
                  <div>
                    <span className="font-extrabold text-slate-900 block leading-tight">
                      Ramesh Soren (Beneficiary)
                    </span>
                    <span className="text-[10px] text-slate-500">Sundargarh • Motor & Agri Repair</span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-purple-600" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.015, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVerifyAndLogin("field_worker")}
                className="text-left p-2 rounded-xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 transition-colors cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                    AM
                  </span>
                  <div>
                    <span className="font-extrabold text-slate-900 block leading-tight">
                      Anita Mahapatra (Prerak Copilot)
                    </span>
                    <span className="text-[10px] text-slate-500">Lathikata GP • 18 Assigned Tasks</span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-blue-600" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.015, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVerifyAndLogin("government")}
                className="text-left p-2 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/80 transition-colors cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                    GO
                  </span>
                  <div>
                    <span className="font-extrabold text-slate-900 block leading-tight">
                      District Skill Committee (DSC Admin)
                    </span>
                    <span className="text-[10px] text-slate-500">Sundargarh • PM-AJAY Perspective Plan</span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-emerald-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

