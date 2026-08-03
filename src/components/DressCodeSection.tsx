import React from 'react';
import { Info } from 'lucide-react';
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

        <p className="font-serif-title text-lg sm:text-xl italic text-[#4A4A4A] leading-relaxed mb-6">
          {config.dressCodeDescription}
        </p>

      </div>
    </div>
  );
};

