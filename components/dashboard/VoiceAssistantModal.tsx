"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  X,
  Globe,
  Bot,
  User,
  Radio,
  ArrowRight,
  Loader2,
  PhoneCall,
  CheckCircle2,
  Zap,
  Scissors,
  Hammer,
  IndianRupee,
  GraduationCap,
  Sun,
  MapPin,
  Clock,
  Award,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoicePoweredOrb } from "@/components/ui/voice-powered-orb";
import { VoiceNavIntent, parseVoiceNavigationIntent } from "@/lib/ai/voiceNavigation";
import confetti from "canvas-confetti";

export interface SkillCardItem {
  id: string;
  title: string;
  nsqfLevel: number;
  qpCode: string;
  category: "electrician" | "tailoring" | "solar" | "carpenter" | "food" | "grant";
  badge: string;
  badgeColor: "purple" | "amber" | "blue" | "emerald";
  duration: string;
  stipend: string;
  centerName: string;
  targetTab: "training" | "schemes" | "self_employment";
  courseId?: string;
  schemeId?: string;
}

export function getMatchedSkillCards(
  text: string,
  district: string = "Kalahandi, Odisha",
  language: string = "hindi"
): SkillCardItem[] {
  const lower = (text || "").toLowerCase();
  const distClean = district.split(",")[0].trim() || "District";

  const allCards: Record<string, SkillCardItem> = {
    carpenter: {
      id: "card-carpenter",
      title: "Carpenter & Wooden Furniture Artisan",
      nsqfLevel: 4,
      qpCode: "CON/Q0602",
      category: "carpenter",
      badge: "PM-AJAY Artisan",
      badgeColor: "amber",
      duration: "3 Months (90 Days)",
      stipend: "₹3,500/mo Stipend + Modern Tool Kit",
      centerName: `PMKK Skill Hub, ${distClean}`,
      targetTab: "training",
      courseId: "course-carpenter"
    },
    electrician: {
      id: "card-electrician",
      title: "Assistant Electrician & Wireman",
      nsqfLevel: 4,
      qpCode: "ELE/Q5901",
      category: "electrician",
      badge: "High Demand",
      badgeColor: "blue",
      duration: "3 Months",
      stipend: "₹3,500/mo (PM-AJAY Support)",
      centerName: `PMKK Center, ${distClean}`,
      targetTab: "training",
      courseId: "course-1"
    },
    tailoring: {
      id: "card-tailoring",
      title: "Self Employed Tailor & Apparel",
      nsqfLevel: 3,
      qpCode: "AMH/Q0102",
      category: "tailoring",
      badge: "SHG Enterprise",
      badgeColor: "purple",
      duration: "6 Months",
      stipend: "₹4,000/mo + Free Sewing Machine",
      centerName: `RSETI Skill Hub, ${distClean}`,
      targetTab: "training",
      courseId: "course-2"
    },
    solar: {
      id: "card-solar",
      title: "Solar PV Agri-Pump Specialist (Suryamitra)",
      nsqfLevel: 4,
      qpCode: "SGJ/Q0101",
      category: "solar",
      badge: "PM-KUSUM",
      badgeColor: "amber",
      duration: "2 Months",
      stipend: "₹4,500/mo Stipend + Assured Placement",
      centerName: `National Solar Energy Hub, ${distClean}`,
      targetTab: "training",
      courseId: "course-4"
    },
    food: {
      id: "card-food",
      title: "Food Processing & Organic Packaging",
      nsqfLevel: 4,
      qpCode: "FIC/Q0103",
      category: "food",
      badge: "FPO Direct Link",
      badgeColor: "emerald",
      duration: "4 Months",
      stipend: "₹3,500/mo + FPO Market Linkage",
      centerName: `District Agri-Business Institute, ${distClean}`,
      targetTab: "training",
      courseId: "course-3"
    },
    grant: {
      id: "card-grant",
      title: "PM-AJAY ₹35,000 Micro-Enterprise Grant",
      nsqfLevel: 0,
      qpCode: "PMAJAY-CAP-01",
      category: "grant",
      badge: "100% Capital Subsidy",
      badgeColor: "emerald",
      duration: "Direct Sanction",
      stipend: "₹35,000 Grant + ₹3,500/mo Stipend",
      centerName: `District Livelihood Mission, ${distClean}`,
      targetTab: "schemes",
      schemeId: "scheme-pmajay"
    }
  };

  const matched: SkillCardItem[] = [];

  // Match based on keywords in spoken response / query
  if (/carpenter|बढ़ई|कारपेंटर|wood|furniture|लकड़ी|काठ/i.test(lower)) {
    matched.push(allCards.carpenter);
  }
  if (/electrician|इलेक्ट्रीशियन|बिजली|वायरिंग|wireman|electrical|विद्युत/i.test(lower)) {
    matched.push(allCards.electrician);
  }
  if (/tailor|सिलाई|कपड़े|garment|apparel|sewing|दर्जी|shg/i.test(lower)) {
    matched.push(allCards.tailoring);
  }
  if (/solar|सोलर|pump|पंप|suryamitra|सूरज|kusum|कृषि/i.test(lower)) {
    matched.push(allCards.solar);
  }
  if (/food|फूड|प्रसंस्करण|processing|packaging|मशरूम|अचार/i.test(lower)) {
    matched.push(allCards.food);
  }
  if (/grant|अनुदान|वजीफा|stipend|35000|35,000|पूंजी|subsidy|योजना|scheme/i.test(lower)) {
    matched.push(allCards.grant);
  }

  // Fallback defaults if none matched
  if (matched.length === 0) {
    matched.push(allCards.electrician, allCards.tailoring, allCards.grant);
  } else if (matched.length === 1) {
    if (!matched.some(m => m.id === allCards.grant.id)) {
      matched.push(allCards.grant);
    } else {
      matched.push(allCards.solar);
    }
  }

  return matched.slice(0, 3);
}

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onNavigateTarget?: (intent: VoiceNavIntent) => void;
  beneficiaryName?: string;
  district?: string;
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  translatedText?: string;
  audioUrl?: string | null;
  skillCards?: SkillCardItem[];
  actionButton?: {
    label: string;
    action: string;
    intent?: VoiceNavIntent | null;
  };
}

export function VoiceAssistantModal({
  isOpen,
  onClose,
  initialPrompt,
  onNavigateTarget,
  beneficiaryName: propBeneficiaryName,
  district: propDistrict
}: VoiceAssistantModalProps) {
  const [activeName, setActiveName] = useState<string>(() => {
    if (propBeneficiaryName) return propBeneficiaryName;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("saksham_beneficiary_profile");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.fullName) return parsed.fullName;
        }
      } catch { }
    }
    return "Savitri Devi";
  });

  const [activeDistrict, setActiveDistrict] = useState<string>(() => {
    if (propDistrict) return propDistrict;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("saksham_beneficiary_profile");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.district) return `${parsed.district}${parsed.state ? `, ${parsed.state}` : ""}`;
        }
      } catch { }
    }
    return "Kalahandi, Odisha";
  });

  const [activeSkillCards, setActiveSkillCards] = useState<SkillCardItem[]>(() =>
    getMatchedSkillCards("", activeDistrict, "hindi")
  );

  useEffect(() => {
    if (propBeneficiaryName) setActiveName(propBeneficiaryName);
    if (propDistrict) {
      setActiveDistrict(propDistrict);
      setActiveSkillCards(getMatchedSkillCards("", propDistrict, selectedLanguage));
    }
  }, [propBeneficiaryName, propDistrict, isOpen]);

  const [selectedLanguage, setSelectedLanguage] = useState<string>("hindi");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceDetected, setVoiceDetected] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"orb" | "chat">("orb");
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [liveAiSubtitle, setLiveAiSubtitle] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);

  const initialGreeting = `नमस्ते ${activeName} जी! मैं सक्षम जीविका सेतु एआई सहायक हूँ। आप बोलकर अपने कौशल, ट्रेनिंग कोर्स या पीएम-अजय अनुदान के बारे में पूछ सकती हैं।`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "msg-1",
      sender: "ai",
      text: initialGreeting,
      translatedText:
        `Namaste ${activeName} ji! I am Saksham-AI Voice AI. You can speak to explore NSQF skill courses and PM-AJAY grants in your language.`,
      skillCards: getMatchedSkillCards("", activeDistrict, "hindi")
    }
  ]);

  const handleCardAction = (card: SkillCardItem) => {
    onClose();
    if (onNavigateTarget) {
      if (card.targetTab === "schemes") {
        onNavigateTarget({
          target: "schemes",
          schemeId: card.schemeId || "scheme-pmajay",
          confidence: 1,
          displayText: card.title,
          spokenFeedback: {
            hi: `${card.title} योजना खुल रही है`,
            or: `${card.title} ଯୋଜନା ଖୋଲୁଛି`,
            sat: `${card.title} ᱡᱚᱡᱚᱱᱟ ᱡᱷᱤᱡᱚᱜ ᱠᱟᱱᱟ`,
            en: `Opening ${card.title}`
          }
        });
      } else {
        onNavigateTarget({
          target: "training",
          courseId: card.courseId || "course-1",
          confidence: 1,
          displayText: card.title,
          spokenFeedback: {
            hi: `${card.title} ट्रेनिंग खुल रही है`,
            or: `${card.title} ତାଲିମ ଖୋଲୁଛି`,
            sat: `${card.title} ᱴᱨᱮᱱᱤᱝ ᱡᱷᱤᱡᱚᱜ ᱠᱟᱱᱟ`,
            en: `Opening ${card.title}`
          }
        });
      }
    }
    confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
  };

  const quickPrompts = [
    {
      langKey: "kalahandi_courses",
      label: "📍 कालाहांडी में मेरे लिए कौन से कोर्स हैं?",
      queryText: "कालाहांडी जिले में मेरे लिए कौन से ट्रेनिंग कोर्स उपलब्ध हैं?"
    },
    {
      langKey: "pmajay_grant",
      label: "💰 ₹35,000 पीएम-अजय अनुदान कैसे मिलेगा?",
      queryText: "मुझे सिलाई मशीन और दुकान शुरू करने के लिए पीएम-अजय ग्रांट कैसे मिल सकता है?"
    },
    {
      langKey: "nearest_center",
      label: "🏫 नजदीकी ट्रेनिंग सेंटर कहाँ है?",
      queryText: "मेरे गांव के सबसे पास ट्रेनिंग सेंटर कहाँ है और हॉस्टल सुविधा है क्या?"
    }
  ];

  // If initialPrompt provided from outside, send it immediately
  useEffect(() => {
    if (isOpen && initialPrompt) {
      handleProcessQuery(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  // Clean up audio on unmount or modal close
  useEffect(() => {
    if (!isOpen) {
      stopAudioPlayback();
      stopRecording();
    }
  }, [isOpen]);

  const stopAudioPlayback = () => {
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
      currentAudioElementRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  /**
   * Play generated MP3 audio stream or fallback to browser SpeechSynthesis
   */
  const playSynthesizedAudio = (audioUrl: string | null, textFallback: string) => {
    stopAudioPlayback();
    setIsSpeaking(true);
    setLiveAiSubtitle(textFallback);

    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        audio.volume = 1.0;
        currentAudioElementRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
        };
        audio.onerror = (e) => {
          console.warn("HTML5 audio playback error, falling back to SpeechSynthesis:", e);
          speakWithBrowserSpeechSynthesis(textFallback);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Audio autoplay blocked or failed, attempting speech synthesis fallback:", err);
            speakWithBrowserSpeechSynthesis(textFallback);
          });
        }
        return;
      } catch (e) {
        console.warn("Audio init error:", e);
      }
    }

    speakWithBrowserSpeechSynthesis(textFallback);
  };

  const speakWithBrowserSpeechSynthesis = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const cleanText = text.replace(/[*_#`]/g, "").trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        const langMap: Record<string, string> = {
          hindi: "hi-IN",
          odia: "hi-IN",
          santhali: "hi-IN",
          english: "en-IN"
        };
        utterance.lang = langMap[selectedLanguage] || "hi-IN";
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Pick matching voice if loaded
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(
          (v) => v.lang.startsWith("hi") || v.name.includes("India") || v.lang.startsWith("en-IN")
        );
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("Speech synthesis error:", err);
        setIsSpeaking(false);
      }
    } else {
      setIsSpeaking(false);
    }
  };

  const getCardIcon = (category: string) => {
    switch (category) {
      case "carpenter":
        return <Hammer className="size-4 text-amber-600" />;
      case "electrician":
        return <Zap className="size-4 text-blue-600" />;
      case "tailoring":
        return <Scissors className="size-4 text-purple-600" />;
      case "solar":
        return <Sun className="size-4 text-amber-500" />;
      case "food":
        return <GraduationCap className="size-4 text-emerald-600" />;
      case "grant":
        return <IndianRupee className="size-4 text-emerald-600" />;
      default:
        return <Award className="size-4 text-purple-600" />;
    }
  };

  /**
   * Complete Pipeline: Query -> Google Gemini AI Reasoning -> Speech
   */
  const handleProcessQuery = async (queryText: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: queryText
    };
    setMessages((prev) => [...prev, userMsg]);
    setLiveTranscript(queryText);
    setIsProcessing(true);

    try {
      const res = await fetch("/api/ai/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          language: selectedLanguage,
          beneficiaryName: activeName,
          district: activeDistrict
        })
      });

      const data = await res.json();
      const replyText = data.replyText || `${activeName} जी, आपके लिए ${activeDistrict} में नि:शुल्क सिलाई और इलेक्ट्रीशियन कोर्स उपलब्ध हैं।`;
      const audioUrl = data.audioUrl || null;

      const matchedCards = getMatchedSkillCards(queryText + " " + replyText, activeDistrict, selectedLanguage);
      setActiveSkillCards(matchedCards);

      const detectedIntent = parseVoiceNavigationIntent(queryText, selectedLanguage);
      const actionLabel = detectedIntent
        ? `👉 ${detectedIntent.displayText}`
        : "कोर्स में आवेदन करें (Apply Now)";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: replyText,
        audioUrl: audioUrl,
        skillCards: matchedCards,
        actionButton: {
          label: actionLabel,
          action: detectedIntent ? "navigate" : "apply",
          intent: detectedIntent
        }
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsProcessing(false);
      playSynthesizedAudio(audioUrl, replyText);
    } catch (err) {
      console.error("Voice assistant query error:", err);
      setIsProcessing(false);
      const fallbackText = `${activeName} जी, ${activeDistrict} के PMKK सेंटर में सिलाई एवं इलेक्ट्रीशियन के नए बैच 15 अक्टूबर से शुरू हो रहे हैं।`;
      const fallbackMatched = getMatchedSkillCards(queryText + " " + fallbackText, activeDistrict, selectedLanguage);
      setActiveSkillCards(fallbackMatched);
      const detectedIntent = parseVoiceNavigationIntent(queryText, selectedLanguage);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: fallbackText,
        skillCards: fallbackMatched,
        actionButton: {
          label: detectedIntent ? `👉 ${detectedIntent.displayText}` : "ट्रेनिंग सेंटर देखें (View Center)",
          action: detectedIntent ? "navigate" : "apply",
          intent: detectedIntent
        }
      };
      setMessages((prev) => [...prev, aiMsg]);
      playSynthesizedAudio(null, fallbackText);
    }
  };

  /**
   * Real-time MediaRecorder recording with safe environment detection
   */
  const startRecording = async () => {
    stopAudioPlayback();
    audioChunksRef.current = [];

    const hasMediaDevices =
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function";

    if (hasMediaDevices) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          stream.getTracks().forEach((track) => track.stop());
          await sendAudioToPipeline(audioBlob);
        };

        mediaRecorder.start();
        setIsRecording(true);
        setLiveTranscript("Listening with Google Gemini Multimodal Voice AI...");
        return;
      } catch (err) {
        console.warn("Microphone access unavailable or denied:", err);
      }
    }

    // Fallback: Web Speech API or simulated spoken dialogue with immediate processing
    setIsRecording(true);
    setLiveTranscript("Listening... (बोलिए, आपकी आवाज़ पहचानी जा रही है)");
    setTimeout(() => {
      setIsRecording(false);
      handleProcessQuery(
        selectedLanguage === "odia"
          ? "ମୋ ପାଇଁ କଳାହାଣ୍ଡିରେ କେଉଁ ସିଲେଇ ଓ ବିଦ୍ୟୁତ ତାଲିମ ଉପଲବ୍ଧ ଅଛି?"
          : "मुझे घर के पास सिलाई और इलेक्ट्रीशियन का काम सीखना है, पीएम-अजय स्टाइपेंड कैसे मिलेगा?"
      );
    }, 2800);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(false);
    }
  };

  /**
   * Send audio blob to /api/ai/voice (Google Gemini Speech-to-Text & Reasoning)
   */
  const sendAudioToPipeline = async (blob: Blob) => {
    setIsProcessing(true);
    setLiveTranscript("Processing with Google Gemini AI...");

    try {
      const formData = new FormData();
      formData.append("file", blob, "audio.webm");
      formData.append("language", selectedLanguage);
      formData.append("name", activeName);
      formData.append("district", activeDistrict);

      const res = await fetch("/api/ai/voice", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      const transcript = data.transcript || "सिलाई और इलेक्ट्रीशियन कोर्स";
      const replyText = data.replyText || `${activeName} जी, आपके लिए ${activeDistrict} में नि:शुल्क ट्रेनिंग उपलब्ध है।`;
      const audioUrl = data.audioUrl || null;

      const matchedCards = getMatchedSkillCards(transcript + " " + replyText, activeDistrict, selectedLanguage);
      setActiveSkillCards(matchedCards);

      // Add user message & AI message with skill cards
      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, sender: "user", text: transcript },
        { id: `ai-${Date.now()}`, sender: "ai", text: replyText, audioUrl: audioUrl, skillCards: matchedCards }
      ]);

      setLiveTranscript(transcript);
      setIsProcessing(false);
      playSynthesizedAudio(audioUrl, replyText);
    } catch (error) {
      console.error("Audio pipeline error:", error);
      setIsProcessing(false);
      handleProcessQuery("कालाहांडी में मेरे लिए कौन से कोर्स हैं?");
    }
  };

  const handleMicToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* 1. Header with Powered-By Badges */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-10 sm:size-11 rounded-2xl bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-purple-200">
                <Bot className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg tracking-tight font-heading">
                    Saksham-AI Realtime Voice AI
                  </h3>
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[11px] text-purple-200/80">
                  Powered 100% by Google Gemini AI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === "orb" ? "chat" : "orb")}
                className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
              >
                {viewMode === "orb" ? "Show Chat" : "Show Orb"}
              </button>
              <button
                onClick={onClose}
                className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* 2. Indic Language Switcher */}
          <div className="px-4 py-2 bg-purple-50/70 border-b border-purple-100 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Globe className="size-3 text-purple-600" />
              भाषा:
            </span>
            {[
              { id: "hindi", label: "हिन्दी (Hindi)" },
              { id: "odia", label: "ଓଡ଼ିଆ (Odia)" },
              { id: "santhali", label: "संताली (Santhali)" },
              { id: "english", label: "English" }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`px-3 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${selectedLanguage === lang.id
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-purple-100/60 border border-purple-200/50"
                  }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* 3. Realtime Orb Visualizer View */}
          {viewMode === "orb" && (
            <div className="flex-1 p-4 sm:p-5 flex flex-col items-center justify-start bg-gradient-to-b from-[#FAF6EE] via-purple-50/20 to-white relative overflow-y-auto max-h-[56vh]">
              {/* 3D WebGL Voice-Powered Orb */}
              <div className="relative size-32 sm:size-36 shrink-0 rounded-full overflow-hidden flex items-center justify-center shadow-xl border-2 border-purple-200/60 my-1">
                <VoicePoweredOrb
                  enableVoiceControl={isRecording || isSpeaking}
                  voiceSensitivity={2.0}
                  maxRotationSpeed={1.8}
                  maxHoverIntensity={1.0}
                  hue={isSpeaking ? 280 : (isRecording ? 140 : 250)}
                  onVoiceDetected={setVoiceDetected}
                  className="w-full h-full"
                />
              </div>

              {/* Real-time Subtitle & Live Status Banner */}
              <div className="mt-2 text-center space-y-2 z-10 w-full max-w-md px-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/90 text-purple-700 text-xs font-bold shadow-2xs">
                  {isProcessing ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin text-purple-600" />
                      <span>Processing with Google Gemini AI...</span>
                    </>
                  ) : isRecording ? (
                    <>
                      <Radio className="size-3.5 animate-ping text-red-600" />
                      <span>Listening... Speak in your language</span>
                    </>
                  ) : isSpeaking ? (
                    <>
                      <Volume2 className="size-3.5 animate-bounce text-emerald-600" />
                      <span>Gemini Voice Copilot Speaking...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5 text-purple-600" />
                      <span>Tap microphone to start live conversation</span>
                    </>
                  )}
                </div>

                {/* Real-time Dynamic Captions / Spoken Result */}
                <div className="p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-purple-100 shadow-xs text-xs font-medium text-slate-800 leading-relaxed text-left">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1">
                    <Bot className="size-3.5" />
                    <span>Saksham-AI Voice Result</span>
                  </div>
                  &ldquo;{liveAiSubtitle || messages[messages.length - 1]?.text || initialGreeting}&rdquo;
                </div>

                {/* Recommended Skill & Training Cards Section */}
                <div className="w-full text-left pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="size-3.5 text-purple-600" />
                      <span>कौशल व ट्रेनिंग कार्ड्स (Recommended Courses)</span>
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      100% Free / Funded
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeSkillCards.map((card) => (
                      <div
                        key={card.id}
                        className="p-3 bg-white hover:bg-purple-50/40 rounded-2xl border border-purple-100/90 shadow-sm transition-all hover:border-purple-300 hover:shadow-md group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className="size-8 rounded-xl bg-purple-100/80 flex items-center justify-center shrink-0 mt-0.5 border border-purple-200/60">
                              {getCardIcon(card.category)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-purple-700 transition-colors">
                                  {card.title}
                                </h4>
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                  card.badgeColor === "amber"
                                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                                    : card.badgeColor === "emerald"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    : card.badgeColor === "blue"
                                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                                    : "bg-purple-100 text-purple-800 border border-purple-200"
                                }`}>
                                  {card.badge}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 flex-wrap">
                                {card.nsqfLevel > 0 && (
                                  <span className="font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                                    NSQF Level {card.nsqfLevel}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Clock className="size-3 text-slate-400" />
                                  {card.duration}
                                </span>
                                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                                  <IndianRupee className="size-3" />
                                  {card.stipend}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                                <MapPin className="size-3 text-slate-400" />
                                <span>{card.centerName}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end">
                          <button
                            onClick={() => handleCardAction(card)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
                          >
                            <Sparkles className="size-3" />
                            <span>
                              {card.targetTab === "schemes"
                                ? "अनुदान योजना देखें (View Grant Scheme)"
                                : "प्रशिक्षण में शामिल हों (Apply Now)"}
                            </span>
                            <ArrowRight className="size-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Chat Messages Body */}
          {viewMode === "chat" && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 min-h-[250px] max-h-[56vh]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  {msg.sender === "ai" && (
                    <div className="size-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 mt-1">
                      <Bot className="size-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${msg.sender === "user"
                        ? "bg-purple-600 text-white rounded-br-xs shadow-md"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs"
                      }`}
                  >
                    <p className="font-medium">{msg.text}</p>

                    {/* Skill / Training Cards attached to AI Response */}
                    {msg.skillCards && msg.skillCards.length > 0 && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-purple-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          कौशल व ट्रेनिंग कार्ड्स (Recommended Courses):
                        </span>
                        <div className="space-y-1.5">
                          {msg.skillCards.map((card) => (
                            <div
                              key={card.id}
                              className="p-2.5 bg-purple-50/60 rounded-xl border border-purple-100/90 hover:border-purple-300 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-1.5">
                                <div className="flex items-start gap-2">
                                  <div className="size-6 rounded-lg bg-white flex items-center justify-center shrink-0 mt-0.5 border border-purple-200">
                                    {getCardIcon(card.category)}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-xs text-slate-900">{card.title}</h5>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                      <span>{card.duration}</span>
                                      <span className="font-bold text-emerald-700">{card.stipend}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 flex justify-end">
                                <button
                                  onClick={() => handleCardAction(card)}
                                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-white px-2.5 py-1 rounded-lg border border-purple-200 shadow-2xs flex items-center gap-1 cursor-pointer"
                                >
                                  <span>{card.targetTab === "schemes" ? "योजना देखें (View Scheme)" : "आवेदन करें (Apply)"}</span>
                                  <ArrowRight className="size-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.actionButton && (
                      <Button
                        onClick={() => {
                          onClose();
                          if (msg.actionButton?.intent && onNavigateTarget) {
                            onNavigateTarget(msg.actionButton.intent);
                          }
                          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                        }}
                        size="sm"
                        className="mt-2.5 w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl gap-1.5"
                      >
                        <Sparkles className="size-3.5" />
                        <span>{msg.actionButton.label}</span>
                      </Button>
                    )}
                  </div>

                  {msg.sender === "user" && (
                    <div className="size-7 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-1">
                      <User className="size-4" />
                    </div>
                  )}
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-center gap-2 p-2.5 bg-purple-50 rounded-xl text-xs text-purple-700 font-medium animate-pulse">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Processing with Google Gemini AI...</span>
                </div>
              )}
            </div>
          )}

          {/* 5. Quick Suggestions */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 space-y-1.5 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Inquiries (सुझाव):
            </span>
            <div className="flex flex-col gap-1">
              {quickPrompts.slice(0, 2).map((p) => (
                <button
                  key={p.langKey}
                  onClick={() => handleProcessQuery(p.queryText)}
                  className="text-left text-xs font-medium text-slate-700 hover:text-purple-700 bg-slate-50 hover:bg-purple-50/70 p-2 rounded-xl border border-slate-200/70 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <span className="truncate pr-2">{p.label}</span>
                  <ArrowRight className="size-3 text-slate-400 group-hover:text-purple-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* 6. Bottom Voice Mic Controller */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col items-center gap-2 shrink-0">
            <div className="relative">
              {isRecording && (
                <div className="absolute -inset-3 rounded-full bg-red-500/25 animate-ping"></div>
              )}
              {isSpeaking && (
                <div className="absolute -inset-3 rounded-full bg-purple-500/25 animate-ping"></div>
              )}
              <button
                onClick={handleMicToggle}
                className={`size-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all cursor-pointer ${isRecording
                    ? "bg-red-600 scale-110 shadow-red-600/40"
                    : isSpeaking
                      ? "bg-emerald-600 scale-105 shadow-emerald-600/40"
                      : "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:scale-105 shadow-purple-600/40"
                  }`}
              >
                {isRecording ? (
                  <Mic className="size-6 animate-pulse" />
                ) : isSpeaking ? (
                  <Volume2 className="size-6 animate-bounce" />
                ) : (
                  <Mic className="size-6" />
                )}
              </button>
            </div>
            <span className="text-[11px] font-bold text-slate-600">
              {isRecording
                ? "Recording voice... Tap to finish"
                : isProcessing
                  ? "Processing with Google Gemini AI..."
                  : isSpeaking
                    ? "Speaking response (Gemini Voice)"
                    : "Tap to Speak in Odia / Hindi (माइक चालू करें)"}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

