"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronDown, Globe, Check, X } from "lucide-react";
import { CURRENT_BENEFICIARY, BeneficiaryData } from "../DashboardShared";

interface MobileHeaderProps {
  onOpenVoice: () => void;
  onOpenProfile: () => void;
  onOpenNotifications?: () => void;
  onLanguageChange?: (langCode: string) => void;
  onLogoClick?: () => void;
  beneficiary?: BeneficiaryData;
}

const LANGUAGES = [
  { code: "hi", label: "हिन्दी", sub: "Hindi" },
  { code: "or", label: "ଓଡ଼ିଆ", sub: "Odia" },
  { code: "sat", label: "संताली", sub: "Santhali" },
  { code: "en", label: "English", sub: "English" },
  { code: "bho", label: "भोजपुरी", sub: "Bhojpuri" },
  { code: "bn", label: "বাংলা", sub: "Bengali" },
  { code: "mr", label: "मराठी", sub: "Marathi" }
];

export function MobileHeader({
  onOpenVoice,
  onOpenProfile,
  onOpenNotifications,
  onLanguageChange,
  onLogoClick,
  beneficiary
}: MobileHeaderProps) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLangCode, setSelectedLangCode] = useState("hi");

  const currentName = beneficiary?.name || CURRENT_BENEFICIARY.name;
  const currentAvatar = beneficiary?.avatarUrl || CURRENT_BENEFICIARY.avatarUrl;

  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLangCode) || LANGUAGES[0];

  const handleSelectLanguage = (code: string) => {
    setSelectedLangCode(code);
    setIsLangOpen(false);
    onLanguageChange?.(code);
  };

  return (
    <>
      <header className="px-3.5 sm:px-5 py-2 flex items-center justify-between shrink-0 bg-[#FAF6EE]/90 backdrop-blur-xs">
        {/* Brand Logo & Tagline */}
        <div
          onClick={onLogoClick}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="size-8.5 shrink-0 relative">
            <Image
              src="/logo.png"
              alt="Saksham AI Logo"
              fill
              className="object-contain drop-shadow-xs"
              sizes="34px"
              priority
            />
          </div>

          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-slate-900 font-heading leading-tight">
              Saksham <span className="text-purple-600">AI</span>
            </span>
            <span className="text-[9px] font-semibold text-slate-500 tracking-tight leading-none mt-0.5">
              Skills Today · Better Tomorrow
            </span>
          </div>
        </div>

        {/* Right Actions: Language Selector + Bell + Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Choose Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsLangOpen(true)}
            className="flex items-center gap-1 h-9 px-2.5 rounded-full bg-white border border-[#EDE7D9] shadow-2xs text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            aria-label="Choose Language"
          >
            <Globe className="size-3.5 text-purple-600 shrink-0" />
            <span className="text-[11px] font-extrabold">{currentLangObj.label}</span>
          </motion.button>

          {/* Notification Bell Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onOpenNotifications || onOpenVoice}
            className="relative size-9 rounded-full bg-white border border-[#EDE7D9] shadow-2xs flex items-center justify-center text-slate-700 cursor-pointer hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </motion.button>

          {/* User Avatar + Dropdown */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onOpenProfile}
            className="flex items-center gap-1 bg-white p-0.5 pr-1.5 rounded-full border border-[#EDE7D9] shadow-2xs cursor-pointer hover:bg-slate-50"
            aria-label="Profile menu"
          >
            <div className="relative size-8 rounded-full overflow-hidden border border-purple-200">
              <Image
                src={currentAvatar}
                alt={currentName}
                fill
                className="object-cover object-top"
              />
            </div>
            <ChevronDown className="size-3 text-slate-500" />
          </motion.button>
        </div>
      </header>

      {/* Language Selection Modal for Mobile */}
      <AnimatePresence>
        {isLangOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden"
            >
              <div className="p-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-white/10 flex items-center justify-center text-purple-200">
                    <Globe className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">भाषा चुनें (Choose Language)</h3>
                    <p className="text-[10px] text-purple-200/80">Select your preferred language</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLangOpen(false)}
                  className="size-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="p-3 grid grid-cols-1 gap-1.5 max-h-[60vh] overflow-y-auto">
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLangCode === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-50/80 border-purple-400/80 text-purple-900 shadow-2xs ring-1 ring-purple-300"
                          : "bg-slate-50/70 border-slate-200/70 text-slate-700 hover:bg-purple-50/40"
                      }`}
                    >
                      <div>
                        <span className="font-bold text-sm block">{lang.label}</span>
                        <span className="text-[11px] text-slate-500">{lang.sub}</span>
                      </div>
                      {isSelected && <Check className="size-4 text-purple-600" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => setIsLangOpen(false)}
                  className="w-full py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
