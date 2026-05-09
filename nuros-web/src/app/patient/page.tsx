"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ArrowRight, ShieldCheck, CheckCircle, AlertTriangle, FileText, Activity, Brain, PlayCircle, Clock } from "lucide-react";
import dynamic from 'next/dynamic';
import { initDb, getClinicByCode, addPatientIntake, Clinic } from '@/lib/mockDb';
import PremiumReport from '@/components/PremiumReport';

type Gender = "Female" | "Male" | "Other" | "Prefer not to say" | "";
type YesNo = "Yes" | "No" | "Prefer not to say" | "";

function PatientWellnessSnapshotInner() {
  const searchParams = useSearchParams();
  const initialClinicCode = searchParams.get('clinicCode') || '';

  const [step, setStep] = useState(1);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  
  // Form State
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [formData, setFormData] = useState({
    name: "", clinicCode: initialClinicCode, age: "", city: "", gender: "" as Gender,
    smoker: "" as YesNo, asthma: "" as YesNo, neuro: "" as YesNo,
    femaleCondition: ""
  });
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Processing State
  const [processingChips, setProcessingChips] = useState<string[]>([]);
  const chipsList = ["speech rhythm", "breath pattern", "vocal energy", "pause frequency", "voice strain", "stress tone", "speech clarity"];

  // Report State
  const [hasPreviousSnapshot, setHasPreviousSnapshot] = useState(false);

  useEffect(() => {
    initDb();
  }, []);

  // Handlers
  const handleNext = () => setStep(prev => prev + 1);

  const isFormValid = () => {
    if (!formData.name || !formData.age) return false;
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 13 || age > 120) return false;
    if (!formData.smoker || !formData.asthma || !formData.neuro) return false;
    return true;
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setTimeLeft(20);
    } catch (err) {
      console.warn("Microphone access denied. Simulating recording.", err);
      setIsRecording(true);
      setTimeLeft(20);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isRecording) {
      handleStopRecording();
    }
    return () => clearInterval(timer);
  }, [isRecording, timeLeft]);

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    setIsRecording(false);
    setStep(4); // Move to Processing
  };

  // Processing Animation Logic & DB Save
  useEffect(() => {
    if (step === 4) {
      const interval = setInterval(() => {
        setProcessingChips(prev => {
          if (prev.length < chipsList.length) {
            return [...prev, chipsList[prev.length]];
          }
          clearInterval(interval);
          setTimeout(async () => {
            let userKey = `${formData.name}-${formData.age}`.toLowerCase();
            
            // Find clinic and dispatch if provided
            if (formData.clinicCode) {
              const c = getClinicByCode(formData.clinicCode);
              setClinic(c);
              if (c) {
                addPatientIntake(c.id, {
                  display_name: formData.name,
                  age: parseInt(formData.age),
                  gender: formData.gender as any,
                  reason_for_visit: "Voice Wellness Scan",
                  consent_given: disclaimerAccepted
                }, null);
                console.log(`[SECURE DISPATCH] Results sent to clinic: ${c.clinic_name}`);
                
                // Also trigger actual email to clinic admin
                try {
                  await fetch('/api/send-snapshot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      formData: { ...formData, email: c.admin_email },
                      results: tableRows
                    })
                  });
                } catch (e) {
                  console.error("Failed to email clinic:", e);
                }
              }
              userKey = `${formData.clinicCode}-${userKey}`;
            }

            // Check memory
            const stored = localStorage.getItem(`nuros_snapshot_${userKey}`);
            if (stored) {
               setHasPreviousSnapshot(true);
            }
            // Save current
            localStorage.setItem(`nuros_snapshot_${userKey}`, new Date().toISOString());
            setStep(5);
          }, 1000);
          return prev;
        });
      }, 600);
      return () => clearInterval(interval);
    }
  }, [step, formData, disclaimerAccepted]);

  const tableRows = [
    { category: "Voice Energy", status: "Balanced", interpretation: "Indicates overall vocal energy level", color: "text-accent-teal", bg: "bg-accent-teal" },
    { category: "Stress & Tension", status: "Moderate", interpretation: "Based on tone variation and vocal tightness", color: "text-accent-amber", bg: "bg-accent-amber" },
    { category: "Breath Stability", status: "Stable", interpretation: "Reflects breathing consistency in speech", color: "text-accent-cyan", bg: "bg-accent-cyan" },
    { category: "Speech Rhythm", status: "Smooth", interpretation: "Measures flow and pause patterns", color: "text-accent-teal", bg: "bg-accent-teal" },
    { category: "Vocal Strain", status: "Low", interpretation: "Indicates vocal effort or tension", color: "text-[#4c8f18]", bg: "bg-[#4c8f18]" }
  ];

  const tableVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] to-[#081329] text-slate-100 font-sans pt-24 pb-20 flex flex-col items-center">
      
      <div className="w-full max-w-4xl px-4 sm:px-6 relative z-10">
        
        {/* Progress Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Patient Wellness Snapshot</h1>
          <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-slate-400">
             {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`flex items-center ${step === i ? 'text-accent-teal' : (step > i ? 'text-accent-cyan' : '')}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${step >= i ? 'border-current bg-current/10' : 'border-slate-700'}`}>
                    {step > i ? <CheckCircle className="w-4 h-4" /> : i}
                  </div>
                  {i < 5 && <div className={`w-8 h-px mx-2 ${step > i ? 'bg-accent-cyan' : 'bg-slate-700'}`} />}
                </div>
             ))}
          </div>
        </div>

        <div className="bg-[#0b1021] border border-midnight-700 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Consent */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                <div className="flex items-center text-accent-amber mb-6">
                  <ShieldCheck className="w-8 h-8 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Consent & Disclaimer</h2>
                </div>
                <div className="bg-accent-amber/10 border border-accent-amber/30 rounded-xl p-6 mb-8 text-slate-300 leading-relaxed text-sm">
                  <p className="mb-4">
                    <strong>Nuros is not a diagnostic tool.</strong> This wellness snapshot does not detect, diagnose, treat, or predict disease.
                  </p>
                  <p>
                    It provides general voice-based wellness signals that you may choose to discuss with your provider. By proceeding, you agree to submit a 20-second voice sample which will be securely transmitted to your clinic's dashboard.
                  </p>
                </div>
                
                <label className="flex items-center gap-[10px] cursor-pointer group mb-8">
                  <input type="checkbox" className="w-5 h-5 accent-accent-teal rounded border-slate-600 cursor-pointer flex-shrink-0" checked={disclaimerAccepted} onChange={(e) => setDisclaimerAccepted(e.target.checked)} />
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors leading-snug">I understand this is not medical advice and consent to processing.</span>
                </label>

                <div className="mt-auto flex justify-end">
                  <button onClick={handleNext} disabled={!disclaimerAccepted} className="px-8 py-3 bg-accent-teal disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#06e3bd] text-midnight-900 font-bold rounded-xl transition-all flex items-center">
                    Continue <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Basic Info */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name *</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#112240] border border-midnight-600 rounded-lg p-3 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal outline-none" placeholder="Jane Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Clinic Code (Optional)</label>
                      <input type="text" value={formData.clinicCode} onChange={e => setFormData({...formData, clinicCode: e.target.value})} className="w-full bg-[#112240] border border-midnight-600 rounded-lg p-3 text-accent-cyan font-mono font-bold focus:border-accent-teal focus:ring-1 focus:ring-accent-teal outline-none" placeholder="e.g. 123" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Age *</label>
                      <input type="number" min="13" max="120" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-[#112240] border border-midnight-600 rounded-lg p-3 text-white focus:border-accent-teal outline-none" placeholder="Years" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Gender</label>
                      <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as Gender})} className="w-full bg-[#112240] border border-midnight-600 rounded-lg p-3 text-white focus:border-accent-teal outline-none">
                        <option value="">Optional</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">City</label>
                      <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-[#112240] border border-midnight-600 rounded-lg p-3 text-white focus:border-accent-teal outline-none" placeholder="Optional" />
                    </div>
                  </div>

                  {parseInt(formData.age) < 18 && (
                     <div className="bg-accent-amber/10 border border-accent-amber/30 text-accent-amber rounded-lg p-3 text-xs font-medium flex items-center">
                       <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" /> Parent or guardian supervision is required.
                     </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-midnight-700 pt-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Current Smoker *</label>
                      <select value={formData.smoker} onChange={e => setFormData({...formData, smoker: e.target.value as YesNo})} className="w-full bg-[#112240] border border-midnight-600 rounded-lg p-2 text-sm text-white focus:border-accent-teal outline-none"><option value="">Select...</option><option value="Yes">Yes</option><option value="No">No</option><option value="Prefer not to say">Prefer not to say</option></select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Asthma / Breathing *</label>
                      <select value={formData.asthma} onChange={e => setFormData({...formData, asthma: e.target.value as YesNo})} className="w-full bg-[#112240] border border-midnight-600 rounded-lg p-2 text-sm text-white focus:border-accent-teal outline-none"><option value="">Select...</option><option value="Yes">Yes</option><option value="No">No</option><option value="Prefer not to say">Prefer not to say</option></select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Neurological Cond. *</label>
                      <select value={formData.neuro} onChange={e => setFormData({...formData, neuro: e.target.value as YesNo})} className="w-full bg-[#112240] border border-midnight-600 rounded-lg p-2 text-sm text-white focus:border-accent-teal outline-none"><option value="">Select...</option><option value="Yes">Yes</option><option value="No">No</option><option value="Prefer not to say">Prefer not to say</option></select>
                    </div>
                  </div>

                </div>
                
                <div className="mt-auto pt-4 flex justify-between items-center border-t border-midnight-700">
                  <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white font-medium text-sm">Back</button>
                  <button onClick={handleNext} disabled={!isFormValid()} className="px-8 py-3 bg-accent-teal disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#06e3bd] text-midnight-900 font-bold rounded-xl transition-all flex items-center">
                    Continue <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Voice Recording */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Voice Recording</h2>
                <p className="text-slate-400 text-sm mb-12 max-w-md mx-auto">
                  Please speak naturally for 20 seconds about how you feel today, your energy level, sleep, stress, or any general concern.
                </p>

                <div className="h-48 flex items-center justify-center mb-8 relative w-full">
                  {!isRecording ? (
                    <button onClick={handleStartRecording} className="w-32 h-32 rounded-full bg-[#112240] border-4 border-midnight-600 flex items-center justify-center hover:bg-[#1b3459] hover:border-accent-teal transition-all group shadow-[0_0_30px_rgba(32,178,170,0.15)] relative">
                       <Mic className="w-12 h-12 text-accent-teal group-hover:scale-110 transition-transform z-10" />
                       <div className="absolute inset-0 rounded-full border border-accent-teal/50 animate-ping opacity-20"></div>
                    </button>
                  ) : (
                    <div className="flex flex-col items-center w-full">
                       <div className="text-5xl font-mono font-bold text-accent-cyan mb-8 drop-shadow-[0_0_15px_rgba(8,247,206,0.6)]">
                         0:{timeLeft.toString().padStart(2, '0')}
                       </div>
                       
                       <div className="flex items-center justify-center space-x-1.5 w-full h-24 overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-r from-[#0b1021] via-transparent to-[#0b1021] z-10 pointer-events-none" />
                         {[...Array(40)].map((_, i) => (
                            <motion.div 
                              key={i} 
                              className="w-1.5 rounded-full bg-gradient-to-t from-accent-cyan to-accent-teal" 
                              animate={{ height: [`${20 + Math.random() * 20}%`, `${60 + Math.random() * 40}%`, `${20 + Math.random() * 20}%`] }}
                              transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, ease: "easeInOut" }}
                            />
                         ))}
                       </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto w-full flex justify-between items-center border-t border-midnight-700 pt-6">
                  <button onClick={() => setStep(2)} className="text-slate-400 hover:text-white font-medium text-sm">Cancel</button>
                  {isRecording && (
                     <button onClick={handleStopRecording} className="px-6 py-2 bg-midnight-600 hover:bg-midnight-500 text-white font-bold rounded-lg transition-all text-sm">
                       Stop Early
                     </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Processing Animation */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center py-10">
                 <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-4 border-dashed border-accent-teal rounded-full opacity-30" />
                    <Brain className="w-12 h-12 text-accent-cyan animate-pulse" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Analyzing Voice Signal</h2>
                 <p className="text-slate-400 text-sm mb-8">Nuros Signal Engine is securely processing your acoustic features...</p>
                 
                 <div className="flex flex-wrap justify-center gap-2 max-w-md">
                   <AnimatePresence>
                     {processingChips.map(chip => (
                       <motion.span 
                         key={chip}
                         initial={{ opacity: 0, scale: 0.8, y: 10 }}
                         animate={{ opacity: 1, scale: 1, y: 0 }}
                         className="px-3 py-1.5 bg-[#112240] border border-accent-teal/30 text-accent-cyan text-xs rounded-full font-medium"
                       >
                         {chip}
                       </motion.span>
                     ))}
                   </AnimatePresence>
                 </div>
              </motion.div>
            )}

            {/* STEP 5: Premium Wellness Snapshot Report */}
            {step >= 5 && (
              <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col w-full">
                 <PremiumReport 
                   formData={formData} 
                   clinic={clinic} 
                   hasPreviousSnapshot={hasPreviousSnapshot} 
                   audioUrl={audioUrl} 
                 />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function PatientWellnessSnapshot() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b1021] flex items-center justify-center text-white">Loading...</div>}>
      <PatientWellnessSnapshotInner />
    </Suspense>
  );
}
