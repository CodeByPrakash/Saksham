"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  MapPin,
  Award,
  CheckCircle2,
  Calendar,
  Building2,
  Coins,
  ShieldCheck,
  Send,
  Sparkles,
  Mic,
  Volume2
} from "lucide-react";
import { CourseItem } from "./DashboardShared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSafeCourseImage } from "@/lib/skillTrainingGenerator";
import confetti from "canvas-confetti";

interface CourseDetailModalProps {
  course: CourseItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenVoiceAssistant?: (prompt?: string) => void;
}

export function CourseDetailModal({ course, isOpen, onClose, onOpenVoiceAssistant }: CourseDetailModalProps) {
  const [isApplied, setIsApplied] = useState<boolean>(false);

  if (!isOpen || !course) return null;

  const handleApply = () => {
    setIsApplied(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6B34EB", "#3B82F6", "#10B981", "#F59E0B"]
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-xl bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Cover Image & Badges */}
          <div className="relative h-48 sm:h-56 w-full bg-slate-100">
            <Image
              src={getSafeCourseImage(course.image, course.title, (course as any).category)}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 size-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer transition-colors backdrop-blur-xs"
            >
              <X className="size-4" />
            </button>

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 bg-purple-600 text-white text-xs font-extrabold rounded-full shadow-md">
                NSQF Level {course.nsqfLevel}
              </span>
              <span className="px-3 py-1 bg-amber-500 text-white text-xs font-extrabold rounded-full shadow-md">
                {course.badge}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading leading-tight drop-shadow-sm">
                {course.title}
              </h2>
              <p className="text-xs text-purple-200 mt-0.5">QP Code: {course.qpCode} • SIDH Certified</p>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700">
            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-100 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-purple-700 uppercase flex items-center gap-1">
                  <Clock className="size-3" />
                  Duration
                </span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{course.duration}</span>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                  <Coins className="size-3" />
                  Stipend
                </span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{course.stipend.split("+")[0]}</span>
              </div>

              <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-blue-700 uppercase flex items-center gap-1">
                  <MapPin className="size-3" />
                  Location
                </span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{course.location}</span>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
                  <Calendar className="size-3" />
                  Batch Starts
                </span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{course.batchDate}</span>
              </div>
            </div>

            {/* Detected Skill Notice */}
            {(course as any).isDetectedSkill && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-start gap-2.5 text-xs text-purple-900">
                <Sparkles className="size-4 text-purple-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-extrabold block text-purple-950">
                    ✨ Custom AI Synthesized Training Program
                  </span>
                  <span className="text-[11px] text-purple-700">
                    {(course as any).detectedReason || "Specially generated based on your detected skill match."}
                  </span>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Course Overview</h4>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                {course.description}
              </p>
            </div>

            {/* Curriculum Modules */}
            {(course as any).syllabusModules && (course as any).syllabusModules.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                  <span>NSQF Curriculum Modules</span>
                  <span className="text-[10px] text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded">
                    {(course as any).syllabusModules.length} Modules
                  </span>
                </h4>
                <div className="space-y-2">
                  {(course as any).syllabusModules.map((mod: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{mod.title}</span>
                        <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border">{mod.duration}</span>
                      </div>
                      <ul className="text-[11px] text-slate-600 space-y-0.5 pl-3 list-disc">
                        {mod.topics.map((t: string, tIdx: number) => (
                          <li key={tIdx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Training Center Info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Building2 className="size-3.5 text-purple-600" />
                  Authorized Training Center
                </span>
                <Badge variant="purple" className="text-[10px]">
                  Free Hostel & Meals
                </Badge>
              </div>
              <h5 className="font-bold text-slate-900 text-sm">{course.centerName}</h5>
              <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
                <span>📍 {course.centerDistance}</span>
                <span>⭐ 4.8 / 5 Rating</span>
                <span>👥 {course.openings} Seats Left</span>
              </div>
            </div>

            {/* PM-AJAY Scheme Benefits */}
            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-200/60 space-y-2">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-purple-600" />
                PM-AJAY Direct Beneficiary Package
              </span>
              <ul className="text-xs space-y-1 text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                  <span>100% Free Course Fee under Special Central Assistance (SCA to SCSP)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                  <span>Monthly stipend credited directly to your Aadhaar-linked DBT account</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                  <span>Guaranteed placement assistance or ₹35,000 tool-kit self-employment grant</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2.5">
            <Button
              onClick={onClose}
              variant="outline"
              className="text-xs font-bold rounded-2xl border-slate-300"
            >
              Back
            </Button>

            {onOpenVoiceAssistant && (
              <button
                onClick={() => {
                  onClose();
                  onOpenVoiceAssistant(`मुझे ${course.title} के बारे में विस्तार से बताएं। इसमें क्या योग्यता चाहिए, कितना स्टाइपेंड मिलेगा और कोर्स के बाद क्या अवसर हैं?`);
                }}
                className="px-3.5 py-2.5 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Ask AI Copilot about this course"
              >
                <Mic className="size-3.5 text-purple-600" />
                <span>Ask AI</span>
              </button>
            )}

            <Button
              onClick={handleApply}
              disabled={isApplied}
              className={`flex-1 text-xs sm:text-sm font-bold rounded-2xl gap-2 shadow-md ${
                isApplied
                  ? "bg-emerald-600 text-white"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              }`}
            >
              {isApplied ? (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>Application Submitted Successfully!</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>Apply with PM-AJAY (1-Click)</span>
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
