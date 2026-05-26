import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Award, MapPin, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: "About Nuros | Leadership & Mission",
  description: "Learn about Nuros AI, founded by Muskan Sandhu. Bridging Enterprise Solution Architecture with Clinical AI for vocal biomarker triage in Canada.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-6 md:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Pioneering the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-teal">Clinical Risk Screening</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-3xl">
            Nuros is on a mission to democratize early health assessments using medical-grade AI vocal biomarkers. We empower healthcare providers across Canada with non-invasive, objective acoustic phenotyping for patient triage.
          </p>
        </header>

        {/* Leadership Section - E-E-A-T Focus */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Leadership & Vision</h2>
          
          <div className="bg-[#0b1021] border border-white/10 rounded-2xl p-8 md:p-10 shadow-xl flex flex-col md:flex-row gap-10 items-start">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              {/* Fallback avatar if no image is available */}
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-midnight-700 to-midnight-800 border-4 border-accent-teal/20 shadow-2xl overflow-hidden mb-6 flex items-center justify-center text-4xl font-bold text-slate-600">
                MS
              </div>
              <h3 className="text-xl font-bold text-white text-center">Muskan Sandhu</h3>
              <p className="text-accent-cyan font-medium text-center uppercase tracking-widest text-xs mt-1">Founder & CEO</p>
            </div>
            
            <div className="w-full md:w-2/3 space-y-6 text-slate-300 leading-relaxed text-sm md:text-base">
              <p>
                Muskan Sandhu brings a formidable background in <strong>Enterprise Solution Architecture</strong> and large-scale cloud infrastructure to the healthcare sector. After years of designing highly secure, distributed systems for Fortune 500 companies, Muskan recognized a critical gap in preventative healthcare: the underutilization of passive data streams, specifically the human voice, in clinical workflows.
              </p>
              <p>
                Transitioning her deep technical expertise into AI-driven health, Muskan founded Nuros to bridge the divide between advanced machine learning and practical clinical utility. Under her leadership, Nuros focuses strictly on evidence-based acoustic phenotyping, ensuring every algorithm meets the rigorous standards required by healthcare providers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="flex items-start">
                  <Award className="w-5 h-5 text-accent-amber mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Enterprise Architecture</h4>
                    <p className="text-xs text-slate-500 mt-1">Designing scalable, secure, and compliant systems.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="w-5 h-5 text-accent-teal mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Clinical AI Integration</h4>
                    <p className="text-xs text-slate-500 mt-1">Translating acoustic data into actionable triage signals.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Local SEO / Service Area Section */}
        <section className="bg-midnight-950 border border-midnight-700 rounded-2xl p-8 mb-16 relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">
            <MapPin className="w-4 h-4 mr-2" /> Our Footprint
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Proudly Serving Canadian Healthcare</h2>
          <p className="text-slate-400 leading-relaxed max-w-2xl text-sm md:text-base">
            Nuros is dedicated to improving patient outcomes across Canada. We are currently partnering with and <strong>serving clinical networks in Brampton, ON and Vancouver, BC</strong>. Our platform is designed to integrate seamlessly into existing provincial health frameworks, supporting clinics with secure, non-invasive screening technologies.
          </p>
        </section>

      </div>
    </div>
  );
}
