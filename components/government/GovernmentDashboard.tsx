"use client";

import React, { useState } from "react";
import { DISTRICT_INTELLIGENCE } from "@/lib/data";
import {
  Building2,
  TrendingUp,
  Award,
  Users,
  AlertTriangle,
  FileCheck2,
  Sliders,
  Sparkles,
  Download,
  CheckCircle2,
  MapPin,
  Flame,
  PieChart,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function GovernmentDashboard() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Sundargarh");
  const [budgetAllocationCrores, setBudgetAllocationCrores] = useState<number>(5.0);
  const [activeTab, setActiveTab] = useState<"overview" | "perspective_plan" | "budget_sim" | "quality_scorecard">("overview");
  const [isExportingPlan, setIsExportingPlan] = useState<boolean>(false);

  const data = DISTRICT_INTELLIGENCE;

  // Budget simulation calculation based on slider
  const projectedBeneficiaries = Math.round(budgetAllocationCrores * 1420);
  const projectedCertifications = Math.round(projectedBeneficiaries * 0.91);
  const projectedPlacements = Math.round(projectedCertifications * 0.82);
  const projectedEnterprises = Math.round(projectedBeneficiaries * 0.18);

  const handleExportPlan = () => {
    setIsExportingPlan(true);
    setTimeout(() => {
      setIsExportingPlan(false);
      alert("PM-AJAY State Perspective Plan (Sundargarh District) downloaded in official GIA-ready PDF format.");
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner & District Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 rounded-3xl shadow-xl border border-indigo-900/40">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="bg-purple-500/20 text-purple-200 border-purple-400/30 text-xs">
              Layer 3 — PM-AJAY District Intelligence
            </Badge>
            <span className="text-xs text-purple-300 font-medium">District Skill Committee (DSC) Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
            District Livelihood & Labour Market Intelligence
          </h1>
          <p className="text-sm text-purple-200/90 max-w-2xl">
            Decentralized planning, demand-aspiration mismatch analytics, perspective plan synthesis & outcome monitoring.
          </p>
        </div>

        {/* District Selector */}
        <div className="flex flex-col gap-1.5 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shrink-0">
          <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider">
            Target District:
          </span>
          <div className="flex items-center gap-1.5">
            {["Sundargarh", "Mayurbhanj", "Varanasi", "Ranchi"].map((dist) => (
              <button
                key={dist}
                onClick={() => setSelectedDistrict(dist)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  selectedDistrict === dist
                    ? "bg-purple-600 text-white shadow-md font-extrabold"
                    : "bg-white/5 text-purple-200 hover:bg-white/15"
                }`}
              >
                {dist}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 High-Level PM-AJAY KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profiled Candidates</span>
              <div className="size-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-heading">
                {data.profiledCount.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-600">+18% this quarter</span>
            </div>
            <p className="text-[11px] text-slate-500">Across 17 Gram Panchayats</p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified NSQF Fit</span>
              <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Award className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-heading">
                {data.verifiedTransitionsPercent}%
              </span>
              <span className="text-xs font-bold text-blue-600">SIDH Synced</span>
            </div>
            <p className="text-[11px] text-slate-500">Mapped to Level 3-5 Qualifications</p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Time to Income</span>
              <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Zap className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-heading">
                {data.avgTimeToIncomeDays} Days
              </span>
              <span className="text-xs font-bold text-emerald-600">-14 days vs target</span>
            </div>
            <p className="text-[11px] text-slate-500">From profiling to 1st stipend/income</p>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sustainable Livelihood</span>
              <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-heading">
                {data.sustainableLivelihoodRatePercent}%
              </span>
              <span className="text-xs font-bold text-emerald-600">180-Day Retention</span>
            </div>
            <p className="text-[11px] text-slate-500">Beyond one-time placement count</p>
          </CardContent>
        </Card>
      </div>

      {/* Surface Sub-navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <PieChart className="size-4" />
          <span>Demand & Skill Gap Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("perspective_plan")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "perspective_plan"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileCheck2 className="size-4" />
          <span>PM-AJAY Perspective Plan & GIA Package</span>
        </button>

        <button
          onClick={() => setActiveTab("budget_sim")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "budget_sim"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Sliders className="size-4" />
          <span>Budget-to-Outcome Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab("quality_scorecard")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "quality_scorecard"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Building2 className="size-4" />
          <span>Training Centre Quality Scorecard</span>
        </button>
      </div>

      {/* Tab 1: Demand & Skill Gap Analytics */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Aspirations Breakdown */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-900 font-heading">
                  Beneficiary Stated Aspirations ({selectedDistrict})
                </CardTitle>
                <Badge variant="purple" className="text-xs">14,820 Profiled</Badge>
              </div>
              <CardDescription className="text-xs">
                Derived dynamically from voice interviews without rigid predefined lists.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.topAspirations.map((asp, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>{asp.sector}</span>
                    <span className="font-extrabold text-purple-700">{asp.count.toLocaleString()} ({asp.percentage}%)</span>
                  </div>
                  <Progress value={asp.percentage} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Local Employer Demand & Mismatch Matrix */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-900 font-heading">
                  Real-time Labour Market Demand
                </CardTitle>
                <Badge variant="success" className="text-xs">NCS & SIDH Data Feed</Badge>
              </div>
              <CardDescription className="text-xs">
                Verified job openings from local industrial clusters, MSMEs and government projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.highDemandSectors.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 text-sm">{sec.sector}</span>
                    <div className="flex items-center gap-3 text-slate-500">
                      <span>💼 {sec.openJobs} Open Positions</span>
                      <span className="text-emerald-600 font-semibold">+{sec.growthPercent}% Demand YoY</span>
                    </div>
                  </div>

                  <Badge
                    variant={
                      sec.mismatchIndex === "Critical"
                        ? "destructive"
                        : sec.mismatchIndex === "Medium"
                        ? "warning"
                        : "secondary"
                    }
                    className="text-[10px]"
                  >
                    Mismatch: {sec.mismatchIndex}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: PM-AJAY Perspective Plan */}
      {activeTab === "perspective_plan" && (
        <Card className="border-purple-200 bg-white shadow-md">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl font-extrabold text-slate-900 font-heading">
                  AI-Generated PM-AJAY District Perspective Plan
                </CardTitle>
                <CardDescription className="text-xs">
                  Automated synthesis for District Skill Committee & State Ministry of Social Justice & Empowerment.
                </CardDescription>
              </div>

              <Button
                onClick={handleExportPlan}
                variant="gradient"
                className="gap-2 text-xs font-bold rounded-xl h-10"
              >
                <Download className="size-4" />
                <span>{isExportingPlan ? "Compiling PDF..." : "Export GIA Plan (PDF)"}</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 text-xs">
            {/* AI Recommendation Summary */}
            <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 space-y-3">
              <h4 className="font-bold text-purple-900 text-sm flex items-center gap-2">
                <Sparkles className="size-4 text-purple-600" />
                Executive Policy Directive (Sundargarh 2026-27):
              </h4>
              <p className="text-slate-800 leading-relaxed font-medium">
                "Allocate <strong>42% of PM-AJAY GIA livelihood funds</strong> toward Solar Agri-Pump and Rural Electromechanical repair clusters. Prioritize the 4,820 candidates with latent motor pump troubleshooting experience to cut training duration from 90 days down to <strong>28-day RPL Fast-Track modules</strong>, reducing per-beneficiary cost by ₹6,800."
              </p>
            </div>

            {/* Ready-to-Submit GIA Project Package */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h5 className="font-bold text-slate-900 text-sm">
                Ready-to-Submit GIA Livelihood Project Package
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Proposed Cohort Size</span>
                  <span className="font-bold text-slate-900">1,200 SC/ST Youth</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Estimated Project Budget</span>
                  <span className="font-bold text-slate-900">₹3.84 Crores</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Projected 6-Mo Retention</span>
                  <span className="font-bold text-emerald-700">84.5% Sustainable Rate</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Budget-to-Outcome Simulator */}
      {activeTab === "budget_sim" && (
        <Card className="border-indigo-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-extrabold text-slate-900 font-heading">
              Budget-to-Outcome Scenario Simulator
            </CardTitle>
            <CardDescription className="text-xs">
              Simulate funding allocation scenarios for PM-AJAY and project measurable livelihoods created.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 text-xs">
            {/* Slider Control */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm">
                  Simulated PM-AJAY Budget Allocation:
                </span>
                <span className="text-xl font-extrabold text-purple-700 font-heading">
                  ₹{budgetAllocationCrores.toFixed(1)} Crores
                </span>
              </div>

              <input
                type="range"
                min="1.0"
                max="25.0"
                step="0.5"
                value={budgetAllocationCrores}
                onChange={(e) => setBudgetAllocationCrores(parseFloat(e.target.value))}
                className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>₹1.0 Cr (Pilot)</span>
                <span>₹10.0 Cr (District Scale)</span>
                <span>₹25.0 Cr (Multi-District)</span>
              </div>
            </div>

            {/* Projected Outcome Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-1">
                <span className="text-[10px] font-bold text-purple-900 uppercase">Beneficiaries Reached</span>
                <p className="text-2xl font-extrabold text-purple-700 font-heading">
                  {projectedBeneficiaries.toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-600">100% profiled & mapped</span>
              </div>

              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1">
                <span className="text-[10px] font-bold text-blue-900 uppercase">NSQF Certifications</span>
                <p className="text-2xl font-extrabold text-blue-700 font-heading">
                  {projectedCertifications.toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-600">Level 3 to Level 5</span>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
                <span className="text-[10px] font-bold text-emerald-900 uppercase">Wage Employment</span>
                <p className="text-2xl font-extrabold text-emerald-700 font-heading">
                  {projectedPlacements.toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-600">Local cluster placement</span>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-1">
                <span className="text-[10px] font-bold text-amber-900 uppercase">Micro-Enterprises</span>
                <p className="text-2xl font-extrabold text-amber-700 font-heading">
                  {projectedEnterprises.toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-600">Mudra & PM-AJAY capital</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Training Centre Quality Scorecard */}
      {activeTab === "quality_scorecard" && (
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 font-heading">
                  Training Facility Audit & Leakage Anomaly Tracker
                </CardTitle>
                <CardDescription className="text-xs">
                  Automated cross-check between enrollment claims, certification attendance, and 180-day employment retention.
                </CardDescription>
              </div>
              <Badge variant="purple" className="text-xs">Continuous Monitoring</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            {data.trainingCentres.map((centre) => (
              <div
                key={centre.id}
                className={`p-4 rounded-2xl border space-y-3 ${
                  centre.anomalyFlag
                    ? "bg-red-50/50 border-red-300"
                    : "bg-slate-50/60 border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{centre.name}</span>
                    <Badge variant={centre.anomalyFlag ? "destructive" : "success"} className="text-[10px]">
                      {centre.anomalyFlag ? "⚠️ Anomaly Flagged" : "✓ Verified Quality"}
                    </Badge>
                  </div>

                  <span className="text-xs font-semibold text-slate-600">
                    6-Mo Retention: <strong className={centre.retention6MonthsPercent < 50 ? "text-red-600 font-extrabold" : "text-emerald-600"}>{centre.retention6MonthsPercent}%</strong>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-600">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900">{centre.enrolled}</span> Enrolled
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900">{centre.certified}</span> Certified
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900">{centre.placed}</span> Placed
                  </div>
                </div>

                {centre.anomalyReason && (
                  <div className="p-2.5 bg-red-100/70 rounded-xl text-red-800 text-[11px] font-medium">
                    <strong>Audit Trigger:</strong> {centre.anomalyReason}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
