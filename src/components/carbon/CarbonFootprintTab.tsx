import React, { useState } from 'react';
import {
  Edit3,
  Check,
  RotateCcw,
  AlertTriangle,
  Factory,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { OverallSummary, ClassroomSummary, DailySummary, AppSettings } from '../../types';
import { SimulationBanner } from '../common/SimulationBanner';
import { formatEnergy, formatCO2 } from '../../utils/formatters';

interface CarbonFootprintTabProps {
  summary: OverallSummary;
  classrooms: ClassroomSummary[];
  dailySummaries: DailySummary[];
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  isModified: boolean;
}

export const CarbonFootprintTab: React.FC<CarbonFootprintTabProps> = ({
  summary,
  classrooms,
  dailySummaries,
  settings,
  onUpdateSettings,
  isModified,
}) => {
  const [editingFactor, setEditingFactor] = useState(false);
  const [tempFactor, setTempFactor] = useState(settings.emissionFactor.toString());
  const [factorError, setFactorError] = useState('');

  const handleSaveFactor = () => {
    const val = parseFloat(tempFactor);
    if (isNaN(val) || val <= 0 || val > 3.0) {
      setFactorError('Please enter a valid factor between 0.05 and 3.00 kg CO₂/kWh');
      return;
    }
    setFactorError('');
    onUpdateSettings({ emissionFactor: val });
    setEditingFactor(false);
  };

  const handleResetFactor = () => {
    setTempFactor('0.710');
    setFactorError('');
    onUpdateSettings({ emissionFactor: 0.710 });
    setEditingFactor(false);
  };

  return (
    <div className="space-y-6">
      <SimulationBanner isModified={isModified} />

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Classroom Carbon Footprint Analysis
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600">
            Quantifying Scope 2 indirect carbon dioxide emissions attributable to grid electricity wastage.
          </p>
        </div>
      </div>

      {/* Formula & Emission Factor Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Fundamental Emission Equation
              </span>
            </div>

            <div className="p-4 bg-slate-900 text-emerald-300 font-mono text-sm sm:text-base rounded-xl border border-slate-800 shadow-inner overflow-x-auto">
              CO₂ Emissions (kg) = Energy Consumption (kWh) × Grid Emission Factor (kg CO₂/kWh)
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In this study, operating electrical loads in unoccupied rooms does not produce direct exhaust emissions on campus. 
              Instead, it creates <strong>Scope 2 indirect greenhouse gas emissions</strong> generated off-site at regional thermal and grid generation plants that supply power to SIT Tumakuru.
            </p>
          </div>

          {/* Editable Factor Panel */}
          <div className="w-full lg:w-80 bg-slate-50 border border-slate-200 rounded-xl p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-teal-600" />
                Grid Emission Factor
              </span>
              {!editingFactor && (
                <button
                  onClick={() => {
                    setTempFactor(settings.emissionFactor.toString());
                    setEditingFactor(true);
                  }}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              )}
            </div>

            {editingFactor ? (
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.001"
                    min="0.01"
                    max="2.5"
                    value={tempFactor}
                    onChange={(e) => setTempFactor(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">kg/kWh</span>
                </div>
                {factorError && <p className="text-xs text-red-600">{factorError}</p>}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleSaveFactor}
                    className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" /> Save
                  </button>
                  <button
                    onClick={handleResetFactor}
                    className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1"
                    title="Reset to 0.710"
                  >
                    <RotateCcw className="w-3 h-3" /> Default
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {settings.emissionFactor.toFixed(3)}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">kg CO₂/kWh</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Baseline model input for Indian regional grid average.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CEA Baseline Notice Box */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-3 text-xs text-slate-600 bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-amber-900">Academic Verification Notice:</strong> The grid emission factor should always be checked against official published databases, such as the 
            <strong> Central Electricity Authority (CEA) CO₂ Baseline Database for the Indian Power Sector</strong>. 
            Indian grid factors typically range between ~0.70 to 0.82 kg CO₂/kWh depending on regional coal versus hydro/solar penetration. 
            <em> Fans and luminaires consume electric current and emit zero direct tailpipe gases.</em>
          </div>
        </div>
      </div>

      {/* Emissions Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Carbon Footprint
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatCO2(summary.totalCO2Kg)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Generated by {formatEnergy(summary.totalEnergyKWh)} wasted energy over 7 days.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Average Daily Emissions
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatCO2(summary.totalCO2Kg / (summary.monitoringDaysCount || 1))}
            </span>
            <span className="text-xs font-semibold text-slate-500">/ day</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Across 4 monitored classrooms at SIT Tumakuru.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Potential Avoided Emissions
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-800">
              {formatCO2(summary.potentialCO2AvoidedKg)}
            </span>
          </div>
          <p className="text-xs text-emerald-700 mt-2 font-medium">
            Achieved at {settings.interventionReductionPercent}% intervention reduction target.
          </p>
        </div>
      </div>

      {/* Classroom-wise & Daily Emissions Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classroom-wise Emissions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Facility Breakdown
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Classroom-wise CO₂ Emissions (kg)
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              C101 – C104
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classrooms} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="classroom" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit=" kg" />
                <Tooltip
                  formatter={(val: number) => [`${val.toFixed(4)} kg CO₂`, 'Emissions']}
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="totalCO2Kg" name="Estimated CO₂ (kg)" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Emissions Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Chronological Trend
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Daily Carbon Emissions Progression (kg)
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySummaries} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="carbonGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#166534" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit=" kg" />
                <Tooltip
                  formatter={(val: number) => [`${val.toFixed(4)} kg CO₂`, 'Daily Emissions']}
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                />
                <Area
                  type="monotone"
                  dataKey="co2Kg"
                  name="CO₂ (kg)"
                  stroke="#166534"
                  fillOpacity={1}
                  fill="url(#carbonGreen)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
