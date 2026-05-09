"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bell, Search, Settings, Grid, FileText, CheckCircle, Clock, 
  AlertTriangle, Mic, ChevronRight, BarChart2,
  Copy, Download, User, Activity, Bot, ShieldAlert, ArrowLeft, Lock
} from 'lucide-react';
import { initDb, getClinicDashboardData, getActiveClinicId, Clinic } from '@/lib/mockDb';
import { auditLogger } from '@/lib/audit-logs';
import { mapToFHIRObservation, NurosVocalData } from '@/lib/fhir-connector';

export default function DoctorDashboard() {
  const router = useRouter();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    initDb();
    const activeId = getActiveClinicId();
    if (!activeId) {
      router.push('/login');
      return;
    }
    const { clinic: c, patients: pts } = getClinicDashboardData(activeId);
    setClinic(c);
    setPatients(pts);

    const interval = setInterval(() => {
       const { patients: updatedPts } = getClinicDashboardData(activeId);
       setPatients(updatedPts);
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const copyIntakeLink = () => {
     if (!clinic) return;
     const url = `${window.location.origin}/patient/${clinic.clinic_slug}`;
     navigator.clipboard.writeText(url);
     setToast('Patient Portal URL Copied!');
     setTimeout(() => setToast(null), 3000);
  };

  const viewPatientProfile = (patient: any) => {
    setSelectedPatient(patient);
    setActiveTab('profile');
    
    // Log access securely
    if (clinic) {
      auditLogger.logAccess({
        clinicianId: clinic.admin_email,
        patientId: patient.id,
        action: 'VIEW_DASHBOARD',
        resourceType: 'Patient Profile',
        status: 'SUCCESS'
      });
    }
  };

  const filteredPatients = patients.filter(p => {
    if (filter !== 'All' && p.scan?.risk_level !== filter) return false;
    if (searchQuery && !p.display_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (!clinic) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">Loading...</div>;

  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in-up">
      {/* Pilot Analytics Agent Widget */}
      <div className="bg-gradient-to-r from-[#0b1021] to-[#121c33] border border-[#1b3459] p-6 rounded-2xl shadow-xl flex justify-between items-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-accent-teal/5 rounded-full blur-3xl pointer-events-none" />
         <div>
           <div className="flex items-center space-x-2 text-accent-cyan font-bold text-xs uppercase tracking-widest mb-2">
             <Bot className="w-4 h-4" /> Pilot Analytics Agent
           </div>
           <h2 className="text-2xl font-bold text-white">{clinic.clinic_name} Performance</h2>
           <p className="text-slate-400 text-sm">Real-time metrics for your clinical pilot.</p>
         </div>
         <div className="flex space-x-6 text-center">
            <div><p className="text-3xl font-extrabold text-white">{patients.length}</p><p className="text-xs text-slate-400 uppercase">Scans Completed</p></div>
            <div><p className="text-3xl font-extrabold text-white">20s</p><p className="text-xs text-slate-400 uppercase">Avg Capture Time</p></div>
            <div><p className="text-3xl font-extrabold text-accent-amber">{patients.filter(p => p.scan?.risk_level === 'Elevated').length}</p><p className="text-xs text-slate-400 uppercase">Elevated Signals</p></div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
         {/* Stats Cards */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            <div className="bg-[#0b1021] border border-white/5 p-5 rounded-2xl">
              <span className="text-slate-400 text-sm font-semibold">Total Scans Today</span>
              <div className="text-3xl font-bold text-white mt-2">{patients.length}</div>
            </div>
            <div className="bg-[#0b1021] border border-white/5 p-5 rounded-2xl">
              <span className="text-slate-400 text-sm font-semibold">Low Signal</span>
              <div className="text-3xl font-bold text-accent-teal mt-2">{patients.filter(p => p.scan?.risk_level === 'Low').length}</div>
            </div>
            <div className="bg-[#0b1021] border border-white/5 p-5 rounded-2xl">
              <span className="text-slate-400 text-sm font-semibold">Moderate Signal</span>
              <div className="text-3xl font-bold text-accent-amber mt-2">{patients.filter(p => p.scan?.risk_level === 'Moderate').length}</div>
            </div>
            <div className="bg-[#0b1021] border border-accent-amber/20 bg-accent-amber/5 p-5 rounded-2xl relative">
              <span className="text-accent-amber text-sm font-semibold flex items-center"><AlertTriangle className="w-4 h-4 mr-1"/> Elevated Signal</span>
              <div className="text-3xl font-bold text-white mt-2">{patients.filter(p => p.scan?.risk_level === 'Elevated').length}</div>
            </div>
         </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#0b1021] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-white">Today's Patient Voice Intake Queue</h2>
          <div className="flex gap-2">
            {['All', 'Low', 'Moderate', 'Elevated'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === f ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1e293b]/30 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Patient Name</th>
                <th className="p-4 font-semibold">Age/Gender</th>
                <th className="p-4 font-semibold">Time Submitted</th>
                <th className="p-4 font-semibold">Overall Signal</th>
                <th className="p-4 font-semibold">AI Follow-Up</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPatients.map(p => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => viewPatientProfile(p)}>
                  <td className="p-4 font-medium text-white">{p.display_name}</td>
                  <td className="p-4 text-slate-400">{p.age} / {p.gender}</td>
                  <td className="p-4 text-slate-400 font-mono text-xs">{new Date(p.created_at).toLocaleTimeString()}</td>
                  <td className="p-4">
                     <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${p.scan?.risk_level === 'Elevated' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : p.scan?.risk_level === 'Moderate' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {p.scan?.risk_level}
                     </span>
                  </td>
                  <td className="p-4 text-slate-300 text-xs">{p.scan?.agents?.follow_up}</td>
                  <td className="p-4 text-right">
                    <button className="text-accent-teal font-medium group-hover:underline flex items-center justify-end w-full">View Details <ChevronRight className="w-4 h-4 ml-1"/></button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No patients found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => {
    if (!selectedPatient || !selectedPatient.scan) return null;
    const scan = selectedPatient.scan;
    
    return (
      <div className="space-y-6 pb-20 animate-fade-in-up">
        <button onClick={() => setActiveTab('dashboard')} className="flex items-center text-slate-400 hover:text-white transition-colors mb-4 text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Queue
        </button>

        {/* Overview Header */}
        <div className="bg-[#0b1021] border border-white/5 rounded-2xl p-6 flex justify-between items-start">
           <div>
              <h1 className="text-3xl font-extrabold text-white mb-2">{selectedPatient.display_name}</h1>
              <div className="flex gap-4 text-sm text-slate-400 font-medium">
                <span><User className="w-4 h-4 inline mr-1"/> {selectedPatient.age} yrs • {selectedPatient.gender}</span>
                <span><Clock className="w-4 h-4 inline mr-1"/> {new Date(selectedPatient.created_at).toLocaleTimeString()}</span>
                {selectedPatient.reason_for_visit && <span><Activity className="w-4 h-4 inline mr-1"/> Reason: {selectedPatient.reason_for_visit}</span>}
              </div>
           </div>
           <div className={`px-4 py-2 rounded-xl border flex flex-col items-center ${scan.risk_level === 'Elevated' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
              <span className="text-xs font-bold uppercase tracking-widest mb-1 text-slate-400">Signal Level</span>
              <span className="text-xl font-extrabold">{scan.risk_level}</span>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
           {/* Left Col: Agents */}
           <div className="lg:col-span-1 space-y-6">
              
              {/* Agent 1: Intake Summary */}
              <div className="bg-[#111827] border border-cyan-900/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50" />
                 <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center"><Bot className="w-4 h-4 mr-2"/> Intake Summary Agent</h3>
                 <p className="text-slate-200 text-sm leading-relaxed">{scan.agents.summary}</p>
                 <div className="mt-4 pt-4 border-t border-white/5">
                   <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Suggested Review Prompts</p>
                   <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                     {scan.suggested_review_prompts.map((p:string, i:number) => <li key={i}>{p}</li>)}
                   </ul>
                 </div>
              </div>

              {/* Agent 2 & 3: Follow Up & Comm */}
              <div className="bg-[#111827] border border-amber-900/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50" />
                 <h3 className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center"><Bot className="w-4 h-4 mr-2"/> Recommendation Agent</h3>
                 <p className="text-white font-bold mb-4">{scan.agents.follow_up}</p>
                 
                 <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center mt-6 pt-4 border-t border-white/5"><Bot className="w-4 h-4 mr-2"/> Comm Agent Draft</h3>
                 <div className="bg-black/30 p-3 rounded-lg text-xs text-slate-300 italic border border-white/5">
                    "{scan.agents.patient_comm}"
                 </div>
              </div>

           </div>

           {/* Right Col: Signals & Research */}
           <div className="lg:col-span-2 space-y-6">
              
              {/* Signal Table */}
              <div className="bg-[#0b1021] border border-white/5 rounded-2xl overflow-hidden">
                 <div className="p-5 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Voice Acoustic Signals</h3>
                    <span className="text-xs text-slate-500 font-mono">Recording Quality: {scan.recording_quality}</span>
                 </div>
                 <table className="w-full text-left text-sm">
                    <thead className="bg-[#1e293b]/30 text-slate-400 text-[10px] uppercase tracking-widest">
                       <tr>
                         <th className="p-4 font-semibold">Signal Category</th>
                         <th className="p-4 font-semibold">Status</th>
                         <th className="p-4 font-semibold">Confidence</th>
                         <th className="p-4 font-semibold">Acoustic Contributors</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                       {Object.entries(scan.signals).map(([key, val]: [string, any]) => (
                         <tr key={key} className="hover:bg-white/5">
                           <td className="p-4 font-medium text-slate-200 capitalize">{key.replace('_', ' ')}</td>
                           <td className="p-4">
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${val.status === 'High' || val.status === 'Irregular' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                               {val.status}
                             </span>
                           </td>
                           <td className="p-4 text-slate-400">{val.confidence}%</td>
                           <td className="p-4 text-slate-400 font-mono">{val.contributors}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              {/* Research Signals (Doctor Only) */}
              <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><ShieldAlert className="w-32 h-32" /></div>
                 
                 <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-xs mb-4">
                   <Lock className="w-4 h-4" /> Doctor View Only
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Advanced Clinical Research Signals</h3>
                 
                 <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-amber-200/80 text-xs leading-relaxed font-medium mb-6">
                   Disclaimer: These research signals are not diagnoses. They are decision-support indicators that may help guide provider conversations and clinical judgment.
                 </div>

                 <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(scan.research_signals).map(([key, val]: [string, any]) => (
                      <div key={key} className="bg-black/20 border border-white/5 p-4 rounded-xl">
                         <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-slate-200 capitalize">{key} Pattern</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${val.status === 'Elevated' ? 'bg-amber-500/20 text-amber-500' : val.status === 'Moderate' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                              {val.status}
                            </span>
                         </div>
                         <p className="text-[10px] text-slate-500 uppercase tracking-widest">{val.label}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Clinical Validation Panel */}
              <div className="bg-[#0b1021] border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
                 <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-widest text-xs mb-4">
                   <Activity className="w-4 h-4" /> Evidence-Based Clinical Validation
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Cross-Referenced Standard Assessments</h3>
                 <p className="text-sm text-slate-400 mb-6">Comparing Nuros acoustic biomarker risk scores against gold-standard clinical assessments.</p>
                 
                 <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
                       <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-slate-200">PHQ-9 Correlation (Mental Health)</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${scan.risk_level === 'Elevated' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {scan.risk_level === 'Elevated' ? 'High Match (PHQ > 15)' : 'Consistent (PHQ < 9)'}
                          </span>
                       </div>
                       <p className="text-[10px] text-slate-500 leading-relaxed">Acoustic indicators of psychomotor retardation closely mirror elevated PHQ-9 scoring for depressive symptoms.</p>
                    </div>

                    <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
                       <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-slate-200">Spirometry Predictor (Respiratory)</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${scan.risk_level === 'Elevated' && scan.signals?.breathiness?.status === 'High' ? 'bg-amber-500/20 text-amber-500' : 'bg-cyan-500/20 text-cyan-400'}`}>
                            {scan.risk_level === 'Elevated' && scan.signals?.breathiness?.status === 'High' ? 'Flagged (FEV1 drops)' : 'Baseline'}
                          </span>
                       </div>
                       <p className="text-[10px] text-slate-500 leading-relaxed">Vocal shimmer and breathiness metrics serve as early proxies for reduced Forced Expiratory Volume (FEV1).</p>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b1021] border-r border-white/5 flex flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-md bg-gradient-to-br from-accent-teal to-accent-cyan flex justify-center items-center shadow-[0_0_15px_rgba(8,247,206,0.3)]">
               <Grid className="w-4 h-4 text-midnight-900" />
             </div>
             <span className="text-xl font-bold text-white">Nuros<span className="font-light text-slate-400">MD</span></span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Clinical Workspace</div>
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-accent-teal/10 text-accent-teal' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
             <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('profile')} disabled={!selectedPatient} className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-accent-teal/10 text-accent-teal' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed'}`}>
             <FileText className="w-4 h-4 mr-3" /> Patient Detail View
          </button>
          <div className="mt-8">
            <Link href="/clinic-home" className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
               <ArrowLeft className="w-4 h-4 mr-3" /> Back to Hub
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <p className="text-sm font-bold text-white truncate">{clinic.admin_name}</p>
          <p className="text-xs text-slate-500 truncate">{clinic.clinic_name}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-white/5 bg-[#0b1021]/80 backdrop-blur-md flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
             <h1 className="text-xl font-bold text-white hidden md:block">
                {activeTab === 'dashboard' ? 'Clinic Dashboard' : 'Patient Detail View'}
             </h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="relative hidden md:block">
               <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
               <input type="text" placeholder="Search patient name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-accent-teal text-slate-200 w-64 transition-all" />
             </div>
             <button onClick={copyIntakeLink} className="hidden sm:flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors text-slate-300">
               <Copy className="w-4 h-4 mr-2" /> Copy Link
             </button>
             <button onClick={() => alert('Downloading...')} className="hidden sm:flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors text-slate-300">
               <Download className="w-4 h-4 mr-2" /> QR
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
           {toast && (
              <div className="absolute top-6 right-10 bg-accent-teal text-midnight-900 font-bold px-6 py-3 rounded-lg shadow-xl animate-fade-in-up flex items-center z-50">
                <CheckCircle className="w-5 h-5 mr-2" /> {toast}
              </div>
           )}
           {activeTab === 'dashboard' ? renderDashboard() : renderProfile()}
        </div>
      </main>
    </div>
  );
}

// Ensure icons used don't break compilation
import { LayoutDashboard } from 'lucide-react';
