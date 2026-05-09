import React from "react";
import { Mic, ShieldCheck, Activity, Stethoscope, Database } from "lucide-react";
import HeroSection from "../components/HeroSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-0 relative overflow-hidden">
      
      {/* Brand Header & Hero replaced with Animated HeroSection */}
      <div className="w-full">
        <HeroSection />
      </div>

      {/* Trust Bar */}
      <div className="mt-12 pt-12 border-t border-midnight-700 w-full max-w-7xl px-4 z-10 animate-fade-in-up mb-24" style={{ animationDelay: '0.4s' }}>
        <p className="text-center text-sm font-semibold text-slate-500 mb-8 uppercase tracking-widest">
          Medical-Grade Architecture
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-slate-400">
          <div className="flex flex-col justify-center items-center text-center group">
            <ShieldCheck className="w-8 h-8 mb-3 text-slate-600 group-hover:text-accent-cyan transition-colors" />
            <span className="text-sm font-medium">PHI-Ready Architecture</span>
          </div>
          <div className="flex flex-col justify-center items-center text-center group">
            <Mic className="w-8 h-8 mb-3 text-slate-600 group-hover:text-accent-cyan transition-colors" />
            <span className="text-sm font-medium">Guided Voice Intake</span>
          </div>
          <div className="flex flex-col justify-center items-center text-center group">
            <Activity className="w-8 h-8 mb-3 text-slate-600 group-hover:text-accent-teal transition-colors" />
            <span className="text-sm font-medium">Clinical Dashboard</span>
          </div>
          <div className="flex flex-col justify-center items-center text-center group">
            <Database className="w-8 h-8 mb-3 text-slate-600 group-hover:text-accent-cyan transition-colors" />
            <span className="text-sm font-medium">EMR Integration Ready</span>
          </div>
          <div className="flex flex-col justify-center items-center text-center group col-span-2 md:col-span-1">
            <Lock className="w-8 h-8 mb-3 text-slate-600 group-hover:text-accent-teal transition-colors" />
            <span className="text-sm font-medium">End-to-End Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Lock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
