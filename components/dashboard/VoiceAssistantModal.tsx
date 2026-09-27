"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  X,
  CheckCircle2,
  ArrowRight,
  Globe,
  Bot,
  User,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  actionButton?: {
    label: string;
    action: string;
  };
}

export function VoiceAssistantModal({ isOpen, onClose, initialPrompt }: VoiceAssistantModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("hindi");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeQuery, setActiveQuery] = useState<string>("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "नमस्ते सावित्री देवी जी! मैं जीविका सेतु एआई सहायक हूँ। आप मुझसे अपने कौशल, प्रशिक्षण कोर्स या पीएम-अजय (PM-AJAY) योजनाओं के बारे में अपनी भाषा में पूछ सकती हैं।",
      translatedText: "Namaste Savitri Devi ji! I am JeevikaSetu AI Assistant. You can ask me about skill courses, training centers or PM-AJAY schemes in your own language."
    }
  ]);

  const quickPrompts = [
    {
      langKey: "kalahandi_courses",
      label: "📍 कालाहांडी में कौन से कोर्स हैं?",
      queryText: "कालाहांडी जिले में मेरे लिए कौन से ट्रेनिंग कोर्स उपलब्ध हैं?",
      aiResponse: "आपके कौशल और 10वीं पास प्रोफाइल के अनुसार कालाहांडी में 'सिलाई एवं परिधान (Tailoring)' और 'इलेक्ट्रीशियन (Electrician NSQF Level 4)' कोर्स सबसे उपयुक्त हैं। इनमें ₹3,500 प्रति माह स्टाइपेंड भी मिलेगा।"
    },
    {
      langKey: "pmajay_grant",
      label: "💰 ₹35,000 पीएम-अजय अनुदान कैसे मिलेगा?",
      queryText: "मुझे सिलाई मशीन और दुकान शुरू करने के लिए पीएम-अजय ग्रांट कैसे मिल सकता है?",
      aiResponse: "पीएम-अजय योजना के तहत आपको ₹35,000 तक का शत-प्रतिशत पूंजीगत अनुदान और मुद्रा योजना से ₹30,000 तक का बिना गारंटी लोन मिल सकता है। आपका आधार कार्ड पहले से सत्यापित है।"
    },
    {
      langKey: "nearest_center",
      label: "🏫 नजदीकी ट्रेनिंग सेंटर कहाँ है?",
      queryText: "मेरे गांव के सबसे पास ट्रेनिंग सेंटर कहाँ है और हॉस्टल सुविधा है क्या?",
      aiResponse: "आपके पते से केवल 6 किमी दूर जूनागढ़ ब्लॉक में RSETI स्किल सेंटर है। यहाँ महिलाओं के लिए सुरक्षित हॉस्टल और मुफ्त आने-जाने का बस पास भी दिया जाता है।"
    }
  ];

  const handleSendQuery = (text: string, customReply?: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsListening(false);
    setIsSpeaking(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text:
          customReply ||
          `मैंने आपकी बात समझ ली है: "${text}"। आपकी रुचि के अनुसार हमने नजदीकी केंद्र पर आपका स्लॉट आरक्षित करने का विकल्प जोड़ दिया है।`,
        actionButton: {
          label: "कोर्स में आवेदन करें (Apply Now)",
          action: "apply"
        }
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsSpeaking(false);
    }, 1200);
  };

  const handleMicToggle = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        handleSendQuery("मुझे घर के पास सिलाई और बुटीक का काम सीखना है, मुझे क्या करना होगा?");
      }, 3000);
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
          className="relative w-full max-w-lg bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 sm:size-11 rounded-2xl bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-purple-200">
                <Bot className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg tracking-tight font-heading">
                    JeevikaSetu AI Assistant
                  </h3>
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-xs text-purple-200/80">Voice-Powered Vernacular Companion</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Language Selector Pills */}
          <div className="px-4 py-2.5 bg-purple-50/70 border-b border-purple-100 flex items-center gap-1.5 overflow-x-auto text-xs">
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
                className={`px-3 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  selectedLanguage === lang.id
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-purple-100/60 border border-purple-200/50"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 min-h-[220px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="size-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot className="size-4" />
                  </div>
                )}

                <div
                  className={`max-w-[84%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white rounded-br-xs shadow-md"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs"
                  }`}
                >
                  <p className="font-medium">{msg.text}</p>
                  {msg.translatedText && (
                    <p className="text-[11px] text-purple-600 mt-1.5 pt-1.5 border-t border-purple-100 font-semibold italic">
                      "{msg.translatedText}"
                    </p>
                  )}
                  {msg.actionButton && (
                    <Button
                      onClick={onClose}
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

            {isListening && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-bold animate-pulse">
                <span className="size-2.5 rounded-full bg-red-500"></span>
                <span>सुन रहा हूँ... अपनी बात कहें (Listening...)</span>
              </div>
            )}

            {isSpeaking && (
              <div className="flex items-center gap-2 p-2.5 bg-purple-50 rounded-xl text-xs text-purple-700 font-medium">
                <Volume2 className="size-4 animate-bounce" />
                <span>एआई उत्तर तैयार कर रहा है...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              सुझाए गए प्रश्न (Quick Prompts):
            </span>
            <div className="flex flex-col gap-1.5">
              {quickPrompts.map((p) => (
                <button
                  key={p.langKey}
                  onClick={() => handleSendQuery(p.queryText, p.aiResponse)}
                  className="text-left text-xs font-medium text-slate-700 hover:text-purple-700 bg-slate-50 hover:bg-purple-50/70 p-2 rounded-xl border border-slate-200/70 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <span>{p.label}</span>
                  <ArrowRight className="size-3 text-slate-400 group-hover:text-purple-600 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Voice Controller */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col items-center gap-2">
            <div className="relative">
              {isListening && (
                <div className="absolute -inset-3 rounded-full bg-red-500/20 animate-ping"></div>
              )}
              <button
                onClick={handleMicToggle}
                className={`size-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all cursor-pointer ${
                  isListening
                    ? "bg-red-500 scale-105 shadow-red-500/40"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 shadow-purple-600/30"
                }`}
              >
                {isListening ? <MicOff className="size-6" /> : <Mic className="size-6" />}
              </button>
            </div>
            <span className="text-[11px] font-bold text-slate-600">
              {isListening ? "टैप करके बंद करें (Tap to finish)" : "बोलने के लिए माइक दबाएं (Tap to Speak)"}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
