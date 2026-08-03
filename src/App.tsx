import React, { useState } from 'react';
import { Heart, CheckCircle2, Sparkles } from 'lucide-react';
import { defaultInvitationConfig } from './defaultData';
import { WaxSealEnvelope } from './components/WaxSealEnvelope';
import { OrchidHeader } from './components/OrchidHeader';
import { CouplePhotoSection } from './components/CouplePhotoSection';
import { CountdownTimer } from './components/CountdownTimer';
import { EventDetails } from './components/EventDetails';
import { DressCodeSection } from './components/DressCodeSection';
import { GiftRegistryPIX } from './components/GiftRegistryPIX';
import { GuestBook } from './components/GuestBook';
import { RSVPModalForm } from './components/RSVPModalForm';

// Toda a configuração do convite (nomes, data, local, textos, PIX etc.)
// vem de src/invitation.config.json — edite esse arquivo para personalizar.
const config = defaultInvitationConfig;

export default function App() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#1F070C] text-[#4A4A4A] font-sans-clean relative overflow-x-hidden pb-16 selection:bg-[#6B1124] selection:text-[#F8F7F4]">
      {/* Background ambient gradient glow */}
      <div className="fixed inset-0 opacity-80 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3B0A14] via-[#1F070C] to-[#120306]" />

      {/* Envelope Wax Seal Overlay */}
      <WaxSealEnvelope
        config={config}
        isOpen={isEnvelopeOpen}
        onOpen={handleOpenEnvelope}
      />

      {/* Main Container Wrapper */}
      <div className="transition-all duration-500 py-6 px-3 sm:px-6 relative z-10 max-w-3xl mx-auto">
        <div className="bg-[#F8F7F4] text-[#4A4A4A] rounded-2xl shadow-2xl border border-[#C6C6C8]/40 overflow-hidden relative">

          {/* Subtle Top Accent Border */}
          <div className="h-1.5 bg-[#6B1124]" />

          {/* Re-open envelope button if closed/tested */}
          {isEnvelopeOpen && (
            <div className="absolute top-3 left-3 z-30">
              <button
                onClick={() => setIsEnvelopeOpen(false)}
                className="px-3 py-1 rounded-full bg-[#6B1124]/90 text-[#F8F7F4] text-[10px] uppercase tracking-widest border border-[#C6C6C8]/40 hover:bg-[#7C2338] cursor-pointer shadow-sm transition-colors"
              >
                ✉️ Ver Capa
              </button>
            </div>
          )}

          {/* 1. Header with Orchids, Verse & Names */}
          <OrchidHeader config={config} />

          {/* 1.5 Couple Photo Section */}
          {config.couplePhotoUrl && (
            <CouplePhotoSection
              photoUrl={config.couplePhotoUrl}
              brideName={config.brideName}
              groomName={config.groomName}
            />
          )}

          {/* 2. Countdown Timer */}
          <CountdownTimer
            targetDateISO={config.countdownTargetDate}
            brideName={config.brideName}
            groomName={config.groomName}
            eventLocationName={config.eventLocationName}
          />

          {/* 3. Date, Time & Venue Details */}
          <EventDetails
            config={config}
            onOpenRSVP={() => setIsRSVPModalOpen(true)}
          />

          {/* 4. Dress Code & Palette Section */}
          <DressCodeSection config={config} />

          {/* 5. Main Action RSVP Callout Banner */}
          <div className="my-10 px-4 max-w-xl mx-auto text-center">
            <div className="bg-[#6B1124] rounded-2xl p-8 text-[#F8F7F4] shadow-2xl border border-[#C6C6C8]/30 relative overflow-hidden">
              <div className="flex items-center justify-center gap-2 mb-3 text-[#C6C6C8]">
                <Sparkles className="w-4 h-4" />
                <h4 className="micro-label !text-[#C6C6C8]">
                  Confirmação de Presença
                </h4>
              </div>
              <p className="font-serif-title text-base sm:text-xl italic text-[#F8F7F4]/90 mb-6 font-light">
                "{config.confirmDeadlineText}"
              </p>
              <button
                onClick={() => setIsRSVPModalOpen(true)}
                className="px-8 py-3.5 rounded-none bg-[#F8F7F4] text-[#6B1124] font-sans-clean text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#C6C6C8] transition-all active:scale-95 shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#6B1124]" />
                Enviar Confirmação
              </button>
            </div>
          </div>

          {/* 6. Gift Registry & PIX Key */}
          <GiftRegistryPIX config={config} />

          {/* 7. Guestbook Wall */}
          <GuestBook webhookUrl={config.googleSheetsWebhookUrl} />

          {/* Footer */}
          <footer className="py-10 text-center border-t border-sep bg-[#F8F7F4] px-4">
            <div className="flex justify-center items-center gap-2 text-[#6B1124] mb-3">
              <Heart className="w-3.5 h-3.5 fill-[#8A2E63] text-[#8A2E63]" />
              <span className="font-serif-display text-lg font-normal uppercase tracking-[0.15em] text-[#6B1124]">
                {config.brideName} <span className="text-[#8A2E63]">&amp;</span> {config.groomName}
              </span>
              <Heart className="w-3.5 h-3.5 fill-[#8A2E63] text-[#8A2E63]" />
            </div>
            <p className="font-serif-title text-sm italic text-[#4A4A4A]">
              Com amor, mal podemos esperar para celebrar esse dia especial com você!
            </p>
            <p className="micro-label mt-6 !text-[9px] !text-[#8A2E63]">
              Convite Virtual Editorial Interativo
            </p>
          </footer>
        </div>
      </div>

      {/* RSVP Confirmation Modal Form */}
      <RSVPModalForm
        config={config}
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
      />
    </div>
  );
}
