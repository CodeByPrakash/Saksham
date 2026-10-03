"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Clock,
  MapPin,
  Calendar,
  Building2,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  Phone,
  BookOpen,
  Award,
  TrendingUp,
  Users,
  Check,
  Briefcase,
  Store,
  ChevronRight,
  Info
} from "lucide-react";
import { CourseItem } from "../DashboardShared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSafeCourseImage } from "@/lib/skillTrainingGenerator";
import confetti from "canvas-confetti";

interface MobileTrainingDetailPageProps {
  course: CourseItem;
  onBack: () => void;
  onOpenVoiceAssistant?: (promptText?: string) => void;
}

export function MobileTrainingDetailPage({
  course,
  onBack,
  onOpenVoiceAssistant
}: MobileTrainingDetailPageProps) {
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"overview" | "syllabus" | "center" | "benefits">("overview");

  // Detailed syllabus modules based on course (dynamic if detected or default fallback)
  const syllabusModules: { title: string; duration: string; topics: string[] }[] = (course as any).syllabusModules || [
    {
      title: `Module 1: Foundations & Occupational Safety (${course.title.split("(")[0].trim()})`,
      duration: "40 Hours",
      topics: [
        "Workplace safety standards & PPE protocols",
        "Tool identification, calibration and maintenance",
        "First aid and emergency hazard containment"
      ]
    },
    {
      title: "Module 2: Core Domain Skills & Practical Lab",
      duration: "140 Hours",
      topics: [
        "Standard operating procedures (SOP) & practical assemblies",
        "Component diagnostic testing and micro-level troubleshooting",
        "Quality testing against BIS and NSQF standards"
      ]
    },
    {
      title: "Module 3: Digital Literacy & Financial Inclusion",
      duration: "30 Hours",
      topics: [
        "UPI digital payments and QR code invoicing",
        "Aadhaar-enabled digital records on DigiLocker",
        "PM-AJAY and Mudra loan application processes"
      ]
    },
    {
      title: "Module 4: On-The-Job Training (OJT) & Enterprise Launch",
      duration: "150 Hours",
      topics: [
        "Hands-on live deployment at certified industry partners",
        "Customer grievance redressal and soft skills",
        "Practical portfolio assessment & NSDC certification"
      ]
    }
  ];

  const careerOutcomes: string[] = (course as any).careerOutcomes || [
    "Certified Skilled Contractor in Local Region",
    "PM-AJAY Supported Micro-Enterprise Entrepreneur",
    "Average Monthly Earnings: ₹20,000 – ₹38,000"
  ];

  const subsidyGrantAmount: string = (course as any).subsidyGrantAmount || "₹35,000 PM-AJAY Capital Subsidy Grant";

  const handleApply = () => {
    setIsApplied(true);
    confetti({
      particleCount: 90,
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
          <span>Back to Training</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${isSaved ? "bg-purple-100 text-purple-700" : "text-slate-500 hover:bg-slate-100"
              }`}
            aria-label="Save Course"
          >
            <Bookmark className={`size-4 ${isSaved ? "fill-purple-600 text-purple-600" : ""}`} />
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: course.title,
                  text: `Check out ${course.title} training under PM-AJAY on Sakhyam-AI!`,
                  url: window.location.href
                }).catch(() => { });
              }
            }}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Share Course"
          >
            <Share2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Dynamic Detected Skill Indicator */}
      {(course as any).isDetectedSkill && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl flex items-center gap-2.5 text-xs text-purple-900"
        >
          <Sparkles className="size-4 text-purple-600 shrink-0 animate-pulse" />
          <div className="flex-1">
            <span className="font-extrabold block text-purple-950">
              ✨ Custom AI Synthesized Training Program
            </span>
            <span className="text-[11px] text-purple-700">
              {(course as any).detectedReason || "Specially generated based on your detected skill match."}
            </span>
          </div>
        </motion.div>
      )}

      {/* 2. HERO COURSE CARD */}
      <div className="relative overflow-hidden rounded-[32px] border border-[#EDE7D9] bg-white shadow-sm">
        {/* Cover Photo */}
        <div className="relative h-48 w-full bg-slate-100">
          <Image
            src={getSafeCourseImage(course.image, course.title, (course as any).category)}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

          {/* Badges Top Left & Right */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-600 text-white text-[11px] font-extrabold rounded-full shadow-md">
              NSQF Level {course.nsqfLevel}
            </span>
            <span
              className={`px-3 py-1 text-white text-[11px] font-extrabold rounded-full shadow-md ${course.badgeColor === "blue"
                ? "bg-blue-600"
                : course.badgeColor === "amber"
                  ? "bg-amber-500"
                  : course.badgeColor === "purple"
                    ? "bg-purple-600"
                    : "bg-emerald-600"
                }`}
            >
              {course.badge}
            </span>
          </div>

          <div className="absolute top-3.5 right-3.5">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-slate-900 text-[10.5px] font-extrabold rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="size-3 text-purple-600" />
              98% Fit
            </span>
          </div>

          {/* Title and QP Code */}
          <div className="absolute bottom-3.5 left-4 right-4 text-white">
            <h1 className="text-xl font-black font-heading leading-snug drop-shadow-sm">
              {course.title}
            </h1>
            <p className="text-[11px] text-purple-200 font-semibold mt-0.5 flex items-center gap-2">
              <span>QP Code: {course.qpCode}</span>
              <span>•</span>
              <span>SIDH & NSDC Certified</span>
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
                {isPlayingAudio ? "Playing Vernacular Audio..." : "Listen in Odia / Hindi (ऑडियो सुनें)"}
              </span>
              <span className="text-[10px] text-purple-600">
                {isPlayingAudio ? "AI narrator explaining course benefits" : "Tap to listen to full course details"}
              </span>
            </div>
          </div>

          <button
            onClick={() => onOpenVoiceAssistant?.(`मुझे ${course.title} कोर्स के बारे में अधिक जानकारी चाहिए।`)}
            className="text-[10.5px] font-extrabold text-purple-700 bg-white px-2.5 py-1 rounded-xl border border-purple-200 shadow-2xs hover:bg-purple-50 transition-colors"
          >
            Ask AI
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white">
          <div className="bg-purple-50/70 p-2.5 rounded-2xl border border-purple-100/80 flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-purple-700 uppercase flex items-center gap-1">
              <Clock className="size-3" />
              Duration
            </span>
            <span className="font-extrabold text-slate-900 text-xs">{course.duration}</span>
          </div>

          <div className="bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-100/80 flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-emerald-700 uppercase flex items-center gap-1">
              <Coins className="size-3" />
              Stipend
            </span>
            <span className="font-extrabold text-slate-900 text-xs truncate">{course.stipend.split("+")[0]}</span>
          </div>

          <div className="bg-blue-50/70 p-2.5 rounded-2xl border border-blue-100/80 flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-blue-700 uppercase flex items-center gap-1">
              <MapPin className="size-3" />
              Location
            </span>
            <span className="font-extrabold text-slate-900 text-xs">{course.location}</span>
          </div>

          <div className="bg-amber-50/70 p-2.5 rounded-2xl border border-amber-100/80 flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
              <Calendar className="size-3" />
              Batch Starts
            </span>
            <span className="font-extrabold text-slate-900 text-xs">{course.batchDate}</span>
          </div>
        </div>
      </div>

      {/* 3. SECTION NAVIGATION PILLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: "overview", label: "Overview" },
          { id: "syllabus", label: "Curriculum & Modules" },
          { id: "center", label: "Training Center" },
          { id: "benefits", label: "PM-AJAY Grants" }
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
          {/* Course Summary */}
          <div className="bg-white p-4 rounded-3xl border border-[#EDE7D9] shadow-2xs space-y-2">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider font-heading flex items-center gap-1.5">
              <BookOpen className="size-4 text-purple-600" />
              Course Description
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {course.description}
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Eligibility Requirement:</span>
              <span className="font-bold text-slate-900">{course.eligibility}</span>
            </div>
          </div>

          {/* Career & Earning Potential */}
          <div className="bg-white p-4 rounded-3xl border border-[#EDE7D9] shadow-2xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider font-heading flex items-center gap-1.5">
              <TrendingUp className="size-4 text-emerald-600" />
              Career & Earning Potential
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-800 font-bold text-xs">
                  <Briefcase className="size-3.5" />
                  <span>Wage Employment</span>
                </div>
                <p className="text-sm font-black text-slate-900">₹14,000 – ₹22,000 / mo</p>
                <p className="text-[10px] text-slate-600">Local industry contractors, service hubs, PHCs & retail stores.</p>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                  <Store className="size-3.5" />
                  <span>Micro-Enterprise</span>
                </div>
                <p className="text-sm font-black text-slate-900">₹25,000 – ₹45,000 / mo</p>
                <p className="text-[10px] text-slate-600">Village repair clinic or tailoring boutique with ₹35k PM-AJAY capital.</p>
              </div>
            </div>
          </div>

          {/* Scheme Package Preview */}
          <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white p-4 rounded-3xl shadow-md space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40">
                PM-AJAY 100% Scholarship
              </span>
              <span className="text-xs font-bold text-emerald-400">Zero Cost</span>
            </div>
            <h4 className="font-extrabold text-sm leading-snug font-heading">
              Complete Training & Livelihood Grant Package
            </h4>
            <ul className="text-[11px] text-purple-200 space-y-1 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                <span>Free Course Fee + Study Materials + Uniform</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                <span>Monthly Stipend directly in DBT Aadhaar Bank Account</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                <span>Free Tool-kit & Equipment subsidy on final graduation</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === "syllabus" && (
        <div className="bg-white p-4 rounded-3xl border border-[#EDE7D9] shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider font-heading">
              NSQF Aligned Curriculum (400 Total Hours)
            </h3>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
              4 Modules
            </span>
          </div>

          <div className="space-y-3">
            {syllabusModules.map((module, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">
                    {module.title}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border">
                    {module.duration}
                  </span>
                </div>

                <ul className="space-y-1">
                  {module.topics.map((topic, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-1.5 text-[11px] text-slate-600 font-medium">
                      <Check className="size-3 text-purple-600 mt-0.5 shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "center" && (
        <div className="bg-white p-4 rounded-3xl border border-[#EDE7D9] shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="size-3.5 text-purple-600" />
              Verified Training Facility
            </span>
            <Badge variant="purple" className="text-[10px]">
              SIDH Verified
            </Badge>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-base font-heading">
              {course.centerName}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Block & District Center • {course.centerDistance}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-slate-50 rounded-xl border">
              <span className="text-[9.5px] text-slate-400 block font-bold">RATING</span>
              <span className="font-extrabold text-xs text-slate-900">⭐ 4.8 / 5</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border">
              <span className="text-[9.5px] text-slate-400 block font-bold">SEATS</span>
              <span className="font-extrabold text-xs text-purple-700">{course.openings} Open</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border">
              <span className="text-[9.5px] text-slate-400 block font-bold">BATCH</span>
              <span className="font-extrabold text-xs text-slate-900">{course.batchDate}</span>
            </div>
          </div>

          <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100 space-y-1.5">
            <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-purple-600" />
              Facility Amenities Included:
            </span>
            <ul className="text-[11px] text-slate-700 space-y-1 font-medium">
              <li>✓ Dedicated safe women hostel with 24/7 security & CCTV</li>
              <li>✓ Free hygienic lunch & nutritious breakfast</li>
              <li>✓ Free daily bus shuttle pass from village pick-up points</li>
              <li>✓ High-speed digital computer lab with vernacular tutor</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === "benefits" && (
        <div className="bg-white p-4 rounded-3xl border border-[#EDE7D9] shadow-2xs space-y-3.5">
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider font-heading flex items-center gap-1.5">
            <Coins className="size-4 text-purple-600" />
            Financial Aid & Subsidy Breakdown
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Tuition & Exam Fees</span>
                <span className="text-[10.5px] text-slate-500">Sponsored by Ministry of Social Justice</span>
              </div>
              <span className="font-extrabold text-purple-700">100% Free (₹0)</span>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Monthly Living Stipend</span>
                <span className="text-[10.5px] text-slate-500">DBT transferred every 30 days</span>
              </div>
              <span className="font-extrabold text-emerald-700">{course.stipend.split("+")[0]}</span>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Graduation Toolkit Voucher</span>
                <span className="text-[10.5px] text-slate-500">Free equipment kit for trade</span>
              </div>
              <span className="font-extrabold text-amber-700">Free Starter Kit</span>
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
              <span>Application Submitted Successfully!</span>
            </div>
            <p className="text-xs text-slate-600">
              Application ID: <strong className="text-slate-900">JS-TRN-2026-9821</strong>
            </p>
            <p className="text-[11px] text-slate-500">
              Your field worker and PMKK center will reach out to schedule your document verification.
            </p>
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="mt-2 text-xs font-bold rounded-xl border-emerald-300 text-emerald-800"
            >
              ← Back to Training List
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onOpenVoiceAssistant?.(`मुझे ${course.title} कोर्स में कैसे आवेदन करना है?`)}
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
              <span>Apply Free with PM-AJAY (1-Click)</span>
            </Button>
          </div>
        )}
      </div>

    </div>
  );
}
