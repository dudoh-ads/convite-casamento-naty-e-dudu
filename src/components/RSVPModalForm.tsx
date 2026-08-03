import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Users, Phone, MessageSquare, Sparkles, Send, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';
import { InvitationConfig, RSVP } from '../types';
import { submitRSVP } from '../services/storage';

interface RSVPModalFormProps {
  config: InvitationConfig;
  isOpen: boolean;
  onClose: () => void;
  onSuccessRSVP?: (rsvp: RSVP) => void;
}

export const RSVPModalForm: React.FC<RSVPModalFormProps> = ({
  config,
  isOpen,
  onClose,
  onSuccessRSVP,
}) => {
  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState<'confirmed' | 'declined'>('confirmed');
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [companionNames, setCompanionNames] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRSVP, setSubmittedRSVP] = useState<RSVP | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmitting(true);

    try {
      const createdRsvp = await submitRSVP({
        guestName,
        attending,
        adultsCount,
        childrenCount,
        companionNames,
        phone,
        message,
        webhookUrl: config.googleSheetsWebhookUrl,
      });

      setSubmittedRSVP(createdRsvp);

      if (attending === 'confirmed') {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#6B1124', '#7C2338', '#8A2E63', '#A13B74', '#C6C6C8'],
        });
      }

      if (onSuccessRSVP) {
        onSuccessRSVP(createdRsvp);
      }
    } catch (err) {
      console.error('Erro ao enviar RSVP:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedRSVP(null);
    setGuestName('');
    setPhone('');
    setMessage('');
    setCompanionNames('');
    setAdultsCount(1);
    setChildrenCount(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A060E]/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#F8F7F4] text-[#4A4A4A] rounded-2xl shadow-2xl border border-sep overflow-hidden my-6">
        {/* Header Bar */}
        <div className="bg-[#6B1124] text-[#F8F7F4] p-5 flex items-center justify-between border-b border-[#C6C6C8]/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C6C6C8]" />
            <h3 className="micro-label !text-[#F8F7F4]">
              Confirmação de Presença
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#C6C6C8] hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {submittedRSVP ? (
            /* Success confirmation screen / Voucher */
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full border border-[#8A2E63] flex items-center justify-center mx-auto text-[#6B1124]">
                <Ticket className="w-7 h-7 text-[#8A2E63]" />
              </div>

              <div>
                <h4 className="font-serif-display text-2xl sm:text-3xl italic text-[#6B1124]">
                  {submittedRSVP.attending === 'confirmed'
                    ? 'Presença Confirmada!'
                    : 'Agradecemos a Resposta!'}
                </h4>
                <p className="font-serif-title text-sm italic text-[#4A4A4A] mt-1">
                  {config.confirmDeadlineText}
                </p>
              </div>

              {/* Confirmation Voucher Card */}
              <div className="bg-[#F8F7F4] border border-sep rounded-xl p-5 text-left font-serif-title text-sm italic space-y-2.5 text-[#4A4A4A]">
                <div className="flex justify-between border-b border-sep pb-2">
                  <span className="micro-label !text-[#8A2E63]">Convidado Principal:</span>
                  <span className="font-semibold text-[#6B1124]">{submittedRSVP.guestName}</span>
                </div>
                <div className="flex justify-between border-b border-sep pb-2">
                  <span className="micro-label !text-[#8A2E63]">Status:</span>
                  <span className={`font-semibold ${submittedRSVP.attending === 'confirmed' ? 'text-emerald-700' : 'text-stone-600'}`}>
                    {submittedRSVP.attending === 'confirmed' ? 'CONFIRMADO ✅' : 'NÃO PODERÁ IR ❌'}
                  </span>
                </div>
                {submittedRSVP.attending === 'confirmed' && (
                  <>
                    <div className="flex justify-between border-b border-sep pb-2">
                      <span className="micro-label !text-[#8A2E63]">Adultos:</span>
                      <span>{submittedRSVP.adultsCount}</span>
                    </div>
                    <div className="flex justify-between border-b border-sep pb-2">
                      <span className="micro-label !text-[#8A2E63]">Crianças:</span>
                      <span>{submittedRSVP.childrenCount}</span>
                    </div>
                    {submittedRSVP.companionNames && (
                      <div className="flex justify-between border-b border-sep pb-2">
                        <span className="micro-label !text-[#8A2E63]">Acompanhantes:</span>
                        <span>{submittedRSVP.companionNames}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="pt-2 micro-label !text-[8px] !text-[#8A2E63] text-center">
                  Código de Registro: {submittedRSVP.id}
                </div>
              </div>

              <button
                onClick={handleResetForm}
                className="w-full py-3.5 bg-[#6B1124] text-[#F8F7F4] font-sans-clean text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#7C2338] transition-colors cursor-pointer"
              >
                Concluir
              </button>
            </div>
          ) : (
            /* RSVP Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="font-serif-title text-base italic text-[#4A4A4A] text-center mb-2">
                "{config.confirmDeadlineText}"
              </p>

              {/* Attendance Toggle */}
              <div>
                <label className="micro-label block mb-2 text-[#8A2E63]">
                  Sua Presença *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending('confirmed')}
                    className={`flex items-center justify-center gap-2 p-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      attending === 'confirmed'
                        ? 'bg-[#6B1124] text-[#F8F7F4] border border-[#6B1124]'
                        : 'bg-transparent text-[#6B1124] border border-sep hover:border-[#6B1124]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C6C6C8]" />
                    Vou Comemorar
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttending('declined')}
                    className={`flex items-center justify-center gap-2 p-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      attending === 'declined'
                        ? 'bg-[#6B1124] text-[#F8F7F4] border border-[#6B1124]'
                        : 'bg-transparent text-[#4A4A4A] border border-sep hover:border-[#6B1124]'
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-[#C6C6C8]" />
                    Não Poderei Ir
                  </button>
                </div>
              </div>

              {/* Guest Full Name */}
              <div>
                <label className="micro-label block mb-1 text-[#8A2E63]">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ex: Helena & Gabriel Silva"
                  className="w-full bg-transparent border-b border-[#6B1124]/30 py-2 font-serif-title text-base italic text-[#4A4A4A] focus:outline-none focus:border-[#6B1124] transition-colors"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="micro-label block mb-1 text-[#8A2E63]">
                  WhatsApp / Telefone para Contato
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-transparent border-b border-[#6B1124]/30 py-2 font-serif-title text-base italic text-[#4A4A4A] focus:outline-none focus:border-[#6B1124] transition-colors"
                />
              </div>

              {/* Companion Counts if Confirmed */}
              {attending === 'confirmed' && (
                <div className="space-y-4 p-5 border border-sep rounded-xl bg-[#F8F7F4]">
                  <div className="flex items-center gap-2 text-[#6B1124]">
                    <Users className="w-3.5 h-3.5 text-[#8A2E63]" />
                    <span className="micro-label text-[#8A2E63]">Acompanhantes</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="micro-label block mb-1 !text-[9px] text-[#8A2E63]">
                        Adultos
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={adultsCount}
                        onChange={(e) => setAdultsCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-transparent border-b border-[#6B1124]/30 py-1.5 font-serif-title text-lg italic text-[#6B1124] text-center focus:outline-none focus:border-[#6B1124]"
                      />
                    </div>

                    <div>
                      <label className="micro-label block mb-1 !text-[9px] text-[#8A2E63]">
                        Crianças (até 10 anos)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-transparent border-b border-[#6B1124]/30 py-1.5 font-serif-title text-lg italic text-[#6B1124] text-center focus:outline-none focus:border-[#6B1124]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="micro-label block mb-1 !text-[9px] text-[#8A2E63]">
                      Nome dos Acompanhantes
                    </label>
                    <input
                      type="text"
                      value={companionNames}
                      onChange={(e) => setCompanionNames(e.target.value)}
                      placeholder="Ex: Pedro, Sofia"
                      className="w-full bg-transparent border-b border-[#6B1124]/30 py-1.5 font-serif-title text-sm italic text-[#4A4A4A] focus:outline-none focus:border-[#6B1124]"
                    />
                  </div>
                </div>
              )}

              {/* Optional Message */}
              <div>
                <label className="micro-label block mb-1 text-[#8A2E63]">
                  Recado / Restrição Alimentar (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ex: Sou vegetariano / Mal podemos esperar!"
                  className="w-full bg-transparent border-b border-[#6B1124]/30 py-2 font-serif-title text-sm italic text-[#4A4A4A] focus:outline-none focus:border-[#6B1124] transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !guestName.trim()}
                className="w-full py-4 bg-[#6B1124] text-[#F8F7F4] font-sans-clean text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#7C2338] transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4 shadow-md"
              >
                {isSubmitting ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#C6C6C8]" />
                    Enviar Confirmação
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

