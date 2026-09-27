"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Mic,
  Volume2,
  VolumeX,
  Check,
  Search,
  ArrowRight,
  Sparkles,
  Sparkle,
  Radio,
  X
} from "lucide-react";
import { LANGUAGES, LanguageOption } from "@/components/navigation/LanguageSelector";

interface LanguageSelectScreenProps {
  onLanguageSelected: (langCode: string) => void;
  initialLanguage?: string;
  isMobile?: boolean;
}

const FEATURED_LANGUAGES: {
  code: string;
  native: string;
  label: string;
  region: string;
  greeting: string;
  audioVoiceText: string;
}[] = [
  {
    code: "hi",
    native: "हिन्दी",
    label: "Hindi",
    region: "उत्तर एवं मध्य भारत (North & Central India)",
    greeting: "नमस्ते! आगे बढ़ने के लिए चुनें",
    audioVoiceText: "हिन्दी भाषा चुनी गई। चलिए शुरू करते हैं।"
  },
  {
    code: "or",
    native: "ଓଡ଼ିଆ",
    label: "Odia",
    region: "ଓଡ଼ିଶା (Odisha)",
    greeting: "ନମସ୍କାର! ଆରମ୍ଭ କରିବାକୁ ବାଛନ୍ତୁ",
    audioVoiceText: "ଓଡ଼ିଆ ଭାଷା ବଛାଗଲା। ଆସନ୍ତୁ ଆରମ୍ଭ କରିବା।"
  },
  {
    code: "sat",
    native: "संताली (ᱥᱟᱱᱛᱟᱲᱤ)",
    label: "Santhali",
    region: "ଝାଡ଼ଖଣ୍ଡ / ମୟୂରଭଞ୍ଜ (Jharkhand / Mayurbhanj)",
    greeting: "ᱡᱚᱦᱟᱨ! ᱮᱛᱦᱚᱵ ᱞᱟᱹᱜିᱫ ᱵᱟᱪᱷᱟᱣ ᱢᱮ",
    audioVoiceText: "संताली बाछाव एना। चोलों सुरु लेगे।"
  },
  {
    code: "en",
    native: "English",
    label: "English",
    region: "National & Global",
    greeting: "Welcome! Tap to select",
    audioVoiceText: "English selected. Let's get started!"
  },
  {
    code: "bho",
    native: "भोजपुरी",
    label: "Bhojpuri",
    region: "बिहार व पूर्वी उत्तर प्रदेश (Bihar & UP)",
    greeting: "प्रणाम! शुरू करे खातिर चुनीं",
    audioVoiceText: "भोजपुरी भाषा चुनल गइल। चलीं शुरू कइल जाव।"
  },
  {
    code: "bn",
    native: "বাংলা",
    label: "Bengali",
    region: "পশ্চিমবঙ্গ ও ত্রিপুরা (West Bengal & Tripura)",
    greeting: "স্বাগতম! शुरू করতে নির্বাচন করুন",
    audioVoiceText: "বাংলা भाषा निर्वाचित होएछे। চলুন शुरू করা যাক।"
  },
  {
    code: "te",
    native: "తెలుగు",
    label: "Telugu",
    region: "ఆంధ్రప్రదేశ్ & తెలంగాణ (AP & Telangana)",
    greeting: "స్వాగతం! ప్రారంభించడానికి ఎంచుకోండి",
    audioVoiceText: "తెలుగు ఎంపिक చేయబడింది. ప్రారంభిద్దాం."
  },
  {
    code: "mr",
    native: "मराठी",
    label: "Marathi",
    region: "महाराष्ट्र (Maharashtra)",
    greeting: "नमस्कार! सुरू करण्यासाठी निवडा",
    audioVoiceText: "मराठी भाषा निवडली आहे. चला सुरू करूया."
  }
];

export function LanguageSelectScreen({
  onLanguageSelected,
  initialLanguage = "hi",
  isMobile = false
}: LanguageSelectScreenProps) {
  const [selectedCode, setSelectedCode] = useState<string>(initialLanguage.toLowerCase());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [voiceFlowState, setVoiceFlowState] = useState<"idle" | "ai_speaking" | "user_listening" | "processing" | "matched">("idle");
  const [spokenTranscript, setSpokenTranscript] = useState<string>("");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const speechTimeoutRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const latestTranscriptRef = useRef<string>("");
  const aiDebounceTimeoutRef = useRef<any>(null);

  // Anti-echoing: Monotonic session ID to cancel out-of-order/stale audio requests
  const audioRequestIdRef = useRef<number>(0);
  // Atomic lock to prevent duplicate language matching/confirmation
  const isMatchingLockRef = useRef<boolean>(false);

  // Clean up all audio and recognition on unmount
  useEffect(() => {
    return () => {
      stopAllVoiceAndAudio();
    };
  }, []);

  // Sync mute state and play initial audio prompt on mount if not muted
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedMute = localStorage.getItem("Saksham-AI_voice_muted");
        if (savedMute === "true") {
          setIsMuted(true);
        } else {
          playSpokenPrompt(
            "नमस्ते! कृपया अपनी पसंदीदा भाषा चुनें। ଦୟାକରି ଆପଣଙ୍କ ପସନ୍ଦର ଭାଷା ବାଛନ୍ତୁ। Please select your preferred language.",
            "hi"
          );
        }
      } catch {
        playSpokenPrompt(
          "नमस्ते! कृपया अपनी पसंदीदा भाषा चुनें। ଦୟାକରି ଆପଣଙ୍କ ପସନ୍ଦର ଭାଷା ବାଛନ୍ତୁ। Please select your preferred language.",
          "hi"
        );
      }
    }
  }, []);

  const stopAllVoiceAndAudio = () => {
    audioRequestIdRef.current++;

    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
    if (aiDebounceTimeoutRef.current) {
      clearTimeout(aiDebounceTimeoutRef.current);
      aiDebounceTimeoutRef.current = null;
    }

    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = "";
        audioPlayerRef.current.onended = null;
        audioPlayerRef.current.onerror = null;
      } catch { }
      audioPlayerRef.current = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch { }
    }
    activeUtteranceRef.current = null;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch { }
      recognitionRef.current = null;
    }

    setIsPlayingAudio(false);
  };

  const toggleMute = () => {
    if (!isMuted) {
      // Switch to MUTE
      setIsMuted(true);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("Saksham-AI_voice_muted", "true");
          stopAllVoiceAndAudio();
          isMatchingLockRef.current = false;
          setVoiceFlowState("idle");
        } catch { }
      }
    } else {
      // Switch to UNMUTE (Voice ON)
      setIsMuted(false);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("Saksham-AI_voice_muted", "false");
        } catch { }
      }
      playSpokenPrompt(
        selectedCode === "or"
          ? "ଓଡ଼ିଆ ଭାଷା ଚୟନ ହୋଇଛି। ଆରମ୍ଭ କରିବା ପାଇଁ ଆଗକୁ ବଢ଼ନ୍ତୁ।"
          : "अपनी भाषा चुनें। आगे बढ़ने के लिए नीचे बटन दबाएं।",
        selectedCode,
        true
      );
    }
  };

  /**
   * Anti-Echo Universal Speech Synthesis with requestId matching
   */
  const playSpokenPrompt = async (
    text: string,
    langCode: string = "hi",
    force = false,
    onEndCallback?: () => void
  ) => {
    if (isMuted && !force) {
      if (onEndCallback) onEndCallback();
      return;
    }

    stopAllVoiceAndAudio();
    const myRequestId = ++audioRequestIdRef.current;
    setIsPlayingAudio(true);

    let hasCompleted = false;
    const triggerComplete = () => {
      if (hasCompleted) return;
      if (myRequestId !== audioRequestIdRef.current) return;
      hasCompleted = true;
      setIsPlayingAudio(false);
      if (onEndCallback) {
        setTimeout(() => {
          if (myRequestId === audioRequestIdRef.current) {
            onEndCallback();
          }
        }, 120);
      }
    };

    // 1. Try Gemini & Google Speech API first
    try {
      const cleanLang = (langCode || "hi").toLowerCase().split("-")[0].split("_")[0];
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: cleanLang })
      });

      if (myRequestId !== audioRequestIdRef.current) return;

      if (res.ok) {
        const data = await res.json();
        if (myRequestId !== audioRequestIdRef.current) return;

        if (data.audioUrl) {
          const audio = new Audio();
          audio.src = data.audioUrl;
          audio.preload = "auto";
          audioPlayerRef.current = audio;

          audio.onended = () => {
            audioPlayerRef.current = null;
            triggerComplete();
          };
          audio.onerror = () => {
            audioPlayerRef.current = null;
            if (myRequestId === audioRequestIdRef.current) {
              playWithBrowserSpeechFallback(text, cleanLang, myRequestId, triggerComplete);
            }
          };

          try {
            await audio.play();
            return;
          } catch {
            // Fall through to browser speech fallback
          }
        }
      }
    } catch { }

    // 2. Fallback to Browser SpeechSynthesis
    if (myRequestId === audioRequestIdRef.current) {
      playWithBrowserSpeechFallback(text, langCode, myRequestId, triggerComplete);
    }
  };

  const playWithBrowserSpeechFallback = (
    text: string,
    langCode: string,
    reqId: number,
    onFinish: () => void
  ) => {
    if (reqId !== audioRequestIdRef.current) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
        const u = new SpeechSynthesisUtterance(text);
        activeUtteranceRef.current = u;
        u.lang = langCode === "en" ? "en-IN" : "hi-IN";
        u.rate = 0.95;
        u.onend = () => {
          if (reqId === audioRequestIdRef.current) onFinish();
        };
        u.onerror = () => {
          if (reqId === audioRequestIdRef.current) onFinish();
        };
        speechTimeoutRef.current = setTimeout(() => {
          if (reqId === audioRequestIdRef.current) onFinish();
        }, Math.max(1600, text.length * 60));
        window.speechSynthesis.speak(u);
      } catch {
        onFinish();
      }
    } else {
      onFinish();
    }
  };

  /**
   * Voice Recognition for Language Choice:
   * AI speaks short prompt first, THEN microphone opens with ZERO audio collision.
   */
  const startVoiceLanguageSelection = () => {
    if (voiceFlowState === "user_listening" || voiceFlowState === "processing") {
      stopAllVoiceAndAudio();
      isMatchingLockRef.current = false;
      setVoiceFlowState("idle");
      return;
    }

    if (voiceFlowState === "ai_speaking") {
      stopAllVoiceAndAudio();
      isMatchingLockRef.current = false;
      startMicListening();
      return;
    }

    stopAllVoiceAndAudio();
    isMatchingLockRef.current = false;
    setSpokenTranscript("");
    latestTranscriptRef.current = "";

    // If muted, start mic immediately
    if (isMuted) {
      startMicListening();
      return;
    }

    // Step 1: AI voice speaks short instruction prompt first
    setVoiceFlowState("ai_speaking");
    const promptText = "अपनी भाषा में कुछ भी बोलिए";

    playSpokenPrompt(promptText, "hi", false, () => {
      // Step 2: AI completed speech! Now open microphone with zero audio collision.
      startMicListening();
    });
  };

  const startMicListening = () => {
    setVoiceFlowState("user_listening");

    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      try {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const rec = new SpeechRecognition();
        recognitionRef.current = rec;
        rec.continuous = true;
        rec.interimResults = true;
        rec.maxAlternatives = 5;

        rec.onstart = () => {
          setVoiceFlowState("user_listening");
        };

        rec.onresult = (e: any) => {
          if (isMatchingLockRef.current) return;

          let fullTranscript = "";
          for (let i = 0; i < e.results.length; i++) {
            fullTranscript += e.results[i][0].transcript + " ";
          }
          fullTranscript = fullTranscript.trim();

          if (!fullTranscript) return;

          setSpokenTranscript(fullTranscript);
          latestTranscriptRef.current = fullTranscript;

          // Gather all candidate alternatives
          const allCandidates: string[] = [fullTranscript];
          for (let i = 0; i < e.results.length; i++) {
            for (let j = 0; j < e.results[i].length; j++) {
              const altText = e.results[i][j]?.transcript?.trim();
              if (altText && !allCandidates.includes(altText)) {
                allCandidates.push(altText);
              }
            }
          }

          // Check fast instant script and pattern matching
          let matchedLang = "";
          for (const cand of allCandidates) {
            matchedLang = matchLanguageCodeFromText(cand);
            if (matchedLang) break;
          }

          if (matchedLang) {
            applyLanguageSelection(matchedLang);
            return;
          }

          // If conversational or random speech, trigger debounced Gemini AI classification
          setVoiceFlowState("processing");
          if (aiDebounceTimeoutRef.current) {
            clearTimeout(aiDebounceTimeoutRef.current);
          }
          aiDebounceTimeoutRef.current = setTimeout(() => {
            if (!isMatchingLockRef.current) {
              classifyWithGemini(fullTranscript);
            }
          }, 500);
        };

        rec.onend = () => {
          if (voiceFlowState === "matched" || isMatchingLockRef.current) return;

          if (latestTranscriptRef.current && latestTranscriptRef.current.trim()) {
            setVoiceFlowState("processing");
            classifyWithGemini(latestTranscriptRef.current);
          } else {
            setVoiceFlowState("idle");
          }
        };

        rec.onerror = () => {
          if (isMatchingLockRef.current) return;
          if (latestTranscriptRef.current && latestTranscriptRef.current.trim()) {
            setVoiceFlowState("processing");
            classifyWithGemini(latestTranscriptRef.current);
          } else {
            setVoiceFlowState((prev) => (prev === "matched" ? "matched" : "idle"));
          }
        };

        rec.start();

        // Safety timeout to auto-stop mic after 8 seconds
        setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch { }
          }
        }, 8000);
      } catch (e) {
        console.warn("Recognition start failed:", e);
        setVoiceFlowState("idle");
      }
    } else {
      // Fallback
      setVoiceFlowState("processing");
      setTimeout(() => {
        setSpokenTranscript("ଓଡ଼ିଆ");
        applyLanguageSelection("or");
      }, 1000);
    }
  };

  /**
   * Auto-Detect language from arbitrary random speech via Google Gemini AI backend API
   */
  const classifyWithGemini = async (textToClassify: string) => {
    if (!textToClassify || !textToClassify.trim() || isMatchingLockRef.current) {
      setVoiceFlowState("idle");
      return;
    }

    try {
      setVoiceFlowState("processing");
      const res = await fetch("/api/ai/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToClassify,
          action: "detect_language"
        })
      });

      if (isMatchingLockRef.current) return;

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.languageCode && !isMatchingLockRef.current) {
          applyLanguageSelection(data.languageCode);
          return;
        }
      }
    } catch (err) {
      console.warn("Gemini voice language detection failed:", err);
    }

    if (isMatchingLockRef.current) return;

    // Fallback: Test regex / script detection one more time
    const fallbackMatch = matchLanguageCodeFromText(textToClassify);
    if (fallbackMatch && !isMatchingLockRef.current) {
      applyLanguageSelection(fallbackMatch);
    } else {
      setVoiceFlowState("idle");
    }
  };

  /**
   * Instant Unicode script detection (0ms)
   */
  const detectLanguageFromScript = (text: string): string => {
    if (!text) return "";
    // Odia script (U+0B00 to U+0B7F)
    if (/[\u0B00-\u0B7F]/.test(text)) return "or";
    // Ol Chiki (Santhali) script (U+1C50 to U+1C7F)
    if (/[\u1C50-\u1C7F]/.test(text)) return "sat";
    // Telugu script (U+0C00 to U+0C7F)
    if (/[\u0C00-\u0C7F]/.test(text)) return "te";
    // Tamil script (U+0B80 to U+0BFF)
    if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
    // Kannada script (U+0C80 to U+0CFF)
    if (/[\u0C80-\u0CFF]/.test(text)) return "kn";
    // Gujarati script (U+0A80 to U+0AFF)
    if (/[\u0A80-\u0AFF]/.test(text)) return "gu";
    // Gurmukhi (Punjabi) script (U+0A00 to U+0A7F)
    if (/[\u0A00-\u0A7F]/.test(text)) return "pa";
    // Bengali / Assamese script (U+0980 to U+09FF)
    if (/[\u0980-\u09FF]/.test(text)) {
      if (/[ৰৱ]/.test(text) || /অসম/.test(text)) return "as";
      return "bn";
    }
    return "";
  };

  /**
   * Match spoken text against Indian language names, common dialect markers, and options
   */
  const matchLanguageCodeFromText = (text: string): string => {
    if (!text) return "";
    const lower = text.toLowerCase().trim();

    // 0. Instant Script Check
    const scriptLang = detectLanguageFromScript(text);
    if (scriptLang) return scriptLang;

    // 1. Odia / Oriya / Odisha & Odia Dialect words & phonetics
    if (
      /odia|oriya|odiya|odisha|orissa|audio|audia|ariya|oria|oriyaa|odissi/i.test(
        lower
      ) ||
      /mote|mu|mun|aame|ame|tame|apana|apananku|nahanti|asuchi|heuchi|dorkar|darkar|sikhiba|sikhibaku|sikhibara|silai|kam|kaam|katha|jani|bapa|ghare|bhalo|namaskar|pani|kahuchi|kahiba|deba|neba|sau|tikiye|chali|sahayata|sahajya|mora|tora|tanka|bhouni|khushi|milba|miluchi|janichu|bujhili|bujhuchi/i.test(
        lower
      ) ||
      /ओडिया|उड़िया|उडिया|ओड़िया|मोते|मुं|मु|आमे|तामे|आपण|कथा|कहूचि|कहूचु|दरकार|दोरकार|सिलाइ|सिखिबा|सिखिबार|अछि|नाहान्ति|आसुचि|हेउचि|खोजुचि|बापा|घरे|भालो|नमस्कार|पाणि|देबा|नेबा|साहाज्य|टंका|भउणी|दिदी|खुसी|मिलिब|मिलूचि|जाणिचु|जाणि|बुझिली|बुझुचि/i.test(
        lower
      ) ||
      /\b(दो|दूसरा|दुसरा|2|two|second|number two|option two)\b/i.test(lower)
    ) {
      return "or";
    }

    // 2. Santhali / Santali / Ol Chiki & Dialect words
    if (
      /santhali|santali|santhal|santal|ol chiki|olchiki|ol ciki|johar|chando|kami|nyam|abon|santhal/i.test(
        lower
      ) ||
      /संताली|संथाली|ᱥᱟᱱᱛᱟᱲᱤ|संताळी|संताडी|जोहार|कामी|ᱧᱟᱢ|ᱡᱚᱦᱟᱨ/i.test(lower) ||
      /\b(तीन|तीसरा|3|three|third|number three|option three)\b/i.test(lower)
    ) {
      return "sat";
    }

    // 3. English / Angrezi
    if (
      /^(english|inglish|englis|angrezi|angreji|अंग्रेजी|अंग्रेज़ी|इंग्लिश|इंगलिश|इंग्रजी)$/i.test(
        lower
      ) ||
      /\b(english language|speak english|अंग्रेजी में|learn in english)\b/i.test(lower) ||
      /\b(चार|चौथा|4|four|fourth|number four|option four)\b/i.test(lower)
    ) {
      return "en";
    }

    // 4. Bhojpuri
    if (
      /bhojpuri|bhojpuree|bhojpur|भोजपुरी|भोजपुर/i.test(lower) ||
      /baate|dikat ba|kare ke|hamra|tohar|kaisan|bujhat|बाटे|करे के|हमार|तोहार|कैसन|बुझात|दिक्कत बा/i.test(
        lower
      ) ||
      /\b(पांच|पाँच|पाँचवां|5|five|fifth|option five)\b/i.test(lower)
    ) {
      return "bho";
    }

    // 5. Bengali / Bangla
    if (
      /bengali|bangla|bangali|bengoli|বাংলা|বাঙালি|বালী|बंगाली|बांग्ला/i.test(lower) ||
      /ami kaj|korte chai|shikhte|amake|আমি|কাজ|করতে চাই/i.test(lower) ||
      /\b(छह|छठा|6|six|sixth|option six)\b/i.test(lower)
    ) {
      return "bn";
    }

    // 6. Telugu
    if (
      /telugu|telgu|telegu|తెలుగు|तेलुगु|तेलगू/i.test(lower) ||
      /kavali|nerchukovali|upadhi|training kavali/i.test(lower) ||
      /\b(सात|सातवां|7|seven|seventh|option seven)\b/i.test(lower)
    ) {
      return "te";
    }

    // 7. Marathi
    if (
      /marathi|marati|मराठी|मरठी/i.test(lower) ||
      /shikaycha|karaycha|aahe|havay|aamhi|tumhi|काम करायचं|हवंय|आहे|आम्ही|शिकायचं|करायचं/i.test(
        lower
      ) ||
      /\b(आठ|आठवां|8|eight|eighth|option eight)\b/i.test(lower)
    ) {
      return "mr";
    }

    // 8. Tamil
    if (
      /tamil|tamizh|தமிழ்|तमिल|तामिल/i.test(lower) ||
      /vendum|velai|enakku/i.test(lower) ||
      /\b(नौ|9|nine)\b/i.test(lower)
    ) {
      return "ta";
    }

    // 9. Gujarati
    if (
      /gujarati|gujrati|ગુજરાતી|गुजराती/i.test(lower) ||
      /joye chhe|kam karvu/i.test(lower) ||
      /\b(दस|10|ten)\b/i.test(lower)
    ) {
      return "gu";
    }

    // 10. Kannada
    if (/kannada|kanada|ಕನ್ನಡ|कन्नड़|कन्नड/i.test(lower) || /beku|kelasa/i.test(lower)) {
      return "kn";
    }

    // 11. Punjabi
    if (/punjabi|panjabi|ਪੰਜਾਬੀ|पंजाबी/i.test(lower) || /chahida|kam sikhna/i.test(lower)) {
      return "pa";
    }

    // 12. Assamese
    if (/assamese|oxomiya|axomiya|অসমীয়া|অসমिया|আসামী/i.test(lower)) {
      return "as";
    }

    // 13. Urdu
    if (/urdu|اردو|উर्दू/i.test(lower) || /madad chahiye|hunar sikhna/i.test(lower)) {
      return "ur";
    }

    // 14. Hindi (Strict trigger or Option 1 ONLY - never greedily catch conversational sentences!)
    if (
      /^(hindi|hindee|hndi|hindustani|हिन्दी|हिंदी|हिंदुस्तानी|हिनदी|हिन्दुस्तानी)$/i.test(
        lower
      ) ||
      /\b(हिन्दी बोलिए|हिंदी भाषा|hindi language|hindi mein|हिंदी में|बोलिए हिंदी)\b/i.test(
        lower
      ) ||
      /\b(एक|पहला|1|one|first|number one|option one)\b/i.test(lower)
    ) {
      return "hi";
    }

    return "";
  };

  /**
   * Apply language selection with strict atomic lock (No Echo / No Duplicate audio)
   */
  const applyLanguageSelection = (detected: string) => {
    if (isMatchingLockRef.current) return;
    isMatchingLockRef.current = true;

    stopAllVoiceAndAudio();
    setVoiceFlowState("matched");

    const featured = FEATURED_LANGUAGES.find((l) => l.code === detected);
    const allFound = LANGUAGES.find((l) => l.code === detected);
    const langLabel = featured?.native || allFound?.native || allFound?.label || detected;

    setSelectedCode(detected);
    try {
      localStorage.setItem("Saksham-AI_lang", detected);
      localStorage.setItem("language", detected);
    } catch { }

    const audioText = featured
      ? featured.audioVoiceText
      : `${langLabel} भाषा चुनी गई। आगे बढ़ रहे हैं।`;

    // Announce in chosen language via Gemini TTS & proceed on finish
    playSpokenPrompt(audioText, detected, true, () => {
      onLanguageSelected(detected);
    });

    // Backup fallback timer so user never gets stuck
    setTimeout(() => {
      onLanguageSelected(detected);
    }, 2000);
  };

  const handleSelectLanguage = (langCode: string) => {
    stopAllVoiceAndAudio();
    isMatchingLockRef.current = false;
    setSelectedCode(langCode);
    try {
      localStorage.setItem("Saksham-AI_lang", langCode);
      localStorage.setItem("language", langCode);
    } catch { }

    const found = FEATURED_LANGUAGES.find((l) => l.code === langCode);
    const allFound = LANGUAGES.find((l) => l.code === langCode);
    const audioText = found
      ? found.audioVoiceText
      : `${allFound?.native || allFound?.label || "भाषा"} चुनी गई। आगे बढ़ रहे हैं।`;

    playSpokenPrompt(audioText, langCode);
  };

  const handleConfirmAndProceed = () => {
    stopAllVoiceAndAudio();
    isMatchingLockRef.current = false;
    try {
      localStorage.setItem("Saksham-AI_lang", selectedCode);
      localStorage.setItem("language", selectedCode);
    } catch { }
    onLanguageSelected(selectedCode);
  };

  const filteredAllLanguages = LANGUAGES.filter((l) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      l.label.toLowerCase().includes(q) ||
      l.native.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  });

  return (
    <div
      translate="no"
      className={`notranslate relative w-full flex flex-col items-center bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] text-slate-900 select-none ${isMobile ? "h-full max-h-[100dvh] px-4.5 pt-4 pb-4 overflow-y-auto" : "min-h-[640px] max-w-lg mx-auto py-8 px-6 rounded-3xl"
        }`}
    >
      {/* Background Cloud Ambient Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-6 -left-10 w-44 h-24 bg-white/70 rounded-full blur-2xl animate-float" />
        <div className="absolute top-36 -right-10 w-52 h-28 bg-amber-100/60 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-12 left-1/3 w-60 h-24 bg-white/80 rounded-full blur-2xl animate-pulse-glow" />
      </div>

      {/* Top Header */}
      <div className="w-full flex items-center justify-between relative z-10 shrink-0 pb-1">
        <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-purple-800 border border-amber-100/80 shadow-2xs">
          <Globe className="size-3.5 text-purple-600 animate-spin-slow" />
          <span>Language Setup • भाषा चयन</span>
        </div>

        {/* Voice Toggle Button: Mute / Voice ON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMute}
          type="button"
          title={isMuted ? "Click to unmute voice guide (आवाज़ चालू करें)" : "Click to mute voice guide (आवाज़ म्यूट करें)"}
          className={`flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-2xs transition-all cursor-pointer select-none active:scale-95 ${isMuted
            ? "bg-slate-100/90 text-slate-500 border-slate-300 hover:bg-slate-200/90"
            : isPlayingAudio
              ? "bg-purple-100 text-purple-800 border-purple-300 ring-2 ring-purple-400/30"
              : "bg-white/90 text-purple-700 hover:bg-white border-purple-200"
            }`}
        >
          {isMuted ? (
            <>
              <VolumeX className="size-3.5 text-rose-500 shrink-0" />
              <span className="text-slate-600 font-bold">Muted (म्यूट)</span>
            </>
          ) : (
            <>
              <div className="relative shrink-0">
                <Volume2 className="size-3.5 text-purple-600 animate-pulse" />
                <span className="size-1.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-ping" />
              </div>
              <span className="text-purple-900 font-bold">
                {isPlayingAudio ? "बोल रहे हैं..." : "Voice ON (चालू)"}
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* Main Title Area */}
      <div className="flex flex-col items-center text-center space-y-1 relative z-10 pt-1.5 shrink-0">
        <div className="relative size-11 flex items-center justify-center">
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

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
          Choose Your Language
        </h1>
        <p className="text-xs font-semibold text-purple-700">
          अपनी भाषा चुनें • ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ
        </p>
      </div>

      {/* Speak Your Language Action Card */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={startVoiceLanguageSelection}
        type="button"
        className="w-full mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white shadow-md shadow-purple-600/20 flex items-center justify-between border border-purple-400/30 cursor-pointer relative z-10 shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className={`size-9 rounded-xl flex items-center justify-center transition-all ${
            voiceFlowState === "user_listening"
              ? "bg-rose-500 text-white animate-pulse ring-2 ring-rose-300"
              : voiceFlowState === "ai_speaking"
              ? "bg-amber-500 text-white animate-bounce"
              : voiceFlowState === "processing"
              ? "bg-indigo-400 text-white animate-spin"
              : "bg-white/20 backdrop-blur-md text-white"
          }`}>
            {voiceFlowState === "processing" ? (
              <Radio className="size-4.5 animate-pulse" />
            ) : (
              <Mic className="size-4.5" />
            )}
          </div>
          <div className="text-left">
            <span className="text-xs sm:text-sm font-extrabold block">
              {voiceFlowState === "ai_speaking" && "AI बोल रहा है..."}
              {voiceFlowState === "user_listening" && "🎤 सुन रहे हैं... अपनी भाषा में बोलिए"}
              {voiceFlowState === "processing" && "⚡ भाषा पहचान रहे हैं..."}
              {voiceFlowState === "matched" && "✓ भाषा पहचानी गई!"}
              {voiceFlowState === "idle" && "Speak to Choose / बोलकर भाषा चुनें"}
            </span>
            <span className="text-[10px] text-purple-200">
              {spokenTranscript
                ? `"${spokenTranscript}"`
                : "Tap & Say 'हिन्दी', 'ଓଡ଼ିଆ' (Odia), 'संताली' or any sentence"}
            </span>
          </div>
        </div>
        <Sparkles className="size-4 text-amber-300" />
      </motion.button>

      {/* Featured Indic Languages Grid */}
      <div className="w-full flex-1 min-h-0 overflow-y-auto lang-scrollbar my-2.5 relative z-10 pr-0.5 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FEATURED_LANGUAGES.map((lang) => {
            const isSelected = selectedCode === lang.code;
            return (
              <motion.button
                key={lang.code}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectLanguage(lang.code)}
                type="button"
                className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex items-center justify-between ${isSelected
                  ? "bg-purple-50/95 border-purple-500 shadow-md ring-2 ring-purple-500/20"
                  : "bg-white/90 hover:bg-white border-slate-200/80 shadow-2xs"
                  }`}
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-extrabold text-slate-900 font-heading">
                      {lang.native}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      ({lang.label})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                    {lang.region}
                  </span>
                </div>

                <div
                  className={`size-6 rounded-full flex items-center justify-center shrink-0 ${isSelected
                    ? "bg-purple-600 text-white"
                    : "border-2 border-slate-300 text-transparent"
                    }`}
                >
                  <Check className="size-3.5 stroke-[3]" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Search More Languages Bar */}
        <div className="pt-2">
          <div className="flex items-center gap-2 bg-white/90 border border-slate-200 rounded-2xl px-3 py-2 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
            <Search className="size-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all 24+ Indian languages (उदा: Assamese, Tamil)..."
              className="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="mt-1.5 max-h-36 overflow-y-auto bg-white rounded-2xl border border-slate-200 p-1 space-y-1">
              {filteredAllLanguages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    handleSelectLanguage(l.code);
                    setSearchQuery("");
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-purple-50 text-xs font-bold text-slate-800 flex items-center justify-between cursor-pointer"
                >
                  <span>{l.native} ({l.label})</span>
                  <span className="text-[10px] text-slate-400">{l.region}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Continue Action Button */}
      <div className="w-full relative z-10 shrink-0 pt-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 420, damping: 25 }}
          onClick={handleConfirmAndProceed}
          type="button"
          className="w-full h-12 text-sm font-extrabold rounded-2xl bg-gradient-to-r from-[#6B34EB] via-[#7539F4] to-[#8042F6] hover:from-[#5E2DD8] hover:to-[#7335EC] text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer border border-purple-400/20"
        >
          <span>
            {selectedCode === "hi"
              ? "आगे बढ़ें (Continue with हिन्दी)"
              : selectedCode === "or"
                ? "ଆଗକୁ ବଢ଼ନ୍ତୁ (Continue with ଓଡ଼ିଆ)"
                : selectedCode === "sat"
                  ? "ᱞᱟᱦᱟᱜ ᱢᱮ (Continue with Santhali)"
                  : `Continue with ${LANGUAGES.find((l) => l.code === selectedCode)?.native || "Selected Language"
                  }`}
          </span>
          <ArrowRight className="size-4" />
        </motion.button>
      </div>
    </div>
  );
}
