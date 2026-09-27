"use client";

import React from "react";
import { motion } from "framer-motion";

interface OnboardingProgressDotsProps {
  currentStep: 0 | 1 | 2;
  className?: string;
}

export function OnboardingProgressDots({ currentStep, className = "" }: OnboardingProgressDotsProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {[0, 1, 2].map((stepIndex) => {
        const isActive = currentStep === stepIndex;
        return (
          <motion.div
            key={stepIndex}
            layout
            initial={false}
            animate={{
              width: isActive ? 22 : 8,
              height: 8,
              backgroundColor: isActive ? "#6B34EB" : "#E2DEF0",
              opacity: isActive ? 1 : 0.65,
              scale: isActive ? 1.05 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 480,
              damping: 32,
            }}
            className="rounded-full shadow-xs shrink-0"
          />
        );
      })}
    </div>
  );
}

