"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Smartphone,
  Mic,
  Users,
  Building2,
  Globe,
  ChevronDown,
  Check,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  Sparkles,
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type AppMode = "onboarding" | "beneficiary" | "field_worker" | "government";

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

interface AppHeaderProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
}

export function AppHeader({
  currentMode,
  onModeChange,
  language,
  onLanguageChange,
  onLogout,
  isLoggedIn = false,
}: AppHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync initial language from googtrans cookie if present
  useEffect(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z_-]+)/);
      if (match && match[1]) {
        const found = LANGUAGES.find((l) => l.code === match[1] || l.code.toLowerCase() === match[1].toLowerCase());
        if (found) {
          onLanguageChange(found.code);
        }
      }
    }
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isLangDropdownOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [isLangDropdownOpen]);

  // Trigger Google Translate & switch language
  const handleSelectLanguage = (lang: LanguageOption) => {
    onLanguageChange(lang.code);
    setIsLangDropdownOpen(false);
    setSearchQuery("");

    try {
      if (lang.code === "en") {
        // Clear translation cookies to restore original English
        document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        document.cookie = `googtrans=; path=/; domain=.${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      } else {
        const cookieVal = `/en/${lang.code}`;
        document.cookie = `googtrans=${cookieVal}; path=/;`;
        const hostname = window.location.hostname;
        if (hostname !== "localhost" && hostname !== "127.0.0.1") {
          document.cookie = `googtrans=${cookieVal}; domain=.${hostname}; path=/;`;
          document.cookie = `googtrans=${cookieVal}; domain=${hostname}; path=/;`;
        }
      }

      // Check if Google Translate element exists in DOM
      const selectElem = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (selectElem) {
        selectElem.value = lang.code;
        selectElem.dispatchEvent(new Event("change", { bubbles: true }));
      }

      // Reload page to guarantee full-page translation across all React nodes without missing dynamic text
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error("Translation trigger error:", err);
    }
  };

  // Navigation items for the desktop and mobile suite
  const visibleNavItems = [
    { id: "beneficiary" as AppMode, label: "Beneficiary AI", icon: Mic },
    { id: "field_worker" as AppMode, label: "Field Worker", icon: Users },
    { id: "government" as AppMode, label: "Govt Dashboard", icon: Building2 },
  ];

  const currentLangObj =
    LANGUAGES.find(
      (l) =>
        l.code === language ||
        l.code.toLowerCase() === language.toLowerCase() ||
        l.native === language ||
        l.label.toLowerCase() === language.toLowerCase()
    ) || LANGUAGES[0];

  // Filter languages based on search query
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Emblem & Name */}
        <div
          onClick={() => {
            if (!isLoggedIn) {
              onModeChange("onboarding");
            } else {
              onModeChange("beneficiary");
            }
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none"
        >
          <div className="size-8 sm:size-9 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs group-hover:scale-105 transition-transform">
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
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 font-heading">
                Sak<span className="text-purple-600">sham</span>
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">
                PM-AJAY
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onModeChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isActive
                  ? "bg-white text-purple-700 shadow-xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <Icon className="size-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Language Dropdown & Logout / Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* Language Dropdown Selector */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer active:scale-95"
              aria-expanded={isLangDropdownOpen}
              aria-haspopup="listbox"
            >
              <Globe className="size-3.5 text-purple-600 shrink-0" />
              <span className="font-extrabold text-slate-900">{currentLangObj.native}</span>
              <ChevronDown
                className={`size-3.5 text-slate-400 transition-transform duration-200 ${isLangDropdownOpen ? "rotate-180 text-purple-600" : ""
                  }`}
              />
            </button>

            {/* Searchable Dropdown Menu with Fixed-Height Scrolling */}
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-1.5">
                {/* Header Title with Google Translate badge */}
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

                {/* Fixed Height Language List with Smooth Scrolling */}
                <div className="max-h-[260px] sm:max-h-[300px] overflow-y-auto lang-scrollbar overscroll-contain p-1.5 space-y-0.5">
                  {filteredLanguages.length > 0 ? (
                    filteredLanguages.map((lang) => {
                      const isSelected =
                        currentLangObj.code === lang.code ||
                        language.toLowerCase() === lang.code.toLowerCase() ||
                        language === lang.native ||
                        language.toLowerCase() === lang.label.toLowerCase();

                      return (
                        <button
                          key={lang.code}
                          onClick={() => handleSelectLanguage(lang)}
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
              </div>
            )}
          </div>

          {/* Logout Button (shown when logged in) */}
          {isLoggedIn && onLogout && (
            <button
              onClick={onLogout}
              title="Logout / Switch Account"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer border border-slate-200/60 hover:border-red-200"
            >
              <LogOut className="size-3.5" />
              <span>Logout</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden size-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Onboarding button hidden when logged in) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Switch Surface Layer:
            </span>
            {isLoggedIn && onLogout && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="text-[11px] font-bold text-red-600 flex items-center gap-1 cursor-pointer bg-red-50 px-2 py-0.5 rounded-lg border border-red-100"
              >
                <LogOut className="size-3" />
                <span>Logout</span>
              </button>
            )}
          </div>

          <div className={`grid ${visibleNavItems.length > 2 ? "grid-cols-2" : "grid-cols-1"} gap-2`}>
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentMode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onModeChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${isActive
                    ? "bg-purple-600 text-white shadow-sm font-extrabold"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
