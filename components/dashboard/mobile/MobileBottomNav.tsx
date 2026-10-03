"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home, GraduationCap, Briefcase, User, Mic } from "lucide-react";

export type MobileTab = "home" | "training" | "jobs" | "messages" | "profile";

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  onVoiceClick?: () => void;
}

export function MobileBottomNav({
  activeTab,
  onSelectTab,
  onVoiceClick
}: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#EDE7D9] py-1.5 px-3 flex items-center justify-between shadow-xl max-w-md mx-auto">
      
      {/* 1. Home Tab */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onSelectTab("home")}
        className={`flex-1 flex flex-col items-center gap-0.5 py-1 rounded-2xl transition-all cursor-pointer ${
          activeTab === "home" ? "text-purple-600 font-extrabold" : "text-slate-400 font-semibold"
        }`}
      >
        <div
          className={`p-1.5 rounded-xl transition-all ${
            activeTab === "home" ? "bg-purple-100/80 text-purple-700 shadow-2xs" : ""
          }`}
        >
          <Home className={`size-5 ${activeTab === "home" ? "fill-purple-600 text-purple-600" : ""}`} />
        </div>
        <span className="text-[10px] leading-none">Home</span>
      </motion.button>

      {/* 2. Training Tab */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onSelectTab("training")}
        className={`flex-1 flex flex-col items-center gap-0.5 py-1 rounded-2xl transition-all cursor-pointer ${
          activeTab === "training" ? "text-purple-600 font-extrabold" : "text-slate-400 font-semibold"
        }`}
      >
        <div
          className={`p-1.5 rounded-xl transition-all ${
            activeTab === "training" ? "bg-purple-100/80 text-purple-700 shadow-2xs" : ""
          }`}
        >
          <GraduationCap className={`size-5 ${activeTab === "training" ? "fill-purple-600 text-purple-600" : ""}`} />
        </div>
        <span className="text-[10px] leading-none">Training</span>
      </motion.button>

      {/* 3. CENTER VOICE AI BUTTON (Elevated Glowing Mic Orb) */}
      <div className="relative -mt-6 flex flex-col items-center px-1">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          onClick={onVoiceClick}
          className="relative size-14 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 text-white shadow-xl shadow-purple-600/40 border-4 border-white flex items-center justify-center cursor-pointer group"
          aria-label="Voice AI Assistant"
        >

          <Mic className="size-6 text-white" />
        </motion.button>
        <span className="text-[9.5px] font-extrabold text-purple-700 leading-none mt-1">
          Voice AI
        </span>
      </div>

      {/* 4. Jobs Tab */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onSelectTab("jobs")}
        className={`flex-1 flex flex-col items-center gap-0.5 py-1 rounded-2xl transition-all cursor-pointer ${
          activeTab === "jobs" ? "text-purple-600 font-extrabold" : "text-slate-400 font-semibold"
        }`}
      >
        <div
          className={`p-1.5 rounded-xl transition-all ${
            activeTab === "jobs" ? "bg-purple-100/80 text-purple-700 shadow-2xs" : ""
          }`}
        >
          <Briefcase className={`size-5 ${activeTab === "jobs" ? "fill-purple-600 text-purple-600" : ""}`} />
        </div>
        <span className="text-[10px] leading-none">Jobs</span>
      </motion.button>

      {/* 5. Profile Tab */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onSelectTab("profile")}
        className={`flex-1 flex flex-col items-center gap-0.5 py-1 rounded-2xl transition-all cursor-pointer ${
          activeTab === "profile" ? "text-purple-600 font-extrabold" : "text-slate-400 font-semibold"
        }`}
      >
        <div
          className={`p-1.5 rounded-xl transition-all ${
            activeTab === "profile" ? "bg-purple-100/80 text-purple-700 shadow-2xs" : ""
          }`}
        >
          <User className={`size-5 ${activeTab === "profile" ? "fill-purple-600 text-purple-600" : ""}`} />
        </div>
        <span className="text-[10px] leading-none">Profile</span>
      </motion.button>

    </nav>
  );
}
