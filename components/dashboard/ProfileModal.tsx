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
  Smartphone,
  Phone,
  Wrench,
  Award,
  Sparkles
} from "lucide-react";
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
}

export function ProfileModal({
  isOpen,
  onClose,
  beneficiary,
  beneficiaryProfile
}: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<BeneficiaryData>(beneficiary || CURRENT_BENEFICIARY);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (beneficiary) {
      setProfile(beneficiary);
    }
  }, [beneficiary, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const displayName = beneficiaryProfile?.fullName || profile.name;
  const displayDistrict = beneficiaryProfile?.district || profile.district;
  const displayState = beneficiaryProfile?.state || profile.state;
  const displayEdu = beneficiaryProfile?.education || profile.education;
  const displayCourse = beneficiaryProfile?.nsqfCourse || "Solar PV Agri-Pump Specialist";
  const displayCode = beneficiaryProfile?.nsqfCode || "ELE/Q5901";
  const displayGrant = beneficiaryProfile?.grantEligibility || "₹35,000 Capital Subsidy + ₹3,500/mo Stipend";

  const displayGender = beneficiaryProfile?.gender || profile.gender || "female";
  const displayAge = beneficiaryProfile?.age || profile.age || (displayGender === "female" ? 52 : 28);
  const ageBracket = getNSQFAgeBracket(displayAge);
  const displayAgeCategory = beneficiaryProfile?.ageCategory || ageBracket.badgeLabel;
  const avatarSrc = profile.avatarUrl || beneficiaryProfile?.avatarUrl || getAvatarForGender(displayGender);

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
              <div className="relative size-12 rounded-full overflow-hidden border-2 border-white/40 bg-purple-800">
                <Image
                  src={avatarSrc}
                  alt={displayName}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-lg tracking-tight font-heading">
                  {displayName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-purple-200/80">
                  <span className="capitalize">{displayGender}</span>
                  <span>•</span>
                  <span>Age {displayAge}</span>
                  <span>•</span>
                  <span className="text-amber-300 font-semibold">{displayAgeCategory}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>Profile details updated successfully!</span>
              </div>
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
                    {displayName} ({displayGender})
                  </span>
                </div>
                <div className="bg-white/10 p-2 rounded-xl">
                  <span className="text-[10px] text-purple-200 block">Age & NSQF Bracket</span>
                  <span className="font-extrabold text-amber-300 truncate block">
                    {displayAge} yrs • {displayAgeCategory}
                  </span>
                </div>
                <div className="bg-white/10 p-2 rounded-xl">
                  <span className="text-[10px] text-purple-200 block">Location</span>
                  <span className="font-extrabold text-white truncate block">{displayDistrict}, {displayState}</span>
                </div>
                <div className="bg-white/10 p-2 rounded-xl">
                  <span className="text-[10px] text-amber-200 block">NSQF Skill Alignment</span>
                  <span className="font-extrabold text-white truncate block">{displayCourse}</span>
                </div>
                <div className="bg-white/10 p-2 rounded-xl col-span-2">
                  <span className="text-[10px] text-emerald-200 block">Capital Support</span>
                  <span className="font-extrabold text-emerald-300 truncate block">{displayGrant}</span>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">
                  Beneficiary Details
                </h4>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-bold text-purple-700 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Edit3 className="size-3.5" />
                  <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <User className="size-3 text-indigo-600" />
                    Gender, Age & NSQF
                  </span>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 capitalize">
                      {displayGender} • {displayAge} yrs
                    </p>
                    <span className="text-[9.5px] font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                      {displayAgeCategory}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {ageBracket.description}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <MapPin className="size-3 text-purple-600" />
                    Location
                  </span>
                  <p className="font-bold text-slate-900">
                    {displayDistrict}, {displayState}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <GraduationCap className="size-3 text-blue-600" />
                    Education Level
                  </span>
                  <p className="font-bold text-slate-900">{displayEdu}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Briefcase className="size-3 text-amber-600" />
                    Looking For
                  </span>
                  <p className="font-bold text-slate-900">{beneficiaryProfile?.aspiration || profile.lookingFor}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Sprout className="size-3 text-emerald-600" />
                    Family Occupation
                  </span>
                  <p className="font-bold text-slate-900">{profile.familyOccupation}</p>
                </div>
              </div>
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
              className="text-xs font-bold rounded-xl"
            >
              Close
            </Button>
            {isEditing && (
              <Button
                onClick={handleSave}
                className="text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white gap-1"
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
