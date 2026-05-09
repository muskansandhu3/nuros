"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QrCode, LayoutDashboard, Copy, Download, LogOut, ArrowRight, Stethoscope } from 'lucide-react';
import { getActiveClinicId, getClinicDashboardData, logoutClinic, Clinic } from '@/lib/mockDb';

export default function ClinicHome() {
  const router = useRouter();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const activeId = getActiveClinicId();
    if (!activeId) {
      router.push('/login');
      return;
    }
    const { clinic: c } = getClinicDashboardData(activeId);
    setClinic(c);
  }, [router]);

  if (!clinic) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">Loading workspace...</div>;

  const patientUrl = `${window.location.origin}/patient?clinicCode=${clinic.id.split('_')[1] || clinic.id}`;


  const copyLink = () => {
    navigator.clipboard.writeText(patientUrl);
    setToast("Patient link copied!");
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    logoutClinic();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-accent-teal/10 blur-[120px] pointer-events-none rounded-full" />

      {toast && (
         <div className="fixed top-8 right-8 z-50 bg-accent-teal text-midnight-900 font-bold px-6 py-3 rounded-xl shadow-2xl animate-fade-in-up">
           {toast}
         </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-16 pb-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-teal to-accent-cyan flex justify-center items-center shadow-[0_0_15px_rgba(8,247,206,0.3)]">
               <Stethoscope className="w-6 h-6 text-midnight-900" />
             </div>
             <div>
               <h1 className="text-xl font-bold text-white leading-tight">Nuros Clinic Workspace</h1>
               <p className="text-sm text-slate-400">{clinic.clinic_name}</p>
             </div>
          </div>
          <button onClick={handleLogout} className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium">
             <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </button>
        </header>

        {/* Welcome */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Welcome back, {clinic.admin_name.split(' ')[0]}</h2>
          <p className="text-lg text-slate-400 max-w-2xl">Select your workspace destination below. You can open the Patient Portal on a lobby tablet, or view the Clinic Dashboard to review acoustic health signals.</p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
           
           {/* Card 1: Patient Portal */}
           <div className="bg-[#0b1021] border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative group overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl group-hover:bg-emerald-400/10 transition-colors" />
              
              <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-6 text-emerald-400">
                 <QrCode className="w-8 h-8" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-3">Patient Portal</h3>
              <p className="text-slate-400 mb-8 flex-1 text-lg">Open your clinic's secure QR check-in page for patients to complete their 20-second voice intake.</p>
              
              <Link href={`/patient?clinicCode=${clinic.id.split('_')[1] || clinic.id}`} target="_blank" className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center transition-all text-lg shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                Open Patient Portal <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
           </div>

           {/* Card 2: Clinic Dashboard */}
           <div className="bg-[#0b1021] border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative group overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl group-hover:bg-cyan-400/10 transition-colors" />
              
              <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-6 text-cyan-400">
                 <LayoutDashboard className="w-8 h-8" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-3">Clinic Dashboard</h3>
              <p className="text-slate-400 mb-8 flex-1 text-lg">View today's voice intake queue, AI summaries, and advanced clinical research signals.</p>
              
              <Link href="/dashboard" className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center transition-all text-lg shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                Open Dashboard <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
           </div>

        </div>

        {/* Quick Links / Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div>
             <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-1">Your Direct Clinic URL</p>
             <p className="text-emerald-300 font-mono text-sm break-all">{patientUrl}</p>
           </div>
           <div className="flex gap-4 w-full md:w-auto">
             <button onClick={copyLink} className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors font-medium text-sm text-white">
               <Copy className="w-4 h-4 mr-2" /> Copy Link
             </button>
             <button onClick={() => alert('Downloading high-res QR code...')} className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors font-medium text-sm text-white">
               <Download className="w-4 h-4 mr-2" /> Get QR Code
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
