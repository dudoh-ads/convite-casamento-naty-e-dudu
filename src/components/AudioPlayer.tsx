import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioPlayerProps {
  customMusicUrl?: string;
  autoPlayTriggered?: boolean;
}

// Helper to transform common cloud storage sharing links into direct audio stream URLs
const formatAudioUrl = (url?: string): string => {
  if (!url) return '';
  const cleaned = url.trim();

  // Convert Google Drive view/share URLs to direct download stream URLs
  if (cleaned.includes('drive.google.com')) {
    const fileIdMatch = cleaned.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || cleaned.match(/id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://docs.google.com/uc?export=download&id=${fileIdMatch[1]}`;
    }
  }

  // Convert Dropbox share links to raw direct stream URLs
  if (cleaned.includes('dropbox.com')) {
    return cleaned.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '?raw=1');
  }

  return cleaned;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ customMusicUrl, autoPlayTriggered }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorIntervalRef = useRef<number | null>(null);

  // Initialize or update HTML5 audio element
  useEffect(() => {
    const directUrl = formatAudioUrl(customMusicUrl);
    if (directUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(directUrl);
        audioRef.current.loop = true;
      } else {
        audioRef.current.src = directUrl;
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, [customMusicUrl]);

  // Synthesize ambient melody as fallback
  const startSyntheticMelody = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 392.00, 293.66];
      let noteIndex = 0;

      const playNextNote = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;

        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.type = 'sine';
        const freq = notes[noteIndex % notes.length];
        osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);

        gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, audioCtxRef.current.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 2.2);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 2.3);

        noteIndex++;
      };

      playNextNote();
      oscillatorIntervalRef.current = window.setInterval(playNextNote, 2200);
      setIsPlaying(true);
    } catch (e) {
      console.error("Erro ao reproduzir áudio sintético:", e);
    }
  };

  const stopSyntheticMelody = () => {
    if (oscillatorIntervalRef.current) {
      clearInterval(oscillatorIntervalRef.current);
      oscillatorIntervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }
    setIsPlaying(false);
  };

  const playAudio = () => {
    if (audioRef.current && customMusicUrl && customMusicUrl.trim() !== '') {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Audio play error:", err);
        });
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    stopSyntheticMelody();
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  useEffect(() => {
    if (autoPlayTriggered && !isPlaying && customMusicUrl && customMusicUrl.trim() !== '') {
      playAudio();
    }
  }, [autoPlayTriggered, customMusicUrl]);

  if (!customMusicUrl || customMusicUrl.trim() === '') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      <button
        onClick={toggleSound}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#5A0F20]/90 text-[#F8F7F4] border border-[#C6C6C8]/40 shadow-xl backdrop-blur-md hover:bg-[#6B1124] transition-all transform hover:scale-105 active:scale-95 text-xs font-semibold tracking-wider uppercase cursor-pointer"
        title={isPlaying ? "Pausar música de fundo" : "Tocar música de fundo"}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-[#A13B74] animate-pulse" />
            <span className="hidden sm:inline font-sans-clean font-medium text-[#F8F7F4]">Música Ativa 🎵</span>
            <span className="flex gap-1 items-end h-3 ml-1">
              <span className="w-1 bg-[#A13B74] h-2 animate-bounce"></span>
              <span className="w-1 bg-[#C6C6C8] h-3 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1 bg-[#A13B74] h-1.5 animate-bounce [animation-delay:0.4s]"></span>
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-[#C6C6C8]" />
            <span className="font-sans-clean font-medium text-[#F8F7F4]">Música 🎵</span>
          </>
        )}
      </button>
    </div>
  );
};

