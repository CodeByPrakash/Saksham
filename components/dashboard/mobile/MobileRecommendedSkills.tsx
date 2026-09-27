"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { CourseItem, RECOMMENDED_COURSES } from "../DashboardShared";

interface MobileRecommendedSkillsProps {
  onOpenCourse: (course: CourseItem) => void;
  onSeeAll: () => void;
}

export function MobileRecommendedSkills({
  onOpenCourse,
  onSeeAll
}: MobileRecommendedSkillsProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-slate-900 text-sm font-heading">
            Recommended for You
          </h3>
          <span className="text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full">
            10 Skills
          </span>
        </div>
        <button
          onClick={onSeeAll}
          className="text-xs font-bold text-purple-700 hover:text-purple-800 cursor-pointer"
        >
          See All
        </button>
      </div>

      {/* Smooth Snap Carousel */}
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pt-1 no-scrollbar -mx-1 px-1">
        {RECOMMENDED_COURSES.map((course) => (
          <motion.div
            key={course.id}
            whileTap={{ scale: 0.98 }}
            className="w-[200px] shrink-0 snap-start bg-white rounded-3xl border border-[#EDE7D9] shadow-2xs overflow-hidden flex flex-col justify-between group transition-all"
          >
            {/* Course Image & Badge */}
            <div className="relative h-28 w-full overflow-hidden bg-slate-100">
              <Image
                src={course.image}
                alt={course.title}
                fill
                sizes="200px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs ${
                    course.badgeColor === "blue"
                      ? "bg-blue-600 text-white"
                      : course.badgeColor === "amber"
                      ? "bg-amber-500 text-white"
                      : course.badgeColor === "purple"
                      ? "bg-purple-600 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {course.badge}
                </span>
              </div>
            </div>

            {/* Course Info */}
            <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs leading-snug line-clamp-2 h-8">
                  {course.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold mt-1">
                  <span className="flex items-center gap-0.5 shrink-0">
                    <Clock className="size-2.5 text-slate-400" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-0.5 truncate">
                    <MapPin className="size-2.5 text-slate-400" />
                    {course.location}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenCourse(course)}
                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-extrabold py-1.5 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Carousel Hint & Counter */}
      <div className="flex items-center justify-between px-1 text-[10px] font-semibold text-slate-400">
        <span>← Swipe horizontally to explore 10 skills →</span>
        <span className="text-purple-600 font-bold">1 of 10</span>
      </div>
    </div>
  );
}
