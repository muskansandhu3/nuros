"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building, User, Mail, Phone, Lock, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { registerClinic, initDb } from '@/lib/mockDb';

export default function ClinicSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clinic_name: '',
    clinic_type: 'gp',
    location: '',
    admin_name: '',
    admin_email: '',
    phone: '',
    password: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [slug, setSlug] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    initDb(); // Ensure DB is initialized
    const newClinic = registerClinic(formData);
    setSlug(newClinic.clinic_slug);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0b1021] border border-midnight-700 rounded-2xl p-8 text-center shadow-xl">
          <div className="w-20 h-20 bg-accent-teal/20 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle className="w-10 h-10 text-accent-teal" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Application Received</h2>
          <p className="text-slate-400 mb-6 leading-relaxed">
            Thank you for applying to pilot Nuros AI. Your clinic ID is <strong className="text-white">{slug}</strong>. 
            We will review your application and activate your dashboard shortly.
          </p>
          <div className="bg-midnight-800 p-4 rounded-lg mb-8 text-sm text-slate-300">
            For demonstration purposes, your account has been automatically provisioned!
          </div>
          <Link href="/login" className="block w-full bg-accent-teal text-midnight-900 font-bold py-3 rounded-xl hover:bg-[#06e3bd] transition-colors">
            Proceed to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative overflow-hidden px-4">
       <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-[#0d6f91]/10 to-transparent pointer-events-none -z-10" />
       
       <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Text / Info */}
          <div className="text-left order-2 md:order-1">
             <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent-teal/10 border border-accent-teal/20 text-accent-teal text-sm font-semibold mb-6">
               <ShieldCheck className="w-4 h-4 mr-2" /> Enterprise Grade
             </div>
             <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">Partner With <span className="text-accent-cyan">Nuros</span></h1>
             <p className="text-lg text-slate-400 mb-8 leading-relaxed">
               Deploy our voice-AI intake lobby in your clinic. Reduce administrative burden, identify critical risk factors instantly, and secure your PHI.
             </p>

             <ul className="space-y-4 mb-8">
               {["Zero-integration setup available", "Dedicated unique lobby URL", "Real-time AI scribe dashboard", "PIPEDA / HIPAA compliant"].map((item, i) => (
                 <li key={i} className="flex items-center text-slate-300">
                   <CheckCircle className="w-5 h-5 text-accent-teal mr-3" /> {item}
                 </li>
               ))}
             </ul>
          </div>

          {/* Form */}
          <div className="bg-[#0b1021] border border-midnight-600 p-8 rounded-2xl shadow-xl order-1 md:order-2">
            <h2 className="text-2xl font-bold text-white mb-6">Clinic Registration</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-300">Clinic Name <span className="text-accent-red">*</span></label>
                <div className="relative">
                  <input required value={formData.clinic_name} onChange={e => setFormData({...formData, clinic_name: e.target.value})} className="w-full bg-[#112240] border border-[#1b3459] focus:border-accent-teal rounded-lg py-3 px-4 pl-10 text-slate-100" placeholder="e.g. Maple Leaf Medical" />
                  <Building className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-300">Clinic Type</label>
                  <select value={formData.clinic_type} onChange={e => setFormData({...formData, clinic_type: e.target.value})} className="w-full bg-[#112240] border border-[#1b3459] focus:border-accent-teal rounded-lg py-3 px-4 text-slate-100">
                    <option value="gp">General Practice</option>
                    <option value="walk-in">Walk-in Clinic</option>
                    <option value="dental">Dental Office</option>
                    <option value="telehealth">Telehealth</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-300">Location</label>
                  <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[#112240] border border-[#1b3459] focus:border-accent-teal rounded-lg py-3 px-4 text-slate-100" placeholder="City, Province" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-300">Admin Name</label>
                  <div className="relative">
                    <input required value={formData.admin_name} onChange={e => setFormData({...formData, admin_name: e.target.value})} className="w-full bg-[#112240] border border-[#1b3459] focus:border-accent-teal rounded-lg py-3 px-4 pl-10 text-slate-100" placeholder="John Doe" />
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-300">Phone</label>
                  <div className="relative">
                    <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#112240] border border-[#1b3459] focus:border-accent-teal rounded-lg py-3 px-4 pl-10 text-slate-100" placeholder="555-0199" />
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-300">Work Email <span className="text-accent-red">*</span></label>
                <div className="relative">
                  <input required type="email" value={formData.admin_email} onChange={e => setFormData({...formData, admin_email: e.target.value})} className="w-full bg-[#112240] border border-[#1b3459] focus:border-accent-teal rounded-lg py-3 px-4 pl-10 text-slate-100" placeholder="admin@clinic.com" />
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-300">Password <span className="text-accent-red">*</span></label>
                <div className="relative">
                  <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-[#112240] border border-[#1b3459] focus:border-accent-teal rounded-lg py-3 px-4 pl-10 text-slate-100" placeholder="••••••••" />
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <button type="submit" className="w-full bg-accent-teal hover:bg-[#06e3bd] text-midnight-900 font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all mt-6 shadow-[0_0_15px_rgba(8,247,206,0.2)]">
                <span>Request Pilot Access</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
            
            <p className="text-center text-sm text-slate-500 mt-6">
              Already a partner? <Link href="/login" className="text-accent-cyan hover:underline">Sign in here</Link>.
            </p>
          </div>

       </div>
    </div>
  );
}
