"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  User,
  MapPin,
  Wrench,
  GraduationCap,
  Briefcase,
  ChevronRight,
  RotateCcw,
  Sparkle,
  Radio,
  VolumeX,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";
import confetti from "canvas-confetti";

export interface BeneficiaryProfileData {
  fullName: string;
  district: string;
  state: string;
  skills: string[];
  nsqfCode: string;
  nsqfLevel: number;
  nsqfCourse: string;
  education: string;
  aspiration: string;
  recommendedPathway: string;
  grantEligibility: string;
  matchScore: number;
}

interface PersonalVoiceOnboardingProps {
  onComplete: (profile: BeneficiaryProfileData) => void;
  onSkip?: () => void;
  initialLanguage?: string;
}

interface StepQuestion {
  id: "name_location" | "skills_experience" | "education" | "aspiration";
  title: string;
  subtitle: string;
  aiPromptText: {
    hi: string;
    or: string;
    sat?: string;
    en: string;
  };
  sampleChips: {
    label: string;
    spokenText: string;
  }[];
}

const ONBOARDING_QUESTIONS: StepQuestion[] = [
  {
    id: "name_location",
    title: "Step 1 of 4 • Name & Location",
    subtitle: "आपका नाम और जिला",
    aiPromptText: {
      hi: "नमस्ते! आपका नाम क्या है और आप किस गाँव या जिले से हैं?",
      or: "ନମସ୍କାର! ଆପଣଙ୍କ ନାମ କ’ଣ ଏବଂ ଆପଣ କେଉଁ ଜିଲ୍ଲାରୁ ଆସିଛନ୍ତି?",
      en: "Namaste! What is your name and which village or district are you from?"
    },
    sampleChips: [
      {
        label: "👤 Ramesh Soren (Sundargarh)",
        spokenText: "मेरा नाम रमेश सोरेन है और मैं सुंदरगढ़ जिले से हूँ।"
      },
      {
        label: "👤 Savitri Devi (Kalahandi)",
        spokenText: "मेरा नाम सावित्री देवी है, कालाहांडी ओडिशा से।"
      },
      {
        label: "👤 Amit Kumar (Varanasi)",
        spokenText: "मेरा नाम अमित कुमार है, वाराणसी उत्तर प्रदेश।"
      }
    ]
  },
  {
    id: "skills_experience",
    title: "Step 2 of 4 • Daily Skills & Trade",
    subtitle: "आपका हुनर और दैनिक काम",
    aiPromptText: {
      hi: "आप वर्तमान में क्या काम करते हैं या आपको किस काम का अनुभव है? जैसे खेती, मोटर रिपेयर, सिलाई या बिजली का काम।",
      or: "ଆପଣ କେଉଁ କାମ କରନ୍ତି କିମ୍ବା ଆପଣଙ୍କର କେଉଁଥିରେ ଅଭିଜ୍ଞତା ଅଛି?",
      en: "What informal work, trade, or practical skills do you have experience in?"
    },
    sampleChips: [
      {
        label: "⚡ Motor & Agri-Pump Repair",
        spokenText: "खेती करता हूँ और थोड़ा बहुत मोटर और पानी का पंप भी ठीक कर लेता हूँ।"
      },
      {
        label: "✂️ Tailoring & Garment Stitching",
        spokenText: "घर पर सिलाई मशीन चलाती हूँ और कपड़े सिलती हूँ।"
      },
      {
        label: "🔌 Domestic Electrician",
        spokenText: "गांव में घरों की वायरिंग और पंखा-मोटर रिपेयर करता हूँ।"
      }
    ]
  },
  {
    id: "education",
    title: "Step 3 of 4 • Education Level",
    subtitle: "आपकी पढ़ाई व साक्षरता",
    aiPromptText: {
      hi: "आपकी पढ़ाई कहाँ तक हुई है? जैसे 8वीं, 10वीं पास, आईटीआई या साक्षर?",
      or: "ଆପଣ କେତେ ପାଠ ପଢ଼ିଛନ୍ତି?",
      en: "What is your education qualification or literacy level?"
    },
    sampleChips: [
      {
        label: "📜 10th Standard (10वीं पास)",
        spokenText: "मैंने 10वीं तक की पढ़ाई पूरी की है।"
      },
      {
        label: "📜 8th Standard (8वीं पास)",
        spokenText: "8वीं पास हूँ और प्रैक्टिकल काम में रुचि है।"
      },
      {
        label: "📜 Non-Formal Literate (साक्षर)",
        spokenText: "स्कूल कम गया हूँ लेकिन पढ़-लिख लेता हूँ और काम जानता हूँ।"
      }
    ]
  },
  {
    id: "aspiration",
    title: "Step 4 of 4 • Livelihood Goal & Grants",
    subtitle: "आपका आजीविका लक्ष्य",
    aiPromptText: {
      hi: "आप आगे क्या करना चाहते हैं? तुरंत कमाई वाली नौकरी, अपना काम शुरू करना या नई स्किल सीखना?",
      or: "ଆପଣ ଆଗକୁ କ’ଣ କରିବାକୁ ଚାହାଁନ୍ତି?",
      en: "What is your primary livelihood goal under PM-AJAY?"
    },
    sampleChips: [
      {
        label: "🌱 Village Solar & Agri-Repair Hub (PM-AJAY Grant)",
        spokenText: "पीएम-अजय योजना से अपनी खुद की मोटर व सोलर रिपेयर दुकान शुरू करना चाहता हूँ।"
      },
      {
        label: "⚡ Fast Income Job (35-Day Certification)",
        spokenText: "जल्दी कमाई वाली नौकरी चाहिए जो गांव के नजदीक हो।"
      },
      {
        label: "🚀 Advanced Apprenticeship",
        spokenText: "इंडस्ट्रियल मोटर और सोलर का बड़ा काम सीखना है।"
      }
    ]
  }
];

export function PersonalVoiceOnboarding({
  onComplete,
  onSkip,
  initialLanguage = "hi"
}: PersonalVoiceOnboardingProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [language, setLanguage] = useState<"hi" | "or" | "sat" | "en">(
    (initialLanguage as any) || "hi"
  );
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>("");
  const [relevanceStatus, setRelevanceStatus] = useState<"idle" | "relevant" | "irrelevant">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Extracted Beneficiary Passport State
  const [profile, setProfile] = useState<BeneficiaryProfileData>({
    fullName: "Ramesh Soren",
    district: "Sundargarh",
    state: "Odisha",
    skills: ["Submersible Pump Diagnostics", "Motor Wiring & Repair"],
    nsqfCode: "ELE/Q5901",
    nsqfLevel: 4,
    nsqfCourse: "Solar PV Agri-Pump Specialist",
    education: "10th Standard",
    aspiration: "Village Agri-Pump & Solar Repair Clinic",
    recommendedPathway: "PM-AJAY Micro-Enterprise Hub",
    grantEligibility: "₹35,000 Capital Subsidy + ₹3,500/mo Stipend",
    matchScore: 94
  });

  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const latestTranscriptRef = useRef<string>("");
  const audioRequestIdRef = useRef<number>(0);

  const currentStep = ONBOARDING_QUESTIONS[currentStepIndex];

  // Speak initial question on step change
  useEffect(() => {
    if (!isFinished) {
      const qText =
        currentStep.aiPromptText[language] || currentStep.aiPromptText.hi;
      playAiVoice(qText);
      setSpokenTranscript("");
      latestTranscriptRef.current = "";
      setRelevanceStatus("idle");
      setFeedbackMessage("");
    }
  }, [currentStepIndex, language, isFinished]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAudioPlayback();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch { }
      }
    };
  }, []);

  const stopAudioPlayback = () => {
    audioRequestIdRef.current++;
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = "";
        audioPlayerRef.current.onended = null;
        audioPlayerRef.current.onerror = null;
        audioPlayerRef.current.load();
      } catch { }
      audioPlayerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch { }
    }
    setIsAiSpeaking(false);
  };

  /**
   * Speak AI text out loud using Google & Gemini TTS with browser SpeechSynthesis fallback
   */
  const playAiVoice = async (text: string) => {
    stopAudioPlayback();
    const myReqId = ++audioRequestIdRef.current;
    setIsAiSpeaking(true);

    const clean = text.replace(/[*_#`]/g, "").trim();

    // 1. Try Gemini & Google TTS API for natural Indic voice
    try {
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean, language })
      });

      if (myReqId !== audioRequestIdRef.current) return;

      if (res.ok) {
        const data = await res.json();
        if (myReqId !== audioRequestIdRef.current) return;
        if (data.audioUrl) {
          const audio = new Audio(data.audioUrl);
          audioPlayerRef.current = audio;
          audio.onended = () => {
            if (myReqId === audioRequestIdRef.current) {
              audioPlayerRef.current = null;
              setIsAiSpeaking(false);
            }
          };
          audio.onerror = () => {
            if (myReqId === audioRequestIdRef.current) {
              audioPlayerRef.current = null;
              playAiVoiceBrowserFallback(clean, myReqId);
            }
          };
          await audio.play();
          return;
        }
      }
    } catch {
      // Fall through to browser synthesis
    }

    if (myReqId === audioRequestIdRef.current) {
      playAiVoiceBrowserFallback(clean, myReqId);
    }
  };

  const playAiVoiceBrowserFallback = (clean: string, reqId: number) => {
    if (reqId !== audioRequestIdRef.current) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = language === "hi" ? "hi-IN" : language === "or" ? "hi-IN" : "en-IN";
        utterance.rate = 0.95;
        utterance.onend = () => {
          if (reqId === audioRequestIdRef.current) {
            setIsAiSpeaking(false);
          }
        };
        utterance.onerror = () => {
          if (reqId === audioRequestIdRef.current) {
            setIsAiSpeaking(false);
          }
        };
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("SpeechSynthesis error:", err);
        if (reqId === audioRequestIdRef.current) {
          setIsAiSpeaking(false);
        }
      }
    } else {
      if (reqId === audioRequestIdRef.current) {
        setIsAiSpeaking(false);
      }
    }
  };

  /**
   * Start live microphone speech recognition
   */
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch { }
      }
      setIsListening(false);
      return;
    }

    stopAudioPlayback();
    setIsListening(true);
    setSpokenTranscript("");
    latestTranscriptRef.current = "";

    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === "hi" ? "hi-IN" : language === "or" ? "or-IN" : "en-IN";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSpokenTranscript(transcript);
        latestTranscriptRef.current = transcript;
      };

      recognition.onend = () => {
        setIsListening(false);
        const finalUtterance = latestTranscriptRef.current;
        if (finalUtterance && finalUtterance.trim().length > 0) {
          evaluateSpokenAnswer(finalUtterance.trim());
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
        const finalUtterance = latestTranscriptRef.current;
        if (finalUtterance && finalUtterance.trim().length > 0) {
          evaluateSpokenAnswer(finalUtterance.trim());
        }
      };

      try {
        recognition.start();
      } catch (e) {
        console.warn("Speech recognition start failed:", e);
        setIsListening(false);
      }
    } else {
      // Fallback for browsers without Web Speech API
      setTimeout(() => {
        setIsListening(false);
        const fallbackUtterance = currentStep.sampleChips[0].spokenText;
        setSpokenTranscript(fallbackUtterance);
        latestTranscriptRef.current = fallbackUtterance;
        evaluateSpokenAnswer(fallbackUtterance);
      }, 2500);
    }
  };

  /**
   * Process and evaluate spoken utterance against the current question
   */
  const evaluateSpokenAnswer = async (spokenText: string) => {
    if (!spokenText || spokenText.trim().length === 0) return;
    setIsEvaluating(true);

    try {
      const res = await fetch("/api/ai/onboarding-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: currentStep.id,
          userSpokenText: spokenText,
          language: language,
          currentProfile: profile
        })
      });

      const data = await res.json();

      if (data.isRelevant) {
        setRelevanceStatus("relevant");
        setFeedbackMessage(data.feedbackText || "जानकारी सफलतापूर्वक दर्ज हो गई है!");

        // Agentically update personal passport profile
        setProfile((prev) => {
          const updated = { ...prev, ...data.extractedData };
          return updated;
        });

        // Speak acknowledgment
        if (data.feedbackText) {
          playAiVoice(data.feedbackText);
        }

        // Auto progress to next step after brief celebration animation
        setTimeout(() => {
          if (currentStepIndex < ONBOARDING_QUESTIONS.length - 1) {
            setCurrentStepIndex((prev) => prev + 1);
          } else {
            handleCompleteOnboarding();
          }
        }, 2200);
      } else {
        // Not relevant: prompt kindly
        setRelevanceStatus("irrelevant");
        const guidance =
          data.feedbackText ||
          "कृपया अपने काम या विवरण से संबंधित बात बोलें।";
        setFeedbackMessage(guidance);
        playAiVoice(guidance);
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      // Fallback: proceed gracefully
      setRelevanceStatus("relevant");
      setTimeout(() => {
        if (currentStepIndex < ONBOARDING_QUESTIONS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          handleCompleteOnboarding();
        }
      }, 1500);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSelectSampleChip = (chip: { label: string; spokenText: string }) => {
    setSpokenTranscript(chip.spokenText);
    evaluateSpokenAnswer(chip.spokenText);
  };

  const handleCompleteOnboarding = () => {
    setIsFinished(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] text-slate-900 select-none overflow-x-hidden">
      {/* Background Cloud Mist */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-6 -left-10 w-52 h-24 bg-white/70 rounded-full blur-2xl animate-float" />
        <div className="absolute top-28 -right-10 w-60 h-28 bg-purple-100/60 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-12 left-1/4 w-64 h-24 bg-amber-100/70 rounded-full blur-2xl" />
      </div>

      {/* Top Header Bar */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-6 pt-3 pb-2 relative z-50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight font-heading">
              Personal Voice Onboarding
            </span>
            <span className="text-[10px] font-bold text-purple-700">
              PM-AJAY AI Livelihood Profiler
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-50">
          <LanguageSelector
            variant="icon"
            onLanguageChange={(code) => setLanguage((code as any) || "hi")}
          />
          {onSkip && (
            <button
              onClick={onSkip}
              type="button"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2.5 py-1 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200/60 cursor-pointer"
            >
              Skip
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-between px-4 sm:px-6 py-2 z-10">
        {!isFinished ? (
          <div className="flex-1 flex flex-col justify-between space-y-4">
            {/* Step Progress Pills */}
            <div className="w-full space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>{currentStep.title}</span>
                <span className="text-purple-700 font-extrabold">
                  {Math.round(((currentStepIndex + 1) / ONBOARDING_QUESTIONS.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden flex">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${((currentStepIndex + 1) / ONBOARDING_QUESTIONS.length) * 100}%`
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              </div>
            </div>

            {/* AI Assistant Question Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-lg border border-purple-100 space-y-3">
              <div className="flex items-start gap-3">
                {/* Pulsating Voice Bot Emblem */}
                <div className="relative shrink-0 mt-0.5">
                  <div
                    className={`size-11 sm:size-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-md ${isAiSpeaking ? "ring-4 ring-purple-300 animate-pulse" : ""
                      }`}
                  >
                    <Sparkles className="size-5" />
                  </div>
                  {isAiSpeaking && (
                    <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-purple-600"></span>
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      Saksham-AI Voice Copilot
                    </span>
                    <button
                      onClick={() =>
                        playAiVoice(
                          currentStep.aiPromptText[language] || currentStep.aiPromptText.hi
                        )
                      }
                      type="button"
                      className="text-purple-600 hover:text-purple-800 p-1 rounded-lg hover:bg-purple-50 cursor-pointer"
                      title="Replay audio question"
                    >
                      <Volume2 className="size-4" />
                    </button>
                  </div>

                  {/* The Main Spoken Question */}
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 font-heading leading-snug">
                    {currentStep.aiPromptText[language] || currentStep.aiPromptText.hi}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {currentStep.subtitle} • {currentStep.aiPromptText.en}
                  </p>
                </div>
              </div>

              {/* Relevance Feedback Banner (if evaluated) */}
              <AnimatePresence>
                {relevanceStatus === "irrelevant" && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-xs text-amber-900"
                  >
                    <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold block">अपूर्ण या असंबंधित उत्तर (Irrelevant Response)</span>
                      <span className="text-amber-800">{feedbackMessage}</span>
                    </div>
                  </motion.div>
                )}

                {relevanceStatus === "relevant" && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-bold"
                  >
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>{feedbackMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Middle Section: Spoken Transcript & Live Passport Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
              {/* Spoken Live Transcript Box */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Radio className={`size-3.5 ${isListening ? "text-red-500 animate-pulse" : "text-slate-400"}`} />
                    <span>{isListening ? "Listening to your voice..." : "Your Spoken Response:"}</span>
                  </span>
                  {isEvaluating && (
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                      <Sparkle className="size-3" />
                      Checking Relevance & Extracting...
                    </span>
                  )}
                </div>

                <div className="min-h-[64px] p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-800 flex items-center">
                  {spokenTranscript ? (
                    <p className="italic font-semibold text-slate-900">"{spokenTranscript}"</p>
                  ) : (
                    <p className="text-slate-400">
                      माइक बटन दबाकर बोलें, या नीचे दिए गए विकल्पों में से चुनें...
                    </p>
                  )}
                </div>

                {/* Quick Spoken Chips for 1-Tap Voice Simulation */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Or Tap to Speak (त्वरित उदाहरण):
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {currentStep.sampleChips.map((chip, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.01, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectSampleChip(chip)}
                        type="button"
                        className="text-left p-2 rounded-xl bg-purple-50/60 hover:bg-purple-100/80 border border-purple-200/70 text-xs text-slate-800 font-semibold transition-all cursor-pointer flex items-center justify-between"
                      >
                        <span className="line-clamp-1">{chip.label}</span>
                        <ChevronRight className="size-3.5 text-purple-600 shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Agentic Live Passport Card Preview */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-4.5 shadow-xl border border-purple-800/40 space-y-3">
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-400" />
                    <span className="text-xs font-extrabold tracking-wide uppercase font-heading">
                      PM-AJAY Livelihood Passport
                    </span>
                  </div>
                  <Badge variant="purple" className="text-[9px] bg-purple-500/30 border-purple-400/40">
                    Live Auto-Fill
                  </Badge>
                </div>

                {/* Extracted Fields Matrix */}
                <div className="space-y-2 text-xs">
                  {/* Name & Location */}
                  <div className="flex items-center justify-between bg-white/10 p-2 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <User className="size-3.5 text-purple-300 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-purple-200 block">Candidate Name</span>
                        <span className="font-extrabold text-white truncate block">
                          {profile.fullName || "—"} ({profile.district || "Sundargarh"})
                        </span>
                      </div>
                    </div>
                    {currentStepIndex >= 0 && (
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    )}
                  </div>

                  {/* Skills & NSQF */}
                  <div className="flex items-center justify-between bg-white/10 p-2 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <Wrench className="size-3.5 text-amber-300 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-amber-200 block">NSQF Skill Alignment</span>
                        <span className="font-extrabold text-white truncate block">
                          {profile.nsqfCourse} ({profile.nsqfCode})
                        </span>
                      </div>
                    </div>
                    {currentStepIndex >= 1 && (
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    )}
                  </div>

                  {/* Education */}
                  <div className="flex items-center justify-between bg-white/10 p-2 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <GraduationCap className="size-3.5 text-blue-300 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-blue-200 block">Qualification</span>
                        <span className="font-extrabold text-white truncate block">
                          {profile.education}
                        </span>
                      </div>
                    </div>
                    {currentStepIndex >= 2 && (
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    )}
                  </div>

                  {/* Livelihood Grant & Pathway */}
                  <div className="flex items-center justify-between bg-white/10 p-2 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <Briefcase className="size-3.5 text-emerald-300 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-emerald-200 block">PM-AJAY Capital Support</span>
                        <span className="font-extrabold text-white truncate block">
                          {profile.grantEligibility}
                        </span>
                      </div>
                    </div>
                    {currentStepIndex >= 3 && (
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Giant Microphone Action Center */}
            <div className="w-full flex flex-col items-center justify-center pt-2 pb-1 space-y-2">
              <div className="relative">
                {isListening && (
                  <div className="absolute -inset-4 rounded-full bg-purple-600/30 animate-ping" />
                )}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={toggleListening}
                  type="button"
                  aria-label="Tap to speak"
                  className={`size-16 sm:size-18 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer ${isListening
                      ? "bg-gradient-to-r from-red-500 to-rose-600 scale-105"
                      : "bg-gradient-to-r from-[#6B34EB] via-[#7539F4] to-[#8042F6] hover:from-[#5E2DD8] hover:to-[#7335EC]"
                    }`}
                >
                  {isListening ? (
                    <MicOff className="size-8 animate-pulse" />
                  ) : (
                    <Mic className="size-8" />
                  )}
                </motion.button>
              </div>

              <span className="text-xs font-extrabold text-slate-800">
                {isListening ? "Listening... (बोलिए, हम सुन रहे हैं)" : "Tap Mic to Speak (माइक दबाकर बोलें)"}
              </span>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* COMPLETION CELEBRATION & ISSUED PASSPORT VIEW                             */
          /* ========================================================================= */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-4"
          >
            <div className="size-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="size-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Livelihood Passport Issued
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                बधाई हो, {profile.fullName}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                आपकी प्रोफाइल और हुनर के आधार पर पीएम-अजय कौशल व स्वरोजगार मार्ग तैयार है।
              </p>
            </div>

            {/* Issued Livelihood Card */}
            <div className="w-full max-w-md bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-5 shadow-2xl border border-purple-500/40 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-white/20 pb-2.5">
                <div>
                  <span className="text-base font-extrabold block font-heading">{profile.fullName}</span>
                  <span className="text-[10px] text-purple-200">
                    ID: PMAJAY-OR-SUN-2026-8941 • {profile.district}, {profile.state}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-amber-300 block">Fit Match</span>
                  <span className="text-sm font-extrabold text-emerald-400">94%</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300">Mapped Skill:</span>
                  <span className="font-extrabold text-white">{profile.nsqfCourse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">NSQF Level:</span>
                  <span className="font-bold text-purple-200">Level {profile.nsqfLevel} ({profile.nsqfCode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Grant Support:</span>
                  <span className="font-extrabold text-emerald-400">{profile.grantEligibility}</span>
                </div>
              </div>
            </div>

            {/* Action CTA to Enter Beneficiary Experience */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onComplete(profile)}
              type="button"
              className="w-full max-w-md h-13 rounded-full bg-gradient-to-r from-[#6B34EB] via-[#7539F4] to-[#8042F6] hover:from-[#5E2DD8] hover:to-[#7335EC] text-white text-base font-bold shadow-xl shadow-purple-600/35 flex items-center justify-center gap-2 cursor-pointer border border-purple-400/20"
            >
              <span>Enter My Beneficiary Dashboard</span>
              <ArrowRight className="size-5" />
            </motion.button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
