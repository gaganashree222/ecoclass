import React, { useState } from 'react';
import {
  Zap,
  Footprints,
  IndianRupee,
  ShieldCheck,
  AlertCircle,
  CheckSquare,
  Users,
  BellRing,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { OverallSummary, AppSettings } from '../../types';
import { SimulationBanner } from '../common/SimulationBanner';
import { formatEnergy, formatCO2, formatCurrency, formatPercent } from '../../utils/formatters';

interface SolutionSimulatorTabProps {
  summary: OverallSummary;
  settings: AppSettings;
  onUpdateInterventionPercent: (percent: number) => void;
  isModified: boolean;
}

export const SolutionSimulatorTab: React.FC<SolutionSimulatorTabProps> = ({
  summary,
  settings,
  onUpdateInterventionPercent,
  isModified,
}) => {
  const [sliderVal, setSliderVal] = useState<number>(settings.interventionReductionPercent);

  const handleSliderChange = (newVal: number) => {
    setSliderVal(newVal);
    onUpdateInterventionPercent(newVal);
  };

  // Dynamic calculations based on slider:
  // energySaved = baselineEnergy * reductionPercent / 100;
  // remainingEnergy = baselineEnergy - energySaved;
  // co2Avoided = energySaved * settings.emissionFactor;
  // moneySaved = energySaved * settings.electricityTariff;
  const baselineEnergy = summary.totalEnergyKWh;
  const energySaved = (baselineEnergy * sliderVal) / 100;
  const remainingEnergy = Math.max(0, baselineEnergy - energySaved);

  const baselineCO2 = baselineEnergy * settings.emissionFactor;
  const co2Avoided = energySaved * settings.emissionFactor;
  const remainingCO2 = remainingEnergy * settings.emissionFactor;

  const baselineCost = baselineEnergy * settings.electricityTariff;
  const moneySaved = energySaved * settings.electricityTariff;
  const remainingCost = remainingEnergy * settings.electricityTariff;

  // Comparison chart data
  const comparisonData = [
    {
      metric: 'Energy (kWh)',
      Baseline: Number(baselineEnergy.toFixed(4)),
      Remaining: Number(remainingEnergy.toFixed(4)),
      Saved: Number(energySaved.toFixed(4)),
    },
    {
      metric: 'CO₂ (kg)',
      Baseline: Number(baselineCO2.toFixed(4)),
      Remaining: Number(remainingCO2.toFixed(4)),
      Saved: Number(co2Avoided.toFixed(4)),
    },
    {
      metric: 'Cost (₹/10)',
      Baseline: Number((baselineCost / 10).toFixed(2)),
      Remaining: Number((remainingCost / 10).toFixed(2)),
      Saved: Number((moneySaved / 10).toFixed(2)),
    },
  ];

  const presets = [25, 40, 60, 75, 90];

  return (
    <div className="space-y-6">
      <SimulationBanner isModified={isModified} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What If We Reduce Wastage? (Intervention Simulator)
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600">
            Model the tangible conservation benefits of behavioral switch-off interventions in empty SIT classrooms.
          </p>
        </div>
      </div>

      {/* Interactive Slider Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Interactive Control
              </span>
              <span className="text-xs text-slate-500">
                Default: 60% Target
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Estimated reduction in unnecessary ON-time
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Drag the slider below to simulate hypothetical compliance levels achieved through campus reminder notices, student ambassadors, and end-of-class switch audits.
            </p>
          </div>

          <div className="flex items-baseline gap-2 bg-emerald-50 border border-emerald-200 px-5 py-3 rounded-2xl">
            <span className="text-4xl font-extrabold text-emerald-800">{sliderVal}%</span>
            <span className="text-xs font-semibold text-emerald-700">Reduction</span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="mt-8 space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={sliderVal}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 focus:outline-hidden"
          />

          <div className="flex justify-between text-xs text-slate-500 font-medium px-1">
            <span>0% (No Action)</span>
            <span>25%</span>
            <span>50%</span>
            <span className="text-emerald-700 font-bold">60% (Default Baseline Target)</span>
            <span>75%</span>
            <span>100% (Zero Wastage)</span>
          </div>

          {/* Preset Buttons */}
          <div className="pt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => handleSliderChange(p)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  sliderVal === p
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {p}% {p === 60 ? '(Default)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Mandatory Academic Disclaimer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-3 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 text-xs text-slate-700">
          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-amber-900">Academic Modeling Note:</strong>{' '}
            <em>
              “This simulation estimates potential savings if unnecessary operating time is reduced by the selected percentage. It is not a measurement of actual intervention effectiveness.”
            </em>{' '}
            The 60% default assumption is an illustrative hypothetical target for college ABL analysis, not an automatically proven empirical fact.
          </div>
        </div>
      </div>

      {/* Six Real-Time Updated Simulation KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Energy Saved */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Energy Saved
            </span>
            <span className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-emerald-900">
              {formatEnergy(energySaved)}
            </span>
          </div>
          <p className="text-xs text-emerald-700 mt-2 font-medium">
            {formatPercent(sliderVal)} reduction of baseline {formatEnergy(baselineEnergy)}
          </p>
        </div>

        {/* 2. Remaining Energy */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Remaining Energy Wastage
            </span>
            <span className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-800">
              {formatEnergy(remainingEnergy)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Remaining uneliminated electrical wastage
          </p>
        </div>

        {/* 3. CO2 Avoided */}
        <div className="bg-white rounded-2xl border border-teal-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              CO₂ Emissions Avoided
            </span>
            <span className="p-2 bg-teal-100 rounded-lg text-teal-800">
              <Footprints className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-teal-900">
              {formatCO2(co2Avoided)}
            </span>
          </div>
          <p className="text-xs text-teal-700 mt-2 font-medium">
            At {settings.emissionFactor} kg CO₂ / kWh grid factor
          </p>
        </div>

        {/* 4. Remaining Emissions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Remaining Emissions
            </span>
            <span className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <Footprints className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-800">
              {formatCO2(remainingCO2)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Residual Scope 2 indirect carbon footprint
          </p>
        </div>

        {/* 5. Money Saved */}
        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Estimated Money Saved
            </span>
            <span className="p-2 bg-amber-100 rounded-lg text-amber-800">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-amber-900">
              {formatCurrency(moneySaved)}
            </span>
          </div>
          <p className="text-xs text-amber-700 mt-2 font-medium">
            Based on ₹{settings.electricityTariff} / kWh electricity tariff
          </p>
        </div>

        {/* 6. Remaining Cost */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Remaining Electricity Cost
            </span>
            <span className="p-2 bg-slate-100 rounded-lg text-slate-600">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-800">
              {formatCurrency(remainingCost)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Remaining monetary expenditure on wastage
          </p>
        </div>
      </div>

      {/* Before vs After Comparison Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Comparative Impact
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Before & After Intervention Comparison
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-3 rounded-xs bg-slate-400" /> Baseline
            </span>
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-3 h-3 rounded-xs bg-emerald-600" /> Modeled Post-Intervention
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="metric" tick={{ fontSize: 12, fill: '#475569' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                formatter={(val: number, name: string) => [`${val}`, name]}
                contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="Baseline" name="Baseline (No Intervention)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Remaining" name="Post-Intervention Level" fill="#166534" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Saved" name="Avoided / Saved Portion" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Practical Campus Intervention Pillars */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          Proposed Low-Cost Behavioral Intervention Framework at SIT Tumakuru
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">1. Student Class Stewards</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Designate 2 student volunteer energy monitors per classroom batch to flick off switches upon lecture dismissal before departing for practical labs.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
              <BellRing className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">2. Exit Switch Reminder Signs</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Affix high-contrast visual nudge stickers right above door-side switchboards: <em>“Last to leave? Turn fans & lights OFF!”</em>
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">3. Custodial Sweep Protocol</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provide floor staff with a standardized 10-minute turnaround inspection card to de-energize empty wings between alternating class slots.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
