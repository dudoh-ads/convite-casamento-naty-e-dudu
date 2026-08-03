import React, { useState } from 'react';
import { Gift, Copy, Check, QrCode, HeartHandshake, UtensilsCrossed, Wine, Coffee, Camera, Home } from 'lucide-react';
import { InvitationConfig, VirtualGift } from '../types';
import { defaultVirtualGifts } from '../defaultData';

interface GiftRegistryPIXProps {
  config: InvitationConfig;
}

export const GiftRegistryPIX: React.FC<GiftRegistryPIXProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);
  const [selectedGift, setSelectedGift] = useState<VirtualGift | null>(null);

  const handleCopyPIX = () => {
    navigator.clipboard.writeText(config.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-4 h-4 text-[#8A2E63]" />;
      case 'Wine': return <Wine className="w-4 h-4 text-[#8A2E63]" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-[#8A2E63]" />;
      case 'Camera': return <Camera className="w-4 h-4 text-[#8A2E63]" />;
      case 'Home': return <Home className="w-4 h-4 text-[#8A2E63]" />;
      default: return <Gift className="w-4 h-4 text-[#8A2E63]" />;
    }
  };

  return (
    <div className="py-10 px-4 sm:px-8 border-b border-sep max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <span className="micro-label mb-3 block text-[#8A2E63]">
          Lista de Presentes &amp; Chave PIX
        </span>
        <p className="font-serif-title text-base sm:text-lg italic text-[#4A4A4A] max-w-lg mx-auto leading-relaxed">
          "Sua presença é nosso maior presente! Caso deseje nos homenagear com uma lembrança ou contribuir para a nossa viagem de Lua de Mel, disponibilizamos nossa Chave PIX abaixo."
        </p>
      </div>

      {/* Main PIX Card */}
      <div className="bg-[#5A0F20] text-[#F8F7F4] rounded-2xl p-6 sm:p-8 shadow-xl border border-[#C6C6C8]/40 relative overflow-hidden mb-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Simulated QR Code */}
          <div className="bg-[#F8F7F4] p-3 rounded-xl shadow-md border border-[#C6C6C8]">
            <div className="w-24 h-24 bg-[#6B1124] flex items-center justify-center rounded relative overflow-hidden">
              <QrCode className="w-20 h-20 text-[#F8F7F4]" />
            </div>
            <span className="micro-label !text-[#4A4A4A] block text-center mt-2 !text-[8px]">
              QR Code PIX
            </span>
          </div>

          {/* PIX Key Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <span className="micro-label !text-[#C6C6C8] block">
              Chave PIX ({config.pixKeyType})
            </span>
            <div className="font-mono text-sm sm:text-base font-bold bg-[#3B0813] px-3 py-2 rounded border border-[#C6C6C8]/40 inline-block text-[#F8F7F4] select-all">
              {config.pixKey}
            </div>
            <p className="font-serif-title text-sm italic text-[#C6C6C8]">
              Favorecido: <strong className="font-semibold text-[#F8F7F4]">{config.pixReceiverName}</strong>
            </p>
            <p className="micro-label !text-[#C6C6C8]/80 !text-[9px]">
              Instituição: {config.bankName}
            </p>
          </div>
        </div>

        {/* Copy Button */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <button
            onClick={handleCopyPIX}
            className={`w-full py-3 font-sans-clean text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              copied
                ? 'bg-emerald-700 text-white'
                : 'bg-[#6B1124] text-[#F8F7F4] hover:bg-[#7C2338] border border-[#C6C6C8]/30'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                Chave PIX Copiada com Sucesso!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#C6C6C8]" />
                Copiar Chave PIX
              </>
            )}
          </button>
        </div>
      </div>

      {/* Virtual Gifts Suggestion Cards */}
      <div>
        <span className="micro-label text-center block mb-6 text-[#8A2E63]">
          Cotas de Presente Simbólicas
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {defaultVirtualGifts.map((gift) => (
            <div
              key={gift.id}
              className="bg-[#F8F7F4] border border-sep rounded-xl p-5 hover:border-[#8A2E63] transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-full border border-[#8A2E63]/30 bg-[#F8F7F4]">
                    {getIcon(gift.icon)}
                  </div>
                  <div>
                    <h5 className="font-serif-display text-base italic text-[#6B1124]">
                      {gift.title}
                    </h5>
                    <span className="micro-label !text-[#8A2E63]">
                      R$ {gift.price},00
                    </span>
                  </div>
                </div>
                <p className="font-serif-title text-sm italic text-[#4A4A4A] mb-4 leading-relaxed">
                  {gift.description}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedGift(gift);
                  handleCopyPIX();
                }}
                className="w-full py-2.5 bg-[#6B1124] text-[#F8F7F4] font-sans-clean text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-[#7C2338] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-[#C6C6C8]" />
                Presentear
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

