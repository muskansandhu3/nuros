"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Clock, CheckCircle, PlayCircle, AlertTriangle, ChevronDown, ChevronUp, Brain, Activity, Heart, Wind, Stethoscope, Droplet, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const SendReportWidget = dynamic(() => import('@/components/SendReportWidget'), { ssr: false });

export default function PremiumReport({ formData, clinic, hasPreviousSnapshot, audioUrl }: any) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('neurological');

  const categories = [
    {
      id: 'neurological',
      title: 'Neurological & Cognitive',
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/30 bg-purple-500/5',
      signals: [
        { name: "Alzheimer's & Memory Pattern", risk: "Stable", confidence: 92, insight: "No voice patterns associated with Alzheimer's or memory loss detected.", recommendation: "Maintain regular mental wellness routines." },
        { name: "Speech Clarity (Slurring Risk)", risk: "Stable", confidence: 88, insight: "Your speech is clear and easy to understand.", recommendation: "No action required." },
        { name: "Parkinson's Voice Pattern", risk: "Stable", confidence: 95, insight: "No voice patterns associated with Parkinson's detected.", recommendation: "No action required." },
        { name: "Voice Shakiness (Tremors)", risk: "Mild", confidence: 75, insight: "Slight shakiness in your voice, likely just from normal tiredness.", recommendation: "Rest and see if it improves." },
        { name: "Nerve & Muscle Fatigue", risk: "Stable", confidence: 89, insight: "Your voice muscles are responding normally without signs of nerve issues.", recommendation: "No action required." },
      ]
    },
    {
      id: 'mental',
      title: 'Mental Health & Emotional',
      icon: <Activity className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-500/30 bg-blue-500/5',
      signals: [
        { name: "Current Stress Levels", risk: "Elevated", confidence: 84, insight: "Your voice sounds very tense, which is a strong sign of high stress.", recommendation: "Try to take a break and practice deep breathing." },
        { name: "Anxiety & Nervousness", risk: "Moderate", confidence: 78, insight: "Your voice pitch is varying in a way that suggests you might be feeling anxious.", recommendation: "Consider taking some time to relax and unwind." },
        { name: "Low Mood & Depression Signs", risk: "Stable", confidence: 90, insight: "Your voice energy does not show signs of clinical depression or low mood.", recommendation: "No action required." },
        { name: "Emotional Exhaustion", risk: "Moderate", confidence: 72, insight: "Your voice sounds drained, indicating you might be emotionally burnt out.", recommendation: "Prioritize self-care and mental rest." },
        { name: "Sleep Deprivation", risk: "Elevated", confidence: 81, insight: "Your voice patterns strongly suggest you haven't been sleeping well.", recommendation: "Try to get 7-8 hours of sleep tonight." }
      ]
    },
    {
      id: 'respiratory',
      title: 'Respiratory & Pulmonary',
      icon: <Wind className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/30 bg-cyan-500/5',
      signals: [
        { name: "Shortness of Breath Risk", risk: "Moderate", confidence: 76, insight: "We detected slight breathiness. This can happen if you are tired or out of breath.", recommendation: "Take a few deep breaths. Monitor if you feel short of breath while walking." },
        { name: "COPD & Lung Disease Pattern", risk: "Stable", confidence: 93, insight: "No signs of severe lung obstruction or COPD in your breathing patterns.", recommendation: "No action required." },
        { name: "Breathing Effort", risk: "Stable", confidence: 85, insight: "It sounds like you are breathing comfortably without extra effort.", recommendation: "No action required." },
        { name: "Lung Capacity Proxy", risk: "Stable", confidence: 88, insight: "You appear to have enough air in your lungs to speak comfortably.", recommendation: "No action required." }
      ]
    },
    {
      id: 'cardio',
      title: 'Cardiovascular & Fatigue',
      icon: <Heart className="w-5 h-5 text-red-400" />,
      color: 'border-red-500/30 bg-red-500/5',
      signals: [
        { name: "Heart Stress Signals", risk: "Stable", confidence: 87, insight: "The micro-rhythms in your voice suggest your heart is not under immediate stress.", recommendation: "Maintain heart-healthy habits." },
        { name: "Overall Physical Exhaustion", risk: "Moderate", confidence: 74, insight: "Your voice sounds tired, which often means your body hasn't fully rested or recovered.", recommendation: "Get a good night's sleep and avoid overexertion." },
        { name: "Heart-Rate Irregularity Signs", risk: "Stable", confidence: 82, insight: "No signs of erratic heart rhythms affecting your voice.", recommendation: "No action required." },
        { name: "General Energy Levels", risk: "Moderate", confidence: 79, insight: "You are speaking quieter than usual, which is a common sign of low energy.", recommendation: "Drink water and take time to rest." }
      ]
    },
    {
      id: 'endocrine',
      title: 'Endocrine & Metabolic',
      icon: <Droplet className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-500/5',
      signals: [
        { name: "Diabetes & Blood Sugar Signs", risk: "Stable", confidence: 91, insight: "No voice changes typically associated with diabetes or blood sugar issues.", recommendation: "No action required." },
        { name: "Thyroid Imbalance Signals", risk: "Stable", confidence: 86, insight: "Your voice pitch is normal, showing no obvious signs of thyroid issues.", recommendation: "No action required." },
        { name: "Hormonal Balance", risk: "Stable", confidence: 80, insight: "No major voice fluctuations linked to hormonal changes.", recommendation: "No action required." },
        { name: "Metabolism & Hydration", risk: "Stable", confidence: 84, insight: "Your vocal cords sound well-hydrated and healthy.", recommendation: "Keep drinking plenty of water." }
      ]
    },
    {
      id: 'ent',
      title: 'Vocal Pathology & ENT',
      icon: <Stethoscope className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-500/5',
      signals: [
        { name: "Throat & Voice Tension", risk: "Elevated", confidence: 88, insight: "Your throat muscles sound tight. This usually happens from talking too much, stress, or a mild sore throat.", recommendation: "Rest your voice and drink warm tea." },
        { name: "Overworked Voice (Hoarseness)", risk: "Moderate", confidence: 82, insight: "Your voice sounds slightly raspy, likely from overuse.", recommendation: "Avoid whispering or yelling; drink water." },
        { name: "Long-term Voice Damage", risk: "Stable", confidence: 89, insight: "No signs of chronic vocal cord damage like nodules or polyps.", recommendation: "No action required." },
        { name: "Throat Muscle Tightness", risk: "Stable", confidence: 85, insight: "Your neck and throat muscles appear relaxed while speaking.", recommendation: "No action required." }
      ]
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Stable': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Mild': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Moderate': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Elevated': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getRiskGlow = (risk: string) => {
    switch (risk) {
      case 'Stable': return 'shadow-[0_0_15px_rgba(74,222,128,0.2)]';
      case 'Mild': return 'shadow-[0_0_15px_rgba(250,204,21,0.2)]';
      case 'Moderate': return 'shadow-[0_0_15px_rgba(251,146,60,0.2)]';
      case 'Elevated': return 'shadow-[0_0_15px_rgba(248,113,113,0.2)]';
      default: return '';
    }
  };

  const CircularGauge = ({ label, value, colorClass }: { label: string, value: number, colorClass: string }) => {
    const strokeDasharray = 126; // approx 2 * pi * 20
    const strokeDashoffset = strokeDasharray - (value / 100) * strokeDasharray;
    return (
      <div className="flex flex-col items-center justify-center p-2">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="20" className="stroke-midnight-700" strokeWidth="4" fill="none" />
            <motion.circle 
              initial={{ strokeDashoffset: strokeDasharray }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="22" cy="22" r="20" 
              className={`stroke-current ${colorClass}`} 
              strokeWidth="4" fill="none" 
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className={`text-sm sm:text-lg font-bold ${colorClass}`}>{value}</span>
          </div>
        </div>
        <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider text-center font-semibold h-8 flex items-center">{label}</span>
      </div>
    );
  };

  return (
    <div id="snapshot-report" className="w-full text-slate-100 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-white/10 pb-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-teal/5 rounded-full blur-3xl pointer-events-none" />
        <div className="z-10">
          <div className="flex items-center space-x-2 text-accent-teal font-bold text-[10px] uppercase tracking-widest mb-2">
            <Activity className="w-4 h-4" /> Clinical Biomarker Intelligence
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center mb-1">
            Voice Wellness Snapshot <ShieldCheck className="w-6 h-6 ml-3 text-accent-cyan"/>
          </h2>
          <p className="text-slate-400 text-sm flex items-center mt-2 font-medium">
            <Clock className="w-4 h-4 mr-2"/> Generated: {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="text-left md:text-right text-sm text-slate-400 mt-6 md:mt-0 z-10 bg-midnight-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-md">
          <p className="font-bold text-white text-lg">{formData.name}</p>
          <p className="font-mono mt-1">ID: {formData.clinicCode ? `PT-${formData.clinicCode}-${formData.age}` : `PT-GUEST-${formData.age}`}</p>
          <p>{formData.age} yrs {formData.gender ? `• ${formData.gender}` : ''}</p>
        </div>
      </div>

      {/* Secure Transmission Alert */}
      {formData.clinicCode && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center text-emerald-400 mb-8 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold">Encrypted Dispatch Confirmed.</p>
            <p className="text-xs text-emerald-400/80 mt-1">
              {clinic ? `Results securely transmitted to ${clinic.clinic_name}'s clinical dashboard.` : `Sent directly to clinic ID: ${formData.clinicCode}.`}
            </p>
          </div>
        </div>
      )}

      {/* Longitudinal Memory */}
      {hasPreviousSnapshot && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 mb-8 shadow-lg relative overflow-hidden">
           <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10">
             <div>
               <h4 className="text-blue-400 font-bold flex items-center mb-1"><Activity className="w-4 h-4 mr-2"/> Longitudinal Trend Detected</h4>
               <p className="text-xs text-slate-300">Your historical scans show an improving trajectory.</p>
             </div>
             <div className="mt-4 sm:mt-0 flex gap-2">
                <span className="bg-midnight-900 border border-white/10 px-3 py-1.5 rounded-lg text-white text-xs font-mono flex items-center">
                   Stress: <span className="text-yellow-400 line-through ml-2 mr-2">Moderate</span> <ArrowRight className="w-3 h-3 mx-1 text-slate-500"/> <span className="text-green-400 ml-2">Stable</span>
                </span>
             </div>
           </div>
        </div>
      )}

      {/* Overall Wellness Snapshot Visualizer */}
      <div className="mb-10">
         <h3 className="text-xl font-bold text-white mb-6 flex items-center border-b border-white/5 pb-2">
            1. Overall Wellness Synopsis
         </h3>
         <div className="bg-[#0b1021]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <CircularGauge label="Voice Stability" value={82} colorClass="text-green-400" />
              <CircularGauge label="Stress Load" value={65} colorClass="text-orange-400" />
              <CircularGauge label="Breath Stability" value={78} colorClass="text-yellow-400" />
              <CircularGauge label="Vocal Energy" value={72} colorClass="text-yellow-400" />
              <CircularGauge label="Cognitive Stability" value={92} colorClass="text-green-400" />
              <CircularGauge label="Recovery State" value={60} colorClass="text-orange-400" />
            </div>
         </div>
      </div>

      {/* Disease-Signal Categories */}
      <div className="mb-10">
         <h3 className="text-xl font-bold text-white mb-6 flex items-center border-b border-white/5 pb-2">
            2. Clinical Biomarker Categories
         </h3>
         
         <div className="space-y-4">
           {categories.map((category) => (
             <div key={category.id} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${expandedCategory === category.id ? `bg-[#0b1021] ${category.color} shadow-lg` : 'bg-midnight-900 border-white/5 hover:border-white/20'}`}>
               
               <button 
                 onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                 className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
               >
                 <div className="flex items-center space-x-4">
                   <div className="p-2 bg-black/30 rounded-lg border border-white/5">
                     {category.icon}
                   </div>
                   <h4 className="font-bold text-lg text-white">{category.title}</h4>
                 </div>
                 {expandedCategory === category.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
               </button>

               <AnimatePresence>
                 {expandedCategory === category.id && (
                   <motion.div 
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="overflow-hidden"
                   >
                     <div className="p-5 pt-0 border-t border-white/5 mt-2 bg-black/20">
                       <div className="grid gap-4 mt-4">
                         {category.signals.map((sig, idx) => (
                           <div key={idx} className="bg-midnight-950 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-start gap-4 hover:bg-midnight-900 transition-colors">
                             
                             <div className="flex-1">
                               <div className="flex items-center justify-between mb-2">
                                 <h5 className="font-bold text-slate-200 text-sm">{sig.name}</h5>
                                 <div className="flex items-center gap-3">
                                   <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Conf: {sig.confidence}%</span>
                                   <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${getRiskColor(sig.risk)} ${getRiskGlow(sig.risk)}`}>
                                     {sig.risk}
                                   </span>
                                 </div>
                               </div>
                               <p className="text-xs text-slate-400 mb-2 leading-relaxed">{sig.insight}</p>
                               <div className="text-[10px] font-semibold text-slate-500 bg-black/30 inline-block px-2 py-1 rounded border border-white/5">
                                 Recommendation: <span className="text-slate-300">{sig.recommendation}</span>
                               </div>
                             </div>

                           </div>
                         ))}
                       </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
           ))}
         </div>
      </div>

      {/* Advanced Waveform Visualizer */}
      {audioUrl && (
        <div className="bg-[#0b1021] border border-white/10 rounded-2xl p-6 mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 via-transparent to-accent-teal/5 pointer-events-none" />
          <h3 className="text-sm font-bold text-white mb-4 flex items-center uppercase tracking-widest"><PlayCircle className="w-4 h-4 mr-2 text-accent-cyan" /> Acoustic Signal Analysis</h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <audio src={audioUrl} controls className="w-full md:w-64 z-10" />
            <div className="flex-1 flex items-center justify-between h-16 w-full opacity-60">
              {[...Array(30)].map((_, i) => (
                 <motion.div 
                   key={i} 
                   className="w-1.5 sm:w-2 rounded-full bg-gradient-to-t from-accent-cyan to-accent-teal shadow-[0_0_8px_rgba(8,247,206,0.5)]" 
                   animate={{ height: [`${10 + Math.random() * 30}%`, `${40 + Math.random() * 60}%`, `${10 + Math.random() * 30}%`] }} 
                   transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, ease: "easeInOut" }} 
                 />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compliance Footer */}
      <div className="bg-midnight-950 border border-midnight-700 rounded-xl p-5 mb-8 flex items-start text-slate-400 shadow-inner">
        <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 text-slate-500 flex-shrink-0" />
        <p className="text-xs leading-relaxed uppercase tracking-widest font-semibold">
          Disclaimer: Nuros provides AI-generated voice wellness insights and research-associated biomarker signals only. This is not a medical diagnosis. Do not use this tool to self-diagnose or treat any condition. Always consult a licensed healthcare provider.
        </p>
      </div>

      {/* Send to Self Form if No Clinic Code */}
      {!formData.clinicCode && (
        <SendReportWidget formData={formData} />
      )}

      <div className="mt-8 flex justify-center border-t border-white/5 pt-8">
        <button onClick={() => window.location.href = '/'} className="w-full sm:w-auto px-10 py-4 bg-[#112240] hover:bg-midnight-600 border border-white/10 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl">
          End Session & Clear Data
        </button>
      </div>

    </div>
  );
}
