import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient" | "glass";
  size?: "default" | "sm" | "lg" | "icon" | "pill";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer select-none",
          {
            "bg-purple-600 text-white shadow-md hover:bg-purple-700 hover:shadow-lg": variant === "default",
            "bg-red-500 text-white hover:bg-red-600 shadow-sm": variant === "destructive",
            "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm": variant === "outline",
            "bg-slate-100 text-slate-900 hover:bg-slate-200": variant === "secondary",
            "hover:bg-slate-100 text-slate-700 hover:text-slate-900": variant === "ghost",
            "text-purple-600 underline-offset-4 hover:underline": variant === "link",
            "btn-sakhyam-gradient font-bold tracking-wide": variant === "gradient",
            "bg-white/80 backdrop-blur-md border border-white/60 text-slate-800 shadow-md hover:bg-white": variant === "glass",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-8 rounded-lg px-3 text-xs": size === "sm",
            "h-12 rounded-2xl px-6 text-base": size === "lg",
            "size-10 rounded-full p-0": size === "icon",
            "h-12 rounded-full px-7 text-base shadow-lg": size === "pill",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
