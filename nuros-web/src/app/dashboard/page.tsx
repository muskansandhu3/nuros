"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Bell, Search, Settings, Grid, FileText, CheckCircle, Clock, 
  AlertTriangle, Mic, Play, Pause, Volume2, MoreVertical, 
  Stethoscope, Activity, Users, ShieldAlert, FileOutput, 
  Database, Download, Send, ArrowLeft, ChevronRight, BarChart2
} from 'lucide-react';
import WaveformPlot from '@/components/WaveformPlot';

const initialDemoPatients = [
  { id: '40192-NR', name: 'James Morrison', dob: '1974-03-12', city: 'Toronto', time: '10:14 AM', status: 'Pending Review', priority: 'High', triage: 'Urgent',
    symptoms: 'Sever chest pain, radiating to left arm, short of breath.', history: 'Hypertension', audioLen: '18s',
    transcription: "I've been having this really tight pain in my chest since I woke up about an hour ago... it's kind of moving down my left arm and it's hard to catch my breath.",
    summary: "Patient presents with acute chest pain onset 1 hr prior, radiating to left upper extremity, accompanied by dyspnea.",
    signals: { clarity: "Strained", breathing: "Labored", stress: "High" }
  },
  { id: '21094-NR', name: 'Elena Rostova', dob: '1988-11-04', city: 'Vancouver', time: '10:05 AM', status: 'AI Summary Ready', priority: 'Medium', triage: 'Priority',
    symptoms: 'Persistent cough for 3 weeks, fever last night.', history: 'None', audioLen: '20s',
    transcription: "My cough just won't go away. It's been like three weeks now. Last night I had a pretty high fever and I'm feeling really fatigued.",
    summary: "Patient reports persistent cough x3 weeks. Endorses subjective fever beginning last evening and general fatigue.",
    signals: { clarity: "Clear", breathing: "Occasional cough", stress: "Low" }
  },
  { id: '99201-NR', name: 'Michael Chang', dob: '1995-06-22', city: 'Calgary', time: '09:42 AM', status: 'Sent to EMR', priority: 'Low', triage: 'Routine',
    symptoms: 'Refill needed for asthma inhaler.', history: 'Asthma', audioLen: '12s',
    transcription: "Hi, I just need a refill for my salbutamol inhaler. I haven't had any major flare-ups, just ran out.",
    summary: "Patient requesting routine refill for salbutamol inhaler. Denies acute exacerbations or new symptoms.",
    signals: { clarity: "Clear", breathing: "Normal", stress: "None" }
  },
  { id: '10582-NR', name: 'Sarah Jenkins', dob: '1955-01-30', city: 'Ottawa', time: '09:15 AM', status: 'Transcribed', priority: 'Medium', triage: 'Review',
    symptoms: 'Dizzy spells when standing up, mild nausea.', history: 'Type 2 Diabetes', audioLen: '19s',
    transcription: "Whenever I stand up from a chair I get very dizzy for a few seconds. I've also been feeling a little nauseous after meals lately.",
    summary: "Patient reports orthostatic dizziness and mild postprandial nausea. History of T2DM.",
    signals: { clarity: "Clear", breathing: "Normal", stress: "Mild concern" }
  },
  { id: '88390-NR', name: 'David Reynolds', dob: '1990-08-14', city: 'Montreal', time: '08:45 AM', status: 'AI Summary Ready', priority: 'High', triage: 'Urgent',
    symptoms: 'Rapid heart rate, sweating, cant sit still, chest tightness.', history: 'None', audioLen: '11s',
    transcription: "My heart is beating really fast, like out of my chest... I can't catch my breath and I feel super jittery right now.",
    summary: "Patient presents with extreme tachycardia, diaphoresis, and psychomotor agitation. Acoustic profile flags acute heavy stimulant exposure.",
    signals: { clarity: "Erratic", breathing: "Breathless", stress: "Severe (Stimulant Flag)" }
  },
  { id: '72291-NR', name: 'Ryan Walker', dob: '1982-11-20', city: 'Calgary', time: '07:30 AM', status: 'AI Summary Ready', priority: 'High', triage: 'Review',
    symptoms: 'Slurred speech, confusion, unsteady gait.', history: 'None', audioLen: '20s',
    transcription: "I don't know why my friends brought me here honestly just feeling a bit dizzy but I'm completely fine.",
    summary: "Patient demonstrating ataxia and dysarthria. Acoustic profile indicative of central nervous system depression, likely acute alcohol intoxication.",
    signals: { clarity: "Slurred", breathing: "Slow", stress: "Low" }
  }
];

export default function DoctorDashboard() {
  const [patients, setPatients] = useState(initialDemoPatients);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pdfAlert, setPdfAlert] = useState<string | null>(null);
  const [expandedModality, setExpandedModality] = useState<string | null>(null);

  // Audio simulation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const playInterval = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const local = localStorage.getItem('nuros_patients');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed.length > 0) {
          const combined = [...parsed, ...initialDemoPatients];
          setPatients(combined);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
     // Apply volume to active speech session if running
     if (typeof window !== 'undefined' && window.speechSynthesis) {
         // Unfortunately speechSynthesis volume can only be set at Utterance creation
         // But we maintain the state for the next play
     }
  }, [volume]);

  const handleDownloadReport = async (ptName: string) => {
    setPdfAlert(`Generating Medical Report PDF for ${ptName}...`);
    
    try {
      const loadScript = (src: string) => new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve(null);
        let script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
      
      if (!(window as any).jspdf) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      }
      if (!(window as any).jspdf.autotable) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js');
      }

      const { jsPDF } = (window as any).jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
      
      const pt = patients.find(p => p.name === ptName) || selectedPatient;
      if (!pt) throw new Error("Patient not found");

      // COLORS
      const darkBlue = [15, 31, 61];
      const teal = [32, 178, 170];
      const red = [220, 38, 38];
      const grey = [100, 100, 100];
      const lightGrey = [240, 240, 240];

      // --- BRAND HEADER (NUROS LOGO REPLICA) ---
      pdf.setFillColor(darkBlue[0], darkBlue[1], darkBlue[2]);
      pdf.rect(0, 0, 216, 25, 'F'); // Top blue bar
      
      // Logo Text
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      pdf.text("NUROS", 20, 16);
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(200, 200, 200);
      pdf.text("VOICE OF HEALTH AI", 20, 21);

      // Report Title
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 255, 255);
      pdf.text("CLINICAL LABORATORY REPORT", 120, 16);
      
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Report ID: REP-${pt.id}-${Math.floor(Math.random()*1000)}`, 120, 21);

      // --- PATIENT & REQUISITION DETAILS (LAB-STYLE) ---
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      
      // Block 1: Patient Details
      pdf.text("PATIENT INFORMATION", 20, 35);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Name: ${pt.name.toUpperCase()}`, 20, 41);
      pdf.text(`DOB: ${pt.dob}    Age: ${new Date().getFullYear() - parseInt(pt.dob.substring(0,4))}`, 20, 46);
      pdf.text(`Health Card / MRN: ${pt.id}`, 20, 51);
      pdf.text(`Location: ${pt.city}`, 20, 56);

      // Block 2: Provider & Specimen Details
      pdf.setFont("helvetica", "bold");
      pdf.text("REQUESTING PHYSICIAN", 110, 35);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Physician: Dr. J. Smith`, 110, 41);
      pdf.text(`Collection Date: ${new Date().toLocaleDateString()}`, 110, 46);
      pdf.text(`Collection Time: ${pt.time}`, 110, 51);
      pdf.text(`Specimen Type: High-Fid Digital Audio`, 110, 56);

      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(20, 60, 195, 60);

      // --- CLINICAL SUMMARY & SYMPTOMS ---
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("CLINICAL CONTEXT & HISTORY", 20, 67);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(`Reported Symptoms: ${pt.symptoms || "None reported."}`, 20, 73);
      pdf.text(`Medical History: ${pt.history || "No known."}`, 20, 78);
      
      pdf.setFont("helvetica", "italic");
      const splitSummary = pdf.splitTextToSize(`Auto-Summary: ${pt.summary || "No summary recorded."}`, 175);
      pdf.text(splitSummary, 20, 84);

      pdf.line(20, 95, 195, 95);

      // --- DIAGNOSTIC TEST RESULTS TABLE (DYNACARE STYLE) ---
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text("AI DIAGNOSTIC MODALITIES", 20, 102);

      const tableData = [
         ["Parkinson's Disease", "Low Risk", "Negative", "98.2%", "< 50%"],
         ["Alzheimer's / Cognitive", "Low Risk", "Negative", "94.6%", "< 50%"],
         ["Clinical Depression", "Low Risk", "Negative", "91.5%", "< 50%"],
         ["Chronic Anxiety", "Medium Risk", "Positive (+)", "88.0%", "< 50%"],
         ["COPD / Vocal Path", "Low Risk", "Negative", "99.1%", "< 50%"],
         ["Laryngeal / Vocal Mass", "Low Risk", "Negative", "97.4%", "< 50%"],
         ["Hypothyroidism", "Medium Risk", "Positive (+)", "84.1%", "< 50%"],
         ["Cardiovascular (CHF)", "Low Risk", "Negative", "95.8%", "< 50%"],
         ["Acid Reflux (GERD)", "Low Risk", "Negative", "99.2%", "< 50%"]
      ];

      (pdf as any).autoTable({
        startY: 106,
        head: [['TEST / MODALITY', 'RISK STATUS', 'FLAG', 'CONFIDENCE', 'REFERENCE INTERVAL']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: darkBlue, textColor: 255, fontSize: 8, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8, textColor: 50 },
        columnStyles: {
           1: { fontStyle: 'bold' },
           2: { fontStyle: 'bold' }
        },
        willDrawCell: function (data: any) {
           if (data.section === 'body') {
              // Color flags
              if (data.row.raw[2] === "Positive (+)") {
                 if (data.column.index === 1 || data.column.index === 2) {
                    data.cell.styles.textColor = [220, 38, 38]; // Red for abnormal
                 }
              } else {
                 if (data.column.index === 1 || data.column.index === 2) {
                    data.cell.styles.textColor = [34, 139, 34]; // Green for normal
                 }
              }
           }
        },
        margin: { top: 10, left: 20, right: 20 }
      });

      const finalY = (pdf as any).lastAutoTable.finalY || 160;

      // --- BIOMARKERS ---
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text("VOCAL BIOMARKER ASSAY", 20, finalY + 12);

      const markerData = [
         ["Jitter (Micro-Tremor)", "0.00 %", "Normal", "< 1.04 %"],
         ["Shimmer (Amplitude)", "0.00 %", "Normal", "< 3.81 %"],
         ["Harmonics-to-Noise (HNR)", "15.7 dB", "Standard", "> 20.0 dB"]
      ];

      (pdf as any).autoTable({
        startY: finalY + 16,
        head: [['BIOMARKER', 'VALUE', 'FLAG', 'REFERENCE INTERVAL']],
        body: markerData,
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: 0, fontSize: 8, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8, textColor: 50 },
        margin: { top: 10, left: 20, right: 20 },
        tableWidth: 175
      });

      const nextY = (pdf as any).lastAutoTable.finalY || finalY + 50;

      // --- TRANSCRIPT & SIGNATURE ---
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(0);
      pdf.text("OBSERVATIONS / TRANSCRIPT:", 20, nextY + 12);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      const scriptLines = pdf.splitTextToSize(`"${pt.transcription || "No voice sample provided."}"`, 175);
      pdf.text(scriptLines, 20, nextY + 18);

      pdf.setFont("helvetica", "bold");
      pdf.text("Electronically Authorized By: Nuros AI Model Core (MD-v4.2)", 20, nextY + 36);
      pdf.setFont("helvetica", "normal");
      pdf.text("This report was generated using acoustic vocal biomarkers. Clinical correlation is recommended.", 20, nextY + 41);

      // --- FOOTER ---
      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Page 1 of 1 • CONFIDENTIAL MEDICAL DOCUMENT • PHIPA / PIPEDA COMPLIANT", 107.5, 270, { align: "center" });

      // Output as blob and physically open in new browser tab
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      
      setPdfAlert(null);
    } catch (e) {
      console.error("PDF GENERATION ERROR:", e);
      setPdfAlert('Failed to generate PDF. Check Console.');
      setTimeout(() => setPdfAlert(null), 3000);
    }
  };

  const handleEmailReport = (ptName: string) => {
    setPdfAlert(`Secure E-mail sent to registered practice address for ${ptName}.`);
    setTimeout(() => setPdfAlert(null), 3000);
  };

  const viewPatientProfile = (patient: any) => {
    setSelectedPatient(patient);
    setActiveTab('profile');
    setIsPlaying(false);
    setPlaybackTime(0);
    if (playInterval.current) window.clearInterval(playInterval.current);
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    setExpandedModality(null);
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
    }
  };

  const togglePlayback = () => {
    // Force UI flip instantly
    setIsPlaying(!isPlaying);
    
    // Clean interval
    if (playInterval.current) {
        clearInterval(playInterval.current);
        playInterval.current = null;
    }

    if (!isPlaying) { // Starting play
      if (playbackTime >= 20) {
          setPlaybackTime(0);
      }

      // Safe audio API engagement
      if (selectedPatient?.voiceData) {
         if (!audioRef.current) {
             audioRef.current = new Audio(selectedPatient.voiceData);
         } else if (audioRef.current.src !== selectedPatient.voiceData) {
             audioRef.current.src = selectedPatient.voiceData;
         }
         audioRef.current.volume = volume;
         audioRef.current.currentTime = playbackTime >= 20 ? 0 : playbackTime;
         
         audioRef.current.play().catch(e => console.warn("Native Voice Media Error:", e));
         
         audioRef.current.onended = () => {
             setIsPlaying(false);
             setPlaybackTime(20);
             if (playInterval.current) clearInterval(playInterval.current);
         }
      } else {
         try {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
               window.speechSynthesis.cancel(); // Clears Safari audio buffers correctly
               
               // Allow buffer to flush for 50ms before enqueuing new audio string
               setTimeout(() => {
                   const utteranceText = selectedPatient?.transcription 
                         ? String(selectedPatient.transcription) 
                         : "Voice sample initialized and proceeding with clinical review.";
                   
                   const msg = new SpeechSynthesisUtterance(utteranceText);
                   msg.rate = 0.9;
                   
                   msg.onend = () => {
                       setIsPlaying(false);
                       setPlaybackTime(20);
                       if (playInterval.current) clearInterval(playInterval.current);
                   };
                   
                   window.speechSynthesis.speak(msg);
               }, 50);
            }
         } catch (e) {
            console.warn("Speech API silent failure.", e);
         }
      }

      // Universal scrubber interval
      let internalTime = playbackTime >= 20 ? 0 : playbackTime;
      playInterval.current = setInterval(() => {
        internalTime++;
        setPlaybackTime(internalTime);
        if (internalTime >= 20) {
           clearInterval(playInterval.current as NodeJS.Timeout);
           setIsPlaying(false);
           try { window.speechSynthesis.cancel(); } catch(err) {}
           if (audioRef.current) audioRef.current.pause();
        }
      }, 1000);
      
    } else { // Stopping play
      if (selectedPatient?.voiceData && audioRef.current) {
         audioRef.current.pause();
      } else {
         try {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
               window.speechSynthesis.pause();
            }
         } catch (e) {
            console.warn("Pause API failed.", e);
         }
      }
    }
  };

  // Progress length visualization
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const SidebarLink = ({ id, icon: Icon, label, badge }: { id: string, icon: any, label: string, badge?: number }) => {
    const isActive = activeTab === id || (activeTab === 'profile' && id === 'intakes' && selectedPatient);
    return (
      <button 
        onClick={() => {
          setActiveTab(id);
          if (id !== 'profile') setSelectedPatient(null);
        }}
        className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
          isActive ? 'bg-midnight-800 text-accent-teal border border-[#08f7ce]/20 shadow-[inset_2px_0_0_#08f7ce]' : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-800 border border-transparent'
        }`}
      >
        <Icon className="w-5 h-5 mr-3" /> {label}
        {badge ? <span className="ml-auto bg-accent-red text-white text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span> : null}
      </button>
    );
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="glass-card p-6 rounded-2xl flex flex-col">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-accent-teal/10 rounded-lg"><Activity className="w-6 h-6 text-accent-teal" /></div>
                    <span className="text-accent-teal text-sm font-bold bg-accent-teal/20 px-2 py-1 rounded">+12%</span>
                 </div>
                 <span className="text-4xl font-bold mb-1">{patients.length + 20}</span>
                 <span className="text-sm font-medium text-slate-400">Total Intakes Today</span>
               </div>
               <div className="glass-card p-6 rounded-2xl flex flex-col border-accent-amber/30">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-accent-amber/10 rounded-lg"><Clock className="w-6 h-6 text-accent-amber" /></div>
                 </div>
                 <span className="text-4xl font-bold mb-1 text-accent-amber">{patients.filter(p => !p.status.includes('EMR')).length}</span>
                 <span className="text-sm font-medium text-slate-400">Pending Review</span>
               </div>
               <div className="glass-card p-6 rounded-2xl flex flex-col border-accent-red/30 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-accent-red/10 blur-[20px] rounded-full" />
                 <div className="flex justify-between items-start mb-4 z-10">
                    <div className="p-2 bg-accent-red/10 rounded-lg"><AlertTriangle className="w-6 h-6 text-accent-red animate-pulse" /></div>
                 </div>
                 <span className="text-4xl font-bold mb-1 text-accent-red z-10">{patients.filter(p => p.priority === 'High').length}</span>
                 <span className="text-sm font-medium text-slate-400 z-10">High Priority Flags</span>
               </div>
               <div className="glass-card p-6 rounded-2xl flex flex-col">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-accent-cyan/10 rounded-lg"><FileOutput className="w-6 h-6 text-accent-cyan" /></div>
                    <span className="text-accent-cyan text-sm font-bold bg-accent-cyan/20 px-2 py-1 rounded">Avg</span>
                 </div>
                 <span className="text-4xl font-bold mb-1">1.2<span className="text-lg">m</span></span>
                 <span className="text-sm font-medium text-slate-400">AI Processing Time</span>
               </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-midnight-700 flex justify-between items-center bg-midnight-800/80">
                <h2 className="text-xl font-bold flex items-center">
                  <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse mr-2"></span> System Overview Overview
                </h2>
                <button onClick={() => setActiveTab('intakes')} className="text-accent-teal text-sm font-medium hover:underline">View All Queues</button>
              </div>
              <div className="p-8 text-center text-slate-400">
                 <Grid className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                 <p className="text-lg font-semibold text-white mb-2">Welcome to NurosMD Dashboard</p>
                 <p className="max-w-md mx-auto">Use the sidebar to navigate to your live New Intakes queue, browse your Patient roster, download Reports, or review critical Triage Flags.</p>
              </div>
            </div>
        </div>
      );
    }
    
    if (activeTab === 'intakes') {
      const visiblePatients = patients.filter(p => p.status !== 'Sent to EMR');
      return (
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-[800px] shadow-xl">
          <div className="p-6 border-b border-midnight-700 flex justify-between items-center bg-midnight-800/80">
            <h2 className="text-xl font-bold flex items-center">
              <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse mr-2"></span> New Intakes Queue
            </h2>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 text-xs uppercase bg-midnight-900/50 sticky top-0">
                  <th className="p-4 rounded-tl-lg font-semibold tracking-wider">Patient</th>
                  <th className="p-4 font-semibold tracking-wider">Status</th>
                  <th className="p-4 font-semibold tracking-wider">Triage</th>
                  <th className="p-4 font-semibold tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {visiblePatients.map((patient, idx) => (
                  <tr 
                    key={idx} 
                    onClick={() => viewPatientProfile(patient)}
                    className="border-b border-midnight-700/50 hover:bg-midnight-800/80 cursor-pointer transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${patient.priority === 'High' ? 'bg-accent-red animate-pulse' : (patient.priority === 'Medium' ? 'bg-accent-amber' : 'bg-transparent')}`}></div>
                        <div>
                           <p className="font-bold text-slate-100 flex items-center">{patient.name}</p>
                           <p className="text-xs text-slate-500 font-mono mt-0.5">{patient.id} • {patient.time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-medium border flex items-center w-max space-x-1
                         ${patient.status === 'Sent to EMR' ? 'bg-[#00f59b]/10 text-[#00f59b] border-[#00f59b]/30' : 
                           patient.status === 'Pending Review' ? 'bg-accent-red/10 text-accent-red border-accent-red/30' :
                           patient.status === 'AI Summary Ready' ? 'bg-accent-teal/10 text-accent-teal border-accent-teal/30' :
                           'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30'
                         }`}
                      >
                         <span>{patient.status}</span>
                      </span>
                    </td>
                    <td className="p-4 font-bold text-sm text-slate-300">
                      {patient.triage}
                    </td>
                    <td className="p-4 text-right">
                       <button className="text-accent-teal text-sm font-bold flex items-center ml-auto group-hover:underline">
                         Review <ChevronRight className="w-4 h-4 ml-1" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'patients') {
      return (
        <div className="glass-card rounded-2xl p-8 flex-1">
           <h2 className="text-2xl font-bold mb-6 flex items-center"><Users className="mr-3 text-accent-cyan" /> Patient Master Roster</h2>
           <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 text-xs uppercase bg-midnight-900/50 border-b border-midnight-700">
                <th className="p-4 font-semibold tracking-wider">Patient ID</th>
                <th className="p-4 font-semibold tracking-wider">Name</th>
                <th className="p-4 font-semibold tracking-wider">DOB</th>
                <th className="p-4 font-semibold tracking-wider">City</th>
                <th className="p-4 font-semibold tracking-wider">Latest Intake</th>
                <th className="p-4 font-semibold tracking-wider text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id} onClick={() => viewPatientProfile(p)} className="border-b border-midnight-700 hover:bg-midnight-800/50 cursor-pointer group">
                  <td className="p-4 text-slate-400 font-mono text-sm">{p.id}</td>
                  <td className="p-4 font-bold text-white group-hover:text-accent-teal transition-colors">{p.name}</td>
                  <td className="p-4 text-slate-300">{p.dob}</td>
                  <td className="p-4 text-slate-300">{p.city}</td>
                  <td className="p-4 text-accent-cyan">{p.time}</td>
                  <td className="p-4 text-right">
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-accent-teal ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
           </table>
        </div>
      );
    }

    if (activeTab === 'profile' && selectedPatient) {
      return (
        <div id="clinical-profile-view" className="space-y-6 pb-20 p-2">
           {/* Navigation Back */}
           <button onClick={() => setActiveTab('intakes')} className="flex items-center text-slate-400 hover:text-white transition-colors mb-2">
             <ArrowLeft className="w-4 h-4 mr-2" /> Back to Queue
           </button>

           {/* Top Header Identity */}
           <div className="flex justify-between items-end border-b border-midnight-700 pb-4">
              <div>
                 <h1 className="text-4xl font-extrabold text-white mb-1 flex items-center gap-3">
                   {selectedPatient.name} 
                   <span className="flex items-center text-[10px] uppercase font-bold tracking-widest text-[#00d4ff] bg-[#00d4ff]/10 px-3 py-1 rounded-full border border-[#00d4ff]/30">
                     <ShieldAlert className="w-3 h-3 mr-1.5" /> PHIPA / PIPEDA Encrypted View
                   </span>
                 </h1>
                 <p className="text-slate-400 font-mono text-sm">DOB: {selectedPatient.dob} &nbsp;|&nbsp; ID: {selectedPatient.id} &nbsp;|&nbsp; {selectedPatient.city}</p>
              </div>
              <div className="flex space-x-3">
                 <button onClick={() => handleDownloadReport(selectedPatient.name)} className="flex items-center justify-center space-x-2 px-6 py-2 bg-[#112240] border border-[#1b3459] hover:bg-[#162a4a] rounded-lg text-sm font-medium transition-colors text-white">
                    <Download className="w-4 h-4" /> <span>Export PDF</span>
                 </button>
                 <button className="flex items-center justify-center space-x-2 px-6 py-2 bg-gradient-to-r from-accent-teal to-accent-cyan text-[#0f1f3d] rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(8,247,206,0.3)] hover:brightness-110 transition-all">
                    <CheckCircle className="w-4 h-4" /> <span>Push to EMR</span>
                 </button>
              </div>
           </div>

           {/* Top Player Section */}
           <div className="w-full flex justify-center mb-6 mt-4">
              <div className="w-full flex flex-col">
                 <h2 className="text-2xl font-bold flex items-center mb-6 self-start text-white">
                    Clinical Metric Displays
                 </h2>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full xl:w-5/6">
                    <div className="bg-[#464f62] border border-slate-500/30 rounded-2xl p-6 shadow-xl flex flex-col text-center transition-transform hover:-translate-y-1">
                       <p className="text-slate-300 text-sm mb-4">Jitter (Micro-Tremor)</p>
                       <div className="text-4xl font-extrabold text-white mb-4">0.00%</div>
                       <span className="text-xs uppercase font-extrabold tracking-widest text-[#20b2aa]">STABLE</span>
                    </div>
                    
                    <div className="bg-[#0f1523] border border-slate-700/50 rounded-2xl p-6 shadow-xl flex flex-col text-center transition-transform hover:-translate-y-1">
                       <p className="text-slate-400 text-sm mb-4">Shimmer (Amplitude)</p>
                       <div className="text-4xl font-extrabold text-white mb-4">0.00%</div>
                       <span className="text-xs uppercase font-extrabold tracking-widest text-[#20b2aa]">STABLE</span>
                    </div>
                    
                    <div className="bg-[#0f1523] border border-slate-700/50 rounded-2xl p-6 shadow-xl flex flex-col text-center transition-transform hover:-translate-y-1">
                       <p className="text-slate-400 text-sm mb-4">Harmonics-To-Noise</p>
                       <div className="text-4xl font-extrabold text-white mb-4">15.7 dB</div>
                       <span className="text-xs uppercase font-extrabold tracking-widest text-[#20b2aa]">OPTIMAL</span>
                    </div>
                 </div>

                 <div className="w-full mt-4">
                    <p className="text-slate-200 font-medium mb-4 text-sm">Playback Recorded Session:</p>
                    <div className="bg-[#3b4252] rounded-full flex items-center px-4 py-3 space-x-4 w-full shadow-xl border border-[#4c566a] relative max-w-2xl">
                       <button 
                         onClick={(e) => { e.preventDefault(); e.stopPropagation(); togglePlayback(); }} 
                         className="w-10 h-10 rounded-full bg-[#2e3440] hover:bg-[#3b9f98] flex items-center justify-center transition-all text-white shadow-xl flex-shrink-0 z-50 cursor-pointer border border-[#1b2028]"
                         title={isPlaying ? "Pause Recording" : "Play Recording"}
                       >
                          {isPlaying ? <Pause className="w-5 h-5 text-accent-cyan" /> : <Play className="w-5 h-5 ml-1 text-white" />}
                       </button>
                       
                       <div className="flex flex-col text-slate-200 font-mono text-xs font-medium w-12 text-center flex-shrink-0 leading-tight">
                          <span>{formatTime(playbackTime)} /</span>
                          <span>0:20</span>
                       </div>
                       
                       <div className="flex-1 h-2.5 bg-[#1b2028] rounded-full relative overflow-hidden shadow-inner cursor-pointer" 
                            onClick={(e) => { 
                               e.stopPropagation(); 
                               const rect = e.currentTarget.getBoundingClientRect();
                               const percent = (e.clientX - rect.left) / rect.width;
                               const newTime = Math.max(0, Math.min(20, Math.floor(percent * 20)));
                               setPlaybackTime(newTime);
                            }}>
                          <div 
                            className="absolute top-0 left-0 h-full bg-[#08f7ce] rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(8,247,206,0.6)]" 
                            style={{ width: `${(playbackTime / 20) * 100}%` }}
                          />
                       </div>
                       
                       <div className="relative flex-shrink-0 z-20">
                         <button onClick={(e) => { e.stopPropagation(); setShowVolume(!showVolume); }} className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-accent-teal transition-colors bg-[#2e3440] shadow-md">
                            <Volume2 className="w-5 h-5" />
                         </button>
                         
                           {showVolume && (
                              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-[#2e3440] p-4 rounded-xl shadow-xl border border-midnight-600 animate-fade-in-up">
                                 <input 
                                    type="range" min="0" max="1" step="0.05" value={volume}
                                    onChange={(e) => { e.stopPropagation(); setVolume(parseFloat(e.target.value)); }}
                                    onMouseUp={(e) => { e.stopPropagation(); setShowVolume(false); }}
                                    onTouchEnd={(e) => { e.stopPropagation(); setShowVolume(false); }}
                                    className="w-24 accent-accent-teal cursor-pointer"
                                 />
                              </div>
                           )}
                       </div>
                       
                       <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors flex-shrink-0 z-20" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>

           {/* 2-Column Main Layout: Visualizer on Left, Modality on Right */}
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="space-y-6">
                 
                 {/* 3D Silk Waveform Visualizer */}
                 <div className="bg-gradient-to-br from-[#0b1021] to-[#121c33] rounded-2xl border border-midnight-600 p-6 relative overflow-hidden h-[500px] flex flex-col">
                    <h3 className="text-xl font-bold text-white flex items-center mb-1 relative z-10">
                      🌊 3D Silk Waveform Visualizer
                    </h3>
                    <p className="text-sm text-slate-300 mb-8 relative z-10">Real-time bioluminescent mapping of glottal frequencies.</p>

                    <div className="flex-1 w-full relative">
                       <WaveformPlot isPlaying={isPlaying} />
                    </div>
                 </div>

                 {/* Biomarker Stability & Scribe Narrative */}
                 <div className="bg-[#0b1021] border border-midnight-600 rounded-2xl p-6 relative">
                    <h3 className="text-xl font-bold text-white flex items-center mb-6">
                      📊 Biomarker Stability & Scribe Narrative
                    </h3>
                    
                    <div className="flex flex-col lg:flex-row gap-8">
                       {/* Left Side Score */}
                       <div className="w-full lg:w-1/3 flex flex-col items-center justify-center text-center space-y-4">
                          <div className="mb-2">
                             <div className="text-6xl font-black text-accent-cyan drop-shadow-[0_0_10px_rgba(0,212,255,0.5)] leading-none">86.5</div>
                             <div className="text-xl text-slate-400 mt-2">/ 100</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-accent-red font-semibold text-xs">Vocal Twin Hash:</div>
                            <div className="text-white font-mono text-sm tracking-wider bg-midnight-800 px-3 py-1 rounded">9C2831973AAA</div>
                          </div>
                          <div className="text-accent-cyan font-bold text-xs pt-4 border-t border-midnight-700 w-full">
                            Market Ready: Medtronic Std.
                          </div>
                       </div>

                       {/* Right Side Narrative */}
                       <div className="w-full lg:w-2/3 border border-midnight-600 rounded-xl p-5 bg-[#121a2f] relative">
                          <div className="flex justify-between items-start mb-4">
                             <h4 className="text-lg font-bold text-[#ffb6c1] flex items-center">
                               📋 Standardized Clinical Narrative
                             </h4>
                             <span className="bg-[#4d7ea8] text-[#0f1f3d] font-bold text-[10px] px-3 py-1.5 rounded uppercase shadow-md">
                               EMR-Ready (Epic / OSCAR)
                             </span>
                          </div>

                          <div className="border border-dashed border-[#4d7ea8] p-4 bg-[#0a0f1c] rounded-lg text-[#00f59b] font-mono text-sm leading-relaxed mb-4 whitespace-pre-line shadow-inner">
                             {`Patient exhibits 0.00% jitter variance and 0.00% shimmer amplitude deviation. 
                             
                             Fundamental frequency standard deviation is 80.6 Hz. High pitch variance suggests physiological respiratory strain or chronic anxiety indicators. Harmonics-to-Noise Ratio (HNR) measured at 20.7 dB.
                             
                             Overall vocal biomarker stability computed at 86.5/100.`}
                          </div>

                          <p className="text-slate-300 text-sm leading-relaxed mb-4">
                            <span className="font-bold text-white">[Women's Health Metrics - General Profile]</span> HNR (20.7 dB) indicates excellent glottal closure with no signs of thyroid-related breathiness. Patient shows highly stable vocal resonance with no signs of hormonal-related vocal strain or atrophy.
                          </p>

                          <div className="bg-[#0b1021] border border-midnight-700 p-4 rounded-lg shadow-inner mt-4">
                             <div className="flex items-center text-xs font-extrabold text-[#4d7ea8] uppercase mb-2">
                               <Database className="w-3.5 h-3.5 mr-2" /> EMR Sync Audit Log
                             </div>
                             <div className="space-y-1">
                               <p className="text-[11px] text-slate-400 font-mono"><span className="text-accent-cyan font-bold">EPIC HYPERSPACE:</span> Structured HL7 FHIR payload mapping complete. Awaiting MD signature.</p>
                               <p className="text-[11px] text-slate-400 font-mono"><span className="text-accent-teal font-bold">OSCAR EMR:</span> Real-time chart sync verified for Patient #{selectedPatient.id}.</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

              </div>

              {/* Right Column */}
              <div className="space-y-6">

                 {/* High-Precision Modality Mapping */}
                 <div className="bg-gradient-to-b from-[#0b1021] to-[#16203a] rounded-2xl border border-midnight-600 p-6 shadow-xl h-full">
                    <h3 className="text-2xl font-bold text-white flex items-center mb-8 pb-4 border-b border-midnight-700">
                      🧬 High-Precision Modality Mapping
                    </h3>

                    <div className="space-y-8">
                       
                        {/* Neurological */}
                       <div className="space-y-3">
                          <h4 className="text-lg font-bold text-white">Neurological</h4>
                          
                          <div className="bg-[#1e2a40] border border-midnight-600 rounded-lg overflow-hidden shadow-sm">
                             <button onClick={() => setExpandedModality(expandedModality === 'parkinsons' ? null : 'parkinsons')} className="w-full p-3 flex justify-between items-center text-left hover:bg-[#25344f] transition-colors">
                               <span className="text-slate-200 text-sm font-medium flex items-center">
                                 <ChevronRight className={`w-4 h-4 mr-2 text-slate-400 transition-transform ${expandedModality === 'parkinsons' ? 'rotate-90' : ''}`} /> Parkinson's Disease - Low Risk
                               </span>
                             </button>
                             {expandedModality === 'parkinsons' && (
                               <div className="p-4 bg-[#16203a] border-t border-midnight-600">
                                 <div className="flex items-center text-accent-cyan font-bold text-sm mb-1">Model is 98.2% confident</div>
                                 <p className="text-xs text-slate-300 leading-relaxed font-mono">Micro-tremor amplitude within normal limits (0.02Hz). No phonatory instability detected.</p>
                               </div>
                             )}
                          </div>
                          
                          <div className="bg-[#1e2a40] border border-midnight-600 rounded-lg overflow-hidden shadow-sm">
                             <button onClick={() => setExpandedModality(expandedModality === 'alzheimers' ? null : 'alzheimers')} className="w-full p-3 flex justify-between items-center text-left hover:bg-[#25344f] transition-colors">
                               <span className="text-slate-200 text-sm font-medium flex items-center">
                                 <ChevronRight className={`w-4 h-4 mr-2 text-slate-400 transition-transform ${expandedModality === 'alzheimers' ? 'rotate-90' : ''}`} /> Alzheimer's / Cognitive Decline - Low Risk
                               </span>
                             </button>
                             {expandedModality === 'alzheimers' && (
                               <div className="p-4 bg-[#16203a] border-t border-midnight-600">
                                 <div className="flex items-center text-accent-cyan font-bold text-sm mb-1">Model is 94.6% confident</div>
                                 <p className="text-xs text-slate-300 leading-relaxed font-mono">Semantic pacing and lexical retrieval delays are not present. Speech flow is fluid.</p>
                               </div>
                             )}
                          </div>
                       </div>

                       {/* Mental Health */}
                       <div className="space-y-3">
                          <h4 className="text-lg font-bold text-white">Mental Health</h4>
                          
                          <div className="bg-[#788a99] border border-slate-500 rounded-lg overflow-hidden shadow-md">
                             <button onClick={() => setExpandedModality(expandedModality === 'depression' ? null : 'depression')} className="w-full p-3 flex justify-between items-center text-left hover:bg-[#6c7c8a] transition-colors">
                               <span className="text-[#0f1f3d] text-sm font-bold flex items-center">
                                 <ChevronRight className={`w-4 h-4 mr-2 text-[#0f1f3d] transition-transform ${expandedModality === 'depression' ? 'rotate-90' : ''}`} /> Clinical Depression - Low Risk
                               </span>
                             </button>
                             {expandedModality === 'depression' && (
                               <div className="p-4 bg-white/20 border-t border-slate-500/50">
                                 <div className="flex items-center text-[#0f1f3d] font-black text-sm mb-1">Model is 91.5% confident</div>
                                 <p className="text-xs text-[#0f1f3d] leading-relaxed font-mono font-medium">Prosody and pitch variation are dynamic. No flat affect detected in vocal tone.</p>
                               </div>
                             )}
                          </div>

                          <div className="bg-[#1e2a40] border border-midnight-600 rounded-lg overflow-hidden shadow-sm">
                             <button onClick={() => setExpandedModality(expandedModality === 'anxiety' ? null : 'anxiety')} className="w-full p-3 flex justify-between items-center text-left hover:bg-[#25344f] transition-colors">
                               <span className="text-slate-200 text-sm font-medium flex items-center">
                                 <ChevronRight className={`w-4 h-4 mr-2 text-slate-400 transition-transform ${expandedModality === 'anxiety' ? 'rotate-90' : ''}`} /> Chronic Anxiety - Medium Risk
                               </span>
                             </button>
                             {expandedModality === 'anxiety' && (
                               <div className="p-4 bg-[#16203a] border-t border-midnight-600">
                                 <div className="flex items-center text-accent-amber font-bold text-sm mb-1">Model is 88.0% confident</div>
                                 <p className="text-xs text-slate-300 leading-relaxed font-mono">Elevated pitch variance and rapid speech rate (180 WPM) noted. Moderate correlation with anxiety markers.</p>
                               </div>
                             )}
                          </div>
                       </div>

                       {/* Respiratory */}
                       <div className="space-y-3">
                          <h4 className="text-lg font-bold text-white">Respiratory</h4>
                          
                          <div className="bg-[#1e2a40] border border-midnight-600 rounded-lg overflow-hidden shadow-sm">
                             <button onClick={() => setExpandedModality(expandedModality === 'copd' ? null : 'copd')} className="w-full p-3 flex justify-between items-center text-left hover:bg-[#25344f] transition-colors">
                               <span className="text-slate-200 text-sm font-medium flex items-center">
                                 <ChevronRight className={`w-4 h-4 mr-2 text-slate-400 transition-transform ${expandedModality === 'copd' ? 'rotate-90' : ''}`} /> COPD / Vocal Pathologies - Low Risk
                               </span>
                             </button>
                             {expandedModality === 'copd' && (
                               <div className="p-4 bg-[#16203a] border-t border-midnight-600">
                                 <div className="flex items-center text-accent-cyan font-bold text-sm mb-1">Model is 99.1% confident</div>
                                 <p className="text-xs text-slate-300 leading-relaxed font-mono">Breathiness and HNR metrics suggest clear glottal closure. Normal respiratory cycle.</p>
                               </div>
                             )}
                          </div>
                       </div>

                       {/* Oncology */}
                       <div className="space-y-3">
                          <h4 className="text-lg font-bold text-white">Oncology</h4>
                          
                          <div className="bg-[#1e2a40] border border-midnight-600 rounded-lg overflow-hidden shadow-sm">
                             <button onClick={() => setExpandedModality(expandedModality === 'laryngeal' ? null : 'laryngeal')} className="w-full p-3 flex justify-between items-center text-left hover:bg-[#25344f] transition-colors">
                               <span className="text-slate-200 text-sm font-medium flex items-center">
                                 <ChevronRight className={`w-4 h-4 mr-2 text-slate-400 transition-transform ${expandedModality === 'laryngeal' ? 'rotate-90' : ''}`} /> Laryngeal / Vocal Mass - Low Risk
                               </span>
                             </button>
                             {expandedModality === 'laryngeal' && (
                               <div className="p-4 bg-[#16203a] border-t border-midnight-600">
                                 <div className="flex items-center text-accent-cyan font-bold text-sm mb-1">Model is 97.4% confident</div>
                                 <p className="text-xs text-slate-300 leading-relaxed font-mono">Symmetry in vocal cord vibration. No hoarseness or roughness detected.</p>
                               </div>
                             )}
                          </div>
                       </div>

                       {/* Substance & Alcohol Use */}
                       <div className="space-y-3">
                          <h4 className="text-lg font-bold text-white">Substance & Alcohol Use</h4>
                          
                          <div className={`border rounded-lg overflow-hidden shadow-sm transition-colors ${['David Reynolds', 'Ryan Walker'].includes(selectedPatient?.name) ? 'bg-[#3b1219] border-accent-red shadow-[0_0_15px_rgba(255,51,102,0.2)]' : 'bg-[#1e2a40] border-midnight-600'}`}>
                             <button onClick={() => setExpandedModality(expandedModality === 'substance' ? null : 'substance')} className={`w-full p-3 flex justify-between items-center text-left transition-colors ${['David Reynolds', 'Ryan Walker'].includes(selectedPatient?.name) ? 'hover:bg-[#4d1620]' : 'hover:bg-[#25344f]'}`}>
                               <span className={`text-sm font-medium flex items-center ${['David Reynolds', 'Ryan Walker'].includes(selectedPatient?.name) ? 'text-accent-red font-bold animate-pulse' : 'text-slate-200'}`}>
                                 <ChevronRight className={`w-4 h-4 mr-2 transition-transform ${['David Reynolds', 'Ryan Walker'].includes(selectedPatient?.name) ? 'text-accent-red' : 'text-slate-400'} ${expandedModality === 'substance' ? 'rotate-90' : ''}`} /> 
                                 {selectedPatient?.name === 'David Reynolds' ? 'Stimulant Use (Cocaine/Meth) - High Risk' : 
                                  selectedPatient?.name === 'Ryan Walker' ? 'Alcohol Intoxication (BAC > 0.08%) - High Risk' : 
                                  'Intoxication / Substance Abuse - Low Risk'}
                               </span>
                             </button>
                             {expandedModality === 'substance' && (
                               <div className={`p-4 border-t ${['David Reynolds', 'Ryan Walker'].includes(selectedPatient?.name) ? 'bg-[#290d12] border-accent-red/50' : 'bg-[#16203a] border-midnight-600'}`}>
                                 <div className={`flex items-center font-bold text-sm mb-1 ${['David Reynolds', 'Ryan Walker'].includes(selectedPatient?.name) ? 'text-accent-red' : 'text-accent-cyan'}`}>
                                    Model is {['David Reynolds', 'Ryan Walker'].includes(selectedPatient?.name) ? '98.5%' : '95.1%'} confident
                                 </div>
                                 <p className={`text-xs leading-relaxed font-mono ${['David Reynolds', 'Ryan Walker'].includes(selectedPatient?.name) ? 'text-[#ffb3c1]' : 'text-slate-300'}`}>
                                    {selectedPatient?.name === 'David Reynolds' 
                                      ? "Critical hyper-arousal markers detected: erratic prosody (F0 variance 55.2 Hz) and severe micro-tremors from muscle tension (Jitter 2.8%). Highly indicative of acute stimulant intoxication."
                                      : selectedPatient?.name === 'Ryan Walker'
                                      ? "Gross motor instability and amplitude dysregulation (Shimmer 6.8%, Jitter 2.1%) suggest acute ataxia and slurring characteristic of significant alcohol intoxication."
                                      : "Macro-motor control and acoustic stability show no biomarkers associated with acute intoxication, stimulants (Cocaine/Meth), or depressants (Opioids/Alcohol)."}
                                 </p>
                               </div>
                             )}
                          </div>
                       </div>

                       {/* Endocrine & Metabolic */}
                       <div className="space-y-3">
                          <h4 className="text-lg font-bold text-white">Endocrine & Metabolic</h4>
                          
                          <div className="bg-[#1e2a40] border border-midnight-600 rounded-lg overflow-hidden shadow-sm shadow-[0_0_15px_rgba(32,178,170,0.15)]">
                             <button onClick={() => setExpandedModality(expandedModality === 'thyroid' ? null : 'thyroid')} className="w-full p-3 flex justify-between items-center text-left hover:bg-[#25344f] transition-colors">
                               <span className="text-slate-200 text-sm font-medium flex items-center">
                                 <ChevronRight className={`w-4 h-4 mr-2 text-slate-400 transition-transform ${expandedModality === 'thyroid' ? 'rotate-90' : ''}`} /> Hypothyroidism / Goiter - Medium Risk
                               </span>
                             </button>
                             {expandedModality === 'thyroid' && (
                               <div className="p-4 bg-[#16203a] border-t border-midnight-600">
                                 <div className="flex items-center text-accent-amber font-bold text-sm mb-1">Model is 84.1% confident</div>
                                 <p className="text-xs text-slate-300 leading-relaxed font-mono">Slight dampening in fundamental frequency and mild gravelly tone observed; indicative of potential vocal fold swelling often associated with thyroid dysfunctions.</p>
                               </div>
                             )}
                          </div>

                          <div className={`border rounded-lg overflow-hidden shadow-sm transition-colors ${selectedPatient?.name === 'Sarah Jenkins' ? 'bg-[#3b1219] border-accent-red shadow-[0_0_15px_rgba(255,51,102,0.2)]' : 'bg-[#1e2a40] border-midnight-600'}`}>
                             <button onClick={() => setExpandedModality(expandedModality === 'diabetes' ? null : 'diabetes')} className={`w-full p-3 flex justify-between items-center text-left transition-colors ${selectedPatient?.name === 'Sarah Jenkins' ? 'hover:bg-[#4d1620]' : 'hover:bg-[#25344f]'}`}>
                               <span className={`text-sm font-medium flex items-center ${selectedPatient?.name === 'Sarah Jenkins' ? 'text-accent-red font-bold animate-pulse' : 'text-slate-200'}`}>
                                 <ChevronRight className={`w-4 h-4 mr-2 transition-transform ${selectedPatient?.name === 'Sarah Jenkins' ? 'text-accent-red' : 'text-slate-400'} ${expandedModality === 'diabetes' ? 'rotate-90' : ''}`} /> 
                                 {selectedPatient?.name === 'Sarah Jenkins' ? 'Type 2 Diabetes (Neuropathy) - High Risk' : 'Type 2 Diabetes (Neuropathy) - Low Risk'}
                               </span>
                             </button>
                             {expandedModality === 'diabetes' && (
                               <div className={`p-4 border-t ${selectedPatient?.name === 'Sarah Jenkins' ? 'bg-[#290d12] border-accent-red/50' : 'bg-[#16203a] border-midnight-600'}`}>
                                 <div className={`flex items-center font-bold text-sm mb-1 ${selectedPatient?.name === 'Sarah Jenkins' ? 'text-accent-red' : 'text-accent-cyan'}`}>
                                    Model is {selectedPatient?.name === 'Sarah Jenkins' ? '92.3%' : '90.1%'} confident
                                 </div>
                                 <p className={`text-xs leading-relaxed font-mono ${selectedPatient?.name === 'Sarah Jenkins' ? 'text-[#ffb3c1]' : 'text-slate-300'}`}>
                                    {selectedPatient?.name === 'Sarah Jenkins' 
                                      ? "Shifted vocal tract resonance (F1: 385 Hz, F2: 1100 Hz) indicates muscular weakness and structural neuropathy highly consistent with Type 2 Diabetes metabolic changes."
                                      : "Metabolic vocal biomarkers are stable with nominal muscle tonality. Formants F1/F2 are within healthy normative boundaries."}
                                 </p>
                               </div>
                             )}
                          </div>
                       </div>

                       {/* Cardiovascular */}
                       <div className="space-y-3">
                          <h4 className="text-lg font-bold text-white">Cardiovascular</h4>
                          
                          <div className="bg-[#1e2a40] border border-midnight-600 rounded-lg overflow-hidden shadow-sm">
                             <button onClick={() => setExpandedModality(expandedModality === 'cardio' ? null : 'cardio')} className="w-full p-3 flex justify-between items-center text-left hover:bg-[#25344f] transition-colors">
                               <span className="text-slate-200 text-sm font-medium flex items-center">
                                 <ChevronRight className={`w-4 h-4 mr-2 text-slate-400 transition-transform ${expandedModality === 'cardio' ? 'rotate-90' : ''}`} /> Congestive Heart Failure - Low Risk
                               </span>
                             </button>
                             {expandedModality === 'cardio' && (
                               <div className="p-4 bg-[#16203a] border-t border-midnight-600">
                                 <div className="flex items-center text-accent-cyan font-bold text-sm mb-1">Model is 95.8% confident</div>
                                 <p className="text-xs text-slate-300 leading-relaxed font-mono">Smooth respiratory cycle without conversational fluid-related dampening or wet sounding micro-pauses. No dyspnea detected during continuous speech.</p>
                               </div>
                             )}
                          </div>
                       </div>

                       {/* Gastrointestinal */}
                       <div className="space-y-3">
                          <h4 className="text-lg font-bold text-white">Gastrointestinal</h4>
                          
                          <div className="bg-[#1e2a40] border border-midnight-600 rounded-lg overflow-hidden shadow-sm">
                             <button onClick={() => setExpandedModality(expandedModality === 'gerd' ? null : 'gerd')} className="w-full p-3 flex justify-between items-center text-left hover:bg-[#25344f] transition-colors">
                               <span className="text-slate-200 text-sm font-medium flex items-center">
                                 <ChevronRight className={`w-4 h-4 mr-2 text-slate-400 transition-transform ${expandedModality === 'gerd' ? 'rotate-90' : ''}`} /> Acid Reflux / GERD - Low Risk
                               </span>
                             </button>
                             {expandedModality === 'gerd' && (
                               <div className="p-4 bg-[#16203a] border-t border-midnight-600">
                                 <div className="flex items-center text-accent-cyan font-bold text-sm mb-1">Model is 99.2% confident</div>
                                 <p className="text-xs text-slate-300 leading-relaxed font-mono">No evidence of chronic vocal fold irritation, vocal fry drops, or throat clearing patterns associated with chronic acid erosion.</p>
                               </div>
                             )}
                          </div>
                       </div>

                    </div>
                 </div>

              </div>

           </div>
        </div>
      );
    }
    
    // Fallbacks
    if (activeTab === 'reports') {
      return (
        <div className="glass-card rounded-2xl p-8 flex-1 relative">
           <h2 className="text-2xl font-bold mb-6 flex items-center"><FileText className="mr-3 text-accent-cyan" /> Live PDF Reports</h2>
           <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 text-xs uppercase bg-midnight-900/50 border-b border-midnight-700">
                <th className="p-4 font-semibold tracking-wider">Report ID</th>
                <th className="p-4 font-semibold tracking-wider">Patient</th>
                <th className="p-4 font-semibold tracking-wider">Generated Date</th>
                <th className="p-4 font-semibold tracking-wider">Format</th>
                <th className="p-4 font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id} className="border-b border-midnight-700 hover:bg-midnight-800/50">
                  <td className="p-4 font-mono text-slate-400 text-sm">REP-{p.id}</td>
                  <td className="p-4 font-bold text-white">{p.name}</td>
                  <td className="p-4 text-slate-300">{p.time} Today</td>
                  <td className="p-4"><span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold border border-red-500/30">PDF</span></td>
                  <td className="p-4 flex justify-end space-x-3">
                     <button onClick={() => handleDownloadReport(p.name)} className="flex items-center text-xs font-medium bg-midnight-900 hover:bg-midnight-100 border border-midnight-600 px-3 py-1.5 rounded text-accent-cyan transition-colors group">
                        <Download className="w-3.5 h-3.5 mr-1.5 group-hover:animate-bounce" /> Download
                     </button>
                     <button onClick={() => handleEmailReport(p.name)} className="flex items-center text-xs font-medium bg-midnight-900 hover:bg-midnight-100 border border-midnight-600 px-3 py-1.5 rounded text-slate-300 transition-colors">
                        <Send className="w-3.5 h-3.5 mr-1.5" /> Email
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
           </table>
        </div>
      );
    }

    if (activeTab === 'triage') {
      const urgentPatients = patients.filter(p => p.priority === 'High');
      return (
        <div className="glass-card rounded-2xl p-8 flex-1 border border-accent-red/30 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-accent-red/5 blur-[80px] rounded-full pointer-events-none" />
           <h2 className="text-2xl font-bold mb-6 flex items-center text-white"><ShieldAlert className="mr-3 text-accent-red animate-pulse" /> Triage Flags (Urgent)</h2>
           
           {urgentPatients.length === 0 ? (
              <p className="text-slate-400">No urgent patients flagged at this time.</p>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {urgentPatients.map(p => (
                   <div key={p.id} className="bg-midnight-900 border border-accent-red/40 p-5 rounded-xl shadow-[0_0_15px_rgba(255,51,102,0.1)] relative">
                      <div className="absolute top-4 right-4 bg-accent-red text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase animate-pulse">Critical</div>
                      <h3 className="text-lg font-bold text-white">{p.name}</h3>
                      <p className="text-xs text-slate-400 font-mono mb-3">{p.id} • {p.time}</p>
                      
                      <div className="bg-[#0a1128] p-3 rounded border border-midnight-700 mb-4 h-24 overflow-y-auto no-scrollbar">
                         <span className="text-xs font-bold text-accent-amber block mb-1">Chief Complaint:</span>
                         <p className="text-sm text-slate-300">{p.summary}</p>
                      </div>
                      
                      <button onClick={() => viewPatientProfile(p)} className="w-full bg-accent-red/20 hover:bg-accent-red text-white font-bold py-2 rounded transition-colors text-sm">
                        Jump to Profile
                      </button>
                   </div>
                ))}
             </div>
           )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-midnight-900 border-r border-midnight-700 hidden lg:flex flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b border-midnight-700 bg-midnight-800">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-md bg-gradient-to-br from-accent-teal to-accent-cyan flex justify-center items-center shadow-[0_0_15px_rgba(8,247,206,0.3)]">
               <Stethoscope className="w-5 h-5 text-midnight-900" />
             </div>
             <span className="text-xl font-bold text-white glow-text">Nuros<span className="font-light text-slate-400">MD</span></span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 px-2">Clinical Triage</div>
          
          <SidebarLink id="dashboard" icon={Grid} label="Dashboard" />
          <SidebarLink id="intakes" icon={Mic} label="New Intakes" badge={patients.filter(p => p.status !== 'Sent to EMR').length} />
          <SidebarLink id="patients" icon={Users} label="Patients" />
          <SidebarLink id="reports" icon={FileText} label="Reports" />
          <SidebarLink id="triage" icon={ShieldAlert} label="Triage Flags" badge={patients.filter(p => p.priority === 'High').length} />

          <div className="mt-8 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 px-2 pt-6 border-t border-midnight-700">Platform</div>
          <Link href="/integrations" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-midnight-800 rounded-lg font-medium transition-colors">
            <Activity className="w-5 h-5 mr-3" /> Integrations
          </Link>
          <Link href="/admin" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-midnight-800 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5 mr-3" /> Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-midnight-700 bg-midnight-800/50">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-full bg-midnight-700 border border-midnight-600 flex items-center justify-center font-bold text-accent-cyan">
               DR
             </div>
             <div>
               <p className="text-sm font-semibold text-white">Dr. Sarah Jenkins</p>
               <p className="text-xs text-slate-400">Toronto General</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-br from-[#0c1322] to-[#0a101b]">
        
        {/* Top Header */}
        <header className="h-20 border-b border-midnight-700 bg-[#0f172a]/90 backdrop-blur-md flex items-center justify-between px-8 flex-shrink-0 z-10 shadow-sm">
          <h1 className="text-2xl font-bold flex items-center capitalize text-slate-100">
             {activeTab === 'dashboard' ? 'Overview' : activeTab === 'profile' ? 'Clinical Profile Display' : activeTab.replace('-', ' ')}
          </h1>
          
          <div className="flex items-center space-x-6">
             <div className="relative">
               <Search className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
               <input type="text" placeholder="Search Patient ID..." className="bg-midnight-800 border border-midnight-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-teal text-slate-200 w-64 transition-all" />
             </div>
             
             <div className="relative cursor-pointer">
               <Bell className="w-6 h-6 text-slate-400 hover:text-accent-teal transition-colors" />
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-red rounded-full border border-midnight-900 animate-pulse"></span>
             </div>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-8 relative no-scrollbar">
           {pdfAlert && (
              <div className="fixed top-8 right-8 bg-accent-teal text-midnight-900 font-bold px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(8,247,206,0.5)] animate-fade-in-up flex items-center z-[100]">
                <CheckCircle className="w-5 h-5 mr-2" /> {pdfAlert}
              </div>
           )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
