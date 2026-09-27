"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Briefcase,
  MapPin,
  Clock,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  Phone,
  Check,
  Coins,
  Award,
  Users,
  Calendar,
  Building
} from "lucide-react";
import { JobItem } from "../DashboardShared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

interface MobileJobDetailPageProps {
  job: JobItem;
  onBack: () => void;
  onOpenVoiceAssistant?: (promptText?: string) => void;
}

export function MobileJobDetailPage({
  job,
  onBack,
  onOpenVoiceAssistant
}: MobileJobDetailPageProps) {
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"overview" | "requirements" | "benefits" | "employer">("overview");

  const handleApply = () => {
    setIsApplied(true);
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6B34EB", "#3B82F6", "#10B981", "#F59E0B"]
    });
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 7000);
    }
  };

  return (
    <div className="space-y-4 pb-12 select-none animate-in fade-in duration-300">

      {/* 1. TOP STICKY APP BAR WITH BACK NAVIGATION */}
      <div className="flex items-center justify-between bg-white/95 backdrop-blur-md px-1 py-1 rounded-2xl border border-[#EDE7D9] shadow-2xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-purple-700 px-2.5 py-1.5 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4 text-purple-600" />
          <span>Back to Jobs</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${isSaved ? "bg-purple-100 text-purple-700" : "text-slate-500 hover:bg-slate-100"
              }`}
            aria-label="Save Job"
          >
            <Bookmark className={`size-4 ${isSaved ? "fill-purple-600 text-purple-600" : ""}`} />
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: job.title,
                  text: `Apply for ${job.title} at ${job.company} via Saksham-AI Saksham-AI!`,
                  url: window.location.href
                }).catch(() => { });
              }
            }}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Share Job"
          >
            <Share2 className="size-4" />
          </button>
        </div>
      </div>

      {/* 2. HERO JOB CARD */}
      <div className="relative overflow-hidden rounded-[32px] border border-[#EDE7D9] bg-white shadow-sm">
        {/* Cover Photo with overlay */}
        <div className="relative h-44 w-full bg-slate-100">
          <Image
            src={job.image}
            alt={job.title}
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

          {/* Badges Top Left & Right */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
            <span
              className={`px-3 py-1 text-white text-[11px] font-extrabold rounded-full shadow-md ${job.badgeColor === "emerald"
                ? "bg-emerald-600"
                : job.badgeColor === "purple"
                  ? "bg-purple-600"
                  : "bg-blue-600"
                }`}
            >
              {job.badge}
            </span>
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-slate-900 text-[10.5px] font-extrabold rounded-full shadow-sm flex items-center gap-1">
              <ShieldCheck className="size-3 text-emerald-600" />
              NCS Verified
            </span>
          </div>

          {/* Role Title and Company */}
          <div className="absolute bottom-3.5 left-4 right-4 text-white">
            <h1 className="text-xl font-black font-heading leading-snug drop-shadow-sm">
              {job.title}
            </h1>
            <p className="text-[11px] text-purple-200 font-semibold mt-0.5 flex items-center gap-2">
              <span>{job.company}</span>
              <span>•</span>
              <span>{job.location}</span>
            </p>
          </div>
        </div>

        {/* Vernacular Audio Guidance Bar */}
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 p-3 px-4 border-t border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleAudio}
              className={`size-8 rounded-full flex items-center justify-center transition-transform cursor-pointer ${isPlayingAudio ? "bg-purple-600 text-white animate-pulse" : "bg-purple-200 text-purple-800"
                }`}
            >
              {isPlayingAudio ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-purple-900 leading-tight">
                {isPlayingAudio ? "Playing Job Explanation..." : "Audio Job Details (नौकरी की जानकारी सुनें)"}
              </span>
              <span className="text-[10px] text-purple-600">
                {isPlayingAudio ? "AI narrator explaining salary & duty timings" : "Listen in Odia / Hindi"}
              </span>
            </div>
          </div>

          <button
            onClick={() => onOpenVoiceAssistant?.(`मुझे ${job.title} नौकरी की पूरी जानकारी चाहिए।`)}
            className="text-[10.5px] font-extrabold text-purple-700 bg-white px-2.5 py-1 rounded-xl border border-purple-200 shadow-2xs hover:bg-purple-50 transition-colors"
          >
            Ask AI
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white">
          <div className="bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-100/80 flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-emerald-700 uppercase flex items-center gap-1">
              <Coins className="size-3" />
              Monthly Salary
            </span>
            <span className="font-extrabold text-slate-900 text-xs truncate">{job.salary.split("/")[0]}</span>
          </div>

          <div className="bg-purple-50/70 p-2.5 rounded-2xl border border-purple-100/80 flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-purple-700 uppercase flex items-center gap-1">
              <Briefcase className="size-3" />
              Job Type
            </span>
            <span className="font-extrabold text-slate-900 text-xs">{job.type}</span>
          </div>

          <div className="bg-blue-50/70 p-2.5 rounded-2xl border border-blue-100/80 flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-blue-700 uppercase flex items-center gap-1">
              <Users className="size-3" />
              Openings
            </span>
            <span className="font-extrabold text-slate-900 text-xs">{job.openings} Vacancies</span>
          </div>

          <div className="bg-amber-50/70 p-2.5 rounded-2xl border border-amber-100/80 flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
              <Clock className="size-3" />
              Experience
            </span>
            <span className="font-extrabold text-slate-900 text-xs truncate">0-1 Year (Fresher)</span>
          </div>
        </div>
      </div>

      {/* 3. SECTION NAVIGATION PILLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: "overview", label: "Job Role" },
          { id: "requirements", label: "Requirements" },
          { id: "benefits", label: "Benefits & Perks" },
          { id: "employer", label: "Employer Info" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${activeTab === tab.id
              ? "bg-purple-600 text-white shadow-xs font-extrabold"
              : "bg-white text-slate-600 border border-[#EDE7D9] hover:bg-slate-50"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. TAB CONTENTS */}
      {activeTab === "overview" && (
        <div className="space-y-3.5">
          {/* Job Overview */}
          <div className="bg-white p-4 rounded-3xl border border-[#EDE7D9] shadow-2xs space-y-2">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider font-heading flex items-center gap-1.5">
              <Briefcase className="size-4 text-purple-600" />
              Role Description
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {job.description}
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Work Shift:</span>
              <span className="font-bold text-slate-900">Day Shift (9:30 AM – 5:30 PM)</span>
            </div>
          </div>

          {/* Key Skill Tags */}
          <div className="bg-white p-4 rounded-3xl border border-[#EDE7D9] shadow-2xs space-y-2.5">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider font-heading">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((sk, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold border border-purple-100 flex items-center gap-1"
                >
                  <Check className="size-3 text-purple-600" />
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Placement Assurance Banner */}
          <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white p-4 rounded-3xl shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                NCS & PM-AJAY Certified Employer
              </span>
              <span className="text-xs font-bold text-purple-200">Official Linkage</span>
            </div>
            <h4 className="font-extrabold text-sm leading-snug font-heading">
              Direct Benefit Transfer & Post-Placement Support
            </h4>
            <p className="text-[11px] text-purple-200 leading-relaxed font-medium">
              Beneficiaries placed through Saksham-AI receive ₹1,500/month post-placement allowance for the first 3 months directly under the PM-AJAY scheme.
            </p>
          </div>
        </div>
      )}

      {activeTab === "requirements" && (
        <div className="bg-white p-4 rounded-3xl border border-[#EDE7D9] shadow-2xs space-y-3.5">
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider font-heading">
            Eligibility & Qualifications
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Minimum Education:</span>
              <span className="font-bold text-slate-900">10th Pass or NSQF Certificate</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Experience Level:</span>
              <span className="font-bold text-slate-900">{job.experience}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Language Preference:</span>
              <span className="font-bold text-slate-900">Odia / Hindi (Basic Spoken)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Aadhaar / e-Shram:</span>
              <span className="font-bold text-emerald-700">Mandatory (Verified on App)</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "benefits" && (
        <div className="bg-white p-4 rounded-3xl border border-[#EDE7D9] shadow-2xs space-y-3.5">
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider font-heading">
            Perks, Insurance & Allowances
          </h3>

          <div className="space-y-2.5">
            {job.benefits.map((benefit, bIdx) => (
              <div
                key={bIdx}
                className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center gap-2.5"
              >
                <div className="size-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Check className="size-3.5 stroke-[3]" />
                </div>
                <span className="text-xs font-bold text-slate-900">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "employer" && (
        <div className="bg-white p-4 rounded-3xl border border-[#EDE7D9] shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="size-3.5 text-purple-600" />
              Verified Employer
            </span>
            <Badge variant="purple" className="text-[10px]">
              Active Partner
            </Badge>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-base font-heading">
              {job.company}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {job.location}, Odisha • Verified under National Career Service (NCS)
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Recruitment Helpline:</span>
              <span className="font-bold text-purple-700">{job.contactPhone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Interview Mode:</span>
              <span className="font-bold text-slate-900">Direct Walk-in / Telephonic</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. STICKY BOTTOM ACTION BAR */}
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-3xl border border-[#EDE7D9] shadow-xl space-y-2">
        {isApplied ? (
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-extrabold text-sm">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Job Application Sent!</span>
            </div>
            <p className="text-xs text-slate-600">
              Application ID: <strong className="text-slate-900">JS-JOB-2026-4409</strong>
            </p>
            <p className="text-[11px] text-slate-500">
              The hiring coordinator at {job.company} will contact you on your registered phone number.
            </p>
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="mt-2 text-xs font-bold rounded-xl border-emerald-300 text-emerald-800"
            >
              ← Back to Jobs List
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onOpenVoiceAssistant?.(`मुझे ${job.company} की ${job.title} नौकरी के लिए आवेदन करना है।`)}
              variant="outline"
              className="size-11 rounded-2xl border-[#EDE7D9] text-purple-700 hover:bg-purple-50 shrink-0 p-0 flex items-center justify-center"
              aria-label="Voice Inquiry"
            >
              <Phone className="size-4.5 text-purple-600" />
            </Button>

            <Button
              onClick={handleApply}
              className="flex-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm py-3 rounded-2xl shadow-lg shadow-purple-600/30 gap-2 cursor-pointer"
            >
              <Sparkles className="size-4" />
              <span>Apply for Job (1-Click)</span>
            </Button>
          </div>
        )}
      </div>

    </div>
  );
}
