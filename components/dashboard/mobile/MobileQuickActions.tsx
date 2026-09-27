"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Sprout, MapPin } from "lucide-react";

interface MobileQuickActionsProps {
  onSelectAction: (actionId: string) => void;
  onSeeAll: () => void;
}

export function MobileQuickActions({ onSelectAction, onSeeAll }: MobileQuickActionsProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-sm font-heading">
          Quick Actions
        </h3>
        <button
          onClick={onSeeAll}
          className="text-xs font-bold text-purple-700 hover:text-purple-800 cursor-pointer"
        >
          See All
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {/* 1. Skill Training */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectAction("action-1")}
          className="bg-[#EFF4FE] p-2.5 py-3 rounded-2xl border border-blue-100/80 shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer min-h-[96px] group transition-all"
        >
          <div className="size-10 rounded-full bg-[#DCE7FD] flex items-center justify-center text-blue-600 mb-2 group-hover:scale-105 transition-transform">
            <GraduationCap className="size-5.5 fill-blue-600 text-blue-600" />
          </div>
          <span className="text-[11px] font-extrabold text-slate-800 leading-tight">
            Skill<br />Training
          </span>
        </motion.div>

        {/* 2. Job Opportunities */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectAction("action-2")}
          className="bg-[#FFF4ED] p-2.5 py-3 rounded-2xl border border-orange-100/80 shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer min-h-[96px] group transition-all"
        >
          <div className="size-10 rounded-full bg-[#FFE7D9] flex items-center justify-center text-orange-600 mb-2 group-hover:scale-105 transition-transform">
            <Briefcase className="size-5.5 fill-orange-500 text-orange-600" />
          </div>
          <span className="text-[11px] font-extrabold text-slate-800 leading-tight">
            Job<br />Opportunities
          </span>
        </motion.div>

        {/* 3. Self-Employment */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectAction("action-3")}
          className="bg-[#EDFAF3] p-2.5 py-3 rounded-2xl border border-emerald-100/80 shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer min-h-[96px] group transition-all"
        >
          <div className="size-10 rounded-full bg-[#D6F5E3] flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-105 transition-transform">
            <Sprout className="size-5.5 fill-emerald-500 text-emerald-600" />
          </div>
          <span className="text-[11px] font-extrabold text-slate-800 leading-tight">
            Self-<br />Employment
          </span>
        </motion.div>

        {/* 4. Find Centers */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectAction("action-4")}
          className="bg-[#EFF4FE] p-2.5 py-3 rounded-2xl border border-blue-100/80 shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer min-h-[96px] group transition-all"
        >
          <div className="size-10 rounded-full bg-[#DCE7FD] flex items-center justify-center text-blue-600 mb-2 group-hover:scale-105 transition-transform">
            <MapPin className="size-5.5 fill-blue-600 text-blue-600" />
          </div>
          <span className="text-[11px] font-extrabold text-slate-800 leading-tight">
            Find<br />Centers
          </span>
        </motion.div>
      </div>
    </div>
  );
}
