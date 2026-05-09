"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Activity, X, MessageSquare, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const shouldReduceMotion = useReducedMotion();

  const handleSend = () => {
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }
    setSuccess(true);
  };

  // Gentle floating motion (0 to -6px)
  const floatingVariants: any = {
    initial: { y: 0 },
    animate: { 
      y: [0, -6, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  // Soft pulse/glow effect applied to drop-shadow to outline the PNG correctly
  const glowVariants: any = {
    initial: { filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.15)) drop-shadow(0 0 0px rgba(32,178,170,0))" },
    animate: { 
      filter: [
        "drop-shadow(0 10px 25px rgba(0,0,0,0.15)) drop-shadow(0 0 2px rgba(32,178,170,0.3))",
        "drop-shadow(0 10px 25px rgba(0,0,0,0.15)) drop-shadow(0 0 10px rgba(32,178,170,0.7))",
        "drop-shadow(0 10px 25px rgba(0,0,0,0.15)) drop-shadow(0 0 2px rgba(32,178,170,0.3))"
      ],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    hover: {
      scale: 1.05,
      filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.25)) drop-shadow(0 0 15px rgba(32,178,170,0.9))",
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start font-sans">
      
      {/* Expanded Contact Form */}
      <div 
        className={`mb-3 transition-all duration-300 ease-in-out origin-bottom-left ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none absolute bottom-0'
        }`}
      >
        <div className="w-[280px] bg-[#0c1a30] border border-[#162a4a] rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#112240] to-[#0c1a30] p-4 border-b border-[#162a4a] flex justify-between items-center relative overflow-hidden">
            <div className="flex items-center space-x-3 z-10">
               <div className="w-8 h-8 rounded-full border border-accent-teal flex items-center justify-center bg-midnight-900 shadow-sm text-accent-teal overflow-hidden relative">
                 <Activity className="w-4 h-4" />
               </div>
               <div>
                  <h3 className="font-bold text-white text-xs">AI Support</h3>
                  <p className="text-[10px] text-accent-cyan flex items-center font-medium">
                    <span className={`w-1.5 h-1.5 bg-accent-cyan rounded-full mr-1 ${shouldReduceMotion ? '' : 'animate-pulse'}`}></span> Online
                  </p>
               </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              aria-label="Close contact widget"
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-midnight-600 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-accent-teal min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          
          <div className="p-5">
             {success ? (
               <div className="text-center py-4 text-white">
                 <div className="w-10 h-10 bg-[#20b2aa]/20 border border-[#20b2aa] rounded-full flex items-center justify-center mx-auto mb-3">
                   <span className="text-[#20b2aa] font-bold text-lg">✓</span>
                 </div>
                 <h4 className="font-bold text-base mb-1">Request Sent</h4>
                 <p className="text-xs text-slate-400">We will contact you shortly to schedule a walkthrough.</p>
                 <button 
                   onClick={() => { setSuccess(false); setEmail(''); setMessage(''); setIsOpen(false); }}
                   className="mt-4 text-xs font-bold text-[#20b2aa] hover:underline focus:outline-none focus:ring-2 focus:ring-accent-teal rounded px-2 py-1 min-h-[44px]"
                 >
                   Close
                 </button>
               </div>
             ) : (
               <form className="space-y-4 font-sans" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                 <p className="text-sm font-medium text-slate-300">Need a pilot walkthrough?</p>
                 
                 <div>
                   <label htmlFor="widget-email" className="sr-only">Your Email</label>
                   <input 
                     id="widget-email"
                     type="email" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="clinic@example.com" 
                     className="w-full bg-[#112240] border border-[#162a4a] focus:border-[#20b2aa] rounded-lg py-2.5 px-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#20b2aa] transition-all" 
                   />
                 </div>
                 <div>
                   <label htmlFor="widget-message" className="sr-only">Message</label>
                   <textarea 
                     id="widget-message"
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     placeholder="Ask us anything..." 
                     rows={2} 
                     className="w-full bg-[#112240] border border-[#162a4a] focus:border-[#20b2aa] rounded-lg py-2.5 px-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#20b2aa] transition-all resize-none"
                   ></textarea>
                 </div>
                 
                 {error && <p className="text-accent-red text-[10px] font-medium">{error}</p>}

                 <button type="submit" className="w-full bg-[#20b2aa] text-[#0f1f3d] hover:bg-[#1b9a93] font-bold py-3 rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0c1a30] min-h-[44px] flex justify-center items-center">
                   Request Demo <ArrowRight className="w-4 h-4 ml-2" />
                 </button>
               </form>
             )}
          </div>
        </div>
      </div>

      {/* Floating AI Assistant Avatar & Button */}
      <div className={`relative ${isOpen ? 'hidden' : 'block'}`}>
        
        {/* Floating Avatar */}
        <div 
           className="absolute bottom-[44px] left-2 flex flex-col items-start z-10"
           onMouseEnter={() => setShowTooltip(true)}
           onMouseLeave={() => setShowTooltip(false)}
        >
          {/* Tooltip */}
          <div 
             className={`absolute -top-12 left-0 bg-midnight-800 border border-midnight-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap transition-all duration-200 pointer-events-none z-20
             ${showTooltip ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'}`}
          >
             Need help or a demo?
             <div className="absolute -bottom-1 left-4 w-2 h-2 bg-midnight-800 border-b border-r border-midnight-600 transform rotate-45"></div>
          </div>

          <motion.button
            onClick={() => setIsOpen(true)}
            aria-label="Nuros AI Assistant"
            aria-expanded={isOpen}
            className="w-[65px] h-[65px] sm:w-[90px] sm:h-[90px] focus:outline-none focus:ring-4 focus:ring-accent-teal rounded-full bg-transparent p-0 m-0 cursor-pointer"
            // @ts-ignore
            variants={!shouldReduceMotion ? { ...glowVariants, ...floatingVariants } : glowVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
             {/* Using standard img tag inside motion to inherit the CSS filter drop-shadow directly */}
             <img 
               src="/ai_assistant_avatar.png" 
               alt="" 
               className="w-full h-full object-contain"
             />
          </motion.button>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Contact Support"
          className="relative z-0 mt-8 flex items-center justify-center px-5 py-3 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.15)] border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0f1c] focus:ring-accent-teal min-h-[44px] bg-[#0f1f3d] text-white border-[#1c4b57] hover:border-[#2ababe]"
        >
          <MessageSquare className="w-4 h-4 text-white fill-white mr-2 flex-shrink-0" aria-hidden="true" />
          <span className="font-bold text-sm tracking-wide select-none">Contact Us</span>
        </button>
      </div>

    </div>
  );
}
