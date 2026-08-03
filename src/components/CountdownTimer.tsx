import React, { useState, useEffect } from 'react';
import { Calendar, Heart } from 'lucide-react';

interface CountdownTimerProps {
  targetDateISO: string;
  brideName: string;
  groomName: string;
  eventLocationName: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDateISO,
  brideName,
  groomName,
  eventLocationName,
}) => {
  const calculateTimeLeft = (): TimeLeft => {
    const target = new Date(targetDateISO).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isPast: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateISO]);

  // Generate Google Calendar Link
  const handleAddToGoogleCalendar = () => {
    const eventDate = new Date(targetDateISO);
    const endDate = new Date(eventDate.getTime() + 5 * 60 * 60 * 1000); // 5 hours duration

    const formatGCalDate = (date: Date) =>
      date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const title = encodeURIComponent(`Casamento de ${brideName} & ${groomName}`);
    const details = encodeURIComponent(`Celebração de Casamento de ${brideName} e ${groomName}. Esperamos por você!`);
    const location = encodeURIComponent(eventLocationName);
    const dates = `${formatGCalDate(eventDate)}/${formatGCalDate(endDate)}`;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <div className="py-8 px-2 sm:px-8 border-b border-sep">
      <div className="max-w-xl mx-auto text-center">
        <span className="micro-label mb-4 block text-[#8A2E63]">
          Contagem Regressiva
        </span>

        {timeLeft.isPast ? (
          <div className="py-4">
            <p className="font-serif-display text-3xl sm:text-4xl text-[#6B1124] italic font-normal">
              🎉 O grande dia chegou!
            </p>
            <p className="font-serif-title text-lg text-[#4A4A4A] italic mt-2">
              Hoje celebramos o amor de {brideName} &amp; {groomName}!
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1 sm:gap-6 my-4 px-1 max-w-full overflow-hidden">
            <div className="text-center min-w-[44px] sm:min-w-[64px]">
              <span className="text-3xl sm:text-5xl block font-serif-display italic font-semibold text-[#6B1124] leading-none">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="micro-label !text-[8px] sm:!text-[10px] mt-1 block text-[#8A2E63]">
                Dias
              </span>
            </div>

            <span className="text-lg sm:text-2xl font-serif-display italic text-[#8A2E63] select-none -mt-3">:</span>

            <div className="text-center min-w-[44px] sm:min-w-[64px]">
              <span className="text-3xl sm:text-5xl block font-serif-display italic font-semibold text-[#6B1124] leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="micro-label !text-[8px] sm:!text-[10px] mt-1 block text-[#8A2E63]">
                Hrs
              </span>
            </div>

            <span className="text-lg sm:text-2xl font-serif-display italic text-[#8A2E63] select-none -mt-3">:</span>

            <div className="text-center min-w-[44px] sm:min-w-[64px]">
              <span className="text-3xl sm:text-5xl block font-serif-display italic font-semibold text-[#6B1124] leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="micro-label !text-[8px] sm:!text-[10px] mt-1 block text-[#8A2E63]">
                Min
              </span>
            </div>

            <span className="text-lg sm:text-2xl font-serif-display italic text-[#8A2E63] select-none -mt-3">:</span>

            <div className="text-center min-w-[44px] sm:min-w-[64px]">
              <span className="text-3xl sm:text-5xl block font-serif-display italic font-semibold text-[#6B1124] leading-none">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="micro-label !text-[8px] sm:!text-[10px] mt-1 block text-[#8A2E63]">
                Seg
              </span>
            </div>
          </div>
        )}

        <p className="text-sm sm:text-base mt-4 leading-relaxed text-[#4A4A4A] font-serif-title italic max-w-md mx-auto">
          O tempo que nos separa do momento mais especial de nossas vidas.
        </p>

        {/* Add to Calendar Button */}
        <div className="mt-5">
          <button
            onClick={handleAddToGoogleCalendar}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#6B1124] text-[#F8F7F4] font-sans-clean text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-[#7C2338] transition-colors cursor-pointer shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-[#C6C6C8]" />
            Salvar na Google Agenda
          </button>
        </div>
      </div>
    </div>
  );

};
