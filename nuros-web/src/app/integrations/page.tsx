"use client";
import React from 'react';
import Link from 'next/link';
import { 
  Database, Activity, ArrowLeft, Settings, ShieldCheck, Mail, Webhook, 
  Key, RefreshCw, Layers, Bell, CheckCircle, Smartphone 
} from 'lucide-react';

export default function IntegrationsConsole() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-8 lg:p-12 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#08f7ce]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-midnight-700 pb-8 mb-10">
         <div>
            <div className="flex items-center mb-2">
               <Link href="/dashboard" className="text-slate-500 hover:text-accent-teal mr-4 transition-colors">
                 <ArrowLeft className="w-5 h-5" />
               </Link>
               <h1 className="text-3xl font-bold flex items-center">
                 <Database className="w-8 h-8 text-accent-teal mr-3" /> Integration Console
               </h1>
            </div>
            <p className="text-slate-400 pl-9 max-w-xl font-light">
              Manage EMR connections, secure webhooks, API access, and clinic routing rules for your Nuros deployment.
            </p>
         </div>
         
         <div className="hidden md:flex space-x-3">
            <button className="px-5 py-2.5 bg-midnight-800 border border-midnight-700 hover:border-accent-cyan rounded-lg text-sm font-medium transition-colors text-white">
               Test Connection
            </button>
            <button className="px-5 py-2.5 bg-accent-teal text-midnight-900 shadow-[0_0_15px_rgba(8,247,206,0.2)] rounded-lg text-sm font-bold transition-all hover:brightness-110">
               Save Configuration
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Column */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Delivery Methods */}
            <div className="glass-card rounded-2xl p-8 border border-[#08f7ce]/10 relative">
               <h2 className="text-xl font-bold mb-6 flex items-center border-b border-midnight-700 pb-4">
                 <RefreshCw className="w-5 h-5 text-accent-cyan mr-3" /> Report Delivery Strategy
               </h2>
               
               <div className="space-y-4">
                  <label className="flex items-start space-x-4 p-4 rounded-xl border-2 border-accent-teal bg-midnight-800/80 cursor-pointer transition-colors shadow-[0_0_15px_rgba(8,247,206,0.1)]">
                     <input type="radio" name="delivery" defaultChecked className="mt-1 w-5 h-5 text-accent-teal focus:ring-accent-teal bg-midnight-900 border-none" />
                     <div>
                        <span className="block font-semibold text-white mb-1">Secure Dashboard Delivery (Recommended)</span>
                        <span className="block text-sm text-slate-400">Full structured reports are stored in the secure doctor dashboard. Email notifications are sent alerting clinicians to log in, protecting PHI.</span>
                     </div>
                  </label>

                  <label className="flex items-start space-x-4 p-4 rounded-xl border border-midnight-700 hover:border-midnight-600 bg-midnight-900/50 cursor-pointer transition-colors opacity-70">
                     <input type="radio" name="delivery" disabled className="mt-1 w-5 h-5 text-accent-teal focus:ring-accent-teal bg-midnight-900 border-none opacity-50" />
                     <div>
                        <span className="block font-semibold text-slate-300 mb-1 flex items-center">
                          Direct EMR Push <span className="ml-2 text-[10px] bg-accent-cyan/20 text-accent-cyan px-2 py-0.5 rounded font-bold uppercase">Coming Soon</span>
                        </span>
                        <span className="block text-sm text-slate-500">Real-time HL7/FHIR integration directly into patient charts via your electronic medical records system.</span>
                     </div>
                  </label>

                  <label className="flex items-start space-x-4 p-4 rounded-xl border border-midnight-700 hover:border-midnight-600 bg-midnight-900/50 cursor-pointer transition-colors">
                     <input type="radio" name="delivery" className="mt-1 w-5 h-5 text-accent-teal focus:ring-accent-teal bg-midnight-900 border-none" />
                     <div>
                        <span className="block font-semibold text-white mb-1">Encrypted Email PDF</span>
                        <span className="block text-sm text-slate-400">Complete report attached as a password-protected PDF. Password delivered via separate secure channel.</span>
                     </div>
                  </label>
               </div>
            </div>

            {/* API & Webhooks */}
            <div className="glass-card rounded-2xl p-8 border border-midnight-700">
               <h2 className="text-xl font-bold mb-6 flex items-center border-b border-midnight-700 pb-4">
                 <Webhook className="w-5 h-5 text-accent-teal mr-3" /> Webhooks & API
               </h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div>
                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 block">API Key (Production)</label>
                        <div className="flex">
                           <input type="password" value="sk_live_1234567890abcdef" readOnly className="flex-1 bg-midnight-800 border border-midnight-600 rounded-l-lg py-2 px-3 text-sm text-slate-300 font-mono focus:outline-none" />
                           <button className="bg-midnight-700 hover:bg-midnight-600 px-4 rounded-r-lg border-y border-r border-midnight-600 transition-colors">
                              Copy
                           </button>
                        </div>
                     </div>
                     <div>
                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 block">EMR Integration Status</label>
                        <div className="flex items-center space-x-2 text-sm text-amber-500 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20 w-max">
                           <AlertCircle className="w-4 h-4" /> <span>Not Connected (Oscar EMR / Epic / Cerner)</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div>
                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 block">Webhook URL (New Intake Event)</label>
                        <input type="url" placeholder="https://api.yourclinic.com/nuros/webhook" className="w-full bg-midnight-800 border border-midnight-600 focus:border-accent-teal rounded-lg py-2 px-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-teal transition-all" />
                     </div>
                     <div>
                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2 block">Export Mapping Fields</label>
                        <Link href="#" className="text-accent-cyan text-sm hover:underline">Configure JSON map for intake summaries</Link>
                     </div>
                  </div>
               </div>
            </div>

         </div>

         {/* Right Column */}
         <div className="space-y-8">
            
            {/* Notifications */}
            <div className="glass-card rounded-2xl p-6 border border-midnight-700">
               <h2 className="text-lg font-bold mb-4 flex items-center border-b border-midnight-700 pb-3">
                 <Bell className="w-4 h-4 text-accent-cyan mr-2" /> Notification Rules
               </h2>
               
               <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-midnight-800 rounded-lg">
                     <div>
                        <p className="text-sm font-medium text-white">Triage Alert (Urgent)</p>
                        <p className="text-xs text-slate-400">SMS to Lead MD</p>
                     </div>
                     <div className="w-10 h-5 bg-accent-teal rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-midnight-900 rounded-full absolute right-0.5 top-0.5" />
                     </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-midnight-800 rounded-lg">
                     <div>
                        <p className="text-sm font-medium text-white">Daily Digest</p>
                        <p className="text-xs text-slate-400">Email summary at 6PM</p>
                     </div>
                     <div className="w-10 h-5 bg-accent-teal rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-midnight-900 rounded-full absolute right-0.5 top-0.5" />
                     </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-midnight-800 rounded-lg">
                     <div>
                        <p className="text-sm font-medium text-white">Voice Memos Ready</p>
                        <p className="text-xs text-slate-400">Dashboard refresh</p>
                     </div>
                     <div className="w-10 h-5 bg-midnight-700 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-slate-400 rounded-full absolute left-0.5 top-0.5" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Support / Docs */}
            <div className="glass-card rounded-2xl p-6 border border-midnight-700 bg-gradient-to-br from-midnight-900 to-midnight-800">
               <h2 className="text-lg font-bold mb-4 flex items-center border-b border-midnight-700 pb-3">
                 <ShieldCheck className="w-4 h-4 text-accent-teal mr-2" /> Architecture Support
               </h2>
               <p className="text-sm text-slate-400 mb-4 leading-relaxed font-light">
                 Need assistance mapping our JSON outputs to your existing clinic software?
               </p>
               <button className="w-full py-2 bg-midnight-700 hover:bg-midnight-600 border border-slate-500 rounded-lg text-sm text-white font-medium transition-colors">
                 View API Documentation
               </button>
            </div>

         </div>

      </div>
    </div>
  );
}

function AlertCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  );
}
