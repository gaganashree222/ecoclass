import React from 'react';
import { Info, Sparkles } from 'lucide-react';

interface SimulationBannerProps {
  isModified?: boolean;
}

export const SimulationBanner: React.FC<SimulationBannerProps> = ({ isModified = false }) => {
  return (
    <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 sm:p-4 mb-6 text-amber-900 shadow-sm transition-all">
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700 flex-shrink-0 mt-0.5">
          {isModified ? <Sparkles className="w-5 h-5" /> : <Info className="w-5 h-5" />}
        </div>
        <div className="flex-1 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold tracking-wide uppercase text-amber-800 text-[11px] sm:text-xs bg-amber-200/70 px-2 py-0.5 rounded">
              ABL Academic Prototype Notice
            </span>
            <span className="font-semibold text-amber-950">
              SIMULATED DATA FOR ABL DEMONSTRATION
            </span>
          </div>
          <p className="mt-1 text-amber-800/90 leading-relaxed">
            All observation logs and appliance operating hours represent a simulated 7-day model at 
            <strong> Siddaganga Institute of Technology (SIT), Tumakuru</strong> for Activity-Based Learning (ABL) pedagogical demonstration. 
            These are not certified institutional sensor measurements. Calculations demonstrate the methodology of converting unnecessary appliance runtime into electrical wastage, carbon dioxide emissions, and operational cost savings.
          </p>
        </div>
      </div>
    </div>
  );
};
