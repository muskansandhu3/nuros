"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Stethoscope, Lock, Mail, ArrowRight } from 'lucide-react';
import { initDb, loginClinic } from '@/lib/mockDb';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    initDb(); // make sure demo data exists
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check our mock database
    const clinic = loginClinic(email);
    
    if (clinic) {
      router.push('/clinic-home');
    } else {
      setError('Invalid clinic email or credentials. Try demo@nuroshealth.ca');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0f1c]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-midnight-900 via-[#0a0f1c] to-midnight-950 -z-10" />

      <div className="max-w-md w-full animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-teal to-accent-cyan mb-6 shadow-[0_0_30px_rgba(8,247,206,0.3)] relative">
             <Stethoscope className="w-10 h-10 text-midnight-900" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Clinic Login</h1>
          <p className="text-slate-400">Access your Nuros Provider Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#0b1021] border border-midnight-600 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-accent-red/10 border border-accent-red/30 text-accent-red p-3 rounded-lg text-sm mb-6 text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Clinic Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#112240] border border-[#1b3459] focus:border-accent-teal rounded-xl py-3.5 px-4 pl-11 text-white placeholder-slate-500 outline-none transition-all"
                  placeholder="demo@nuroshealth.ca"
                  required
                />
                <Mail className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div>
               <div className="flex justify-between mb-1">
                 <label className="block text-sm font-semibold text-slate-300">Password</label>
                 <a href="#" className="text-xs text-accent-cyan hover:underline">Forgot password?</a>
               </div>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#112240] border border-[#1b3459] focus:border-accent-teal rounded-xl py-3.5 px-4 pl-11 text-white placeholder-slate-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <button type="submit" className="w-full bg-accent-teal hover:bg-[#06e3bd] text-midnight-900 font-bold py-3.5 rounded-xl flex items-center justify-center transition-all shadow-[0_0_15px_rgba(8,247,206,0.2)] hover:shadow-[0_0_25px_rgba(8,247,206,0.4)] mt-4">
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-midnight-700 text-center">
             <p className="text-slate-400 text-sm">
               Not a partner clinic yet? <Link href="/clinic-signup" className="text-accent-cyan hover:text-white font-medium transition-colors">Apply here</Link>
             </p>
          </div>
        </form>
      </div>
    </div>
  );
}
