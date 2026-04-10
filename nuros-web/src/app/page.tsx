import Link from "next/link";
import { Mic, ShieldCheck, Activity, Stethoscope, Database, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Brand Header */}
      <div className="text-center z-10 max-w-4xl mx-auto">
        <div className="flex justify-center items-center mb-6">
          <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-accent-teal to-accent-cyan shadow-[0_0_30px_rgba(8,247,206,0.3)]">
            <Mic className="text-midnight-900 w-8 h-8 absolute animate-pulse" />
          </div>
          <h1 className="ml-4 text-5xl font-extrabold tracking-tight text-white glow-text">
            Nuros <span className="font-light text-slate-300">AI</span>
          </h1>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-fade-in-up">
          Care While <span className="text-accent-teal">Waiting</span>
        </h2>
        
        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          A 20-second voice-based health intake that converts patient narratives into structured clinical triage reports. Secure, intelligent, and immediate.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Link 
            href="/patient" 
            className="group relative flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-accent-teal hover:bg-[#06e3bd] text-midnight-900 font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(8,247,206,0.2)] hover:shadow-[0_0_30px_rgba(8,247,206,0.5)] transform hover:-translate-y-1"
          >
            <Activity className="w-5 h-5 mr-3 group-hover:animate-pulse" />
            Patient Check-In
          </Link>

          <Link 
            href="/login" 
            className="group relative flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-midnight-800 hover:bg-midnight-700 text-white font-semibold rounded-xl border border-midnight-700 hover:border-slate-500 transition-all duration-300 transform hover:-translate-y-1"
          >
            <Stethoscope className="w-5 h-5 mr-3 text-accent-cyan" />
            Doctor / Clinic Login
          </Link>

          <Link 
            href="/admin" 
            className="group hidden md:flex items-center justify-center w-full sm:w-auto px-6 py-4 text-slate-400 hover:text-white font-medium transition-colors"
          >
            Console <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 duration-300" />
          </Link>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="mt-24 pt-12 border-t border-midnight-700 w-full max-w-7xl px-4 z-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
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
