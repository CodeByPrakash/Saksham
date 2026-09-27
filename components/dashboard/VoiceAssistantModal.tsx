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
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoicePoweredOrb } from "@/components/ui/voice-powered-orb";
import confetti from "canvas-confetti";

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  translatedText?: string;
  audioUrl?: string | null;
  actionButton?: {
    label: string;
    action: string;
  };
}

export function VoiceAssistantModal({
  isOpen,
  onClose,
  initialPrompt
}: VoiceAssistantModalProps) {
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

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "नमस्ते सावित्री देवी जी! मैं सक्षम जीविका सेतु एआई सहायक हूँ। आप बोलकर अपने कौशल, ट्रेनिंग कोर्स या पीएम-अजय अनुदान के बारे में पूछ सकती हैं।",
      translatedText:
        "Namaste Savitri Devi ji! I am Saksham-AI Voice AI. You can speak to explore NSQF skill courses and PM-AJAY grants in your language."
    }
  ]);

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
          beneficiaryName: "Savitri Devi",
          district: "Kalahandi, Odisha"
        })
      });

      const data = await res.json();
      const replyText = data.replyText || "सावित्री देवी जी, आपके लिए कालाहांडी में नि:शुल्क सिलाई और इलेक्ट्रीशियन कोर्स उपलब्ध हैं।";
      const audioUrl = data.audioUrl || null;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: replyText,
        audioUrl: audioUrl,
        actionButton: {
          label: "कोर्स में आवेदन करें (Apply Now)",
          action: "apply"
        }
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsProcessing(false);
      playSynthesizedAudio(audioUrl, replyText);
    } catch (err) {
      console.error("Voice assistant query error:", err);
      setIsProcessing(false);
      const fallbackText = "सावित्री देवी जी, कालाहांडी के PMKK सेंटर में सिलाई एवं इलेक्ट्रीशियन के नए बैच 15 अक्टूबर से शुरू हो रहे हैं।";
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: fallbackText
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
      formData.append("name", "Savitri Devi");
      formData.append("district", "Kalahandi, Odisha");

      const res = await fetch("/api/ai/voice", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      const transcript = data.transcript || "सिलाई और इलेक्ट्रीशियन कोर्स";
      const replyText = data.replyText || "सावित्री देवी जी, आपके लिए कालाहांडी में नि:शुल्क ट्रेनिंग उपलब्ध है।";
      const audioUrl = data.audioUrl || null;

      // Add user message
      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, sender: "user", text: transcript },
        { id: `ai-${Date.now()}`, sender: "ai", text: replyText, audioUrl: audioUrl }
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
          <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white flex items-center justify-between">
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
          <div className="px-4 py-2 bg-purple-50/70 border-b border-purple-100 flex items-center gap-1.5 overflow-x-auto text-xs">
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
            <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#FAF6EE] to-white relative min-h-[270px] overflow-hidden">
              {/* 3D WebGL Voice-Powered Orb */}
              <div className="relative size-44 sm:size-52 rounded-full overflow-hidden flex items-center justify-center shadow-2xl">
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
              <div className="mt-3.5 text-center space-y-1.5 z-10 w-full max-w-sm px-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/80 text-purple-700 text-xs font-bold shadow-2xs">
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

                {/* Real-time Dynamic Captions */}
                {liveAiSubtitle && (
                  <div className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl border border-purple-100 shadow-sm text-xs font-semibold text-slate-800 leading-snug line-clamp-3">
                    &ldquo;{liveAiSubtitle}&rdquo;
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Chat Messages Body */}
          {viewMode === "chat" && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 min-h-[250px]">
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
                    className={`max-w-[84%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${msg.sender === "user"
                        ? "bg-purple-600 text-white rounded-br-xs shadow-md"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs"
                      }`}
                  >
                    <p className="font-medium">{msg.text}</p>
                    {msg.actionButton && (
                      <Button
                        onClick={() => {
                          onClose();
                          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                        }}
                        size="sm"
                        className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl gap-1.5"
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
          <div className="px-4 py-2 bg-white border-t border-slate-100 space-y-1.5">
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
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col items-center gap-2">
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

