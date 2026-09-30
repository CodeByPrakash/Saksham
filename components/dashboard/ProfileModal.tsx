"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Sprout,
  Edit3,
  CheckCircle2,
  Save,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  Wrench,
  IndianRupee,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";
import { CURRENT_BENEFICIARY, BeneficiaryData } from "./DashboardShared";
import { BeneficiaryProfileData } from "@/components/onboarding/PersonalVoiceOnboarding";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getNSQFAgeBracket, getAvatarForGender } from "@/lib/nsqfAge";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiary?: BeneficiaryData;
  beneficiaryProfile?: BeneficiaryProfileData | null;
  onUpdateProfile?: (updated: Partial<BeneficiaryProfileData>) => void;
}

const POPULAR_NSQF_TRADES = [
  { label: "🚁 Kisan Drone Pilot", value: "Kisan Drone Pilot & Agri-Sprayer (AGR/Q7004)", code: "AGR/Q7004" },
  { label: "☀️ Solar PV Agri-Pump", value: "Solar PV Agri-Pump Specialist (SGJ/Q0102)", code: "SGJ/Q0102" },
  { label: "✂️ Self Employed Tailor", value: "Self Employed Tailor (AMH/Q1947)", code: "AMH/Q1947" },
  { label: "⚡ Domestic Electrician", value: "Domestic Electrician (ELE/Q6001)", code: "ELE/Q6001" },
  { label: "🏥 Healthcare GDA", value: "Healthcare General Duty Assistant (HSS/Q5101)", code: "HSS/Q5101" },
  { label: "💻 CSC Digital Mitra", value: "CSC Digital e-Gram Mitra (SSC/Q2212)", code: "SSC/Q2212" },
  { label: "🍄 Mushroom Cultivation", value: "Commercial Mushroom & Spawn Cultivator (AGR/Q7803)", code: "AGR/Q7803" },
  { label: "🥛 Dairy Processing", value: "Dairy Processing & Value Added Products (FIC/Q2001)", code: "FIC/Q2001" },
  { label: "🐟 Biofloc Fisheries", value: "Freshwater Biofloc Aquaculture Specialist (AGR/Q4910)", code: "AGR/Q4910" },
  { label: "🛢️ Cold-Press Oil Mill", value: "Cold-Press Edible Oil Processing Entrepreneur (FIC/Q5003)", code: "FIC/Q5003" },
  { label: "🪑 Modular Carpentry", value: "Smart Modular Furniture & Wood Craftsman (FFS/Q0103)", code: "FFS/Q0103" },
  { label: "🔧 Plumbing & Irrigation", value: "Plumbing & Micro-Irrigation Technician (PSC/Q0104)", code: "PSC/Q0104" }
];

export function ProfileModal({
  isOpen,
  onClose,
  beneficiary,
  beneficiaryProfile,
  onUpdateProfile
}: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Initial source values
  const currentGender = (beneficiaryProfile?.gender || beneficiary?.gender || "female") as "male" | "female";
  const currentAge = beneficiaryProfile?.age || beneficiary?.age || (currentGender === "female" ? 52 : 28);
  const currentName = beneficiaryProfile?.fullName || beneficiary?.name || CURRENT_BENEFICIARY.name;
  const currentDistrict = beneficiaryProfile?.district || beneficiary?.district || CURRENT_BENEFICIARY.district;
  const currentState = beneficiaryProfile?.state || beneficiary?.state || CURRENT_BENEFICIARY.state;
  const currentEdu = beneficiaryProfile?.education || beneficiary?.education || CURRENT_BENEFICIARY.education;
  const currentAspiration = beneficiaryProfile?.aspiration || beneficiary?.lookingFor || CURRENT_BENEFICIARY.lookingFor;
  const currentCourse = beneficiaryProfile?.nsqfCourse || (beneficiaryProfile?.skills && beneficiaryProfile.skills[0]) || "Kisan Drone Pilot & Agri-Sprayer (AGR/Q7004)";
  const currentGrant = beneficiaryProfile?.grantEligibility || "₹35,000 Capital Subsidy + ₹3,500/mo Stipend";
  const currentCode = beneficiaryProfile?.nsqfCode || "AGR/Q7004";

  // Editable form fields
  const [editGender, setEditGender] = useState<"male" | "female">(currentGender);
  const [editAge, setEditAge] = useState<number>(currentAge);
  const [editName, setEditName] = useState<string>(currentName);
  const [editDistrict, setEditDistrict] = useState<string>(currentDistrict);
  const [editState, setEditState] = useState<string>(currentState);
  const [editEducation, setEditEducation] = useState<string>(currentEdu);
  const [editAspiration, setEditAspiration] = useState<string>(currentAspiration);
  const [editNsqfCourse, setEditNsqfCourse] = useState<string>(currentCourse);
  const [editGrantEligibility, setEditGrantEligibility] = useState<string>(currentGrant);

  // Sync state when modal is opened or props change
  useEffect(() => {
    if (isOpen) {
      setEditGender(currentGender);
      setEditAge(currentAge);
      setEditName(currentName);
      setEditDistrict(currentDistrict);
      setEditState(currentState);
      setEditEducation(currentEdu);
      setEditAspiration(currentAspiration);
      setEditNsqfCourse(currentCourse);
      setEditGrantEligibility(currentGrant);
      setIsEditing(false);
      setSavedSuccess(false);
    }
  }, [isOpen, beneficiary, beneficiaryProfile]);

  if (!isOpen) return null;

  // Real-time calculations for active values
  const activeGender = isEditing ? editGender : currentGender;
  const activeAge = isEditing ? editAge : currentAge;
  const activeBracket = getNSQFAgeBracket(activeAge);
  const activeAvatar = getAvatarForGender(activeGender);
  const activeName = isEditing ? editName : currentName;
  const activeDistrict = isEditing ? editDistrict : currentDistrict;
  const activeState = isEditing ? editState : currentState;
  const activeEducation = isEditing ? editEducation : currentEdu;
  const activeAspiration = isEditing ? editAspiration : currentAspiration;
  const activeCourse = isEditing ? editNsqfCourse : currentCourse;
  const activeGrant = isEditing ? editGrantEligibility : currentGrant;

  const handleSave = () => {
    // Determine appropriate QP code if known
    const matchingPreset = POPULAR_NSQF_TRADES.find((t) => t.value === editNsqfCourse || t.label.includes(editNsqfCourse));
    const finalCode = matchingPreset ? matchingPreset.code : currentCode;

    const updated: Partial<BeneficiaryProfileData> = {
      fullName: editName.trim() || currentName,
      gender: editGender,
      age: editAge,
      ageCategory: activeBracket.badgeLabel,
      district: editDistrict.trim() || currentDistrict,
      state: editState.trim() || currentState,
      education: editEducation,
      aspiration: editAspiration,
      nsqfCourse: editNsqfCourse.trim() || currentCourse,
      nsqfCode: finalCode,
      skills: [editNsqfCourse.trim() || currentCourse, "Vocational Skill Execution", "Safety Protocols"],
      grantEligibility: editGrantEligibility.trim() || currentGrant,
      avatarUrl: getAvatarForGender(editGender)
    };

    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }

    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("Sakhyam_beneficiary_profile");
        const existing = saved ? JSON.parse(saved) : {};
        const merged = { ...existing, ...updated };
        localStorage.setItem("Sakhyam_beneficiary_profile", JSON.stringify(merged));
        if (updated.nsqfCourse) {
          localStorage.setItem("Sakhyam_detected_job_skill", updated.nsqfCourse);
        }
        window.dispatchEvent(new CustomEvent("beneficiaryProfileUpdated", { detail: merged }));
      } catch { }
    }

    setIsEditing(false);
    setSavedSuccess(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch { }

    setTimeout(() => setSavedSuccess(false), 4000);
  };

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
          {/* Header Banner */}
          <div className="p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative size-12 rounded-full overflow-hidden border-2 border-white/40 bg-purple-800 shrink-0">
                <Image
                  src={activeAvatar}
                  alt={activeName}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-lg tracking-tight font-heading truncate">
                  {activeName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-purple-200/80">
                  <span className="capitalize">{activeGender}</span>
                  <span>•</span>
                  <span>Age {activeAge}</span>
                  <span>•</span>
                  <span className="text-amber-300 font-semibold">{activeBracket.tag}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0 ml-2"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
            {savedSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 font-bold flex items-center gap-2 text-xs shadow-sm"
              >
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Profile, NSQF trade, and passport details saved successfully!</span>
              </motion.div>
            )}

            {/* PM-AJAY Livelihood Passport Card */}
            <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white rounded-2xl p-4 shadow-md border border-purple-800/40 space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/15 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  <span className="text-xs font-extrabold tracking-wide uppercase font-heading">
                    PM-AJAY Livelihood Passport
                  </span>
                </div>
                <Badge className="text-[9px] bg-emerald-500/20 text-emerald-300 border-emerald-400/40 font-bold">
                  ✓ Verified Issued
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white/10 p-2 rounded-xl">
                  <span className="text-[10px] text-purple-200 block">Candidate & Gender</span>
                  <span className="font-extrabold text-white truncate block capitalize">
                    {activeName} ({activeGender})
                  </span>
                </div>
                <div className="bg-white/10 p-2 rounded-xl">
                  <span className="text-[10px] text-purple-200 block">Age & NSQF Bracket</span>
                  <span className="font-extrabold text-amber-300 truncate block">
                    {activeAge} yrs • {activeBracket.tag}
                  </span>
                </div>
                <div className="bg-white/10 p-2 rounded-xl">
                  <span className="text-[10px] text-purple-200 block">Location</span>
                  <span className="font-extrabold text-white truncate block">{activeDistrict}, {activeState}</span>
                </div>
                <div className="bg-white/10 p-2 rounded-xl">
                  <span className="text-[10px] text-amber-200 block">NSQF Skill Alignment</span>
                  <span className="font-extrabold text-white truncate block">{activeCourse}</span>
                </div>
                <div className="bg-white/10 p-2 rounded-xl col-span-2">
                  <span className="text-[10px] text-emerald-200 block">Capital Support / Grant</span>
                  <span className="font-extrabold text-emerald-300 truncate block">{activeGrant}</span>
                </div>
              </div>
            </div>

            {/* Profile Editing / View Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-purple-600" />
                  <span>Beneficiary Profile & NSQF Settings</span>
                </h4>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-bold text-purple-700 flex items-center gap-1 hover:underline cursor-pointer bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors border border-purple-200"
                >
                  <Edit3 className="size-3.5" />
                  <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                </button>
              </div>

              {isEditing ? (
                /* ================= EDIT MODE ================= */
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3.5 p-3.5 sm:p-4 bg-purple-50/60 rounded-2xl border border-purple-200 shadow-inner"
                >
                  {/* 1. GENDER SELECTOR */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-900 text-xs block">
                      Gender / लिंग
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setEditGender("male")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                          editGender === "male"
                            ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-purple-50"
                        }`}
                      >
                        <span className="text-sm">👨</span>
                        <span>Male (पुरुष)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditGender("female")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                          editGender === "female"
                            ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-purple-50"
                        }`}
                      >
                        <span className="text-sm">👩</span>
                        <span>Female (महिला)</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. AGE & NSQF LIVE BRACKET */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-900 text-xs">
                        Age & NSQF Category / उम्र
                      </label>
                      <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                        {activeBracket.badgeLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditAge((prev) => Math.max(14, prev - 1))}
                        className="size-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold cursor-pointer transition-colors"
                      >
                        <Minus className="size-3.5" />
                      </button>

                      <input
                        type="number"
                        min={14}
                        max={90}
                        value={editAge}
                        onChange={(e) => setEditAge(parseInt(e.target.value, 10) || 18)}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 text-center focus:ring-2 focus:ring-purple-400 focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => setEditAge((prev) => Math.min(90, prev + 1))}
                        className="size-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold cursor-pointer transition-colors"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <p className="text-[10.5px] text-purple-900/80 font-medium">
                      🎯 {activeBracket.description}
                    </p>
                  </div>

                  {/* 3. FULL NAME */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-900 text-xs block">
                      Full Name / पूरा नाम
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. Ramesh Soren / Savitri Devi"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>

                  {/* 4. LOCATION (District & State) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-900 text-xs block">
                        District / जिला
                      </label>
                      <input
                        type="text"
                        value={editDistrict}
                        onChange={(e) => setEditDistrict(e.target.value)}
                        placeholder="e.g. Sundargarh"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-900 text-xs block">
                        State / राज्य
                      </label>
                      <input
                        type="text"
                        value={editState}
                        onChange={(e) => setEditState(e.target.value)}
                        placeholder="e.g. Odisha"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 5. NSQF MAPPED SKILL / TRADE */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-900 text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Wrench className="size-3 text-purple-600" />
                        <span>NSQF Mapped Skill / Trade</span>
                      </span>
                      <span className="text-[10px] text-purple-600 font-normal">Select or type custom</span>
                    </label>

                    {/* Quick Trade Selection Chips */}
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-white/70 rounded-xl border border-slate-200">
                      {POPULAR_NSQF_TRADES.map((trade) => (
                        <button
                          key={trade.code}
                          type="button"
                          onClick={() => setEditNsqfCourse(trade.value)}
                          className={`text-[10px] px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer border ${
                            editNsqfCourse.includes(trade.code) || editNsqfCourse.toLowerCase().includes(trade.label.slice(2).trim().toLowerCase())
                              ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-purple-50"
                          }`}
                        >
                          {trade.label}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={editNsqfCourse}
                      onChange={(e) => setEditNsqfCourse(e.target.value)}
                      placeholder="e.g. Kisan Drone Pilot & Agri-Sprayer (AGR/Q7004)"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>

                  {/* 6. EDUCATION LEVEL */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-900 text-xs block">
                      Education / शिक्षा
                    </label>
                    <select
                      value={editEducation}
                      onChange={(e) => setEditEducation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    >
                      <option value="10th Standard (10वीं पास)">10th Standard (10वीं पास)</option>
                      <option value="8th Standard Completed">8th Standard Completed</option>
                      <option value="5th Pass / Practical Learner">5th Pass / Practical Learner</option>
                      <option value="12th / Intermediate">12th / Intermediate</option>
                      <option value="ITI / Diploma">ITI / Diploma</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </div>

                  {/* 7. CAPITAL SUPPORT / GRANT */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-900 text-xs flex items-center gap-1">
                      <IndianRupee className="size-3 text-emerald-600" />
                      <span>PM-AJAY Capital Support / Goal</span>
                    </label>
                    <input
                      type="text"
                      value={editGrantEligibility}
                      onChange={(e) => setEditGrantEligibility(e.target.value)}
                      placeholder="e.g. ₹35,000 Capital Subsidy + ₹3,500/mo Stipend"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>

                  {/* 8. LOOKING FOR / CAREER GOAL */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-900 text-xs block">
                      Career Goal / स्वरोजगार या नौकरी
                    </label>
                    <select
                      value={editAspiration}
                      onChange={(e) => setEditAspiration(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    >
                      <option value="Village Agri-Pump & Solar Repair Clinic">🏪 Village Agri-Pump & Solar Repair Clinic</option>
                      <option value="Custom Drone Hiring Center & Agri-Spraying">🚁 Custom Drone Hiring Center & Agri-Spraying</option>
                      <option value="Own Village Repair Clinic / Shop">🏪 Own Village Repair Clinic / Shop</option>
                      <option value="Assured Wage Job (Factory/Company)">💼 Assured Wage Job (Factory/Company)</option>
                      <option value="Self-Employment / Micro-Enterprise">🚀 Self-Employment / Micro-Enterprise</option>
                      <option value="Skill Certification / RPL">📜 Skill Certification / RPL</option>
                    </select>
                  </div>

                  {/* SAVE CHANGES BUTTON INSIDE FORM */}
                  <div className="pt-2">
                    <Button
                      onClick={handleSave}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white font-extrabold shadow-md gap-2 cursor-pointer transition-all"
                    >
                      <Save className="size-4" />
                      <span>Save & Apply Changes</span>
                    </Button>
                  </div>
                </motion.div>
              ) : (
                /* ================= VIEW MODE ================= */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <User className="size-3 text-indigo-600" />
                      Gender, Age & NSQF
                    </span>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 capitalize">
                        {activeGender} • {activeAge} yrs
                      </p>
                      <span className="text-[9.5px] font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                        {activeBracket.badgeLabel}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {activeBracket.description}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <MapPin className="size-3 text-purple-600" />
                      Location
                    </span>
                    <p className="font-bold text-slate-900">
                      {activeDistrict}, {activeState}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Wrench className="size-3 text-amber-600" />
                      NSQF Trade
                    </span>
                    <p className="font-bold text-slate-900 truncate">{activeCourse}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <GraduationCap className="size-3 text-blue-600" />
                      Education Level
                    </span>
                    <p className="font-bold text-slate-900">{activeEducation}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 sm:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Briefcase className="size-3 text-emerald-600" />
                      Looking For & Goal
                    </span>
                    <p className="font-bold text-slate-900">{activeAspiration}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Scheme Eligibility Box */}
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/70 space-y-2">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-purple-600" />
                Verified PM-AJAY Digital Identity
              </span>
              <p className="text-xs text-slate-600">
                Aadhaar e-KYC linked with e-Shram & Skill India Digital Hub (SIDH). Eligible for 100% free courses & tool-kit stipend.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="text-xs font-bold rounded-xl cursor-pointer"
            >
              Close
            </Button>
            {isEditing && (
              <Button
                onClick={handleSave}
                className="text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-1.5 cursor-pointer shadow-sm"
              >
                <Save className="size-3.5" />
                <span>Save Changes</span>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
