"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, CheckCircle2, ArrowRight, Building2, Coins, Sparkles } from "lucide-react";
import { SCHEMES_LIST } from "./DashboardShared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SchemesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SchemesModal({ isOpen, onClose }: SchemesModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-200">
                <Building2 className="size-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg tracking-tight font-heading">
                  Government Support Schemes
                </h3>
                <p className="text-xs text-purple-200/80">Subsidies, Grants & Self-Employment Convergence</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Scheme Cards */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {SCHEMES_LIST.map((sc) => (
              <div
                key={sc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Badge variant="purple" className="text-[10px] mb-1">
                      {sc.category}
                    </Badge>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base font-heading">
                      {sc.name}
                    </h4>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                    {sc.grantAmount}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">Eligibility: {sc.eligibility}</p>
                  <ul className="space-y-1 pt-1">
                    {sc.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-slate-700">
                        <CheckCircle2 className="size-3.5 text-purple-600 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] font-bold text-purple-700 flex items-center gap-1">
                    <ShieldCheck className="size-3.5" />
                    {sc.status}
                  </span>
                  <Button
                    onClick={onClose}
                    size="sm"
                    className="text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white gap-1"
                  >
                    <span>Claim Benefits</span>
                    <ArrowRight className="size-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              className="text-xs font-bold rounded-xl"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
