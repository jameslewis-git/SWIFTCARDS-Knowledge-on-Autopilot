"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 text-slate-900 dark:text-slate-50 transition-bg",
          className
        )}
        {...props}
      >
        {/* Multiple animated background layers */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary aurora layer */}
          <div className="absolute inset-0 opacity-60">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-500/30 dark:via-purple-500/30 dark:to-pink-500/30 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/15 to-purple-600/15 dark:from-transparent dark:via-blue-400/20 dark:to-purple-600/20 animate-bounce"></div>
          </div>
          
          {/* Flowing particles */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/15 dark:bg-blue-400/20 rounded-full blur-3xl animate-ping"></div>
            <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-400/15 dark:bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-400/15 dark:bg-pink-400/20 rounded-full blur-3xl animate-bounce"></div>
          </div>
          
          {/* Moving gradient orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/8 via-purple-600/8 to-pink-600/8 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10 animate-spin-slow"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-cyan-600/8 via-blue-600/8 to-indigo-600/8 dark:from-cyan-600/10 dark:via-blue-600/10 dark:to-indigo-600/10 animate-spin-slow-reverse"></div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-400/30 dark:to-purple-400/30 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 dark:from-purple-400/30 dark:to-pink-400/30 rounded-full blur-xl animate-float-delayed"></div>
            <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 dark:from-cyan-400/30 dark:to-blue-400/30 rounded-full blur-xl animate-float-slow"></div>
            <div className="absolute bottom-20 right-20 w-36 h-36 bg-gradient-to-br from-pink-400/20 to-red-400/20 dark:from-pink-400/30 dark:to-red-400/30 rounded-full blur-xl animate-float-delayed-2"></div>
          </div>
          
          {/* Wave effect */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-500/15 via-purple-500/15 to-transparent dark:from-blue-500/20 dark:via-purple-500/20 dark:to-transparent animate-wave"></div>
        </div>
        
        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    </main>
  );
}; 