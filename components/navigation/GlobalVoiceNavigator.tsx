"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Compass,
  GraduationCap,
  Briefcase,
  Sprout,
  User,
  MapPin,
  ArrowRight,
  Radio,
  Loader2,
  ChevronRight,
  X,
  Globe
} from "lucide-react";
import {
  VoiceNavIntent,
  VoiceNavTarget,
  parseVoiceNavigationIntent,
  playVoiceNavigationConfirmation
} from "@/lib/ai/voiceNavigation";
import { RECOMMENDED_COURSES, RECOMMENDED_JOBS, CourseItem, JobItem } from "@/components/dashboard/DashboardShared";
import confetti from "canvas-confetti";

interface GlobalVoiceNavigatorProps {
  currentLanguage?: string;
  onNavigate: (intent: VoiceNavIntent) => void;
  onOpenVoiceAssistant?: () => void;
  className?: string;
  isCompact?: boolean;
}

export function GlobalVoiceNavigator({
  currentLanguage = "hi",
  onNavigate,
  onOpenVoiceAssistant,
  className = "",
  isCompact = false
}: GlobalVoiceNavigatorProps) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [lastActionFeedback, setLastActionFeedback] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Quick Action Voice & Tap Prompts
  const quickNavPrompts = [
    {
      id: "p-recom",
      label: "⭐ Recommendations",
      icon: Sparkles,
      color: "bg-purple-100 text-purple-700 border-purple-200",
      queryText: "Show all my recommendations"
    },
    {
      id: "p-elec",
      label: "⚡ Electrician Course",
      icon: GraduationCap,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      queryText: "Open electrician training course"
    },
    {
      id: "p-tailor",
      label: "🧵 Tailoring & Apparel",
      icon: GraduationCap,
      color: "bg-amber-100 text-amber-700 border-amber-200",
      queryText: "Open tailoring and sewing course"
    },
    {
      id: "p-jobs",
      label: "💼 Job Opportunities",
      icon: Briefcase,
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      queryText: "Show local job opportunities"
    },
    {
      id: "p-pmajay",
      label: "💰 ₹35,000 Grant",
      icon: Sprout,
      color: "bg-rose-100 text-rose-700 border-rose-200",
      queryText: "Open PM-AJAY 35000 grant and schemes"
    },
    {
      id: "p-centers",
      label: "📍 Kalahandi Center",
      icon: MapPin,
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
      queryText: "Where is the nearest training center"
    },
    {
      id: "p-profile",
      label: "👤 Skills Passport",
      icon: User,
      color: "bg-teal-100 text-teal-700 border-teal-200",
      queryText: "Open my verified profile and passport"
    }
  ];

  /**
   * Initialize Web Speech API for voice command recognition
   */
  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: simulated speech input prompt
      setIsListening(true);
      setTranscript("Listening... (बोलिए, आपकी आवाज़ पहचानी जा रही है)");
      setTimeout(() => {
        setIsListening(false);
        handleExecuteCommand(
          currentLanguage === "or"
            ? "ମୋ ପାଇଁ ଇଲେକ୍ଟ୍ରିସିଆନ୍ କୋର୍ସ ଖୋଲନ୍ତୁ"
            : "इलेक्ट्रीशियन और सिलाई का कोर्स दिखाओ"
        );
      }, 2500);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      const langMap: Record<string, string> = {
        hi: "hi-IN",
        or: "or-IN",
        sat: "hi-IN",
        en: "en-IN",
        bho: "hi-IN",
        mr: "mr-IN",
        bn: "bn-IN",
        te: "te-IN"
      };

      recognition.lang = langMap[currentLanguage.toLowerCase()] || "hi-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("Listening... (बोलिए / କୁହନ୍ତୁ)");
      };

      recognition.onresult = (event: any) => {
        let current = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);

        if (event.results[0].isFinal) {
          setIsListening(false);
          handleExecuteCommand(current);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
        // If aborted or empty, keep gentle fallback
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn("Speech recognition failed to start:", e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  /**
   * Process and dispatch the voice navigation intent
   */
  const handleExecuteCommand = async (spokenUtterance: string) => {
    if (!spokenUtterance || !spokenUtterance.trim()) return;

    setIsProcessing(true);
    setTranscript(spokenUtterance);

    // 1. Fast local regex & Indic phonetic matcher
    let intent = parseVoiceNavigationIntent(spokenUtterance, currentLanguage);

    // 2. If not matched locally, fallback to conversational AI handler
    if (!intent) {
      try {
        const res = await fetch("/api/ai/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: spokenUtterance,
            language: currentLanguage,
            beneficiaryName: "Savitri Devi"
          })
        });
        const data = await res.json();
        if (data.replyText) {
          // If conversational answer, open Voice Assistant
          if (onOpenVoiceAssistant) {
            onOpenVoiceAssistant();
          }
          setIsProcessing(false);
          return;
        }
      } catch (err) {
        console.warn("Voice AI fallback error:", err);
      }
    }

    if (intent) {
      // Spoken Feedback in the user's active language
      const langKey = (currentLanguage || "hi").toLowerCase();
      const feedbackText =
        intent.spokenFeedback[langKey] ||
        intent.spokenFeedback.hi ||
        intent.spokenFeedback.en ||
        "Opening requested section.";

      setLastActionFeedback(intent.displayText);
      playVoiceNavigationConfirmation(feedbackText, currentLanguage);

      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = setTimeout(() => {
        setLastActionFeedback("");
      }, 5000);

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.2 },
        colors: ["#6B34EB", "#3B82F6", "#F59E0B"]
      });

      onNavigate(intent);
    } else {
      setLastActionFeedback("Command recognized. Opening Voice Assistant...");
      if (onOpenVoiceAssistant) {
        onOpenVoiceAssistant();
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* ========================================================================= */}
      {/* 1. UNIVERSAL VOICE NAVIGATION BAR (Sticky Glassmorphic Container)         */}
      {/* ========================================================================= */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl border border-[#EDE7D9] shadow-xs p-2.5 sm:p-3 transition-all hover:shadow-md">
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Interactive Voice Navigation Search & Live Speech Input */}
          <div className="flex-1 flex items-center gap-2.5 min-w-0">
            {/* Mic Activation Button with Glowing Waves */}
            <div className="relative shrink-0">
              {isListening && (
                <span className="absolute -inset-1.5 rounded-full bg-red-500/30 animate-ping"></span>
              )}
              {isProcessing && (
                <span className="absolute -inset-1.5 rounded-full bg-purple-500/30 animate-pulse"></span>
              )}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleToggleMic}
                className={`size-10 sm:size-11 rounded-2xl flex items-center justify-center text-white transition-all cursor-pointer shadow-sm ${
                  isListening
                    ? "bg-red-600 shadow-red-600/40 animate-pulse ring-2 ring-red-400"
                    : isProcessing
                    ? "bg-purple-700 shadow-purple-700/40"
                    : "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:shadow-purple-600/30 shadow-purple-600/20"
                }`}
                title="Tap to speak in Odia, Hindi, Santhali or English"
              >
                {isListening ? (
                  <Radio className="size-5 animate-spin" />
                ) : isProcessing ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Mic className="size-5" />
                )}
              </motion.button>
            </div>

            {/* Live Spoken Input / Search Hint / Action Banner */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full shrink-0">
                  Voice Navigation & Copilot
                </span>
                {lastActionFeedback && (
                  <span className="text-[11px] font-bold text-emerald-700 truncate animate-fadeIn">
                    ✓ {lastActionFeedback}
                  </span>
                )}
              </div>

              <div className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                {isListening ? (
                  <span className="text-red-600 font-bold animate-pulse">
                    🎙️ {transcript || "Listening... Speak your command in Odia / Hindi"}
                  </span>
                ) : isProcessing ? (
                  <span className="text-purple-700 font-bold flex items-center gap-1.5">
                    <Loader2 className="size-3 animate-spin" />
                    <span>Processing with Google Gemini AI...</span>
                  </span>
                ) : transcript ? (
                  <span className="text-slate-900 font-medium">&ldquo;{transcript}&rdquo;</span>
                ) : (
                  <span className="text-slate-500 font-normal">
                    बोलें या टैप करें: <span className="text-slate-700 font-bold">&ldquo;कोर्स दिखाओ&rdquo;</span>, <span className="text-slate-700 font-bold">&ldquo;नौकरियां&rdquo;</span>, <span className="text-slate-700 font-bold">&ldquo;₹35,000 अनुदान&rdquo;</span>, <span className="text-slate-700 font-bold">&ldquo;ଓଡ଼ିଆ ଭାଷା&rdquo;</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Toggle Prompt Chips / Open Copilot */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenVoiceAssistant && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenVoiceAssistant}
                className="hidden sm:flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-extrabold px-3 py-2 rounded-xl border border-purple-200/80 transition-colors cursor-pointer"
              >
                <Sparkles className="size-3.5 text-purple-600" />
                <span>AI Copilot</span>
              </motion.button>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer text-xs font-bold"
              title="Toggle Quick Voice Shortcuts"
            >
              <Compass className="size-4 text-purple-600" />
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. DUAL-ACCESS MANUAL & VOICE SHORTCUT CHIPS (Horizontal Scrollable)      */}
        {/* ========================================================================= */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="size-2.5 text-purple-600" />
            Quick Access:
          </span>

          {quickNavPrompts.map((prompt) => {
            const Icon = prompt.icon;
            return (
              <motion.button
                key={prompt.id}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleExecuteCommand(prompt.queryText)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${prompt.color}`}
              >
                <Icon className="size-3 shrink-0" />
                <span>{prompt.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
