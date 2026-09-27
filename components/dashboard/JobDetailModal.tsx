"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Briefcase,
  MapPin,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Calendar,
  Sparkles,
  Award,
  ArrowRight,
  Coins
} from "lucide-react";
import { JobItem } from "./DashboardShared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

interface JobDetailModalProps {
  job: JobItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenVoiceAssistant?: (prompt?: string) => void;
}

export function JobDetailModal({
  job,
  isOpen,
  onClose,
  onOpenVoiceAssistant
}: JobDetailModalProps) {
  const [isApplied, setIsApplied] = useState<boolean>(false);

  if (!isOpen || !job) return null;

  const handleApply = () => {
    setIsApplied(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6B34EB", "#10B981", "#F59E0B", "#3B82F6"]
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
          <div className="relative h-44 sm:h-52 w-full bg-slate-100">
            <Image
              src={job.image}
              alt={job.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 size-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer transition-colors backdrop-blur-xs"
            >
              <X className="size-4" />
            </button>

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-extrabold rounded-full shadow-md flex items-center gap-1">
                <ShieldCheck className="size-3.5" />
                NCS Verified
              </span>
              <span className="px-3 py-1 bg-purple-600 text-white text-xs font-extrabold rounded-full shadow-md">
                {job.type}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading leading-tight drop-shadow-sm">
                {job.title}
              </h2>
              <p className="text-xs text-purple-200 mt-0.5 flex items-center gap-1.5">
                <Building2 className="size-3.5 text-purple-300" />
                <span>{job.company} • {job.location}</span>
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700">
            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                  <Coins className="size-3" />
                  Monthly Salary
                </span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{job.salary}</span>
              </div>

              <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-100 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-purple-700 uppercase flex items-center gap-1">
                  <Briefcase className="size-3" />
                  Vacancies
                </span>
                <span className="font-extrabold text-purple-900 text-xs sm:text-sm">{job.openings} Openings</span>
              </div>

              <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 flex flex-col gap-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-blue-700 uppercase flex items-center gap-1">
                  <Award className="size-3" />
                  Experience
                </span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">{job.experience}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Job Responsibilities & Overview
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                {job.description}
              </p>
            </div>

            {/* Skills Required */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Skills Required (कौशल)
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/70 text-xs font-bold"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Job Benefits & Allowances
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                {job.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact & Helpline */}
            <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <Phone className="size-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">
                    HR & Placement Desk
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">{job.contactPhone}</span>
                </div>
              </div>

              {onOpenVoiceAssistant && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenVoiceAssistant(`मुझे ${job.title} नौकरी के बारे में और जानकारी चाहिए`);
                  }}
                  className="text-xs font-bold text-purple-700 bg-white hover:bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 shadow-2xs transition-colors cursor-pointer"
                >
                  Ask Voice AI
                </button>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-2xl text-xs font-bold border-slate-300"
            >
              Close
            </Button>

            {isApplied ? (
              <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-extrabold shadow-sm">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>Application Submitted via NCS!</span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                <Sparkles className="size-4" />
                <span>Apply for Job (1-Click)</span>
                <ArrowRight className="size-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
