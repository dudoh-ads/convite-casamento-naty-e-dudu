import React from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { InvitationConfig } from '../types';

interface WaxSealEnvelopeProps {
  config: InvitationConfig;
  isOpen: boolean;
  onOpen: () => void;
}

export const WaxSealEnvelope: React.FC<WaxSealEnvelopeProps> = ({ config, isOpen, onOpen }) => {
  const handleSealClick = () => {
    // Fire celebratory confetti burst from the seal location using palette colors
    confetti({
      particleCount: 75,
      spread: 85,
      origin: { y: 0.55 },
      colors: ['#6B1124', '#7C2338', '#8A2E63', '#A13B74', '#C6C6C8', '#F8F7F4'],
    });

    onOpen();
  };

  if (isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A060E]/95 backdrop-blur-md p-4 overflow-hidden">
      {/* Background ambient editorial glow */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5A0F20] via-[#3B0813] to-[#2A060E]" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.05, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md aspect-[3/4.6] max-h-[88vh] rounded-2xl shadow-2xl bg-dark-editorial border border-[#C6C6C8]/30 flex flex-col justify-between overflow-hidden text-center select-none"
      >
        {/* Silver vertical ribbon strip */}
        <div className="absolute top-0 bottom-0 left-[88%] w-[5px] bg-silver-metallic opacity-90 shadow-md z-0" />
        <div className="absolute top-0 bottom-0 left-[88.8%] w-[1px] bg-white opacity-80 z-0" />

        {/* Top Header - Couple Monogram / Names */}
        <div className="relative z-10 pt-10 px-8">
          <p className="micro-label !text-[#C6C6C8] mb-3">
            Convite de Casamento
          </p>
          <h1 className="font-serif-display text-3xl sm:text-4xl text-[#F8F7F4] italic font-normal tracking-wide">
            {config.brideName}
          </h1>
          <p className="font-serif-title text-2xl text-[#A13B74] italic my-0.5">&amp;</p>
          <h1 className="font-serif-display text-3xl sm:text-4xl text-[#F8F7F4] italic font-normal tracking-wide">
            {config.groomName}
          </h1>
        </div>

        {/* Middle Section - Elegant Orchid floral watermark */}
        <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">
          {/* Decorative floral watermark SVG */}
          <div className="w-24 h-24 opacity-40 mb-2">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#A13B74]">
              <path d="M50 20C45 35 25 35 25 50C25 65 40 75 50 90C60 75 75 65 75 50C75 35 55 35 50 20Z" fill="currentColor" fillOpacity="0.3"/>
              <circle cx="50" cy="50" r="12" fill="#8A2E63" fillOpacity="0.6"/>
              <path d="M50 10C55 25 80 30 85 45C90 60 75 75 50 80C25 75 10 60 15 45C20 30 45 25 50 10Z" stroke="#C6C6C8" strokeWidth="0.8" strokeOpacity="0.8"/>
            </svg>
          </div>

          {/* Interactive Burgundy Wax Seal Button */}
          <div className="relative mt-2">
            <button
              onClick={handleSealClick}
              className="group relative z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-seal-burgundy border-2 border-[#C6C6C8]/80 shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 animate-pulse-seal"
              aria-label="Abrir convite de casamento"
            >
              {/* Outer metallic ring border */}
              <div className="absolute inset-1 rounded-full border border-[#C6C6C8]/40 pointer-events-none" />
              <div className="absolute inset-2 rounded-full border border-white/30 pointer-events-none" />

              {/* Inner seal wax emblem crest */}
              <div className="flex flex-col items-center justify-center text-[#F8F7F4]">
                <div className="font-serif-display text-xl sm:text-2xl italic font-bold tracking-tight text-[#F8F7F4] group-hover:scale-105 transition-transform">
                  {config.brideName.charAt(0)}&amp;{config.groomName.charAt(0)}
                </div>
                <div className="w-8 h-[1px] bg-[#C6C6C8] my-0.5 opacity-60"></div>
                <div className="text-[9px] font-sans-clean font-bold uppercase tracking-[0.2em] text-[#C6C6C8]">
                  ABRIR
                </div>
              </div>
            </button>
          </div>

          {/* Instruction text with glowing pulse */}
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-6 flex flex-col items-center gap-1.5"
          >
            <p className="micro-label !text-[#C6C6C8]">
              Clique no selo para abrir
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-[#A13B74] animate-ping" />
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 pb-8 px-6">
          <p className="font-serif-title text-base italic text-[#C6C6C8]">
            {config.eventDateText}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

