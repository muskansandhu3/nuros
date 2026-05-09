"use client";

import React, { useState } from "react";
import { FileText, CheckCircle } from "lucide-react";

interface SendReportWidgetProps {
  formData: any;
}

export default function SendReportWidget({ formData }: SendReportWidgetProps) {
  const [selfEmail, setSelfEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendToSelf = async () => {
    if (!selfEmail) return;
    setIsSendingEmail(true);
    try {
        const response = await fetch("/api/send-secure-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: selfEmail })
        });

        if (response.ok) {
          setEmailSent(true);
        } else {
          console.error("Failed to send secure report");
        }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="bg-[#112240] border border-midnight-600 rounded-xl p-6 mb-6 shadow-sm mt-4">
      <h3 className="text-lg font-bold text-white mb-2 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-accent-cyan" /> Securely Email Report
      </h3>
      {emailSent ? (
        <div className="bg-[#4c8f18]/20 border border-[#4c8f18]/40 text-[#4c8f18] rounded-lg p-4 flex items-center mt-4">
          <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
          <div>
             <p className="font-bold">Sent successfully!</p>
             <p className="text-xs mt-1">Check your inbox for the PDF report and a separate email with your access key.</p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-400 mb-4">You did not provide a clinic code. You can email a secure PDF copy of this snapshot to yourself.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={selfEmail}
              onChange={(e) => setSelfEmail(e.target.value)}
              className="flex-1 bg-midnight-900 border border-midnight-600 rounded-lg p-3 text-white focus:border-accent-cyan outline-none"
            />
            <button 
              onClick={handleSendToSelf}
              disabled={!selfEmail || isSendingEmail}
              className="px-6 py-3 bg-accent-cyan hover:bg-[#08d3e6] disabled:opacity-50 text-midnight-900 font-bold rounded-lg transition-all flex justify-center items-center whitespace-nowrap"
            >
              {isSendingEmail ? "Sending..." : "Send Secure Report"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
