import React from 'react';
import { getAssetUrl } from '../utils/assets';

interface CouplePhotoSectionProps {
  photoUrl: string;
  brideName: string;
  groomName: string;
}

export const CouplePhotoSection: React.FC<CouplePhotoSectionProps> = ({
  photoUrl,
  brideName,
  groomName,
}) => {
  return (
    <div className="py-12 px-4 sm:px-8 border-b border-sep">
      <div className="max-w-2xl mx-auto">
        <div className="relative group">
          {/* Elegant Frame Container */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#6B1124]/30 bg-white">
            {/* Photo with subtle zoom on hover */}
            <div className="relative overflow-hidden aspect-[4/5] sm:aspect-[3/4]"  
                style={{
                    backgroundImage: photoUrl ? `url('${photoUrl}')` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>

              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#6B1124]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Decorative corner accents */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#8A2E63] opacity-60" />
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#8A2E63] opacity-60" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#8A2E63] opacity-60" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#8A2E63] opacity-60" />
        </div>

        {/* Caption below photo */}
        <div className="mt-8 text-center">
          <p className="font-serif-display text-xl sm:text-2xl italic text-[#6B1124] tracking-wide">
            {brideName} <span className="text-[#8A2E63]">&</span> {groomName}
          </p>
          <p className="font-serif-title text-sm italic text-[#4A4A4A] mt-2">
            Prontos para celebrar este momento especial com vocês
          </p>
        </div>
      </div>
    </div>
  );
};
