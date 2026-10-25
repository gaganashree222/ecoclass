import React from 'react';
import { Leaf, Calendar, FileText, Menu, X, Sparkles, School } from 'lucide-react';
import { Badge } from '../common/Badge';

interface HeaderProps {
  institutionName: string;
  isModified: boolean;
  onOpenReport: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  institutionName,
  isModified,
  onOpenReport,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-500/20">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                    Eco<span className="text-emerald-700">Class</span>
                  </span>
                  <span className="hidden sm:inline-block text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                    ABL Prototype
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <School className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-medium text-slate-700 truncate max-w-[170px] sm:max-w-xs" title={institutionName}>
                    SIT Tumakuru
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Monitoring Period, Status Pill, Export Report Button */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Reporting Period */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200/60">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Reporting: Day 1 – Day 7</span>
            </div>

            {/* Data Status Indicator */}
            <div className="flex items-center">
              {isModified ? (
                <Badge variant="amber" className="shadow-xs">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>User-Modified Data</span>
                </Badge>
              ) : (
                <Badge variant="green" className="shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Simulated Dataset</span>
                </Badge>
              )}
            </div>

            {/* Export Report CTA */}
            <button
              type="button"
              onClick={onOpenReport}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 shadow-sm hover:shadow transition-all transform active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Generate ABL Report</span>
              <span className="sm:hidden">Report</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
