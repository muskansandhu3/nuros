import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Activity, Wind, Database, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: "The Science of Acoustic Phenotyping | Nuros Technology",
  description: "Discover how Nuros utilizes advanced AI vocal screening in Ontario to provide clinical decision support for respiratory health and biomarker triage.",
};

export default function TechnologyPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-6 md:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <header className="mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent-teal/10 border border-accent-teal/30 text-accent-teal text-xs font-bold uppercase tracking-widest mb-6">
            <Activity className="w-4 h-4 mr-2" /> Core Technology
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            The Science of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-teal">Acoustic Phenotyping</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-3xl">
            Nuros leverages advanced machine learning to extract micro-acoustic features from the human voice. This enables non-invasive clinical risk screening and provides actionable triage signals for healthcare providers.
          </p>
        </header>

        <div className="space-y-10">
          
          {/* Section 1 */}
          <section className="bg-[#0b1021] border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl mr-4">
                <Wind className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Clinical Decision Support for Respiratory Health</h2>
            </div>
            <div className="text-slate-300 leading-relaxed text-sm md:text-base space-y-4">
              <p>
                A core pillar of our technology focuses on pulmonary and respiratory screening. By analyzing vocal parameters such as shimmer, jitter, and forced breath variations, the Nuros engine provides powerful <strong>Clinical Decision Support for Respiratory Health</strong>.
              </p>
              <p>
                These acoustic biomarkers act as proxies for traditional spirometry, enabling primary care physicians to identify irregular breathing patterns and triage patients who may require formal diagnostic follow-up for conditions like COPD or asthma. <em>Nuros does not diagnose respiratory conditions; it screens and flags acoustic anomalies.</em>
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-[#0b1021] border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl mr-4">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">AI Vocal Screening in Ontario</h2>
            </div>
            <div className="text-slate-300 leading-relaxed text-sm md:text-base space-y-4">
              <p>
                Deployed securely within Canadian infrastructure, Nuros is pioneering <strong>AI Vocal Screening in Ontario</strong> and beyond. Our models are trained on diverse, demographically representative datasets to minimize bias and ensure high clinical validity across varied populations.
              </p>
              <p>
                By integrating seamlessly into existing EMR workflows via HL7 FHIR standards, clinics in Ontario and British Columbia can adopt our acoustic phenotyping tools without disrupting provider workflows.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-[#0b1021] border border-white/10 rounded-2xl p-8 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <ShieldCheck className="w-48 h-48" />
             </div>
            <div className="flex items-center mb-6 relative z-10">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl mr-4">
                <ShieldCheck className="w-6 h-6 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">Regulatory Compliance: Screen & Triage</h2>
            </div>
            <div className="text-slate-300 leading-relaxed text-sm md:text-base space-y-4 relative z-10">
              <p>
                Patient safety and regulatory adherence are foundational to Nuros. Our platform is strictly categorized as a clinical screening and triage tool. 
              </p>
              <p>
                Our algorithms process voice samples to flag elevated risk signals, allowing doctors to prioritize care. We explicitly engineer our systems to <strong>screen</strong> and <strong>triage</strong>, avoiding automated medical diagnoses to maintain compliance with Health Canada and FDA software-as-a-medical-device (SaMD) guidelines.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
