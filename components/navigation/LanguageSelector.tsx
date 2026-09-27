"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface LanguageOption {
  code: string;
  label: string;
  native: string;
  region: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", native: "English", region: "National / Global" },
  { code: "hi", label: "Hindi", native: "हिन्दी", region: "North & Central India" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ", region: "Odisha" },
  { code: "sat", label: "Santhali", native: "संताली (ᱥᱟᱱᱛᱟᱲᱤ)", region: "Jharkhand / Mayurbhanj" },
  { code: "bho", label: "Bhojpuri", native: "भोजपुरी", region: "Bihar / Eastern UP" },
  { code: "bn", label: "Bengali", native: "বাংলা", region: "West Bengal / Tripura" },
  { code: "mr", label: "Marathi", native: "मराठी", region: "Maharashtra" },
  { code: "te", label: "Telugu", native: "తెలుగు", region: "Andhra Pradesh / Telangana" },
  { code: "ta", label: "Tamil", native: "தமிழ்", region: "Tamil Nadu" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", region: "Gujarat" },
  { code: "ur", label: "Urdu", native: "اردو", region: "National / UP / Kashmir" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", region: "Karnataka" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", region: "Kerala" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", region: "Punjab" },
  { code: "as", label: "Assamese", native: "অসমীয়া", region: "Assam" },
  { code: "mai", label: "Maithili", native: "मैथिली", region: "Bihar / Mithila" },
  { code: "doi", label: "Dogri", native: "डोगरी", region: "Jammu & Kashmir" },
  { code: "kok", label: "Konkani", native: "कोंकणी", region: "Goa / Coastal" },
  { code: "ne", label: "Nepali", native: "नेपाली", region: "Sikkim / North Bengal" },
  { code: "sd", label: "Sindhi", native: "سنڌي / सिन्धी", region: "Western India" },
  { code: "sa", label: "Sanskrit", native: "संस्कृतम्", region: "Classical" },
  { code: "es", label: "Spanish", native: "Español", region: "International" },
  { code: "fr", label: "French", native: "Français", region: "International" },
  { code: "ar", label: "Arabic", native: "العربية", region: "International" },
];

interface LanguageSelectorProps {
  variant?: "full" | "icon" | "compact";
  className?: string;
  align?: "right" | "left";
  currentLanguage?: string;
  onLanguageChange?: (langCode: string) => void;
}

export function LanguageSelector({
  variant = "full",
  className = "",
  align = "right",
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentCode, setCurrentCode] = useState<string>(currentLanguage || "en");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentLanguage) {
      setCurrentCode(currentLanguage.toLowerCase());
    }
  }, [currentLanguage]);

  // Sync initial language from saved preference or prop
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Clear any rogue googtrans cookies that corrupt React DOM
        const hostname = window.location.hostname;
        document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = `googtrans=; path=/; domain=${hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        document.cookie = `googtrans=; path=/; domain=.${hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;

        const saved = localStorage.getItem("Saksham-AI_lang");
        if (saved && !currentLanguage) {
          const found = LANGUAGES.find(
            (l) => l.code === saved || l.code.toLowerCase() === saved.toLowerCase()
          );
          if (found) {
            setCurrentCode(found.code);
            onLanguageChange?.(found.code);
          }
        }
      } catch { }
    }
  }, [currentLanguage, onLanguageChange]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleSelect = (lang: LanguageOption) => {
    setCurrentCode(lang.code);
    setIsOpen(false);
    setSearchQuery("");

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("Saksham-AI_lang", lang.code);
        // Clear googtrans to prevent browser translator from double-translating
        const hostname = window.location.hostname;
        document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = `googtrans=; path=/; domain=${hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        document.cookie = `googtrans=; path=/; domain=.${hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      } catch { }
    }

    onLanguageChange?.(lang.code);
  };

  const currentLangObj =
    LANGUAGES.find((l) => l.code === currentCode || l.code.toLowerCase() === currentCode.toLowerCase()) ||
    LANGUAGES[0];

  const filteredLanguages = LANGUAGES.filter((l) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      l.label.toLowerCase().includes(q) ||
      l.native.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`relative z-[9999] ${className}`} ref={dropdownRef}>
      {/* 1. Icon / Compact Variant for Onboarding Header & Mobile Tabs */}
      {variant === "icon" || variant === "compact" ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const willOpen = !isOpen;
            setIsOpen(willOpen);
            if (willOpen && typeof window !== "undefined" && "speechSynthesis" in window) {
              try {
                const u = new SpeechSynthesisUtterance("कृपया अपनी भाषा चुनें");
                u.lang = "hi-IN";
                window.speechSynthesis.speak(u);
              } catch { }
            }
          }}
          type="button"
          title={`Translate / भाषा बदलें (${currentLangObj.native})`}
          className="flex items-center gap-1 bg-white/85 backdrop-blur-md border border-amber-100/90 hover:bg-white px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-2xs transition-all cursor-pointer select-none active:scale-95"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <Globe className="size-3.5 text-purple-600 shrink-0" />
          <span className="text-[11px] font-extrabold text-purple-900 uppercase tracking-tight">
            {currentLangObj.code}
          </span>
          <ChevronDown
            className={`size-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-purple-600" : ""
              }`}
          />
        </motion.button>
      ) : (
        /* 2. Full Standard Pill Variant for AppHeader */
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <Globe className="size-3.5 text-purple-600 shrink-0" />
          <span className="font-extrabold text-slate-900">{currentLangObj.native}</span>
          <ChevronDown
            className={`size-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-purple-600" : ""
              }`}
          />
        </button>
      )}

      {/* Dropdown Menu with Search & Fixed-Height Scroll */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`absolute ${align === "left" ? "left-0" : "right-0"
              } mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-[99999] select-none`}
          >
            {/* Header with Google Translate badge */}
            <div className="px-3.5 pt-1 pb-2 flex items-center justify-between border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Select Language / भाषा</span>
              <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">
                Google Translate
              </span>
            </div>

            {/* Search Input Box */}
            <div className="p-2 border-b border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                <Search className="size-3.5 text-slate-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search language / भाषा खोजें..."
                  className="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Fixed Height Language List */}
            <div className="max-h-[260px] sm:max-h-[300px] overflow-y-auto lang-scrollbar overscroll-contain p-1.5 space-y-0.5">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((lang) => {
                  const isSelected = currentLangObj.code === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${isSelected
                          ? "bg-purple-50/90 text-purple-700 font-extrabold"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-xs font-extrabold text-slate-900 leading-tight">
                          {lang.native}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
                          {lang.label} • {lang.region}
                        </span>
                      </div>
                      {isSelected && <Check className="size-4 text-purple-600 shrink-0 stroke-[2.5]" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs text-slate-400 space-y-1">
                  <p className="font-semibold">No language found</p>
                  <p className="text-[10px] text-slate-400">कोई भाषा नहीं मिली</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[11px] font-bold text-purple-600 hover:underline pt-1 cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
