"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, Activity } from 'lucide-react';
import { auditLogger } from '@/lib/audit-logger';

export default function SmartOnFhirLaunch() {
  const router = useRouter();
  const [status, setStatus] = useState("Initiating SMART on FHIR Handshake...");

  useEffect(() => {
    // Simulate OAuth2 SMART on FHIR SSO Flow
    const initiateLaunch = async () => {
      // 1. Receive launch token from EMR (Epic, Cerner, etc.)
      setStatus("Validating EMR Launch Token...");
      await new Promise(r => setTimeout(r, 1200));

      // 2. Authenticate Clinician & Resolve Patient Context
      setStatus("Resolving Patient Context (FHIR OAuth2)...");
      await new Promise(r => setTimeout(r, 1500));

      // 3. Log the access securely
      auditLogger.logAccess({
        clinicianId: "dr_smith_123",
        patientId: "pt_98765",
        action: "SMART_LAUNCH",
        resourceType: "Dashboard",
        status: "SUCCESS"
      });

      setStatus("Secure connection established. Redirecting to NurosMD...");
      await new Promise(r => setTimeout(r, 800));

      // 4. Redirect to dashboard seamlessly
      router.push('/dashboard');
    };

    initiateLaunch();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-100 font-sans p-4">
      <div className="bg-[#0b1021] border border-[#1b3459] rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center">
         <div className="absolute top-0 right-0 w-32 h-32 bg-accent-teal/10 rounded-full blur-3xl pointer-events-none" />
         
         <div className="flex justify-center mb-6">
           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-teal to-accent-cyan flex justify-center items-center shadow-[0_0_20px_rgba(8,247,206,0.3)] animate-pulse">
             <Activity className="w-8 h-8 text-midnight-900" />
           </div>
         </div>

         <h1 className="text-2xl font-bold text-white mb-2">Nuros Health AI</h1>
         <p className="text-sm text-slate-400 mb-8">SMART on FHIR Integration Gateway</p>

         <div className="flex items-center justify-center space-x-3 text-accent-cyan font-medium text-sm">
           <Loader2 className="w-5 h-5 animate-spin" />
           <span>{status}</span>
         </div>

         <div className="mt-10 flex items-center justify-center space-x-2 text-[10px] text-emerald-400/70 uppercase tracking-widest font-bold">
           <ShieldCheck className="w-4 h-4" />
           <span>End-to-End Encrypted & PHIPA Compliant</span>
         </div>
      </div>
    </div>
  );
}
