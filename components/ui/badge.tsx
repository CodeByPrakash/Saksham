import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "purple" | "glass";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
        {
          "bg-purple-600 text-white": variant === "default",
          "bg-slate-100 text-slate-800 border border-slate-200": variant === "secondary",
          "bg-red-50 text-red-700 border border-red-200": variant === "destructive",
          "text-slate-800 border border-slate-300": variant === "outline",
          "bg-emerald-50 text-emerald-700 border border-emerald-200": variant === "success",
          "bg-amber-50 text-amber-800 border border-amber-200": variant === "warning",
          "bg-purple-50 text-purple-700 border border-purple-200": variant === "purple",
          "bg-white/90 backdrop-blur-md text-slate-800 border border-white shadow-sm": variant === "glass",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
