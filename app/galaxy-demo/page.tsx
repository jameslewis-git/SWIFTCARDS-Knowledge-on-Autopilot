"use client";

import { GalaxyBackground } from "@/components/ui/galaxy-background";

export default function GalaxyDemoPage() {
  return (
    <div className="relative min-h-screen">
      {/* Galaxy Background */}
      <div className="absolute inset-0 z-0">
        <GalaxyBackground />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Galaxy Background Demo
          </h1>
          <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto">
            This is a responsive 3D galaxy background using Spline. 
            The background is fully interactive and works on all devices.
          </p>
        </div>
      </div>
    </div>
  );
} 