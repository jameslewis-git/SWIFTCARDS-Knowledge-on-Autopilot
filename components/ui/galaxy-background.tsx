"use client";

import React, { Suspense, lazy, useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const Spline = lazy(() => import('@splinetool/react-spline'))

interface GalaxyBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
}

export function GalaxyBackground({ className = "", style = {} }: GalaxyBackgroundProps) {
  const splineRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Update mouse position for custom cursor
      setMousePosition({ x: event.clientX, y: event.clientY });
      
      if (splineRef.current && isLoaded && isDark) {
        // Calculate mouse position as percentage
        const x = (event.clientX / window.innerWidth) * 100;
        const y = (event.clientY / window.innerHeight) * 100;
        
        // Send mouse position to Spline scene
        try {
          splineRef.current.emit('mouseMove', { x, y });
        } catch (error) {
          console.log('Spline interaction not available');
        }
      }
    };

    const handleMouseClick = (event: MouseEvent) => {
      if (splineRef.current && isLoaded && isDark) {
        const x = (event.clientX / window.innerWidth) * 100;
        const y = (event.clientY / window.innerHeight) * 100;
        
        try {
          splineRef.current.emit('mouseClick', { x, y });
        } catch (error) {
          console.log('Spline click interaction not available');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
    };
  }, [isLoaded, isDark]);

  const onLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    setIsLoaded(true);
  };

    return (
    <div 
      className={`relative w-full h-full pointer-events-auto overflow-hidden ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        pointerEvents: 'auto',
        overflow: 'hidden',
        cursor: isDark ? 'none' : 'default', // Hide cursor only in dark mode
        ...style
      }}
    >
      {/* Hide Spline attribution badge */}
      <style jsx>{`
        iframe[src*="spline.design"] {
          position: relative !important;
        }
        iframe[src*="spline.design"]::after {
          content: none !important;
        }
        /* Hide Spline badge */
        [data-spline-badge] {
          display: none !important;
        }
        /* Alternative selectors for Spline badge */
        .spline-badge,
        [class*="spline"],
        [id*="spline"] {
          display: none !important;
        }
      `}</style>
      {isDark ? (
        // Dark Mode: Galaxy Background with Spline
        <>
          <Suspense fallback={
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
              <div className="text-white text-lg">Loading 3D Background...</div>
            </div>
          }>
            <Spline
              style={{
                width: '100%',
                height: '100vh',
                pointerEvents: 'auto',
              }}
              scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode"
              onLoad={onLoad}
            />
          </Suspense>
          
          {/* Custom cursor for dark mode */}
          <div
            className="fixed pointer-events-none z-50 w-6 h-6 bg-white/20 rounded-full border border-white/40 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
            }}
          />
          <div
            className="fixed pointer-events-none z-50 w-2 h-2 bg-white/60 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-50 ease-out"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
            }}
          />
          
          {/* Interactive floating particles for dark mode */}
          <div
            className="fixed pointer-events-none z-40 w-3 h-3 bg-blue-400/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out"
            style={{
              left: mousePosition.x + 50,
              top: mousePosition.y - 30,
            }}
          />
          <div
            className="fixed pointer-events-none z-40 w-2 h-2 bg-purple-400/40 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out"
            style={{
              left: mousePosition.x - 40,
              top: mousePosition.y + 20,
            }}
          />
          <div
            className="fixed pointer-events-none z-40 w-1 h-1 bg-pink-400/50 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-400 ease-out"
            style={{
              left: mousePosition.x + 20,
              top: mousePosition.y + 40,
            }}
          />
          
          {/* Dark mode gradient overlay - dimmed for better text readability */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              background: `
                linear-gradient(to right, rgba(0, 0, 0, 0.3), transparent 20%, transparent 80%, rgba(0, 0, 0, 0.3)),
                linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.4) 100%),
                radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%)
              `,
              pointerEvents: 'none',
            }}
          />
        </>
               ) : (
           // Light Mode: High Texture Dynamic Background
           <>
             {/* Complex gradient background */}
             <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 via-pink-50 to-orange-50" />
             
             {/* Multiple gradient layers */}
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/20 via-transparent to-purple-100/20" />
             <div className="absolute inset-0 bg-gradient-to-bl from-pink-100/15 via-transparent to-indigo-100/15" />
             
             {/* Vibrant color patterns */}
             <div className="absolute inset-0 opacity-60">
               {/* Colorful dots pattern */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.4)_3px,transparent_3px)] bg-[length:40px_40px]" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.4)_3px,transparent_3px)] bg-[length:60px_60px]" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.4)_3px,transparent_3px)] bg-[length:50px_50px]" />
               
               {/* Colorful grid pattern */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.3)_1px,transparent_1px)] bg-[length:80px_80px]" />
               
               {/* Diagonal color stripes */}
               <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(59,130,246,0.2)_20px,rgba(59,130,246,0.2)_22px)]" />
               <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_25px,rgba(147,51,234,0.2)_25px,rgba(147,51,234,0.2)_27px)]" />
             </div>
             
             {/* Additional vibrant layers */}
             <div className="absolute inset-0 opacity-40">
               {/* Colorful hexagonal pattern */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.3)_4px,transparent_4px)] bg-[length:70px_70px]" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.3)_4px,transparent_4px)] bg-[length:90px_90px]" />
               
               {/* Colorful wavy lines */}
               <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_30px,rgba(59,130,246,0.25)_30px,rgba(59,130,246,0.25)_32px)]" />
               <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_35px,rgba(147,51,234,0.25)_35px,rgba(147,51,234,0.25)_37px)]" />
             </div>
             
             {/* Bright accent patterns */}
             <div className="absolute inset-0 opacity-50">
               {/* Bright color spots */}
               <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/60 to-purple-400/60 rounded-full blur-md" />
               <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-400/60 to-red-400/60 rounded-full blur-md" />
               <div className="absolute bottom-1/4 left-3/4 w-28 h-28 bg-gradient-to-br from-green-400/60 to-teal-400/60 rounded-full blur-md" />
               
               {/* Colorful stripes */}
               <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-pink-400/40" />
               <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-green-400/40 via-teal-400/40 to-blue-400/40" />
             </div>
             
                           {/* Heavy animated floating elements */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Massive background orbs */}
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-300/60 to-purple-300/60 rounded-full animate-spin-slow blur-xl" />
                <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-tl from-pink-300/60 to-orange-300/60 rounded-full animate-spin-slow-reverse blur-xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-300/50 to-blue-300/50 rounded-full animate-spin-slow blur-lg" />
                
                {/* Large floating circles with complex gradients */}
                <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-400/70 via-purple-400/60 to-pink-400/70 rounded-full animate-float blur-md" />
                <div className="absolute top-40 right-20 w-36 h-36 bg-gradient-to-bl from-pink-400/70 via-orange-400/60 to-yellow-400/70 rounded-full animate-float-delayed blur-md" />
                <div className="absolute bottom-32 left-1/4 w-48 h-48 bg-gradient-to-tr from-indigo-400/70 via-blue-400/60 to-cyan-400/70 rounded-full animate-float-slow blur-md" />
                
                {/* Medium floating elements with enhanced effects */}
                <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-400/80 via-pink-400/70 to-red-400/80 rounded-full animate-float-delayed-2 blur-sm shadow-lg" />
                <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-gradient-to-tl from-blue-400/80 via-indigo-400/70 to-purple-400/80 rounded-full animate-float blur-sm shadow-lg" />
                <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-br from-green-400/70 via-teal-400/60 to-cyan-400/70 rounded-full animate-float-slow blur-sm" />
                
                {/* Small floating particles with enhanced visibility */}
                <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-gradient-to-r from-blue-500/90 to-purple-500/90 rounded-full animate-float-slow blur-sm shadow-md" />
                <div className="absolute top-1/3 left-2/3 w-10 h-10 bg-gradient-to-r from-purple-500/90 to-pink-500/90 rounded-full animate-float-delayed blur-sm shadow-md" />
                <div className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-gradient-to-r from-pink-500/95 to-orange-500/95 rounded-full animate-float blur-sm shadow-md" />
                <div className="absolute top-2/3 right-1/3 w-9 h-9 bg-gradient-to-r from-indigo-500/90 to-blue-500/90 rounded-full animate-float-delayed-2 blur-sm shadow-md" />
                <div className="absolute bottom-1/2 right-1/2 w-6 h-6 bg-gradient-to-r from-cyan-500/95 to-blue-500/95 rounded-full animate-float-slow blur-sm shadow-md" />
                
                {/* Geometric shapes with enhanced styling */}
                <div className="absolute top-16 right-1/4 w-16 h-16 bg-gradient-to-br from-blue-400/80 to-purple-400/80 rotate-45 animate-float blur-sm shadow-lg" />
                <div className="absolute bottom-20 left-1/3 w-14 h-14 bg-gradient-to-br from-pink-400/80 to-orange-400/80 rotate-12 animate-float-delayed blur-sm shadow-lg" />
                <div className="absolute top-1/2 right-1/4 w-18 h-18 bg-gradient-to-br from-indigo-400/80 to-cyan-400/80 rotate-30 animate-float-slow blur-sm shadow-lg" />
                
                {/* Additional complex shapes */}
                <div className="absolute top-1/4 right-1/2 w-12 h-12 bg-gradient-to-br from-yellow-400/70 to-orange-400/70 rotate-60 animate-float-delayed-2 blur-sm" />
                <div className="absolute bottom-1/3 right-1/3 w-10 h-10 bg-gradient-to-br from-teal-400/70 to-green-400/70 rotate-90 animate-float blur-sm" />
                
                {/* Pulsing elements */}
                <div className="absolute top-1/3 left-1/2 w-8 h-8 bg-gradient-to-r from-pink-500/95 to-purple-500/95 rounded-full animate-pulse blur-sm" />
                <div className="absolute bottom-1/4 left-1/2 w-6 h-6 bg-gradient-to-r from-blue-500/95 to-cyan-500/95 rounded-full animate-pulse blur-sm" />
                
                {/* Wave-like elements */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-200/60 via-purple-200/50 to-transparent animate-wave" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-pink-200/60 via-orange-200/50 to-transparent animate-wave" />
              </div>
             
             {/* Enhanced wave effects */}
             <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/30 via-white/10 to-transparent" />
             <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
             
                           {/* Complex gradient overlay for text readability */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100vh',
                  background: `
                    linear-gradient(to right, rgba(255, 255, 255, 0.2), transparent 25%, transparent 75%, rgba(255, 255, 255, 0.2)),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, transparent 30%, transparent 70%, rgba(255, 255, 255, 0.25) 100%),
                    radial-gradient(ellipse at center, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)
                  `,
                  pointerEvents: 'none',
                }}
              />
           </>
         )}
    </div>
  );
} 