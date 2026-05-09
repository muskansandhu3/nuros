'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, PlayCircle, UserCheck } from 'lucide-react';
import AnimatedHeroLogo from './AnimatedHeroLogo';
import { motion, useReducedMotion } from 'framer-motion';

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
     setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden font-sans">
      
      {/* Background with lighter gradient to avoid heavy dark area at bottom */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#f4f8fa] via-[#eaf0f3] to-[#d8e3ea]" />

      {/* Subtle Animated Particles (Clinical/Medical grade) */}
      {mounted && !shouldReduceMotion && (
         <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
           {[...Array(12)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-1.5 h-1.5 bg-accent-teal rounded-full"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
               }}
               animate={{
                 y: [0, -30, 0],
                 opacity: [0.1, 0.4, 0.1],
                 scale: [1, 1.2, 1]
               }}
               transition={{
                 duration: 4 + Math.random() * 3,
                 repeat: Infinity,
                 ease: "easeInOut",
                 delay: Math.random() * 2
               }}
             />
           ))}
         </div>
      )}

      {/* Full width container ensuring top/bottom padding and breathing room */}
      <div className="w-full flex flex-col items-center justify-center relative z-10 pt-20 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen">
        
        {/* Animated SVG Logo */}
        <div className="w-full max-w-4xl flex justify-center items-center mb-10 animate-fade-in" style={{ animationDuration: shouldReduceMotion ? '0.1s' : '2s' }}>
          <AnimatedHeroLogo />
        </div>

        {/* Text Content */}
        <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center">
          
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur border border-slate-300 text-[#0d6f91] text-sm font-semibold mb-8 shadow-sm animate-fade-in-up" style={{ animationDelay: shouldReduceMotion ? '0s' : '0.1s' }}>
            <span className="flex w-2 h-2 rounded-full bg-accent-teal mr-2 animate-pulse" aria-hidden="true"></span>
            Clinical-Grade AI Platform
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-8 animate-fade-in-up text-[#082d4b]" style={{ animationDelay: shouldReduceMotion ? '0s' : '0.2s' }}>
            Voice AI for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d6f91] to-[#4c8f18]">Early Health Risk Signals</span>
          </h1>
          
          {/* Darkened text for WCAG AA compliance against light background */}
          <p className="text-lg lg:text-xl text-slate-700 mb-12 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: shouldReduceMotion ? '0s' : '0.3s' }}>
            Nuros turns short voice samples into privacy-first clinical risk insights for clinics, dentists, and care teams.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-5 justify-center animate-fade-in-up w-full" style={{ animationDelay: shouldReduceMotion ? '0s' : '0.4s' }}>
            
            {/* Primary Action - B2B Focus */}
            <Link 
              href="/clinic-signup" 
              aria-label="Request pilot access for your clinic"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#082d4b] hover:bg-[#061e3a] text-white font-bold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center group focus:outline-none focus:ring-4 focus:ring-accent-teal focus:ring-offset-2 min-h-[44px]"
            >
              Request Pilot Access
            </Link>

            {/* Secondary Action - Demo */}
            <Link 
              href="/patient" 
              className="group relative px-8 py-4 bg-accent-teal hover:bg-[#06e3bd] text-midnight-900 font-bold rounded-xl transition-all flex items-center justify-center shadow-[0_0_20px_rgba(8,247,206,0.3)] hover:shadow-[0_0_30px_rgba(8,247,206,0.5)] focus:outline-none focus:ring-4 focus:ring-accent-teal/50 min-h-[44px]"
            >
              Get Voice Wellness Snapshot <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Tertiary Action / Informational */}
            <Link 
              href="/how-it-works" 
              aria-label="See how the Nuros platform works"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-transparent hover:bg-slate-200/50 text-[#073b5d] font-bold transition-all duration-300 flex items-center justify-center group focus:outline-none focus:ring-4 focus:ring-accent-teal focus:ring-offset-2 min-h-[44px] underline-offset-4 hover:underline"
            >
              See How It Works
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
