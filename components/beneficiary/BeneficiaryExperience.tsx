"use client";

import React, { useState } from "react";
import { WebDashboard } from "@/components/dashboard/WebDashboard";
import { MobileDashboard } from "@/components/dashboard/MobileDashboard";
import { useIsMobile } from "@/lib/useIsMobile";
import {
  INITIAL_BENEFICIARIES,
  SAMPLE_PATHWAYS,
  BeneficiaryProfile,
  PathwayOption,
  SkillItem
} from "@/lib/data";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Zap,
  TrendingUp,
  Store,
  MapPin,
  Clock,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  FileText,
  Building2,
  HelpCircle,
  RefreshCw,
  Sliders,
  Play,
  RotateCcw,
  Check,
  LayoutDashboard,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BeneficiaryProfileData } from "@/components/onboarding/PersonalVoiceOnboarding";
import confetti from "canvas-confetti";

interface BeneficiaryExperienceProps {
  beneficiaryProfile?: BeneficiaryProfileData | null;
}

export function BeneficiaryExperience({ beneficiaryProfile }: BeneficiaryExperienceProps = {}) {
  const [viewMode, setViewMode] = useState<"dashboard" | "advanced_tools">("dashboard");
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>("BEN-2026-901");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [selectedPathway, setSelectedPathway] = useState<PathwayOption | null>(
    SAMPLE_PATHWAYS["BEN-2026-901"][0]
  );
  const [activeTab, setActiveTab] = useState<"profiler" | "pathways" | "passport" | "enterprise">("pathways");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const currentBeneficiary =
    INITIAL_BENEFICIARIES.find((b) => b.id === selectedBeneficiaryId) ||
    INITIAL_BENEFICIARIES[0];

  const pathways = SAMPLE_PATHWAYS[selectedBeneficiaryId] || SAMPLE_PATHWAYS["BEN-2026-901"];

  const handleSelectPathway = (path: PathwayOption) => {
    setSelectedPathway(path);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#6B34EB", "#3B82F6", "#F59E0B", "#10B981"]
    });
  };

  const simulateVoiceRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
    }, 3000);
  };

  const playVoicePrompt = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 4000);
  };

  const isMobile = useIsMobile();

  // Primary Default Experience: Responsive Reference Dashboard
  if (viewMode === "dashboard") {
    return (
      <div className="w-full">
        {isMobile ? (
          <MobileDashboard beneficiaryProfile={beneficiaryProfile} />
        ) : (
          <WebDashboard beneficiaryProfile={beneficiaryProfile} />
        )}
      </div>
    );
  }

  // Advanced Tools Experience (3 Pathways, Voice Profiler, Enterprise Builder, Passport)
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Return to Dashboard Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setViewMode("dashboard")}
          className="flex items-center gap-1.5 text-xs font-extrabold text-purple-700 bg-white hover:bg-purple-50 px-4 py-2 rounded-2xl border border-purple-200 shadow-2xs transition-all cursor-pointer"
        >
          <LayoutDashboard className="size-4" />
          <span>← Return to Main Dashboard</span>
        </button>

        <Badge variant="purple" className="text-xs">
          Advanced Engine Explorer
        </Badge>
      </div>

      {/* Top Banner & Beneficiary Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-purple-800/40">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="bg-purple-500/20 text-purple-200 border-purple-400/30 text-xs">
              Layer 1 — Beneficiary Surface
            </Badge>
            <span className="text-xs text-purple-300 font-medium">Voice-First Livelihood Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
            AI Livelihood Profiling & Pathway Engine
          </h1>
          <p className="text-sm text-purple-200/90 max-w-2xl">
            "From what a beneficiary can say, to what they can learn, to where they can earn."
          </p>
        </div>

        {/* Quick Demo Beneficiary Selector */}
        <div className="flex flex-col gap-1.5 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shrink-0">
          <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider">
            Switch Beneficiary Persona:
          </span>
          <div className="flex items-center gap-1.5">
            {INITIAL_BENEFICIARIES.map((ben) => (
              <button
                key={ben.id}
                onClick={() => {
                  setSelectedBeneficiaryId(ben.id);
                  const newPaths = SAMPLE_PATHWAYS[ben.id] || SAMPLE_PATHWAYS["BEN-2026-901"];
                  setSelectedPathway(newPaths[0]);
                }}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  selectedBeneficiaryId === ben.id
                    ? "bg-purple-500 text-white shadow-md font-extrabold"
                    : "bg-white/5 text-purple-200 hover:bg-white/15"
                }`}
              >
                {ben.name.split(" ")[0]} ({ben.district})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Surface Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("pathways")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "pathways"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Sparkles className="size-4" />
          <span>3 Parallel Pathways</span>
        </button>

        <button
          onClick={() => setActiveTab("profiler")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "profiler"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Mic className="size-4" />
          <span>AI Voice Profiler & Skill Discovery</span>
        </button>

        <button
          onClick={() => setActiveTab("enterprise")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "enterprise"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Store className="size-4" />
          <span>Enterprise Builder (PM-AJAY Grant)</span>
        </button>

        <button
          onClick={() => setActiveTab("passport")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "passport"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileText className="size-4" />
          <span>Livelihood Passport & Twin</span>
        </button>
      </div>

      {/* Main Tab Views */}
      {activeTab === "pathways" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3 Pathway Cards */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">
                  AI-Optimized Livelihood Pathways
                </h2>
                <p className="text-xs text-slate-500">
                  Computed based on {currentBeneficiary.name}'s informal skills, {currentBeneficiary.district} district demand & {currentBeneficiary.mobilityConstraintKm}km radius constraint.
                </p>
              </div>
              <Badge variant="success" className="text-xs">
                Constraint-Engine Verified
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pathways.map((path) => {
                const isSelected = selectedPathway?.id === path.id;
                return (
                  <div
                    key={path.id}
                    onClick={() => handleSelectPathway(path)}
                    className={`relative flex flex-col justify-between p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-purple-50/50 border-purple-600 shadow-lg shadow-purple-600/10 scale-[1.02]"
                        : "bg-white border-slate-200/80 hover:border-purple-300 hover:shadow-md"
                    }`}
                  >
                    {/* Top Badges */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                            path.type === "fast_income"
                              ? "bg-amber-100 text-amber-800"
                              : path.type === "career_growth"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {path.type === "fast_income" && "⚡ Fast Income"}
                          {path.type === "career_growth" && "🚀 Career Growth"}
                          {path.type === "entrepreneurship" && "🌱 Micro-Enterprise"}
                        </span>
                        <div className="flex items-center gap-1 text-purple-700 font-extrabold text-sm">
                          <span>{path.matchScore}%</span>
                          <span className="text-[10px] font-semibold text-slate-500">Fit</span>
                        </div>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 leading-snug font-heading">
                        {path.title}
                      </h3>

                      <p className="text-xs text-slate-600 font-medium">
                        {path.role}
                      </p>
                    </div>

                    {/* Metric Highlights */}
                    <div className="my-4 py-3 border-y border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-purple-600" />
                          Time to Income:
                        </span>
                        <span className="font-bold text-slate-900">
                          {path.estimatedTimeToIncomeDays} days
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <TrendingUp className="size-3.5 text-emerald-600" />
                          Est. Income:
                        </span>
                        <span className="font-bold text-slate-900">
                          {path.incomePotentialMonthly}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-indigo-600" />
                          Nearest Centre:
                        </span>
                        <span className="font-bold text-slate-900">
                          {path.nearestCentre.distanceKm} km
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant={isSelected ? "gradient" : "outline"}
                      size="sm"
                      className="w-full text-xs font-bold rounded-xl mt-1"
                    >
                      {isSelected ? "Selected Pathway" : "View Details"}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Selected Pathway Deep-Dive Card */}
            {selectedPathway && (
              <Card className="border-purple-200/80 bg-white/90 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="purple" className="text-xs">
                          NSQF Level {selectedPathway.nsqfLevel} • QP: {selectedPathway.qpCode}
                        </Badge>
                        <Badge variant="success" className="text-xs">
                          {selectedPathway.localJobCountWithinRadius} Verified Openings within {currentBeneficiary.mobilityConstraintKm} km
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-extrabold text-slate-900 font-heading">
                        {selectedPathway.title}
                      </CardTitle>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={playVoicePrompt}
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs font-bold rounded-xl text-purple-700 border-purple-200"
                      >
                        <Volume2 className="size-3.5" />
                        <span>{isPlayingAudio ? "Playing Odia/Hindi..." : "Audio Explanation"}</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Plain Language Rationale */}
                  <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 space-y-2">
                    <h4 className="text-xs font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-purple-600" />
                      Explainable "Why This Recommendation?"
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                      {selectedPathway.whyThisRecommendation.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="size-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skill Gap Matrix (Existing vs Needed) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2">
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <Check className="size-4 text-emerald-600" />
                        Skills You Already Have ({selectedPathway.skillGaps.existing.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPathway.skillGaps.existing.map((skill, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-semibold bg-white text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-2">
                      <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <Sparkles className="size-4 text-amber-600" />
                        Target Skills to Learn ({selectedPathway.skillGaps.needed.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPathway.skillGaps.needed.map((skill, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-semibold bg-white text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs"
                          >
                            + {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Nearest Training Centre Card */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Recommended Training Facility (SIDH Verified)
                      </span>
                      <h5 className="text-sm font-bold text-slate-900">
                        {selectedPathway.nearestCentre.name}
                      </h5>
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span>📍 {selectedPathway.nearestCentre.distanceKm} km away</span>
                        <span>⭐ {selectedPathway.nearestCentre.rating} / 5</span>
                        <span>🗓️ Next Batch: {selectedPathway.nearestCentre.nextBatchDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="purple" className="text-xs">
                        Free Hostel & Transport under PM-AJAY
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Beneficiary Persona Snapshot */}
          <div className="space-y-5">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                    Beneficiary Profile
                  </span>
                  <Badge variant="secondary" className="text-[11px]">
                    {currentBeneficiary.id}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  {currentBeneficiary.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  {currentBeneficiary.age} yrs • {currentBeneficiary.education} • {currentBeneficiary.district}, {currentBeneficiary.state}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                {/* Spoken Voice Statement Box */}
                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/70 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                    <Volume2 className="size-3.5 text-amber-700" />
                    Spoken Statement (Vernacular Audio):
                  </span>
                  <p className="text-xs text-slate-800 italic font-medium">
                    "{currentBeneficiary.rawSpokenInput}"
                  </p>
                </div>

                {/* Discovered Skills */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800">
                    Discovered Skills & Confidence:
                  </span>
                  <div className="space-y-2">
                    {currentBeneficiary.extractedSkills.map((sk) => (
                      <div
                        key={sk.id}
                        className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">{sk.name}</span>
                          <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                            {sk.confidence}% Conf.
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>NSQF Level {sk.nsqfLevel}</span>
                          <span>QP Code: {sk.qpCode}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action to Full Passport */}
                <Button
                  onClick={() => setActiveTab("passport")}
                  variant="outline"
                  className="w-full text-xs font-bold rounded-xl gap-1.5"
                >
                  <span>View Livelihood Passport</span>
                  <ChevronRight className="size-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: AI Voice Profiler & Discovery */}
      {activeTab === "profiler" && (
        <Card className="border-purple-200/70 bg-white shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-extrabold text-slate-900 font-heading">
                  Conversational Livelihood Interview Engine
                </CardTitle>
                <CardDescription className="text-xs">
                  Low-literacy voice dialogue in Odia, Hindi & regional dialects. Converts unstructured speech into official NSQF capabilities.
                </CardDescription>
              </div>
              <Badge variant="purple" className="text-xs">
                BHASHINI Speech-to-Ontology
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-purple-50/50 to-white rounded-3xl border border-purple-100 text-center space-y-4">
              <div className="relative">
                {isRecording && (
                  <div className="absolute -inset-4 rounded-full bg-purple-500/20 animate-ping"></div>
                )}
                <button
                  onClick={simulateVoiceRecording}
                  className={`size-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer ${
                    isRecording
                      ? "bg-red-500 scale-110 shadow-red-500/30"
                      : "bg-purple-600 hover:bg-purple-700 shadow-purple-600/30"
                  }`}
                >
                  {isRecording ? <MicOff className="size-8 animate-pulse" /> : <Mic className="size-8" />}
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-800">
                  {isRecording ? "Listening & Extracting Concepts in Real-Time..." : "Tap to Speak or Test Audio Recording"}
                </span>
                <p className="text-xs text-slate-500 max-w-sm">
                  Try speaking: "मैं धान की खेती करता हूँ और गांव में लोगों के मोटर पंप और इन्वर्टर ठीक करता हूँ"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Enterprise Builder */}
      {activeTab === "enterprise" && (
        <Card className="border-emerald-200 bg-white shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-extrabold text-slate-900 font-heading">
                  AI Enterprise Builder — Village Solar & Pump Clinic
                </CardTitle>
                <CardDescription className="text-xs">
                  Auto-generated micro-business proposal supporting PM-AJAY self-employment grants and Mudra loans.
                </CardDescription>
              </div>
              <Badge variant="success" className="text-xs">
                PM-AJAY Capital Grant Eligible
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1.5">
                <span className="font-bold text-emerald-900 text-xs">Estimated Capital Needed:</span>
                <p className="text-lg font-extrabold text-emerald-700">₹65,000</p>
                <span className="text-[11px] text-slate-600">Toolkit (₹40k) + Spares buffer (₹25k)</span>
              </div>

              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-1.5">
                <span className="font-bold text-purple-900 text-xs">Scheme Funding Convergence:</span>
                <p className="text-sm font-extrabold text-purple-700">
                  ₹35,000 PM-AJAY Grant + ₹30,000 Mudra Shishu
                </p>
                <span className="text-[11px] text-slate-600">Zero collateral required for SC/ST beneficiaries</span>
              </div>

              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1.5">
                <span className="font-bold text-blue-900 text-xs">Estimated Break-even:</span>
                <p className="text-lg font-extrabold text-blue-700">3 Months</p>
                <span className="text-[11px] text-slate-600">Avg net profit ₹22,000 – ₹35,000/mo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Livelihood Passport */}
      {activeTab === "passport" && (
        <Card className="border-purple-200 bg-white shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-extrabold text-slate-900 font-heading">
                  One Beneficiary, One Livelihood Passport
                </CardTitle>
                <CardDescription className="text-xs">
                  Portable, tamper-proof digital skill identity synchronized with Skill India Digital Hub (SIDH) and e-Shram.
                </CardDescription>
              </div>
              <Badge variant="purple" className="text-xs">
                Passport ID: JS-OR-2026-0901
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white rounded-3xl shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-purple-600 flex items-center justify-center font-extrabold text-lg shadow-md">
                    RS
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-heading">{currentBeneficiary.name}</h3>
                    <p className="text-xs text-purple-200">
                      {currentBeneficiary.district}, {currentBeneficiary.state} • Aadhaar / e-Shram Linked
                    </p>
                  </div>
                </div>

                <Badge variant="purple" className="bg-purple-500/30 text-purple-200 border-purple-400/40 text-xs">
                  Active Digital Twin
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
