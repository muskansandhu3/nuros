'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function AnimatedHeroLogo() {
  const shouldReduceMotion = useReducedMotion();
  const transitionBase = { ease: "easeInOut" as const };
  
  // Conditionally adjust animation intensity based on user preferences
  const pathDuration = shouldReduceMotion ? 0.1 : 2;
  const pulseDuration = shouldReduceMotion ? 6 : 1.5;
  const delayFactor = shouldReduceMotion ? 0 : 1;

  return (
    <div className="w-full flex justify-center items-center">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1600 1200" 
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="max-h-[250px] md:max-h-[350px] w-auto overflow-hidden"
        aria-label="Nuros Health AI Logo"
      >
        <defs>
          <radialGradient id="badgeBlue" cx="42%" cy="35%" r="68%">
            <stop offset="0%" stopColor="#0d6f91"/>
            <stop offset="55%" stopColor="#073b5d"/>
            <stop offset="100%" stopColor="#061e3a"/>
          </radialGradient>
          <linearGradient id="greenGrad" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#c9ff58"/>
            <stop offset="55%" stopColor="#7fc42d"/>
            <stop offset="100%" stopColor="#4c8f18"/>
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#f9e89f"/>
            <stop offset="60%" stopColor="#c7a54a"/>
            <stop offset="100%" stopColor="#8e6e22"/>
          </linearGradient>
          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#0a2540" floodOpacity="0.20"/>
          </filter>
          <filter id="greenGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feFlood floodColor="#9be23a" floodOpacity="0.85"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="strongGreenGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feFlood floodColor="#9be23a" floodOpacity="0.95"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* LAYER 02: background_ecg_line */}
        <g id="layer_02_background_ecg_line">
          <motion.path 
            fill="none" 
            stroke="#b8c4ca" 
            strokeWidth="10" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M0 710 H305 C330 710 330 610 350 610 C370 610 374 830 397 830 C420 830 440 650 460 650 C482 650 488 710 510 710 H620 M980 710 H1045 C1062 710 1067 664 1082 664 C1100 664 1111 818 1131 818 C1153 818 1190 550 1212 550 C1234 550 1241 710 1265 710 H1600"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: pathDuration, delay: 0.5 * delayFactor, ...transitionBase }}
          />
          {/* Green traveling pulse over the ECG */}
          {!shouldReduceMotion && (
            <motion.path 
              fill="none" 
              stroke="#9be23a" 
              strokeWidth="12" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              filter="url(#greenGlow)"
              d="M0 710 H305 C330 710 330 610 350 610 C370 610 374 830 397 830 C420 830 440 650 460 650 C482 650 488 710 510 710 H620 M980 710 H1045 C1062 710 1067 664 1082 664 C1100 664 1111 818 1131 818 C1153 818 1190 550 1212 550 C1234 550 1241 710 1265 710 H1600"
              initial={{ pathLength: 0, opacity: 0, pathOffset: 0 }}
              animate={{ pathLength: 0.1, pathOffset: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, delay: 1 * delayFactor, ease: "linear" }}
            />
          )}
        </g>

        {/* LAYER 03 & 04: Main badge and Brain */}
        <motion.g 
          id="badge_and_brain" 
          initial={{ scale: shouldReduceMotion ? 1 : 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.5 : 1.2, delay: 1.5 * delayFactor, ...transitionBase }}
          style={{ transformOrigin: '800px 465px' }}
        >
          <g filter="url(#softShadow)">
            <circle cx="800" cy="465" r="280" fill="url(#goldGrad)"/>
            <circle cx="800" cy="465" r="255" fill="#ffffff"/>
            <circle cx="800" cy="465" r="238" fill="url(#badgeBlue)"/>
          </g>
          
          <g id="layer_04_brain_outline" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M800 265 C765 250 734 266 724 298 C686 288 655 315 657 354 C626 361 604 391 612 424 C584 445 585 489 613 510 C594 552 625 596 669 596 C674 633 716 653 748 633 C764 660 787 670 800 668"/>
            <path d="M800 265 C835 250 866 266 876 298 C914 288 945 315 943 354 C974 361 996 391 988 424 C1016 445 1015 489 987 510 C1006 552 975 596 931 596 C926 633 884 653 852 633 C836 660 813 670 800 668"/>
            <path d="M800 267 V668"/>
          </g>

          {/* LAYER 05: brain_circuit_left */}
          <g id="layer_05_brain_circuit_left" filter="url(#greenGlow)" fill="none" stroke="#9be23a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <motion.path d="M760 310 V370 L710 420 H650" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: shouldReduceMotion ? 0.1 : 1, delay: 2.2 * delayFactor }}/>
            <motion.circle cx="650" cy="420" r="8" fill="#9be23a" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3 * delayFactor }}/>
            
            <motion.path d="M730 330 V385 L690 385" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: shouldReduceMotion ? 0.1 : 0.8, delay: 2.4 * delayFactor }}/>
            <motion.circle cx="690" cy="385" r="8" fill="#9be23a" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.1 * delayFactor }}/>
            
            <motion.path d="M705 455 H645" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 2.6 * delayFactor }}/>
            <motion.circle cx="645" cy="455" r="8" fill="#9be23a" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.1 * delayFactor }}/>
            
            <motion.path d="M750 520 H690 V570" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: shouldReduceMotion ? 0.1 : 1, delay: 2.3 * delayFactor }}/>
            <motion.circle cx="690" cy="570" r="8" fill="#9be23a" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.2 * delayFactor }}/>
            
            <motion.path d="M775 595 V545 H725" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: shouldReduceMotion ? 0.1 : 0.8, delay: 2.5 * delayFactor }}/>
            <motion.circle cx="725" cy="545" r="8" fill="#9be23a" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.2 * delayFactor }}/>
            
            <motion.path d="M772 420 L725 350 V315" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: shouldReduceMotion ? 0.1 : 0.9, delay: 2.1 * delayFactor }}/>
            <motion.circle cx="725" cy="315" r="8" fill="#9be23a" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.9 * delayFactor }}/>
            
            <motion.path d="M785 500 L735 500" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: shouldReduceMotion ? 0.1 : 0.5, delay: 2.7 * delayFactor }}/>
            <motion.circle cx="735" cy="500" r="8" fill="#9be23a" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.1 * delayFactor }}/>
          </g>

          {/* LAYER 06: brain_circuit_right */}
          <g id="layer_06_brain_circuit_right" filter="url(#greenGlow)" fill="none" stroke="#9be23a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <motion.path d="M840 310 V370 L890 420 H950" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: shouldReduceMotion ? 0.1 : 1, delay: 2.2 * delayFactor }}/>
            <motion.circle cx="950" cy="420" r="8" fill="#9be23a" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3 * delayFactor }}/>
            
            <motion.path d="M870 330 V385 L910 385" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: shouldReduceMotion ? 0.1 : 0.8, delay: 2.4 * delayFactor }}/>
            <motion.circle cx="910" cy="385" r="8" fill="#9be23a" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.1 * delayFactor }}/>
            
            <motion.path d="M895 455 H955" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 2.6 * delayFactor }}/>
            <motion.circle cx="955" cy="455" r="8" fill="#9be23a" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.1 * delayFactor }}/>
            
            <motion.path d="M850 520 H910 V570" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: shouldReduceMotion ? 0.1 : 1, delay: 2.3 * delayFactor }}/>
            <motion.circle cx="910" cy="570" r="8" fill="#9be23a" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.2 * delayFactor }}/>
            
            <motion.path d="M825 595 V545 H875" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: shouldReduceMotion ? 0.1 : 0.8, delay: 2.5 * delayFactor }}/>
            <motion.circle cx="875" cy="545" r="8" fill="#9be23a" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.2 * delayFactor }}/>
            
            <motion.path d="M828 420 L875 350 V315" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: shouldReduceMotion ? 0.1 : 0.9, delay: 2.1 * delayFactor }}/>
            <motion.circle cx="875" cy="315" r="8" fill="#9be23a" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.9 * delayFactor }}/>
            
            <motion.path d="M815 500 L865 500" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: shouldReduceMotion ? 0.1 : 0.5, delay: 2.7 * delayFactor }}/>
            <motion.circle cx="865" cy="500" r="8" fill="#9be23a" stroke="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.1 * delayFactor }}/>
          </g>

          {/* LAYER 07: central_health_wave */}
          <motion.g 
            id="layer_07_central_health_wave" 
            filter="url(#greenGlow)"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, delay: 3.5 * delayFactor, type: "spring", stiffness: 200 }}
            style={{ transformOrigin: '800px 465px' }}
          >
            <path d="M598 465 H705 L736 465 L760 395 L806 555 L842 437 L872 500 L900 465 H1002" fill="none" stroke="#9be23a" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="598" cy="465" r="16" fill="#bfff55"/>
            <circle cx="1002" cy="465" r="16" fill="#bfff55"/>
          </motion.g>
        </motion.g>

        {/* Signal sending down to O */}
        {!shouldReduceMotion && (
          <motion.circle 
            cx="800" cy="668" r="6" fill="#9be23a" filter="url(#greenGlow)"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: [0, 150] }}
            transition={{ duration: 0.8, delay: 4.2 * delayFactor, ease: "easeIn" }}
          />
        )}

        {/* LAYER 08: wordmark_letters_STATIC_NURS */}
        <motion.g 
          id="layer_08_wordmark_letters_static_nurs"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.5 : 1, delay: 5 * delayFactor, ...transitionBase }}
        >
          {/* Centered around X=800. Letter spacing adjusted for visual balance. */}
          <text x="690" y="900" textAnchor="end" fontSize="128" fontFamily="Montserrat, Arial, sans-serif" fontWeight="800" fill="#082d4b" letterSpacing="14px">NUR</text>
          <text x="910" y="900" textAnchor="start" fontSize="128" fontFamily="Montserrat, Arial, sans-serif" fontWeight="800" fill="#082d4b" letterSpacing="14px">S</text>
        </motion.g>

        {/* LAYER 09: animated_O_outer_ring */}
        <motion.g 
          id="layer_09_animated_O_outer_ring" 
          style={{ transformOrigin: '800px 854px' }}
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.8, delay: 4.8 * delayFactor, type: "spring", bounce: 0.4 }}
        >
          {/* Pulsing ring every 3 seconds after load */}
          <motion.circle 
            cx="800" cy="854" r="70" fill="none" stroke="url(#greenGrad)" strokeWidth="22" strokeLinecap="round"
            animate={{ filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }}
            transition={{ duration: pulseDuration, delay: 7 * delayFactor, repeat: Infinity, repeatDelay: 1.5 }}
          />
        </motion.g>

        {/* LAYER 10: animated_O_ear_icon */}
        <motion.g 
          id="layer_10_animated_O_ear_icon" 
          filter="url(#greenGlow)" 
          style={{ transformOrigin: '800px 854px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 5.2 * delayFactor }}
        >
          <motion.g
            animate={{ scale: shouldReduceMotion ? 1 : [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }}
            transition={{ duration: pulseDuration, delay: 5.5 * delayFactor, repeat: Infinity, repeatDelay: 1.5 }}
          >
            <path d="M795 812 C826 812 844 833 844 860 C844 883 828 893 812 902 C804 906 802 914 802 924" fill="none" stroke="#79bd2b" strokeWidth="11" strokeLinecap="round"/>
            <path d="M796 838 C809 838 817 847 817 860 C817 874 803 878 799 891" fill="none" stroke="#79bd2b" strokeWidth="8" strokeLinecap="round"/>
            <path d="M780 927 V890" stroke="#79bd2b" strokeWidth="8" strokeLinecap="round"/>
          </motion.g>
        </motion.g>

        {/* LAYER 11: O_sound_wave_rings */}
        <motion.g 
          id="layer_11_O_sound_wave_rings" 
          style={{ transformOrigin: '800px 854px' }}
        >
          <motion.circle 
            cx="800" cy="854" r="98" fill="none" stroke="#9be23a" strokeWidth="4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={shouldReduceMotion ? { opacity: 0.3, scale: 1 } : { opacity: [0, 0.55, 0], scale: [0.8, 1.2, 1.5] }}
            transition={{ duration: 2, delay: 5.5 * delayFactor, repeat: shouldReduceMotion ? 0 : Infinity, repeatDelay: 2.5 }}
          />
          <motion.circle 
            cx="800" cy="854" r="124" fill="none" stroke="#9be23a" strokeWidth="3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={shouldReduceMotion ? { opacity: 0.15, scale: 1.1 } : { opacity: [0, 0.30, 0], scale: [0.8, 1.1, 1.4] }}
            transition={{ duration: 2, delay: 5.8 * delayFactor, repeat: shouldReduceMotion ? 0 : Infinity, repeatDelay: 2.5 }}
          />
        </motion.g>

        {/* LAYER 12: tagline */}
        <motion.g 
          id="layer_12_tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 6.5 * delayFactor }}
        >
          {/* Centered under the wordmark */}
          <text x="800" y="1020" textAnchor="middle" fontSize="36" fontFamily="Montserrat, Arial, sans-serif" fontWeight="400" fill="#6f7a82" letterSpacing="18px">VOICE OF HEALTH AI</text>
          {/* Subtle connecting lines extending from the tagline */}
          <line x1="300" y1="1010" x2="400" y2="1010" stroke="#8ac43f" strokeWidth="2" opacity="0.5"/>
          <line x1="1200" y1="1010" x2="1300" y2="1010" stroke="#8ac43f" strokeWidth="2" opacity="0.5"/>
        </motion.g>

      </svg>
    </div>
  );
}
