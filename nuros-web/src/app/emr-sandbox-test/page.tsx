"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Server, RefreshCw, Send, CheckCircle2, AlertCircle, FileJson, User, Activity, ArrowRight } from 'lucide-react';
import { NurosVocalData, mapToFHIRObservation, createDiagnosticReport } from '@/lib/fhir-connector';

type Patient = {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
};

export default function EMRSandboxTest() {
  const [emrTarget, setEmrTarget] = useState<'oracle' | 'telus'>('oracle');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [fhirPayloads, setFhirPayloads] = useState<{ observation: any; diagnosticReport: any } | null>(null);
  const [pushStatus, setPushStatus] = useState<'idle' | 'pushing' | 'success' | 'error'>('idle');

  const fetchOraclePatients = async () => {
    setIsLoading(true);
    setError('');
    setSelectedPatient(null);
    setFhirPayloads(null);
    setPushStatus('idle');
    try {
      // Use the Oracle Health Cerner Open Sandbox FHIR R4 endpoint
      // Fetch patients with name 'Smart' which is standard in Cerner's open sandbox
      const res = await fetch('https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/Patient?name=Smart', {
        headers: {
          'Accept': 'application/fhir+json'
        }
      });
      
      if (!res.ok) throw new Error(`Failed to fetch from Cerner Sandbox: ${res.statusText}`);
      const data = await res.json();
      
      if (data.entry && data.entry.length > 0) {
        const mappedPatients = data.entry.map((e: any) => {
          const res = e.resource;
          const name = res.name && res.name.length > 0 
            ? `${res.name[0].given ? res.name[0].given.join(' ') : ''} ${res.name[0].family || ''}`
            : 'Unknown';
          return {
            id: res.id,
            name: name.trim(),
            gender: res.gender || 'unknown',
            birthDate: res.birthDate || 'unknown'
          };
        });
        setPatients(mappedPatients.slice(0, 5)); // Just take top 5
      } else {
        setPatients([]);
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching patients');
    } finally {
      setIsLoading(false);
    }
  };

  const generateFhirPayload = (patient: Patient) => {
    setSelectedPatient(patient);
    setPushStatus('idle');
    
    // Create mock Nuros data for the patient
    const mockData: NurosVocalData = {
      patientId: patient.id,
      clinicianId: "nuros_demo_clinician_01",
      encounterId: "enc_" + Math.floor(Math.random() * 100000),
      date: new Date().toISOString(),
      overallRisk: "Elevated",
      metrics: {
        jitter: 1.45,
        shimmer: 4.82,
        hnr: 12.3
      }
    };

    const observation = mapToFHIRObservation(mockData);
    const observationId = "obs_" + Math.floor(Math.random() * 100000);
    observation.id = observationId;
    
    const diagnosticReport = createDiagnosticReport(mockData, observationId);
    
    setFhirPayloads({ observation, diagnosticReport });
  };

  const simulatePushToEMR = async () => {
    setPushStatus('pushing');
    
    // Simulate network delay for writing to EMR
    await new Promise(r => setTimeout(r, 1800));
    
    // Simulate successful write
    setPushStatus('success');
  };

  return (
    <div className="min-h-screen bg-[#0b1021] text-slate-200 p-6 md:p-12 font-sans overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#20b2aa] to-[#08f7ce] flex items-center justify-center shadow-[0_0_15px_rgba(32,178,170,0.3)]">
              <Database className="w-5 h-5 text-midnight-900" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">EMR Sandbox Integration</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Live demonstration of Nuros interoperability. Fetch real patient data from the Oracle Health (Cerner) FHIR Sandbox, map vocal biomarker scores to standard HL7 FHIR payloads, and securely push to the EMR.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Step 1: EMR Connection */}
          <div className="col-span-1 space-y-6">
            <div className="bg-[#112240] border border-[#1e3a66] rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#20b2aa]/10 rounded-full blur-3xl pointer-events-none" />
              
              <h2 className="text-lg font-bold text-white flex items-center mb-4">
                <Server className="w-4 h-4 mr-2 text-[#20b2aa]" /> 1. Select EMR Target
              </h2>
              
              <div className="flex bg-[#0b1021] rounded-lg p-1 border border-[#1e3a66] mb-6">
                <button 
                  onClick={() => setEmrTarget('oracle')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${emrTarget === 'oracle' ? 'bg-[#20b2aa] text-[#0f1f3d] shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Oracle Health
                </button>
                <button 
                  onClick={() => setEmrTarget('telus')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${emrTarget === 'telus' ? 'bg-[#20b2aa] text-[#0f1f3d] shadow-md' : 'text-slate-400 hover:text-white opacity-50 cursor-not-allowed'}`}
                  title="Coming Soon"
                  disabled
                >
                  Telus Health
                </button>
              </div>

              <button 
                onClick={fetchOraclePatients}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-[#1e3a66] hover:bg-[#2a4d82] border border-[#3b6db0]/30 text-white font-bold py-3 px-4 rounded-xl transition-all"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span>Fetch Sandbox Patients</span>
              </button>
              
              {error && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* Patient List */}
            <AnimatePresence>
              {patients.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#112240] border border-[#1e3a66] rounded-2xl p-6 shadow-xl"
                >
                  <h2 className="text-lg font-bold text-white flex items-center mb-4">
                    <User className="w-4 h-4 mr-2 text-[#20b2aa]" /> 2. Select Patient Context
                  </h2>
                  <div className="space-y-2">
                    {patients.map(p => (
                      <button
                        key={p.id}
                        onClick={() => generateFhirPayload(p)}
                        className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                          selectedPatient?.id === p.id 
                            ? 'bg-[#20b2aa]/10 border-[#20b2aa] shadow-[0_0_10px_rgba(32,178,170,0.15)]' 
                            : 'bg-[#0b1021] border-[#1e3a66] hover:border-[#3b6db0]'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-sm text-white">{p.name}</p>
                          <p className="text-xs text-slate-400">ID: {p.id} • {p.gender}</p>
                        </div>
                        {selectedPatient?.id === p.id && <ArrowRight className="w-4 h-4 text-[#20b2aa]" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Step 3: FHIR Payload & Push */}
          <div className="col-span-1 lg:col-span-2">
            <AnimatePresence mode="wait">
              {!fhirPayloads ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] border border-dashed border-[#1e3a66] rounded-2xl flex flex-col items-center justify-center text-slate-500"
                >
                  <Activity className="w-12 h-12 mb-4 opacity-20" />
                  <p>Fetch and select a patient to generate FHIR payload</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="payloads"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-[#112240] border border-[#1e3a66] rounded-2xl p-6 shadow-xl relative">
                    <h2 className="text-lg font-bold text-white flex items-center justify-between mb-4">
                      <span className="flex items-center">
                        <FileJson className="w-4 h-4 mr-2 text-[#20b2aa]" /> 3. Generated FHIR Payload
                      </span>
                      <span className="text-xs font-medium px-2 py-1 bg-blue-900/40 text-blue-300 rounded border border-blue-800/50">
                        HL7 FHIR R4
                      </span>
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Observation Resource</p>
                        <div className="bg-[#0b1021] border border-[#1e3a66] rounded-xl p-4 overflow-x-auto h-[350px] custom-scrollbar">
                          <pre className="text-[11px] text-emerald-300 font-mono leading-relaxed">
                            {JSON.stringify(fhirPayloads.observation, null, 2)}
                          </pre>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">DiagnosticReport Resource</p>
                        <div className="bg-[#0b1021] border border-[#1e3a66] rounded-xl p-4 overflow-x-auto h-[350px] custom-scrollbar">
                          <pre className="text-[11px] text-blue-300 font-mono leading-relaxed">
                            {JSON.stringify(fhirPayloads.diagnosticReport, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#112240] border border-[#1e3a66] rounded-2xl p-6 shadow-xl flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg mb-1">Push to {emrTarget === 'oracle' ? 'Oracle Health' : 'Telus Health'}</h3>
                      <p className="text-sm text-slate-400">Simulate writing the generated resources back to the EMR sandbox.</p>
                    </div>
                    
                    {pushStatus === 'idle' && (
                      <button 
                        onClick={simulatePushToEMR}
                        className="flex items-center space-x-2 bg-[#20b2aa] hover:bg-[#1b9a93] text-[#0f1f3d] font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(32,178,170,0.4)]"
                      >
                        <Send className="w-4 h-4" />
                        <span>Push Payload</span>
                      </button>
                    )}

                    {pushStatus === 'pushing' && (
                      <div className="flex items-center space-x-3 text-[#20b2aa] font-bold px-6 py-3">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Transmitting via TLS...</span>
                      </div>
                    )}

                    {pushStatus === 'success' && (
                      <div className="flex items-center space-x-3 text-emerald-400 font-bold px-4 py-3 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
                        <CheckCircle2 className="w-5 h-5" />
                        <div>
                          <p>201 Created</p>
                          <p className="text-[10px] font-normal opacity-80">Payload successfully validated and stored in EMR</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
