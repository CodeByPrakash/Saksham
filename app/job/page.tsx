"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MobileDashboard } from "@/components/dashboard/MobileDashboard";

function JobPageContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id") || searchParams.get("job");

  return <MobileDashboard initialTab="jobs" initialJobId={jobId || undefined} />;
}

export default function JobPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-[#FAF6EE] flex items-center justify-center text-purple-600 font-bold text-sm">
          Loading Job Opportunities...
        </div>
      }
    >
      <JobPageContent />
    </Suspense>
  );
}
