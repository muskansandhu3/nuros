"use client";
import React from "react";
import { motion } from "framer-motion";
import { Mic, ShieldCheck, BrainCircuit, Activity, LayoutDashboard, Mail, QrCode, Sparkles, LockKeyhole, Stethoscope, User, Database, Cpu } from "lucide-react";

const steps = [
  {
    icon: Mic,
    title: "1. Patient Speaks",
    text: "Patient scans a QR code or opens the clinic link and records a 20-second voice check-in.",
    tag: "20 sec voice intake",
  },
  {
    icon: ShieldCheck,
    title: "2. Consent + Minimal Info",
    text: "Nuros collects consent, name, age, gender, and optional reason for visit — no health card or full DOB.",
    tag: "Privacy-first",
  },
  {
    icon: BrainCircuit,
    title: "3. Voice Signal Engine",
    text: "The voice is converted into acoustic signals like rhythm, breath stability, pauses, strain, and energy.",
    tag: "AI biomarker layer",
  },
  {
    icon: Activity,
    title: "4. Wellness / Clinical Signals",
    text: "Nuros generates a structured signal summary for review, not a diagnosis.",
    tag: "Decision support",
  },
  {
    icon: LayoutDashboard,
    title: "5. Clinic Dashboard",
    text: "The result appears only in the connected clinic dashboard or secure clinic email summary.",
    tag: "Clinic-owned record",
  },
];

const signals = [
  ["Voice Energy", "Balanced", "Overall vocal strength and energy level"],
  ["Stress & Tension", "Moderate", "Tone variation and vocal tightness"],
  ["Breath Stability", "Stable", "Consistency of airflow during speech"],
  ["Speech Rhythm", "Slight Pauses", "Flow, timing, and pause patterns"],
  ["Vocal Strain", "Low", "Effort or tension in voice production"],
];

function AnimatedArchitectureFlow() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[320px] rounded-2xl bg-[#0b1021] border border-white/10 p-6 shadow-inner overflow-hidden">
      
      {/* Abstract Background Glows */}
      <motion.div className="absolute left-10 top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
      <motion.div className="absolute right-10 bottom-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} />

      <div className="flex w-full h-full items-center justify-between relative z-10">
        
        {/* Stage 1: Live Talking Avatar */}
        <div className="flex flex-col items-center z-20">
          <div className="relative flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full border border-emerald-400/30 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
            <User className="text-emerald-300 w-8 h-8 z-10" />
            <motion.div className="absolute inset-0 rounded-full border border-emerald-400" animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
            <motion.div className="absolute inset-0 rounded-full border border-emerald-300" animate={{ scale: [1, 1.3, 1.8], opacity: [0.6, 0.2, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5, ease: "easeOut" }} />
          </div>
          <p className="mt-3 text-xs font-semibold text-emerald-200 uppercase tracking-widest">Patient Input</p>
        </div>

        {/* Connection Line 1: Particles moving from Patient to AI Core */}
        <div className="relative flex-1 h-px bg-white/10 mx-4">
          <motion.div className="absolute top-1/2 -mt-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
          <motion.div className="absolute top-1/2 -mt-1 w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_10px_#6ee7b7]" animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5, ease: "linear" }} />
        </div>

        {/* Stage 2: Deep Learning AI Core */}
        <div className="flex flex-col items-center z-20">
          <motion.div className="relative flex items-center justify-center w-20 h-20 bg-[#0f172a] rounded-xl border border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.3)] transform rotate-45" animate={{ rotate: [45, 45], scale: [1, 1.05, 1], boxShadow: ["0 0 30px rgba(34,211,238,0.2)", "0 0 50px rgba(34,211,238,0.5)", "0 0 30px rgba(34,211,238,0.2)"] }} transition={{ duration: 3, repeat: Infinity }}>
            <Cpu className="text-cyan-300 w-8 h-8 -rotate-45" />
            {/* Extracting features visualization inside core */}
            <div className="absolute inset-2 flex flex-col justify-between -rotate-45 opacity-50">
               {[...Array(5)].map((_, i) => (
                  <motion.div key={i} className="h-0.5 bg-cyan-300 rounded-full" animate={{ width: [`${30+Math.random()*40}%`, `${60+Math.random()*40}%`, `${30+Math.random()*40}%`] }} transition={{ duration: 0.5+Math.random(), repeat: Infinity }} />
               ))}
            </div>
          </motion.div>
          <p className="mt-5 text-xs font-semibold text-cyan-200 uppercase tracking-widest text-center">Nuros Signal<br/>Engine</p>
        </div>

        {/* Connection Line 2: Particles moving from AI Core to Output */}
        <div className="relative flex-1 h-px bg-white/10 mx-4 flex flex-col justify-center">
           <motion.div className="absolute top-1/2 -mt-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
           <motion.div className="absolute top-1/2 -mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4, ease: "linear" }} />
           <motion.div className="absolute top-1/2 -mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.8, ease: "linear" }} />
        </div>

        {/* Stage 3: Clinical Output Node */}
        <div className="flex flex-col items-center z-20">
          <div className="relative flex flex-col items-center justify-center w-16 h-16 bg-slate-900 rounded-lg border border-blue-400/30 shadow-[0_0_20px_rgba(96,165,250,0.2)] overflow-hidden">
             <Database className="text-blue-300 w-6 h-6 mb-1 z-10" />
             {/* Simulating data filling */}
             <motion.div className="absolute bottom-0 w-full bg-blue-500/20" animate={{ height: ["0%", "100%", "0%"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
          </div>
          <p className="mt-3 text-xs font-semibold text-blue-200 uppercase tracking-widest text-center">Secure<br/>Output</p>
        </div>

      </div>

      {/* Floating Biomarker Chips coming out of the AI Core */}
      <motion.div className="absolute top-1/4 left-1/2 px-2 py-1 bg-cyan-900/50 border border-cyan-400/30 rounded text-[10px] font-mono text-cyan-200" animate={{ y: [0, -20, -40], opacity: [0, 1, 0], x: 20 }} transition={{ duration: 3, repeat: Infinity, delay: 0 }}>MFCC</motion.div>
      <motion.div className="absolute top-3/4 left-1/2 px-2 py-1 bg-emerald-900/50 border border-emerald-400/30 rounded text-[10px] font-mono text-emerald-200" animate={{ y: [0, 20, 40], opacity: [0, 1, 0], x: -10 }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}>JITTER</motion.div>
      <motion.div className="absolute top-1/2 left-[55%] px-2 py-1 bg-blue-900/50 border border-blue-400/30 rounded text-[10px] font-mono text-blue-200" animate={{ y: [0, -15, -30], opacity: [0, 1, 0], x: 30 }} transition={{ duration: 3, repeat: Infinity, delay: 2 }}>CPP</motion.div>
    </div>
  );
}

function FlowLine() {
  return (
    <div className="relative mx-auto my-8 hidden h-16 max-w-5xl items-center justify-between md:flex">
      <div className="absolute left-8 right-8 top-1/2 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />
      <motion.div
        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.9)]"
        animate={{ left: ["6%", "92%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function NurosHowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#061322] text-white">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden px-6 py-20 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_35%)]" />
        <motion.div
          className="absolute left-8 top-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
              <Sparkles className="h-4 w-4" /> Voice intelligence, explained simply
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
              How Nuros turns a short voice sample into useful health signals
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Nuros helps clinics capture a 20-second voice intake, process acoustic biomarkers securely, and send a structured wellness or clinical-support summary to the care team.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="rounded-full bg-emerald-300 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-900/30 hover:bg-emerald-400 transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-200" href="/clinic-signup">
                Request Pilot Access
              </a>
              <a className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/15 transition-colors focus:outline-none focus:ring-4 focus:ring-white/30" href="/patient">
                Get Voice Snapshot
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <AnimatedArchitectureFlow />
          </motion.div>
        </div>
      </section>

      {/* Step-by-Step Flow Section */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <FlowLine />
          <div className="grid gap-5 md:grid-cols-5">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.6, type: "spring", bounce: 0.4 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(52, 211, 153, 0.1)" }}
                  className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur transition-colors hover:border-emerald-400/30"
                >
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-300/15 text-emerald-200">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-300/80">{step.tag}</p>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{step.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture & Table Section */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[2rem] border border-white/10 bg-[#0b1021] p-8 shadow-xl"
          >
            <h2 className="text-3xl font-semibold text-white">Privacy-first architecture</h2>
            <p className="mt-4 text-slate-400">
              Nuros is designed to give clinics acoustic insight without unnecessary patient-data exposure.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                { Icon: LockKeyhole, label: "No health card number required" },
                { Icon: ShieldCheck, label: "No exact dates of birth collected" },
                { Icon: BrainCircuit, label: "Raw audio processed ephemerally" },
                { Icon: QrCode, label: "Clinic-specific QR code routing" },
                { Icon: Mail, label: "Secure, encrypted email dispatch" },
              ].map(({ Icon, label }, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="flex items-center gap-4 rounded-2xl bg-white/5 border border-white/5 p-4 text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <div className="p-2 bg-emerald-400/10 rounded-lg">
                     <Icon className="h-5 w-5 text-emerald-300" />
                  </div>
                  <span className="font-medium text-sm">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[2rem] border border-white/10 bg-slate-900 p-4 text-slate-100 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="rounded-[1.5rem] bg-[#0f172a] border border-slate-800 p-6 relative z-10">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Your Voice Wellness Snapshot</h3>
                  <p className="text-sm text-slate-400 mt-1">Decision-support signals, not diagnosis</p>
                </div>
                <motion.span 
                   animate={{ opacity: [0.5, 1, 0.5] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="rounded-full bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-400 uppercase tracking-wide"
                >
                  Live Report
                </motion.span>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0b1021]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#1e293b]/50 text-slate-400">
                    <tr>
                      <th className="p-4 font-semibold">Signal</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">What it reflects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signals.map((row, i) => (
                      <motion.tr 
                        key={row[0]} 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        className="border-t border-slate-800 bg-transparent hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 font-semibold text-slate-200">{row[0]}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 text-xs font-bold text-emerald-400">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                             {row[1]}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 text-xs">{row[2]}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-200/90 font-medium">
                Nuros does not diagnose or treat medical conditions. It provides voice-based signals that may support better conversations with a provider.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-7xl rounded-[2.5rem] border border-emerald-400/20 bg-gradient-to-br from-[#0f172a] to-[#0b1021] p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.1),transparent_70%)]" />
          <div className="relative z-10">
            <h2 className="text-3xl font-semibold sm:text-4xl text-white">Built for clinics, simple enough for patients</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400 text-lg">
              Use Nuros through a QR code, clinic tablet, SMS link, or secure web intake. No hardware required.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <a className="rounded-full bg-emerald-400 hover:bg-emerald-300 px-8 py-3.5 font-bold text-slate-950 shadow-lg shadow-emerald-900/30 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-200" href="/clinic-signup">Request Clinical Pilot</a>
              <a className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 font-semibold text-white hover:bg-white/10 transition-all focus:outline-none focus:ring-4 focus:ring-white/30" href="/patient">Get Voice Snapshot</a>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
