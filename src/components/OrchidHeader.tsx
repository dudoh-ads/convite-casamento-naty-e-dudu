import React from 'react';
import { InvitationConfig } from '../types';

interface OrchidHeaderProps {
  config: InvitationConfig;
}

export const OrchidHeader: React.FC<OrchidHeaderProps> = ({ config }) => {
  return (
    <div className="relative text-center pt-12 px-4 sm:px-8 border-b border-sep">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] text-[180px] sm:text-[260px] font-serif-display select-none pointer-events-none z-0 text-[#6B1124]">
        {config.brideName.charAt(0)}&amp;{config.groomName.charAt(0)}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto my-6">
        <span className="micro-label block mb-6 tracking-[0.25em] text-[#8A2E63]">
          {config.subtitle || "Convidamos para o Casamento de"}
        </span>

        <h1 className="font-serif-display text-5xl sm:text-7xl md:text-8xl italic font-normal text-[#6B1124] leading-[0.95] tracking-tight my-6">
          {config.brideName} <br className="hidden sm:inline" />
          <span className="text-[#8A2E63] font-serif-title italic font-light sm:mx-2">&amp;</span>
          <br className="hidden sm:inline" /> {config.groomName}
        </h1>

        <div className="mt-10 flex items-center justify-center space-x-6">
          <div className="w-16 sm:w-24 h-px bg-[#6B1124] opacity-20"></div>
          <span className="font-serif-title text-2xl sm:text-3xl italic text-[#5A0F20]">
            {config.eventTimeText}
          </span>
          <div className="w-16 sm:w-24 h-px bg-[#6B1124] opacity-20"></div>
        </div>

        {config.quote && (
          <div className="mt-10 max-w-lg mx-auto pt-8 border-t border-sep/50">
            <p className="font-serif-title text-lg sm:text-xl italic text-[#4A4A4A] leading-relaxed">
              "{config.quote}"
            </p>
            {config.quoteReference && (
              <p className="micro-label mt-2 text-[#8A2E63]">
                — {config.quoteReference}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


