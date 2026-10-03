"use client";

import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { CURRENT_BENEFICIARY } from "../DashboardShared";

interface MobileProgressCardProps {
  onViewAll: () => void;
}

export function MobileProgressCard({ onViewAll }: MobileProgressCardProps) {
  return (
    <div className="bg-white rounded-[28px] border border-[#EDE7D9] shadow-2xs p-4 space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-sm font-heading">
          Your Progress
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="size-3" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Circular Donut Chart 60% */}
        <div className="relative size-24 shrink-0 flex items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 36 36">
            {/* Background Ring */}
            <path
              className="text-slate-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Active Purple Progress Ring 60% */}
            <path
              className="text-purple-600"
              strokeDasharray="60, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-base font-black text-slate-900 leading-none">60%</span>
            <span className="text-[8px] font-bold text-slate-400 leading-tight mt-0.5 max-w-[45px]">
              Profile Completed
            </span>
          </div>
        </div>

        {/* Checklist Stepper */}
        <div className="space-y-1.5 flex-1">
          {/* 1. Basic Information (Done) */}
          <div className="flex items-center gap-2">
            <div className="size-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check className="size-2.5 stroke-[3]" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Basic Information</span>
          </div>

          {/* 2. Skills Assessment (Done) */}
          <div className="flex items-center gap-2">
            <div className="size-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check className="size-2.5 stroke-[3]" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Skills Assessment</span>
          </div>

          {/* 3. Recommendations (Active Purple Radio) */}
          <div className="flex items-center gap-2">
            <div className="size-4.5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
              <span className="size-1.5 rounded-full bg-white"></span>
            </div>
            <span className="text-xs font-extrabold text-slate-900">Recommendations</span>
          </div>

          {/* 4. Enrolled in Training (Pending) */}
          <div className="flex items-center gap-2">
            <div className="size-4.5 rounded-full border-2 border-slate-300 shrink-0"></div>
            <span className="text-xs font-medium text-slate-400">Enrolled in Training</span>
          </div>

          {/* 5. Certification & Placement (Pending) */}
          <div className="flex items-center gap-2">
            <div className="size-4.5 rounded-full border-2 border-slate-300 shrink-0"></div>
            <span className="text-xs font-medium text-slate-400">Certification & Placement</span>
          </div>
        </div>
      </div>
    </div>
  );
}
