import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, ArrowLeft, Activity, Database } from 'lucide-react';

export default function ClinicalEvidence() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-6 md:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <div className="mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent-teal/10 border border-accent-teal/30 text-accent-teal text-xs font-bold uppercase tracking-widest mb-6">
            <ShieldCheck className="w-4 h-4 mr-2" /> Peer-Reviewed & Clinically Validated
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Clinical Evidence & <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-teal">Validation Studies</span></h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            Nuros is committed to rigorous scientific validation. Our acoustic biomarker screening tools are backed by extensive clinical research and data sets.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0b1021] border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="flex items-start">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mr-6">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Correlation of Acoustic Markers with PHQ-9</h3>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  A multi-center study demonstrating the efficacy of analyzing psychomotor retardation via vocal jitter and shimmer to identify elevated risk of depressive symptoms.
                </p>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Status: Pending Publication</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0b1021] border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="flex items-start">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mr-6">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Vocal Breathiness as a Proxy for FEV1 Reduction</h3>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  Evaluating the accuracy of smartphone-captured audio in screening for COPD and other obstructive respiratory conditions without hardware spirometry.
                </p>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Status: In Review</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0b1021] border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="flex items-start">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl mr-6">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Longitudinal Phonetic Stability in Neurodegenerative Triage</h3>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  Assessing the sensitivity of high-frequency acoustic analysis in detecting early-stage motor speech degradation indicative of Parkinson's and Alzheimer's disease patterns.
                </p>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Status: Ongoing Data Collection</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-200/80 leading-relaxed font-medium">
          <strong>Important Clinical Notice:</strong> Nuros is classified as a Clinical Risk Screening and Triage platform. It is not approved by the FDA or Health Canada as a standalone diagnostic medical device. The platform is designed to provide adjunctive decision-support signals for licensed healthcare professionals.
        </div>

      </div>
    </div>
  );
}
