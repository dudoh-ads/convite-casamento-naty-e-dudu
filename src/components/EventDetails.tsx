import React from 'react';
import { Calendar, Clock, MapPin, Navigation, CheckCircle2 } from 'lucide-react';
import { InvitationConfig } from '../types';

interface EventDetailsProps {
  config: InvitationConfig;
  onOpenRSVP: () => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ config, onOpenRSVP }) => {
  return (
    <div className="py-10 px-4 sm:px-8 border-b border-sep space-y-10">
      {/* Date & Time Section */}
      <div className="max-w-xl mx-auto text-center">
        <span className="micro-label mb-3 block text-[#8A2E63]">
          Data &amp; Horário
        </span>

        <div className="flex flex-col items-center justify-center gap-4 my-3">
          <div className="text-center">
            <span className="font-serif-display text-3xl sm:text-4xl italic text-[#6B1124] block tracking-wide font-normal">
              {config.eventDateText}
            </span>
          </div>

          <div className="hidden sm:block w-[1px] h-8 bg-sep" />

          <div className="text-center flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#8A2E63]" />
            <span className="font-serif-title text-2xl sm:text-3xl italic text-[#5A0F20] block">
              {config.eventTimeText}
            </span>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="max-w-xl mx-auto text-center pt-8 border-t border-sep/60">
        <span className="micro-label mb-3 block text-[#8A2E63]">
          Local da Cerimônia &amp; Recepção
        </span>

        <h4 className="font-serif-display text-3xl sm:text-4xl italic text-[#6B1124] my-2">
          {config.eventLocationName}
        </h4>

        <p className="font-serif-title text-lg sm:text-xl italic text-[#4A4A4A] max-w-md mx-auto mb-6 leading-relaxed">
          {config.eventAddress}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={config.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#6B1124] text-[#F8F7F4] font-sans-clean text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-[#7C2338] transition-colors shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5 text-[#C6C6C8]" />
            Como Chegar (Maps)
          </a>

          <button
            onClick={onOpenRSVP}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-[#6B1124] text-[#6B1124] font-sans-clean text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-[#6B1124] hover:text-[#F8F7F4] transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#8A2E63]" />
            Confirmar Presença
          </button>
        </div>
      </div>
    </div>
  );
};

