"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MobileDashboard } from "@/components/dashboard/MobileDashboard";
import { MobileTab } from "@/components/dashboard/mobile";

function MobileDashboardContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as MobileTab | null;
  const courseParam = searchParams.get("course");
  const jobParam = searchParams.get("job") || searchParams.get("id");
  const initialTab: MobileTab =
    tabParam && ["home", "training", "jobs", "messages", "profile"].includes(tabParam)
      ? tabParam
      : (jobParam ? "jobs" : "home");

  return <MobileDashboard initialTab={initialTab} initialCourseId={courseParam || undefined} initialJobId={jobParam || undefined} />;
}

export default function MobilePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-[#FAF6EE] flex items-center justify-center text-purple-600 font-bold text-sm">
          Loading Sakhyam-AI Mobile...
        </div>
      }
    >
      <MobileDashboardContent />
    </Suspense>
  );
}
