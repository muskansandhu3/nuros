"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { Mic, ArrowRight, ArrowLeft, Activity, CheckCircle, ShieldCheck, AlertCircle, Phone, CreditCard, Calendar, Navigation, Building, MessageSquare, Play, Stethoscope } from "lucide-react";

export default function PatientPortal() {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    healthCard: '',
    dob: '',
    city: '',
    phone: '',
    clinicCode: '',
    consent: false
  });

  // Medical History State
  const [medicalContext, setMedicalContext] = useState({
    menopause: '',
    pregnancy: '',
    menstrual: '',
    medications: ''
  });

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [waveformActive, setWaveformActive] = useState(false);

  // Processing steps (Step 5)
  const [processingStep, setProcessingStep] = useState(0);
  const savedRef = useRef(false);

  // Core Physical Microphone Tracking
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const base64AudioRef = useRef<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      setWaveformActive(true);
    } else if (timeLeft === 0 && isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      }
      setIsRecording(false);
      setWaveformActive(false);
      setStep(5); // Move to processing
    }

    return () => clearInterval(timer);
  }, [isRecording, timeLeft]);

  // Handle Step 5 Simulation
  useEffect(() => {
    let processStages: NodeJS.Timeout;
    if (step === 5) {
      processStages = setInterval(() => {
        setProcessingStep(prev => {
          if (prev < 5) return prev + 1;
          clearInterval(processStages);
          setTimeout(() => {
             if (savedRef.current) return;
             savedRef.current = true;
             // Save to localStorage for demo
             const newPatient = {
               id: `${Math.floor(Math.random() * 90000) + 10000}-NR`,
               name: formData.fullName || 'New Patient',
               dob: formData.dob || 'Unknown',
               city: formData.city || 'Unknown',
               time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
               status: 'AI Summary Ready',
               priority: 'High', // make it high so it's noticeable
               triage: 'Review',
               symptoms: 'Reported symptoms via voice capture',
               history: 'Unknown',
               audioLen: `${20 - timeLeft}s`,
               transcription: 'Patient submitted voice sample... I have been experiencing shortness of breath and some mild chest discomfort.',
               summary: 'Patient reports recent onset of shortness of breath and mild chest discomfort. Recommend clinical review.',
               signals: { clarity: 'Clear', breathing: 'Labored', stress: 'Elevated' },
               voiceData: base64AudioRef.current || null
             };
             const existing = JSON.parse(localStorage.getItem('nuros_patients') || '[]');
             localStorage.setItem('nuros_patients', JSON.stringify([newPatient, ...existing]));
             
             setStep(6);
          }, 1000);
          return prev;
        });
      }, 1500);
    }
    return () => clearInterval(processStages);
  }, [step, formData, timeLeft]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (e) => {
         if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      recorder.onstop = () => {
         const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
         const reader = new FileReader();
         reader.readAsDataURL(blob);
         reader.onloadend = () => {
            base64AudioRef.current = reader.result as string;
         };
      };
      
      mediaRecorderRef.current = recorder;
      recorder.start();
      setTimeLeft(20);
      setIsRecording(true);
    } catch (err) {
      console.warn("Microphone access denied or unavailable. Running in mocked mode.", err);
      setTimeLeft(20);
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    setIsRecording(false);
    setWaveformActive(false);
    setStep(5);
  };

  const renderProgress = () => {
    return (
      <div className="w-full max-w-md mx-auto mb-10 mt-6 relative z-10">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500
                ${step === s ? 'bg-[#20b2aa] text-[#0f1f3d] shadow-[0_0_15px_rgba(32,178,170,0.5)] scale-110' : 
                  step > s ? 'bg-[#20b2aa]/50 text-white' : 'bg-midnight-700 text-slate-400'}`}>
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
            </div>
          ))}
        </div>
        <div className="h-1 w-full bg-midnight-700 rounded-full relative overflow-hidden flex -z-10 absolute top-[14px]">
          <div 
            className="h-full bg-[#20b2aa] transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(32,178,170,0.6)]" 
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 relative flex flex-col items-center justify-start overflow-y-auto">
      {/* Top Nav */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <Link href="/" className="flex items-center space-x-2">
          <Activity className="w-6 h-6 text-[#20b2aa]" />
          <span className="text-xl font-bold tracking-tight text-white glow-text">Nuros<span className="font-light text-slate-400">Intake</span></span>
        </Link>
        <span className="text-sm text-slate-400 font-medium bg-midnight-800 px-3 py-1 rounded-full border border-midnight-700">Patient Portal</span>
      </div>

      {renderProgress()}

      <div className="w-full max-w-xl relative shrink-0 text-white">
        
        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="bg-[#0c1a30] border border-[#162a4a] p-8 rounded-2xl shadow-xl animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-2">Patient Check-In</h2>
            <p className="text-slate-400 font-light mb-8 text-sm">Please verify your details for the clinical intake.</p>
            
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-300">Full Name <span className="text-[#20b2aa]">*</span></label>
                <div className="relative group">
                  <input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-[#112240] border border-[#162a4a] focus:border-[#20b2aa] rounded-lg py-3 px-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#20b2aa] transition-all" placeholder="John Doe" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-300">Health Card # <span className="text-[#20b2aa]">*</span></label>
                  <div className="relative group">
                    <input required pattern="[0-9]{10}" title="Must be exactly 10 digits." maxLength={10} minLength={10} value={formData.healthCard} onChange={e => {
                       const val = e.target.value.replace(/\D/g, '');
                       setFormData({...formData, healthCard: val});
                    }} className="w-full bg-[#112240] border border-[#162a4a] focus:border-[#20b2aa] rounded-lg py-3 px-4 pl-10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#20b2aa]" placeholder="1234567890" />
                    <CreditCard className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-300">Date of Birth <span className="text-[#20b2aa]">*</span></label>
                  <div className="relative group">
                    <input type="date" required value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full bg-[#112240] border border-[#162a4a] focus:border-[#20b2aa] rounded-lg py-3 px-4 pl-10 text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#20b2aa]" />
                    <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-300">City <span className="text-[#20b2aa]">*</span></label>
                  <div className="relative group">
                    <input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-[#112240] border border-[#162a4a] focus:border-[#20b2aa] rounded-lg py-3 px-4 pl-10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#20b2aa]" placeholder="e.g. Toronto" />
                    <Navigation className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-300">Phone Number <span className="text-[#20b2aa]">*</span></label>
                  <div className="relative group">
                    <input required type="tel" pattern="[0-9]{10}" title="Must be exactly 10 digits." maxLength={10} minLength={10} value={formData.phone} onChange={e => {
                       const val = e.target.value.replace(/\D/g, '');
                       setFormData({...formData, phone: val});
                    }} className="w-full bg-[#112240] border border-[#162a4a] focus:border-[#20b2aa] rounded-lg py-3 px-4 pl-10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#20b2aa]" placeholder="5551234567" />
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-300">Clinic / Doctor Code <span className="text-[#20b2aa]">*</span></label>
                <div className="relative group">
                  <input required className="w-full bg-[#112240] border border-[#162a4a] focus:border-[#20b2aa] rounded-lg py-3 px-4 pl-10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#20b2aa]" placeholder="e.g. CLINIC-123" />
                  <Building className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div className="pt-4 border-t border-[#162a4a] mt-4">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input type="checkbox" required className="mt-1 w-5 h-5 rounded border-none bg-midnight-900 text-[#20b2aa] focus:ring-[#20b2aa]" />
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-snug">
                    I consent to the secure use of my voice sample and submitted information for clinical review. Data is encrypted and PHIPA/HIPAA compliant. <span className="text-[#20b2aa]">*</span>
                  </span>
                </label>
              </div>

              <button type="submit" className="w-full bg-[#20b2aa] hover:bg-[#1b9a93] text-[#0f1f3d] font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all mt-6 shadow-md shadow-[#20b2aa]/20">
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Medical Context */}
        {step === 2 && (
          <div className="bg-[#0c1a30] border border-[#162a4a] p-8 rounded-2xl shadow-xl animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
               <Stethoscope className="w-6 h-6 mr-3 text-[#20b2aa]" /> Medical Context
            </h2>
            <p className="text-slate-400 font-light mb-8 text-sm">Please answer a few questions about your current health status to help us personalize your assessment.</p>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
              
              <div className="space-y-3">
                 <label className="text-sm font-semibold text-slate-300 block">Are you currently experiencing menopause? <span className="text-[#20b2aa]">*</span></label>
                 <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 bg-[#112240] px-4 py-3 rounded-lg border border-[#162a4a] hover:border-[#20b2aa] cursor-pointer flex-1 transition-colors">
                       <input type="radio" name="menopause" required className="text-[#20b2aa] focus:ring-[#20b2aa] bg-[#0c1a30] border-[#162a4a]" />
                       <span className="text-sm font-medium">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2 bg-[#112240] px-4 py-3 rounded-lg border border-[#162a4a] hover:border-[#20b2aa] cursor-pointer flex-1 transition-colors">
                       <input type="radio" name="menopause" required className="text-[#20b2aa] focus:ring-[#20b2aa] bg-[#0c1a30] border-[#162a4a]" />
                       <span className="text-sm font-medium">No / Not Applicable</span>
                    </label>
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-sm font-semibold text-slate-300 block">Are you currently pregnant? <span className="text-[#20b2aa]">*</span></label>
                 <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 bg-[#112240] px-4 py-3 rounded-lg border border-[#162a4a] hover:border-[#20b2aa] cursor-pointer flex-1 transition-colors">
                       <input type="radio" name="pregnancy" required className="text-[#20b2aa] focus:ring-[#20b2aa] bg-[#0c1a30] border-[#162a4a]" />
                       <span className="text-sm font-medium">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2 bg-[#112240] px-4 py-3 rounded-lg border border-[#162a4a] hover:border-[#20b2aa] cursor-pointer flex-1 transition-colors">
                       <input type="radio" name="pregnancy" required className="text-[#20b2aa] focus:ring-[#20b2aa] bg-[#0c1a30] border-[#162a4a]" />
                       <span className="text-sm font-medium">No / Not Applicable</span>
                    </label>
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-sm font-semibold text-slate-300 block">Are you currently experiencing your menstrual cycle? <span className="text-[#20b2aa]">*</span></label>
                 <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 bg-[#112240] px-4 py-3 rounded-lg border border-[#162a4a] hover:border-[#20b2aa] cursor-pointer flex-1 transition-colors">
                       <input type="radio" name="menstrual" required className="text-[#20b2aa] focus:ring-[#20b2aa] bg-[#0c1a30] border-[#162a4a]" />
                       <span className="text-sm font-medium">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2 bg-[#112240] px-4 py-3 rounded-lg border border-[#162a4a] hover:border-[#20b2aa] cursor-pointer flex-1 transition-colors">
                       <input type="radio" name="menstrual" required className="text-[#20b2aa] focus:ring-[#20b2aa] bg-[#0c1a30] border-[#162a4a]" />
                       <span className="text-sm font-medium">No / Not Applicable</span>
                    </label>
                 </div>
              </div>

              <div className="space-y-3 pt-2">
                 <label className="text-sm font-semibold text-slate-300 block">Are you currently taking any medications? <span className="text-slate-500 font-light ml-1">(Optional)</span></label>
                 <textarea 
                   placeholder="List medications here or leave blank..." 
                   rows={3} 
                   className="w-full bg-[#112240] border border-[#162a4a] focus:border-[#20b2aa] rounded-lg py-3 px-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#20b2aa] transition-all resize-none"
                 />
              </div>

              <div className="flex space-x-4 pt-4 border-t border-[#162a4a] mt-6">
                <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-[#112240] hover:bg-[#162a4a] border border-[#1b3459] text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all">
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button type="submit" className="w-2/3 bg-[#20b2aa] hover:bg-[#1b9a93] text-[#0f1f3d] font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#20b2aa]/20">
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Guided Questions Prep */}
        {step === 3 && (
          <div className="bg-[#0c1a30] border border-[#162a4a] p-10 rounded-2xl shadow-xl animate-fade-in-up text-center">
             <div className="w-20 h-20 mx-auto bg-[#112240] rounded-full flex items-center justify-center mb-6 border border-[#1b3459]">
               <MessageSquare className="w-10 h-10 text-accent-cyan" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-4">Vocal Vital Sign</h2>
             <p className="text-slate-400 text-lg mb-8 leading-relaxed font-light">
               Next, we will capture your symptoms using your voice. Please be prepared to answer:
             </p>
             <ul className="text-left text-slate-300 space-y-4 max-w-sm mx-auto mb-10 text-lg font-medium bg-[#112240] p-6 rounded-xl border border-[#162a4a]">
               <li className="flex items-start">
                 <span className="text-[#20b2aa] mr-3 font-bold">1.</span> "How are you feeling today?"
               </li>
               <li className="flex items-start">
                 <span className="text-[#00d4ff] mr-3 font-bold">2.</span> "Did you see these symptoms before?"
               </li>
             </ul>

             <div className="flex flex-col sm:flex-row gap-4 mt-6">
               <button 
                 onClick={() => setStep(2)}
                 className="w-full sm:w-1/3 bg-[#112240] hover:bg-[#162a4a] border border-[#1b3459] text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center space-x-2 transition-all"
               >
                 <ArrowLeft className="w-5 h-5" />
                 <span>Back</span>
               </button>
               <button 
                 onClick={() => setStep(4)}
                 className="w-full sm:w-2/3 bg-gradient-to-r from-[#20b2aa] to-[#00d4ff] hover:brightness-110 text-[#0f1f3d] font-bold text-lg py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg"
               >
                 <Mic className="w-6 h-6" />
                 <span>I'm Ready</span>
               </button>
             </div>
          </div>
        )}

        {/* Step 4: 20-SECOND VOICE SAMPLE */}
        {step === 4 && (
          <div className="bg-[#0c1a30] border border-[#162a4a] p-10 rounded-2xl shadow-xl animate-fade-in-up text-center relative overflow-hidden">
             
             {isRecording && (
                <div className="absolute top-0 left-0 w-full h-1 bg-[#112240]">
                   <div 
                      className="h-full bg-accent-red transition-all ease-linear"
                      style={{ width: `${((20 - timeLeft)/20) * 100}%`, transitionDuration: '1s' }}
                   />
                </div>
             )}

             <h2 className="text-3xl font-bold text-white mb-2">
               {isRecording ? "Recording..." : "Record Voice Sample"}
             </h2>
             <p className="text-slate-400 text-sm mb-4 h-10">
               {isRecording ? 
                "Please describe how you are feeling in your own words." : 
                "A 20-second vocal baseline helps our AI generate your clinical summary."}
             </p>
             
             {!isRecording && (
                <div className="mb-8 flex justify-center">
                   <span className="bg-[#112240] border border-[#1b3459] text-accent-cyan text-[11px] font-bold px-4 py-2 rounded-full uppercase tracking-wider flex items-center shadow-lg">
                     🌐 Polyglot AI Enabled: Speak in any language
                   </span>
                </div>
             )}
             
             {/* Waveform Visualization */}
             <div className="h-32 flex items-center justify-center mb-8 relative">
               {!isRecording ? (
                 <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#1b3459] flex items-center justify-center">
                    <Mic className="w-10 h-10 text-slate-600" />
                 </div>
               ) : (
                 <div className="flex flex-col items-center">
                    <div className="text-5xl font-mono font-bold text-accent-red mb-6 drop-shadow-[0_0_10px_rgba(255,51,102,0.8)] animate-pulse">
                      0:{timeLeft.toString().padStart(2, '0')}
                    </div>
                    <div className="waveform scale-150">
                      <div className="waveform-bar bg-accent-red shadow-[0_0_8px_rgba(255,51,102,0.6)]"></div>
                      <div className="waveform-bar bg-accent-red shadow-[0_0_8px_rgba(255,51,102,0.6)]"></div>
                      <div className="waveform-bar bg-accent-red shadow-[0_0_8px_rgba(255,51,102,0.6)]"></div>
                      <div className="waveform-bar bg-accent-red shadow-[0_0_8px_rgba(255,51,102,0.6)]"></div>
                      <div className="waveform-bar bg-accent-red shadow-[0_0_8px_rgba(255,51,102,0.6)]"></div>
                      <div className="waveform-bar bg-accent-red shadow-[0_0_8px_rgba(255,51,102,0.6)]"></div>
                      <div className="waveform-bar bg-accent-red shadow-[0_0_8px_rgba(255,51,102,0.6)]"></div>
                    </div>
                 </div>
               )}
             </div>

             <div className="flex justify-center space-x-4">
               {!isRecording ? (
                 <div className="flex w-full space-x-4">
                   <button 
                     onClick={() => setStep(3)}
                     className="w-1/3 bg-[#112240] hover:bg-[#162a4a] border border-[#1b3459] text-white font-bold text-lg py-5 rounded-xl flex items-center justify-center transition-all"
                   >
                     <ArrowLeft className="w-6 h-6" />
                   </button>
                   <button 
                    onClick={handleStartRecording}
                    className="w-2/3 bg-accent-red hover:bg-[#ff1a53] text-white font-bold text-lg py-5 rounded-xl flex items-center justify-center space-x-3 transition-all shadow-[0_0_20px_rgba(255,51,102,0.5)] transform hover:scale-105"
                   >
                     <Mic className="w-6 h-6" />
                     <span>Start Recording</span>
                   </button>
                 </div>
               ) : (
                 <div className="w-full py-5 flex items-center justify-center space-x-3">
                   <div className="w-4 h-4 bg-accent-red rounded-full animate-pulse" />
                   <span className="text-accent-red font-bold text-lg animate-pulse tracking-wide">Recording in progress...</span>
                 </div>
               )}
             </div>
             
             {!isRecording && timeLeft < 20 && (
                <button onClick={() => setStep(5)} className="mt-6 text-[#20b2aa] hover:underline text-sm font-medium">
                  Proceed with current recording
                </button>
             )}
          </div>
        )}

        {/* Step 5: AI PROCESSING */}
        {step === 5 && (
          <div className="bg-[#0c1a30] border border-[#162a4a] rounded-2xl p-10 shadow-xl animate-fade-in-up text-center">
            
            <div className="relative w-24 h-24 mx-auto mb-8">
               <div className="absolute inset-0 rounded-full border-4 border-[#162a4a]" />
               <div className="absolute inset-0 rounded-full border-4 border-accent-cyan border-t-transparent animate-spin" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <Activity className="w-8 h-8 text-accent-cyan animate-pulse" />
               </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Analyzing Vocal Vitals</h2>
            <p className="text-slate-400 font-light mb-10 text-sm">Please do not close this window.</p>

            <div className="space-y-4 max-w-xs mx-auto text-left">
              {[
                { label: "Voice recorded securely", active: processingStep >= 0 },
                { label: "Speech transcription", active: processingStep >= 1 },
                { label: "Biomarker extraction", active: processingStep >= 2 },
                { label: "AI structuring summary", active: processingStep >= 3 },
                { label: "Doctor report formatted", active: processingStep >= 4 },
                { label: "Synced to Clinical Queue", active: processingStep >= 5 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                    ${item.active ? 'bg-[#20b2aa]/20 text-[#20b2aa] shadow-[0_0_10px_rgba(32,178,170,0.3)]' : 'bg-[#112240] text-[#1b3459]'}`}>
                    <CheckCircle className="w-3 h-3" />
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-500 ${item.active ? 'text-slate-200' : 'text-slate-600'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: PATIENT CONFIRMATION */}
        {step === 6 && (
          <div className="bg-[#0c1a30] border border-[#162a4a] rounded-2xl p-10 shadow-xl animate-fade-in-up text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#20b2aa]/10 to-transparent pointer-events-none" />
            
            <div className="w-24 h-24 mx-auto rounded-full bg-[#20b2aa]/20 border border-[#20b2aa]/40 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(32,178,170,0.3)]">
              <CheckCircle className="w-12 h-12 text-[#20b2aa]" />
            </div>

            <h2 className="text-4xl font-extrabold text-white mb-2">Thank You!</h2>
            <h3 className="text-2xl font-bold text-[#20b2aa] mb-4">Intake Complete</h3>
            <p className="text-slate-300 mb-8 max-w-sm mx-auto text-lg font-light leading-relaxed">
              Your voice intake summary has been securely delivered to your clinic for review.
            </p>

            <div className="bg-[#0f1f3d] border border-[#1b3459] rounded-xl p-5 mb-8 flex flex-col items-center">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Intake Reference ID</span>
              <span className="text-accent-cyan font-mono text-xl tracking-widest">{Math.floor(Math.random() * 900000) + 100000}-NR</span>
            </div>

            <div className="flex bg-[#112240] border border-amber-500/30 text-amber-500 rounded-xl p-4 text-left">
              <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                This tool supports clinical triage and does not replace emergency care. If you are experiencing severe or life-threatening symptoms, seek immediate emergency attention.
              </p>
            </div>
            
            <Link href="/" className="mt-8 relative inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-[#112240] hover:bg-[#162a4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#20b2aa] w-full transition-colors shadow-sm">
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
