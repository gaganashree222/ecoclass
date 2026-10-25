import React from 'react';
import { School, Fan, Lightbulb, Zap, Footprints, IndianRupee, PieChart, ArrowUpRight } from 'lucide-react';
import { ClassroomSummary } from '../../types';
import { formatEnergy, formatCO2, formatCurrency, formatPercent } from '../../utils/formatters';

interface ClassroomCardProps {
  summary: ClassroomSummary;
  onClick: () => void;
  isSelected?: boolean;
}

export const ClassroomCard: React.FC<ClassroomCardProps> = ({
  summary,
  onClick,
  isSelected = false,
}) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`bg-white rounded-2xl border transition-all duration-200 p-5 shadow-sm hover:shadow-md cursor-pointer text-left relative overflow-hidden group ${
        isSelected
          ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
          : 'border-slate-200/90 hover:border-emerald-300'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <School className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Classroom
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
              {summary.classroom}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <PieChart className="w-3 h-3 text-emerald-600" />
            {formatPercent(summary.percentageContribution)}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Wastage Share</p>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="mt-4 space-y-3">
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              Total Energy Wasted:
            </span>
            <span className="text-base font-extrabold text-slate-900">
              {formatEnergy(summary.totalEnergyKWh)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
            <div>
              <span className="text-[11px] text-slate-400 block">Fan Wastage:</span>
              <span className="font-semibold text-emerald-900">{formatEnergy(summary.fanEnergyKWh)}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Light Wastage:</span>
              <span className="font-semibold text-teal-800">{formatEnergy(summary.lightEnergyKWh)}</span>
            </div>
          </div>
        </div>

        {/* Environmental & Financial Impact */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 flex items-center gap-1 text-[11px]">
              <Footprints className="w-3 h-3 text-teal-600" />
              CO₂ Footprint:
            </span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {formatCO2(summary.totalCO2Kg)}
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 flex items-center gap-1 text-[11px]">
              <IndianRupee className="w-3 h-3 text-amber-600" />
              Electricity Cost:
            </span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {formatCurrency(summary.totalCostINR)}
            </span>
          </div>
        </div>

        {/* Appliance Counts */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1" title="Sum of fans recorded across events">
              <Fan className="w-3.5 h-3.5 text-slate-400" />
              <strong className="text-slate-700">{summary.totalFansOn}</strong> fans logged
            </span>
            <span className="inline-flex items-center gap-1" title="Sum of lights recorded across events">
              <Lightbulb className="w-3.5 h-3.5 text-slate-400" />
              <strong className="text-slate-700">{summary.totalLightsOn}</strong> lights logged
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
            Details <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Note about event counts */}
      <div className="mt-3 text-[10px] text-slate-400 italic">
        *Logged sums across {summary.totalEvents} events ({summary.totalMinutes} total minutes). Does not imply unique physical fixtures.
      </div>
    </div>
  );
};
