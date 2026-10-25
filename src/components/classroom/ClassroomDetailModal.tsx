import React from 'react';
import { X, School } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ClassroomSummary, CalculatedRecord, AppSettings } from '../../types';
import { formatEnergy, formatCO2, formatCurrency, formatPercent } from '../../utils/formatters';

interface ClassroomDetailModalProps {
  classroom: string;
  summary: ClassroomSummary | undefined;
  records: CalculatedRecord[];
  settings: AppSettings;
  onClose: () => void;
}

export const ClassroomDetailModal: React.FC<ClassroomDetailModalProps> = ({
  classroom,
  summary,
  records,
  settings,
  onClose,
}) => {
  const roomRecords = records
    .filter((r) => r.classroom === classroom)
    .sort((a, b) => a.day - b.day);

  const chartData = roomRecords.map((r) => ({
    name: `Day ${r.day}`,
    day: r.day,
    energyKWh: Number(r.energyKWh.toFixed(4)),
    fanKWh: Number(r.fanEnergyKWh.toFixed(4)),
    lightKWh: Number(r.lightEnergyKWh.toFixed(4)),
    costINR: Number(r.costINR.toFixed(2)),
    co2Kg: Number(r.co2Kg.toFixed(4)),
    minutes: r.minutes,
  }));

  if (!summary) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  Classroom {classroom} Detailed Audit
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {formatPercent(summary.percentageContribution)} of campus total
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Siddaganga Institute of Technology, Tumakuru • 7-Day Observation Analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top 4 KPI mini cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase block">
                Total Energy Wasted
              </span>
              <span className="text-lg font-extrabold text-emerald-950 mt-1 block">
                {formatEnergy(summary.totalEnergyKWh)}
              </span>
              <span className="text-[10px] text-emerald-700 mt-0.5 block">
                Fan: {formatEnergy(summary.fanEnergyKWh)} | Light: {formatEnergy(summary.lightEnergyKWh)}
              </span>
            </div>

            <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl">
              <span className="text-[11px] font-semibold text-teal-800 uppercase block">
                CO₂ Emissions
              </span>
              <span className="text-lg font-extrabold text-teal-950 mt-1 block">
                {formatCO2(summary.totalCO2Kg)}
              </span>
              <span className="text-[10px] text-teal-700 mt-0.5 block">
                Factor: {settings.emissionFactor} kg/kWh
              </span>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
              <span className="text-[11px] font-semibold text-amber-800 uppercase block">
                Electricity Cost
              </span>
              <span className="text-lg font-extrabold text-amber-950 mt-1 block">
                {formatCurrency(summary.totalCostINR)}
              </span>
              <span className="text-[10px] text-amber-700 mt-0.5 block">
                Tariff: ₹{settings.electricityTariff}/kWh
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-600 uppercase block">
                Unnecessary Runtime
              </span>
              <span className="text-lg font-extrabold text-slate-900 mt-1 block">
                {summary.totalMinutes} min
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Across {summary.totalEvents} recorded events
              </span>
            </div>
          </div>

          {/* Daily Consumption Chart for this Classroom */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Daily Energy Wastage Breakdown (kWh)
            </h4>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: number) => [`${val} kWh`, 'Energy']}
                    labelFormatter={(label) => `${label} - ${classroom}`}
                  />
                  <Bar dataKey="fanKWh" name="Fans (60W)" fill="#166534" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="lightKWh" name="Lights (20W)" fill="#0d9488" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Daily Observation Logs ({roomRecords.length} Days)
              </span>
              <span className="text-[11px] text-slate-500 italic">
                *Simulated classroom event observations
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/75 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5">Day</th>
                    <th className="px-3 py-2.5">Fans ON</th>
                    <th className="px-3 py-2.5">Lights ON</th>
                    <th className="px-3 py-2.5">Duration</th>
                    <th className="px-3 py-2.5">Power (W)</th>
                    <th className="px-3 py-2.5">Energy (kWh)</th>
                    <th className="px-3 py-2.5">CO₂ (kg)</th>
                    <th className="px-3 py-2.5">Cost (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roomRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-medium text-slate-900">Day {r.day}</td>
                      <td className="px-3 py-2 text-slate-700">{r.fans}</td>
                      <td className="px-3 py-2 text-slate-700">{r.lights}</td>
                      <td className="px-3 py-2 text-slate-700">{r.minutes} min</td>
                      <td className="px-3 py-2 text-slate-700">{r.totalPowerW} W</td>
                      <td className="px-3 py-2 font-semibold text-emerald-800">{r.energyKWh.toFixed(4)}</td>
                      <td className="px-3 py-2 text-slate-700">{r.co2Kg.toFixed(4)}</td>
                      <td className="px-3 py-2 font-medium text-slate-800">₹{r.costINR.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
