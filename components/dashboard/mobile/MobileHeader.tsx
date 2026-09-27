"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Bell, ChevronDown } from "lucide-react";
import { CURRENT_BENEFICIARY } from "../DashboardShared";

interface MobileHeaderProps {
  onOpenVoice: () => void;
  onOpenProfile: () => void;
  onLogoClick?: () => void;
}

export function MobileHeader({
  onOpenVoice,
  onOpenProfile,
  onLogoClick
}: MobileHeaderProps) {
  return (
    <header className="px-5 py-2 flex items-center justify-between shrink-0">
      {/* Brand Logo & Tagline */}
      <div
        onClick={onLogoClick}
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
            Saksham <span className="text-purple-600">AI</span>
          </span>
          <span className="text-[9.5px] font-semibold text-slate-500 tracking-tight leading-none mt-0.5">
            Skills Today · Better Tomorrow
          </span>
        </div>
      </div>

      {/* Right Actions: Bell & Avatar with Chevron */}
      <div className="flex items-center gap-2.5">
        {/* Notification Bell Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onOpenVoice}
          className="relative size-10 rounded-full bg-white border border-[#EDE7D9] shadow-2xs flex items-center justify-center text-slate-700 cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="size-4.5" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </motion.button>

        {/* User Avatar + Dropdown */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onOpenProfile}
          className="flex items-center gap-1 bg-white p-1 pr-2 rounded-full border border-[#EDE7D9] shadow-2xs cursor-pointer"
          aria-label="Profile menu"
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
  );
}
