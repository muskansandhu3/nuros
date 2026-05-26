"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Check, X } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function ConsentModal({ isOpen, onAccept, onDecline }: ConsentModalProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight + 10;
    if (bottom) {
      setHasScrolled(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#0b1021] border border-white/10 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative"
          >
            <div className="flex items-center space-x-3 mb-6 border-b border-white/5 pb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <ShieldAlert className="w-6 h-6 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Patient Consent & Privacy</h2>
            </div>
            
            <div 
              className="text-sm text-slate-300 space-y-4 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar mb-6"
              onScroll={handleScroll}
            >
              <p>
                <strong>1. Clinical Risk Screening:</strong> Nuros is an AI-powered vocal biomarker triage tool. It analyzes acoustic signals to identify potential clinical risks.
              </p>
              <p className="text-amber-400 font-medium">
                Nuros is NOT a diagnostic device. It does not replace professional medical judgment, diagnosis, or treatment.
              </p>
              <p>
                <strong>2. Data De-identification (PHIPA/HIPAA):</strong> Before any processing occurs, your voice data is passed through our secure privacy-masking logic. All personally identifiable information is stripped from the acoustic features.
              </p>
              <p>
                <strong>3. Audit Logging:</strong> Access to your clinical risk report is securely logged in our compliance audit trails to ensure strict data governance.
              </p>
              <p>
                By proceeding, you explicitly consent to the capturing and processing of your voice sample for clinical screening purposes as outlined above.
              </p>
              {!hasScrolled && (
                <p className="text-xs text-slate-500 italic mt-4">Please scroll to the bottom to accept.</p>
              )}
            </div>

            <div className="flex space-x-3 pt-4 border-t border-white/5">
              <button 
                onClick={onDecline}
                className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-2" /> Decline
              </button>
              <button 
                onClick={onAccept}
                disabled={!hasScrolled}
                className="flex-1 py-3 px-4 rounded-xl bg-accent-teal text-[#0f1f3d] font-bold hover:bg-[#1b9a93] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_15px_rgba(32,178,170,0.3)]"
              >
                <Check className="w-4 h-4 mr-2" /> Accept & Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
