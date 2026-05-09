import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Server, FileCheck, CheckCircle, Database, EyeOff } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pt-24 pb-20 px-4">
      
      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center mb-20 animate-fade-in-up">
         <div className="w-20 h-20 bg-accent-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-teal/20">
            <ShieldCheck className="w-10 h-10 text-accent-teal" />
         </div>
         <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Built for Healthcare Privacy</h1>
         <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
           Nuros is engineered to process clinical signals without compromising patient identity. We are a processing layer, not a data broker.
         </p>
      </div>

      {/* Core Principles Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
         
         <div className="bg-[#0b1021] border border-midnight-600 rounded-2xl p-8 hover:border-accent-teal/50 transition-colors">
            <Server className="w-8 h-8 text-accent-cyan mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Canadian Hosted</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               All infrastructure and data processing is localized within Canada. We ensure compliance with strict regional data residency laws and healthcare standards.
            </p>
         </div>

         <div className="bg-[#0b1021] border border-midnight-600 rounded-2xl p-8 hover:border-accent-teal/50 transition-colors">
            <Lock className="w-8 h-8 text-accent-cyan mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">End-to-End Encryption</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               Data is encrypted at rest (AES-256) and in transit (TLS 1.3). Acoustic payload hashes are mathematically irreversable to raw audio.
            </p>
         </div>

         <div className="bg-[#0b1021] border border-midnight-600 rounded-2xl p-8 hover:border-accent-teal/50 transition-colors">
            <FileCheck className="w-8 h-8 text-accent-cyan mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">PIPEDA / PHIPA Aligned</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               Our architecture is strictly aligned with the Personal Health Information Protection Act (PHIPA) and PIPEDA regulations for medical data.
            </p>
         </div>

         <div className="bg-[#0b1021] border border-midnight-600 rounded-2xl p-8 hover:border-accent-teal/50 transition-colors">
            <Database className="w-8 h-8 text-accent-teal mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Clinics Own The Data</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               Nuros operates strictly as a data processor. The clinic retains 100% ownership of their patients' data. We never sell, share, or broker health information.
            </p>
         </div>

         <div className="bg-[#0b1021] border border-midnight-600 rounded-2xl p-8 hover:border-accent-teal/50 transition-colors">
            <EyeOff className="w-8 h-8 text-accent-teal mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">No Raw Audio Stored</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               By default, raw patient voice audio is processed ephemerally in RAM to extract biomarker signatures and is immediately purged post-computation.
            </p>
         </div>

         <div className="bg-[#0b1021] border border-midnight-600 rounded-2xl p-8 hover:border-accent-teal/50 transition-colors">
            <CheckCircle className="w-8 h-8 text-accent-teal mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Consent-First Design</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
               Every intake requires explicit patient consent. We do not collect full Dates of Birth or Government Health Card Numbers during voice intake.
            </p>
         </div>

      </div>

      {/* Audit Log Section */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#112240] to-midnight-900 border border-midnight-600 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
         <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent-teal/10 rounded-full blur-[80px] pointer-events-none" />
         
         <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Enterprise Audit & Access Control</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
               Clinics benefit from strict Role-Based Access Control (RBAC). Staff only see data necessary for their clinical duties. Furthermore, every action within the Nuros Dashboard generates an immutable audit log trail, satisfying hospital compliance audits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
               <Link href="/clinic-signup" className="px-8 py-4 bg-accent-teal text-midnight-900 font-bold rounded-xl text-center hover:bg-[#06e3bd] transition-colors shadow-lg shadow-accent-teal/20">
                  Request Security Whitepaper
               </Link>
               <Link href="/for-clinics" className="px-8 py-4 bg-midnight-800 text-white font-bold rounded-xl border border-midnight-600 text-center hover:bg-midnight-700 transition-colors">
                  View Clinic Features
               </Link>
            </div>
         </div>
      </div>

    </div>
  );
}
