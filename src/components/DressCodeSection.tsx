import React from 'react';
import { Shirt, Info } from 'lucide-react';
import { InvitationConfig } from '../types';

interface DressCodeSectionProps {
  config: InvitationConfig;
}

export const DressCodeSection: React.FC<DressCodeSectionProps> = ({ config }) => {
  return (
    <div className="py-10 px-4 sm:px-8 border-b border-sep">
      <div className="max-w-xl mx-auto text-center">
        <span className="micro-label mb-3 block text-[#8A2E63]">
          {config.dressCodeTitle}
        </span>

        <p className="font-serif-title text-base sm:text-lg italic text-[#4A4A4A] leading-relaxed mb-6">
          {config.dressCodeDescription}
        </p>

        {/* Dress code guidelines & forbidden color notes */}
        <div className="p-6 border border-sep rounded-xl bg-[#F8F7F4] shadow-xs">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Info className="w-3.5 h-3.5 text-[#6B1124]" />
            <span className="micro-label !text-[#6B1124]">
              Atenção aos Tons Reservados
            </span>
          </div>
          <p className="font-serif-title text-sm italic text-[#4A4A4A]">
            "{config.forbiddenColorsText}"
          </p>

          {/* Color Chips */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            {config.forbiddenColorHexes.map((hex, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div
                  className="w-7 h-7 rounded-full border border-[#C6C6C8] shadow-xs relative flex items-center justify-center"
                  style={{ backgroundColor: hex }}
                >
                  <span className="w-full h-[1px] bg-[#000000]/60 rotate-45 absolute" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

