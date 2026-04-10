"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { MessageSquare, X } from 'lucide-react';

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSend = () => {
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start font-sans">
      
      {/* Expanded Contact Form */}
      <div 
        className={`mb-4 transition-all duration-300 ease-in-out origin-bottom-left ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-[300px] sm:w-[350px] bg-[#0c1a30] border border-[#162a4a] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="bg-gradient-to-r from-[#112240] to-[#0c1a30] p-4 border-b border-[#162a4a] flex justify-between items-center relative overflow-hidden">
            <div className="flex items-center space-x-3 z-10">
               <div className="w-10 h-10 rounded-full border border-accent-teal overflow-hidden relative bg-midnight-900 shadow-[0_0_10px_rgba(8,247,206,0.3)]">
                 <Image src="/ai_doctor_new.png" alt="Doctor Agent" layout="fill" objectFit="cover" />
               </div>
               <div>
                  <h3 className="font-bold text-white text-sm">Dr. Nuros Support</h3>
                  <p className="text-xs text-accent-cyan flex items-center">
                    <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full mr-1 animate-pulse"></span> Online
                  </p>
               </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-midnight-600 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-5">
             {success ? (
               <div className="text-center py-6 text-white">
                 <div className="w-12 h-12 bg-[#20b2aa]/20 border border-[#20b2aa] rounded-full flex items-center justify-center mx-auto mb-4">
                   <span className="text-[#20b2aa] font-bold text-xl">✓</span>
                 </div>
                 <h4 className="font-bold text-lg mb-2">Thank you!</h4>
                 <p className="text-sm text-slate-400">Thank you for your message. Our team will get back to you shortly.</p>
                 <button 
                   onClick={() => { setSuccess(false); setEmail(''); setMessage(''); setIsOpen(false); }}
                   className="mt-6 text-sm text-[#20b2aa] hover:underline"
                 >
                   Close Window
                 </button>
               </div>
             ) : (
               <form className="space-y-4 font-sans" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                 <div>
                   <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 block">Your Email</label>
                   <input 
                     type="email" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="example@clinic.com" 
                     className="w-full bg-[#112240] border border-[#162a4a] focus:border-[#20b2aa] rounded-lg py-2.5 px-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#20b2aa] transition-all" 
                   />
                 </div>
                 <div>
                   <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 block">How can we help?</label>
                   <textarea 
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     placeholder="Ask us anything..." 
                     rows={4} 
                     className="w-full bg-[#112240] border border-[#162a4a] focus:border-[#20b2aa] rounded-lg py-2.5 px-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#20b2aa] transition-all resize-none"
                   ></textarea>
                 </div>
                 
                 {error && <p className="text-accent-red text-xs font-medium">{error}</p>}

                 <button type="submit" className="w-full bg-[#20b2aa] border border-[#20b2aa] text-[#0f1f3d] hover:bg-[#1b9a93] font-bold py-3 rounded-xl transition-all shadow-md">
                   Send Message
                 </button>
               </form>
             )}
          </div>
        </div>
      </div>

      {/* Doctor Action Button at Bottom Left */}
      <div className="relative group flex flex-col items-center">
        {/* Only show doctor image when the widget is closed */}
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer relative z-0 transition-transform hover:scale-105 duration-300 select-none pointer-events-auto filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
          >
             <div className="relative w-36 h-40 -mb-6 z-0">
               <Image 
                 src="/ai_doctor_new.png" 
                 alt="Contact Us Doctor" 
                 layout="fill" 
                 objectFit="contain" 
                 style={{ objectPosition: 'bottom' }} 
                 className="select-none"
               />
             </div>
          </div>
        )}
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`
             z-10 flex items-center justify-center space-x-2 px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)]
             border transition-all duration-300
             ${isOpen 
                ? 'bg-[#112240] text-slate-300 border-[#1b3459] w-[150px]' 
                : 'bg-[#0f1f3d] text-white border-[#1c4b57] hover:border-[#2ababe] w-[180px]'
             }
          `}
        >
          {isOpen ? (
            <span className="font-semibold text-sm tracking-wide">Close</span>
          ) : (
            <>
              {/* White chat box icon from Lucide */}
              <MessageSquare className="w-5 h-5 text-white fill-white mr-2 flex-shrink-0" />
              <span className="font-bold text-lg tracking-wide select-none">Contact Us</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
