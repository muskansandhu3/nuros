"use client";
import React from 'react';
import Link from 'next/link';
import { 
  Users, Building, Shield, Database, Lock, Search, Filter, 
  MoreVertical, Check, AlertTriangle, ArrowLeft, Settings,
  MapPin, Clock
} from 'lucide-react';

const clinics = [
  { id: 'C-8219', name: 'Toronto General Cardiology', status: 'Active', members: 12, storage: '1.2 GB', since: 'Oct 2024' },
  { id: 'C-2041', name: 'Vancouver Telehealth Network', status: 'Active', members: 45, storage: '4.8 GB', since: 'Jan 2025' },
  { id: 'C-6632', name: 'Ottowa Urgent Care', status: 'Pending', members: 0, storage: '0 MB', since: 'Mar 2025' },
];

const auditLogs = [
  { time: '10:45 AM', action: 'API Key Rotated', user: 'admin_sys', target: 'C-8219' },
  { time: '09:22 AM', action: 'Role Update (Read -> Admin)', user: 'dr.jenkins@clinic.com', target: 'dr.marks@clinic.com' },
  { time: '08:15 AM', action: 'Data Retention Policy Updated', user: 'admin_sys', target: 'Global System' },
  { time: 'Yesterday', action: 'PHI Export to EMR triggered', user: 'dr.smith@vtn.ca', target: 'Intake 21094-NR' },
];

export default function AdminConsole() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex font-sans">
      
      {/* Sidebar Admin Nav */}
      <aside className="w-64 bg-midnight-900 border-r border-midnight-700 hidden lg:flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-midnight-700 bg-midnight-800">
           <Link href="/dashboard" className="text-slate-500 hover:text-accent-teal mr-3 transition-colors">
              <ArrowLeft className="w-4 h-4" />
           </Link>
           <Shield className="w-5 h-5 text-accent-red mr-2" />
           <span className="text-lg font-bold text-white tracking-widest uppercase">Console</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 text-sm font-medium">
          <Link href="#" className="flex items-center px-4 py-3 bg-midnight-800 text-white rounded-lg border border-midnight-700 shadow-[inset_2px_0_0_#ff3366]">
            <Building className="w-4 h-4 mr-3 text-accent-red" /> Clinics & Routing
          </Link>
          <Link href="#" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-midnight-800 rounded-lg transition-colors">
            <Users className="w-4 h-4 mr-3" /> Role & Access
          </Link>
          <Link href="#" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-midnight-800 rounded-lg transition-colors">
            <Lock className="w-4 h-4 mr-3" /> Consent & Privacy
          </Link>
          <Link href="#" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-midnight-800 rounded-lg transition-colors">
            <Database className="w-4 h-4 mr-3" /> Voice Record Storage
          </Link>
          <Link href="#" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-midnight-800 rounded-lg transition-colors">
            <Settings className="w-4 h-4 mr-3" /> Security Center
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto p-10 relative">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex justify-between items-end border-b border-midnight-700 pb-6">
             <div>
                <h1 className="text-3xl font-bold flex items-center mb-2">Clinic Operations</h1>
                <p className="text-slate-400 font-light">Super Admin jurisdiction. Manage onboarding, compliance, and enterprise routing.</p>
             </div>
             <button className="px-5 py-2.5 bg-accent-red hover:bg-[#ff1a53] text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(255,51,102,0.3)]">
                + Onboard New Clinic
             </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column: Clinics Table */}
            <div className="xl:col-span-2 glass-card rounded-2xl border border-midnight-700 overflow-hidden flex flex-col">
               <div className="p-5 border-b border-midnight-700 flex justify-between items-center bg-midnight-800/50">
                  <h2 className="text-lg font-bold">Managed Clinics</h2>
                  <div className="relative">
                     <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2" />
                     <input type="text" placeholder="Search ID or Name" className="bg-midnight-900 border border-midnight-700 focus:border-accent-cyan rounded-full py-1.5 pl-9 pr-4 text-xs focus:outline-none w-48 text-slate-300 transition-colors" />
                  </div>
               </div>

               <table className="w-full text-left border-collapse text-sm">
                 <thead>
                   <tr className="text-slate-500 text-xs uppercase bg-midnight-900/40">
                     <th className="p-4 font-semibold tracking-wider">Clinic Name</th>
                     <th className="p-4 font-semibold tracking-wider">Status</th>
                     <th className="p-4 font-semibold tracking-wider">Storage</th>
                     <th className="p-4 font-semibold tracking-wider text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {clinics.map((clinic, idx) => (
                     <tr key={idx} className="border-b border-midnight-700/50 hover:bg-midnight-800/80 transition-colors">
                       <td className="p-4">
                         <p className="font-bold text-slate-200">{clinic.name}</p>
                         <p className="text-xs text-slate-500 font-mono mt-0.5">{clinic.id} • {clinic.members} Doctors</p>
                       </td>
                       <td className="p-4">
                         {clinic.status === 'Active' ? 
                           <span className="px-2.5 py-1 bg-accent-teal/10 text-accent-teal rounded-full text-xs font-medium border border-accent-teal/30">Active</span> :
                           <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-medium border border-amber-500/30">Pending</span>
                         }
                       </td>
                       <td className="p-4 text-slate-400 font-mono text-xs">{clinic.storage}</td>
                       <td className="p-4 text-right">
                         <button className="text-slate-400 hover:text-white transition-colors p-1">
                           <MoreVertical className="w-4 h-4" />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>

            {/* Right Column: Mini Settings & Audit */}
            <div className="space-y-8">
               
               {/* retention */}
               <div className="glass-card rounded-2xl border border-midnight-700 p-6 bg-midnight-800/30">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                    <Database className="w-4 h-4 mr-2 text-accent-cyan" /> Retention Policy
                  </h3>
                  
                  <div className="space-y-4">
                     <div>
                        <div className="flex justify-between text-sm mb-1">
                           <span className="text-white">Voice Memos (Raw Audio)</span>
                           <span className="text-accent-teal font-medium">30 Days</span>
                        </div>
                        <p className="text-xs text-slate-500">Auto-deleted to minimize PHI risk.</p>
                     </div>
                     <div className="border-t border-midnight-700 pt-3">
                        <div className="flex justify-between text-sm mb-1">
                           <span className="text-white">Structured Transcripts</span>
                           <span className="text-accent-teal font-medium">7 Years</span>
                        </div>
                        <p className="text-xs text-slate-500">Stored via HIPAA-compliant vault.</p>
                     </div>
                     <button className="w-full mt-2 py-2 border border-midnight-600 hover:border-accent-cyan rounded-lg text-xs font-medium text-slate-300 transition-colors">
                       Configure Regions
                     </button>
                  </div>
               </div>

               {/* Audit Logs */}
               <div className="glass-card rounded-2xl border border-midnight-700 p-6">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-accent-amber" /> System Audit Trail
                  </h3>
                  
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-midnight-600 before:to-transparent">
                     {auditLogs.map((log, idx) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-5 h-5 rounded-full border border-midnight-600 bg-midnight-900 text-slate-500 group-[.is-active]:text-accent-cyan group-[.is-active]:border-accent-cyan shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            <Clock className="w-2.5 h-2.5" />
                          </div>
                          
                          <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-midnight-700 bg-midnight-800 shadow relative">
                            <div className="text-[10px] text-slate-500 font-mono mb-1">{log.time}</div>
                            <div className="text-xs font-semibold text-slate-200 mb-1">{log.action}</div>
                            <div className="text-[10px] text-slate-400">By: {log.user}</div>
                          </div>
                        </div>
                     ))}
                  </div>

                  <button className="w-full mt-4 py-2 text-xs font-medium text-accent-cyan hover:underline transition-colors text-center">
                    View Full Access Logs (CSV)
                  </button>
               </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
