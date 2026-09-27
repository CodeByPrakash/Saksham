"use client";

import React, { useState } from "react";
import { FIELD_WORKER_TASKS } from "@/lib/data";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Mic,
  PhoneCall,
  Clock,
  MapPin,
  FileCheck,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Search,
  Filter,
  Plus,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function FieldWorkerCopilot() {
  const [tasks, setTasks] = useState(FIELD_WORKER_TASKS);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<any>(FIELD_WORKER_TASKS[0]);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === "urgent") return t.priority === "Urgent";
    if (activeFilter === "dropout") return t.taskType.includes("Dropout");
    if (activeFilter === "grievance") return t.taskType.includes("Grievance");
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-blue-800/40">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="bg-blue-500/20 text-blue-200 border-blue-400/30 text-xs">
              Layer 2 — Field Operations
            </Badge>
            <span className="text-xs text-blue-300 font-medium">Gram Panchayat & NGO Copilot</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
            Field Worker & Prerak Livelihood Copilot
          </h1>
          <p className="text-sm text-blue-200/90 max-w-2xl">
            Assisted conversational interviews, AI dropout early warning alerts, and low-bandwidth voice grievance tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsInterviewModalOpen(true)}
            variant="gradient"
            className="h-11 px-5 text-xs font-bold gap-2 shadow-lg"
          >
            <Mic className="size-4" />
            <span>Start Assisted Interview</span>
          </Button>
        </div>
      </div>

      {/* Task Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Today's Assigned Queue</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">18</span>
            <Badge variant="purple" className="text-[10px]">4 Urgent</Badge>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">AI Dropout Alerts</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-600">3</span>
            <Badge variant="warning" className="text-[10px]">Support Needed</Badge>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Post-Placement Check-ins</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-600">12</span>
            <Badge variant="success" className="text-[10px]">90-Day Retention</Badge>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Voice Grievances</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-indigo-600">2</span>
            <Badge variant="secondary" className="text-[10px]">Stipend & Travel</Badge>
          </div>
        </div>
      </div>

      {/* Main Task List & Selected Task Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-base font-bold text-slate-900 font-heading">
                  Priority Action Queue
                </CardTitle>
                {/* Filter tabs */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                      activeFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveFilter("urgent")}
                    className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                      activeFilter === "urgent" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                    }`}
                  >
                    Urgent
                  </button>
                  <button
                    onClick={() => setActiveFilter("dropout")}
                    className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                      activeFilter === "dropout" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                    }`}
                  >
                    Dropout Risk
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {filteredTasks.map((task) => {
                const isSelected = selectedTask?.id === task.id;
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isSelected
                        ? "bg-purple-50/60 border-purple-500 shadow-sm"
                        : "bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {task.beneficiaryName}
                        </span>
                        <Badge
                          variant={task.priority === "Urgent" ? "destructive" : "purple"}
                          className="text-[10px]"
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      <div className="text-xs font-semibold text-purple-700">
                        {task.taskType}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {task.village}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {task.dueTime}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`size-5 transition-transform ${isSelected ? "text-purple-600 translate-x-1" : "text-slate-400"}`} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Selected Task Detail Panel */}
        <div className="space-y-4">
          {selectedTask ? (
            <Card className="border-purple-200 bg-white shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" className="text-xs">{selectedTask.id}</Badge>
                  <Badge variant="success" className="text-xs">{selectedTask.status}</Badge>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 font-heading">
                  {selectedTask.beneficiaryName}
                </CardTitle>
                <CardDescription className="text-xs">
                  {selectedTask.village} • Due {selectedTask.dueTime}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 space-y-1.5">
                  <span className="font-bold text-purple-900 text-xs">AI Context & Trigger Reason:</span>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {selectedTask.notes}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-800">Recommended Next Steps:</span>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-purple-600 shrink-0" />
                      <span>Conduct assisted voice interview / confirm consent.</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-purple-600 shrink-0" />
                      <span>Coordinate transport allowance support under PM-AJAY.</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-purple-600 shrink-0" />
                      <span>Update post-intervention status on District Portal.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Button
                    onClick={() => setIsInterviewModalOpen(true)}
                    variant="gradient"
                    className="w-full text-xs font-bold rounded-xl h-10 gap-1.5"
                  >
                    <Mic className="size-4" />
                    <span>Launch Assisted Interview Mode</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full text-xs font-bold rounded-xl h-10 gap-1.5"
                  >
                    <PhoneCall className="size-4" />
                    <span>Call Beneficiary / Reschedule IVR</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-slate-50 p-8 rounded-3xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
              Select a task from the queue to view AI context and intervention actions.
            </div>
          )}
        </div>
      </div>

      {/* Assisted Interview Modal Simulation */}
      {isInterviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                  <Mic className="size-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Assisted Beneficiary Interview</h3>
                  <p className="text-[11px] text-slate-500">Hands-free phone handover mode</p>
                </div>
              </div>
              <button
                onClick={() => setIsInterviewModalOpen(false)}
                className="size-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 space-y-2 text-center">
              <div className="size-16 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse">
                <Mic className="size-7" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                AI Voice Assistant is Speaking with Beneficiary...
              </h4>
              <p className="text-xs text-slate-600 italic">
                "नमस्कार! क्या आप मुझे अपने काम और अनुभव के बारे में बता सकते हैं?"
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800">Live Transcript & Extracted Signals:</span>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-slate-700">
                <p><strong>Candidate:</strong> "मैं घर के पास वेल्डिंग और ग्राइंडिंग का काम करता हूँ।"</p>
                <p className="text-purple-700 font-semibold">
                  → Discovered: Arc Welding (NSQF L3), Metal Fabrication (QP: CSC/Q0204).
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsInterviewModalOpen(false)}
              variant="gradient"
              className="w-full text-xs font-bold rounded-xl h-11"
            >
              Complete Interview & Synchronize to Cloud
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
