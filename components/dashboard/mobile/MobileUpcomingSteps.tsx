"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic, ChevronRight } from "lucide-react";

interface MobileUpcomingStepsProps {
  onStartStep: () => void;
  onSeeAll: () => void;
}

export function MobileUpcomingSteps({ onStartStep, onSeeAll }: MobileUpcomingStepsProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-sm font-heading">
          Upcoming Steps
        </h3>
        <button
          onClick={onSeeAll}
          className="text-xs font-bold text-purple-700 hover:text-purple-800 cursor-pointer"
        >
          See All
        </button>
      </div>

      {/* Stepper Card */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onStartStep}
        className="bg-white p-3.5 rounded-3xl border border-[#EDE7D9] shadow-2xs flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-600/30">
            <Mic className="size-5.5 animate-pulse" />
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight">
              Complete Skills Assessment
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Take a short voice interview
            </p>
          </div>
        </div>

        <div className="size-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <ChevronRight className="size-4" />
        </div>
      </motion.div>
    </div>
  );
}
