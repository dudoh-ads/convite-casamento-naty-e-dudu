import React from 'react';
import { InvitationConfig } from '../types';

interface OrchidHeaderProps {
  config: InvitationConfig;
}

export const OrchidHeader: React.FC<OrchidHeaderProps> = ({ config }) => {
  return (
    <div className="relative text-center pt-8 pb-8 px-4 sm:px-8 border-b border-sep">
      {/* Top Editorial Metadata Row */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start w-full gap-4 mb-8 pb-6 border-b border-sep/60">
        <div className="flex flex-col text-center sm:text-left">
          <span className="micro-label text-[#8A2E63]">Local do Evento</span>
          <span className="font-serif-title text-base sm:text-lg italic text-[#6B1124]">
            {config.eventLocationName}
          </span>
        </div>

        {/* Orchid flower vector graphics element */}
        <div className="w-20 h-10 my-1 sm:my-0 opacity-90">
          <svg viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g transform="translate(150, 60)">
              <ellipse cx="0" cy="-25" rx="14" ry="24" fill="#8A2E63" transform="rotate(-15)" />
              <ellipse cx="0" cy="-25" rx="14" ry="24" fill="#A13B74" transform="rotate(15)" />
              <ellipse cx="-25" cy="5" rx="15" ry="22" fill="#6B1124" transform="rotate(-60)" />
              <ellipse cx="25" cy="5" rx="15" ry="22" fill="#6B1124" transform="rotate(60)" />
              <ellipse cx="0" cy="22" rx="16" ry="25" fill="#7C2338" />
              <circle cx="0" cy="0" r="7" fill="#F8F7F4" />
            </g>
            <path d="M40 70 Q 90 40 150 55 T 250 40" stroke="#C6C6C8" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
        </div>

        <div className="flex flex-col text-center sm:text-right">
          <span className="micro-label text-[#8A2E63]">A Data Escolhida</span>
          <span className="font-serif-title text-base sm:text-lg italic text-[#6B1124]">
            {config.eventDateText}
          </span>
        </div>
      </div>

      {/* Subtle background monogram watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] text-[180px] sm:text-[260px] font-serif-display select-none pointer-events-none z-0 text-[#6B1124]">
        {config.brideName.charAt(0)}&amp;{config.groomName.charAt(0)}
      </div>

      {/* Main Editorial Header Content */}
      <div className="relative z-10 max-w-2xl mx-auto my-4">
        <span className="micro-label block mb-4 tracking-[0.25em] text-[#8A2E63]">
          {config.subtitle || "Convidamos para o Casamento de"}
        </span>

        {/* Big Editorial Title */}
        <h1 className="font-serif-display text-5xl sm:text-7xl md:text-8xl italic font-normal text-[#6B1124] leading-[0.95] tracking-tight my-4">
          {config.brideName} <br className="hidden sm:inline" />
          <span className="text-[#8A2E63] font-serif-title italic font-light sm:mx-2">&amp;</span>
          <br className="hidden sm:inline" /> {config.groomName}
        </h1>

        {/* Time Divider */}
        <div className="mt-8 flex items-center justify-center space-x-6">
          <div className="w-16 sm:w-24 h-px bg-[#6B1124] opacity-20"></div>
          <span className="font-serif-title text-xl sm:text-2xl italic text-[#5A0F20]">
            {config.eventTimeText}
          </span>
          <div className="w-16 sm:w-24 h-px bg-[#6B1124] opacity-20"></div>
        </div>

        {/* Verse / Quote */}
        {config.quote && (
          <div className="mt-8 max-w-lg mx-auto pt-6 border-t border-sep/50">
            <p className="font-serif-title text-base sm:text-lg italic text-[#4A4A4A] leading-relaxed">
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


