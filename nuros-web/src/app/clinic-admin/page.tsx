"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building, Settings, Copy, CheckCircle, Users, Activity, 
  CreditCard, ShieldCheck, LogOut, ArrowLeft, Stethoscope, Clock
} from 'lucide-react';
import { initDb, getClinicDashboardData, getActiveClinicId, logoutClinic, Clinic } from '@/lib/mockDb';

export default function ClinicAdminPage() {
  const router = useRouter();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [patientCount, setPatientCount] = useState(0);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  useEffect(() => {
    initDb();
    const activeId = getActiveClinicId();
    if (!activeId) {
      router.push('/login');
      return;
    }

    const { clinic: c, patients } = getClinicDashboardData(activeId);
    setClinic(c);
    setPatientCount(patients.length);
  }, [router]);

  const copyIntakeLink = () => {
     if (!clinic) return;
     const url = `${window.location.origin}/patient/${clinic.clinic_slug}`;
     navigator.clipboard.writeText(url);
     setAlertMsg('Patient Lobby Link copied to clipboard!');
     setTimeout(() => setAlertMsg(null), 3000);
  };

  const handleLogout = () => {
    logoutClinic();
    router.push('/login');
  };

  if (!clinic) return <div className="min-h-screen bg-midnight-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-8">
      {alertMsg && (
        <div className="fixed top-8 right-8 bg-accent-teal text-midnight-900 font-bold px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(8,247,206,0.5)] animate-fade-in-up flex items-center z-[100]">
          <CheckCircle className="w-5 h-5 mr-2" /> {alertMsg}
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-midnight-900 border border-midnight-700 p-6 rounded-2xl shadow-xl">
           <div className="flex items-center space-x-4">
             <Link href="/dashboard" className="w-10 h-10 bg-midnight-800 rounded-full flex items-center justify-center hover:bg-midnight-700 transition-colors text-slate-400 hover:text-white border border-midnight-600">
               <ArrowLeft className="w-5 h-5" />
             </Link>
             <div>
               <h1 className="text-2xl font-bold text-white flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-slate-400" />
                  Clinic Administration
               </h1>
               <p className="text-slate-400 text-sm">Manage your clinic settings, staff, and Nuros integration.</p>
             </div>
           </div>
           
           <button onClick={handleLogout} className="flex items-center space-x-2 text-accent-red hover:text-red-400 font-medium px-4 py-2 bg-accent-red/10 border border-accent-red/20 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> <span>Sign Out</span>
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left Column: Details */}
           <div className="lg:col-span-2 space-y-8">
              
              <div className="bg-[#0b1021] border border-midnight-600 rounded-2xl p-6 shadow-xl">
                 <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                   <Building className="w-5 h-5 mr-3 text-accent-cyan" /> Clinic Profile
                 </h2>
                 
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <p className="text-sm text-slate-500 font-medium mb-1">Clinic Name</p>
                       <p className="text-white font-bold">{clinic.clinic_name}</p>
                    </div>
                    <div>
                       <p className="text-sm text-slate-500 font-medium mb-1">Clinic Type</p>
                       <p className="text-white capitalize">{clinic.clinic_type.replace('-', ' ')}</p>
                    </div>
                    <div>
                       <p className="text-sm text-slate-500 font-medium mb-1">Location</p>
                       <p className="text-white">{clinic.location}</p>
                    </div>
                    <div>
                       <p className="text-sm text-slate-500 font-medium mb-1">Primary Admin</p>
                       <p className="text-white">{clinic.admin_name} ({clinic.admin_email})</p>
                    </div>
                 </div>
              </div>

              <div className="bg-[#0b1021] border border-midnight-600 rounded-2xl p-6 shadow-xl">
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-white flex items-center">
                     <Users className="w-5 h-5 mr-3 text-accent-cyan" /> Staff Access
                   </h2>
                   <button className="text-sm font-medium text-accent-teal bg-accent-teal/10 px-3 py-1.5 rounded-lg border border-accent-teal/30">
                     + Invite Staff
                   </button>
                 </div>
                 
                 <div className="space-y-3">
                    {/* Dummy Staff List */}
                    <div className="flex items-center justify-between p-4 bg-midnight-900 border border-midnight-700 rounded-xl">
                       <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-midnight-800 rounded-full flex items-center justify-center font-bold text-white">DR</div>
                          <div>
                            <p className="text-sm font-bold text-white">{clinic.admin_name}</p>
                            <p className="text-xs text-slate-400">{clinic.admin_email}</p>
                          </div>
                       </div>
                       <span className="text-xs font-bold bg-slate-700 text-white px-2 py-1 rounded">Owner / Admin</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-midnight-900 border border-midnight-700 rounded-xl opacity-60">
                       <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-midnight-800 rounded-full flex items-center justify-center font-bold text-slate-400"><Stethoscope className="w-4 h-4"/></div>
                          <div>
                            <p className="text-sm font-bold text-white">Dr. Lisa Ray</p>
                            <p className="text-xs text-slate-400">lisa@clinic.com</p>
                          </div>
                       </div>
                       <span className="text-xs font-bold bg-midnight-800 text-slate-300 border border-midnight-600 px-2 py-1 rounded">Physician</span>
                    </div>
                 </div>
              </div>

           </div>

           {/* Right Column: Status & Links */}
           <div className="space-y-8">
              
              <div className="bg-gradient-to-b from-[#112240] to-midnight-900 border border-midnight-600 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-accent-teal/5 rounded-full blur-[30px]" />
                 <h2 className="text-lg font-bold text-white mb-6">Integration Status</h2>
                 
                 <div className="mb-6">
                    <p className="text-sm text-slate-400 mb-2">Pilot Status</p>
                    {clinic.pilot_status === 'active' ? (
                       <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-teal/10 border border-accent-teal/30 text-accent-teal font-bold text-sm uppercase tracking-wider">
                         <CheckCircle className="w-4 h-4 mr-2" /> Active
                       </span>
                    ) : (
                       <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-amber/10 border border-accent-amber/30 text-accent-amber font-bold text-sm uppercase tracking-wider">
                         <Clock className="w-4 h-4 mr-2" /> Pending Approval
                       </span>
                    )}
                 </div>

                 <div className="mb-6 border-t border-midnight-700 pt-6">
                    <p className="text-sm text-slate-400 mb-2">Current Usage</p>
                    <p className="text-3xl font-black text-white">{patientCount} <span className="text-sm font-medium text-slate-500">Intakes Captured</span></p>
                 </div>

                 <div className="border-t border-midnight-700 pt-6">
                    <p className="text-sm text-slate-400 mb-2">Billing Plan</p>
                    <div className="flex items-center text-white font-medium">
                      <CreditCard className="w-5 h-5 mr-3 text-slate-500" />
                      Free Pilot Tier
                    </div>
                 </div>
              </div>

              <div className="bg-[#0b1021] border border-midnight-600 rounded-2xl p-6 shadow-xl">
                 <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                   <Activity className="w-5 h-5 mr-3 text-accent-cyan" /> Patient Lobby Link
                 </h2>
                 <p className="text-sm text-slate-400 mb-4">
                   Open this URL on your clinic's waiting room tablets (iPads) to allow patients to check in.
                 </p>
                 
                 <div className="bg-midnight-900 border border-midnight-700 rounded-lg p-3 flex items-center justify-between mb-4">
                    <span className="text-slate-300 font-mono text-sm truncate mr-2">
                       {window.location.origin}/patient/{clinic.clinic_slug}
                    </span>
                 </div>
                 
                 <button onClick={copyIntakeLink} className="w-full flex items-center justify-center space-x-2 bg-accent-teal hover:bg-[#06e3bd] text-midnight-900 font-bold py-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(8,247,206,0.15)]">
                    <Copy className="w-5 h-5" /> <span>Copy Link</span>
                 </button>
              </div>

           </div>

        </div>
      </div>
    </div>
  );
}
