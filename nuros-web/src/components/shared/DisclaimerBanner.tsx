import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-center text-amber-200/90 text-xs sm:text-sm font-medium z-50 relative">
      <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
      <p className="text-center">
        <span className="font-bold uppercase tracking-wider mr-1">Clinical Screening Tool:</span> 
        Nuros provides vocal biomarker triage signals. It is not a diagnostic device and should not replace professional medical judgment.
      </p>
    </div>
  );
}
