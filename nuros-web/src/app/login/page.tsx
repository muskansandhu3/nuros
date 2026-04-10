"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Stethoscope, Lock, Shield, Database, Activity, Key, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* Left Column: Form Setup */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 bg-midnight-900 border-r border-midnight-700 relative z-10 shadow-[20px_0_50px_rgba(10,17,40,0.5)]">
        <Link href="/" className="flex items-center space-x-3 mb-16 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-teal to-accent-cyan flex items-center justify-center p-2 shadow-[0_0_15px_rgba(8,247,206,0.3)]">
            <Stethoscope className="text-midnight-900 w-5 h-5 flex-shrink-0" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white glow-text">Nuros<span className="font-light text-slate-400">Clinic</span></span>
        </Link>

        <div>
          <h2 className="text-3xl font-bold mb-2 text-slate-50">Clinician Access</h2>
          <p className="text-slate-400 font-light mb-8">Securely log in to the diagnostic dashboard.</p>
          
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); window.location.href='/dashboard'; }}>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-300">Clinic Email / Username</label>
              <div className="relative group">
                <input 
                  type="email" 
                  className="w-full bg-midnight-800 border border-midnight-700 focus:border-accent-teal rounded-lg py-3 px-4 pl-12 text-slate-100 font-medium placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-accent-teal transition-all shadow-inner" 
                  placeholder="doctor@nuros.clinic" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Activity className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-accent-teal transition-colors" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-300">Password</label>
                <Link href="#" className="text-xs text-accent-cyan hover:underline transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <input 
                  type="password" 
                  className="w-full bg-midnight-800 border border-midnight-700 focus:border-accent-teal rounded-lg py-3 px-4 pl-12 text-slate-100 font-medium placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-accent-teal transition-all shadow-inner" 
                  placeholder="••••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-accent-teal transition-colors" />
              </div>
            </div>

            {/* Optional MFA Code */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-300">MFA Code <span className="text-slate-500 font-light">(Optional for staging)</span></label>
              <div className="relative group">
                <input 
                  type="text" 
                  className="w-full bg-midnight-800 border border-midnight-700 focus:border-accent-cyan rounded-lg py-3 px-4 pl-12 text-slate-100 font-medium placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all shadow-inner tracking-widest" 
                  placeholder="000000" 
                  maxLength={6}
                />
                <Key className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-accent-cyan transition-colors" />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-accent-teal to-accent-cyan text-midnight-900 font-bold text-lg py-4 rounded-xl flex items-center justify-center space-x-2 mt-8 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(8,247,206,0.3)] hover:shadow-[0_0_30px_rgba(8,247,206,0.5)] transform hover:-translate-y-[1px]"
            >
              <LogIn className="w-5 h-5" />
              <span>Secure Login</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <span className="text-slate-500 text-sm">Need access?</span>{' '}
            <Link href="#" className="text-accent-teal font-medium hover:underline ml-1">
              Request Clinic Onboarding
            </Link>
          </div>
          
        </div>
      </div>

      {/* Right Column: Visuals and Trust items */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-midnight-800 relative overflow-hidden p-16">
        {/* Abstract Medical AI Graphic background */}
        <div className="absolute inset-0 z-0">
           <svg className="absolute w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,50 Q25,10 50,50 T100,50" stroke="var(--color-accent-teal)" strokeWidth="0.5" fill="none" className="animate-pulse" />
             <path d="M0,60 Q25,20 50,60 T100,60" stroke="var(--color-accent-cyan)" strokeWidth="0.3" fill="none" style={{animationDelay: '1s'}} className="animate-pulse" />
           </svg>
        </div>

        <div className="z-10 text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full border border-[#08f7ce]/30 flex items-center justify-center bg-gradient-to-tr from-midnight-900 to-midnight-700 shadow-[0_0_50px_rgba(8,247,206,0.1)] relative">
            <div className="absolute w-full h-full rounded-full border border-[#00d4ff]/20 animate-ping" style={{ animationDuration: '3s' }} />
            <Shield className="w-12 h-12 text-accent-cyan" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Enterprise Triage Dashboard</h3>
          <p className="text-slate-400 mb-12 font-light text-lg">
            Review voice-generated clinical summaries instantly.
          </p>

          <div className="space-y-6 text-left">
            <div className="glass p-4 rounded-xl flex items-center">
              <Shield className="w-6 h-6 text-accent-teal mr-4 flex-shrink-0" />
              <p className="text-slate-300 font-medium text-sm">Secure Clinician Access</p>
            </div>
            
            <div className="glass p-4 rounded-xl flex items-center">
              <Lock className="w-6 h-6 text-accent-cyan mr-4 flex-shrink-0" />
              <p className="text-slate-300 font-medium text-sm">Encrypted Voice Reports</p>
            </div>
            
            <div className="glass p-4 rounded-xl flex items-center">
              <Activity className="w-6 h-6 text-accent-teal mr-4 flex-shrink-0" />
              <p className="text-slate-300 font-medium text-sm">Role-Based Dashboard</p>
            </div>

            <div className="glass p-4 rounded-xl flex items-center">
              <Database className="w-6 h-6 text-accent-cyan mr-4 flex-shrink-0" />
              <p className="text-slate-300 font-medium text-sm">EMR Integration Ready</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
