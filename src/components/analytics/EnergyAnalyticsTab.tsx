import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, School, Zap, Footprints, IndianRupee, PieChart as PieIcon } from 'lucide-react';
import { CalculatedRecord, AppSettings } from '../../types';
import { SimulationBanner } from '../common/SimulationBanner';
import { calculateDailySummaries, calculateClassroomSummaries, calculateOverallSummary } from '../../utils/calculations';
import { formatEnergy, formatCurrency } from '../../utils/formatters';

interface EnergyAnalyticsTabProps {
  records: CalculatedRecord[];
  settings: AppSettings;
  isModified: boolean;
}

const DONUT_COLORS = ['#166534', '#0d9488']; // forest green, teal
const BAR_COLORS = ['#15803d', '#0d9488', '#0284c7', '#d97706'];

export const EnergyAnalyticsTab: React.FC<EnergyAnalyticsTabProps> = ({
  records,
  settings,
  isModified,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('ALL');
  const [selectedDay, setSelectedDay] = useState<string>('ALL');

  // Filter records
  const filteredRecords = records.filter((r) => {
    const roomMatch = selectedRoom === 'ALL' || r.classroom === selectedRoom;
    const dayMatch = selectedDay === 'ALL' || r.day === Number(selectedDay);
    return roomMatch && dayMatch;
  });

  // Calculate dynamic chart datasets from filtered records
  const dailyData = calculateDailySummaries(filteredRecords, 7);
  const classroomData = calculateClassroomSummaries(filteredRecords, settings);
  const overallFiltered = calculateOverallSummary(filteredRecords, settings);

  const availableRooms = Array.from(new Set(records.map((r) => r.classroom))).sort();

  // Donut chart data for Fan vs Light
  const donutData = [
    {
      name: 'Ceiling Fans (60W)',
      value: Number(overallFiltered.totalFansKWh.toFixed(4)),
    },
    {
      name: 'Lights (20W)',
      value: Number(overallFiltered.totalLightsKWh.toFixed(4)),
    },
  ];

  return (
    <div className="space-y-6">
      <SimulationBanner isModified={isModified} />

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Energy & Emissions Analytics
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600">
            Interactive visual charts generated dynamically from monitored classroom observations.
          </p>
        </div>

        {/* Global Chart Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs text-xs">
            <School className="w-3.5 h-3.5 text-slate-400" />
            <label htmlFor="analytics-room" className="font-semibold text-slate-500">
              Classroom:
            </label>
            <select
              id="analytics-room"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Classrooms</option>
              {availableRooms.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <label htmlFor="analytics-day" className="font-semibold text-slate-500">
              Day:
            </label>
            <select
              id="analytics-day"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Day 1 – Day 7</option>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={String(d)}>
                  Day {d} Only
                </option>
              ))}
            </select>
          </div>

          {(selectedRoom !== 'ALL' || selectedDay !== 'ALL') && (
            <button
              onClick={() => {
                setSelectedRoom('ALL');
                setSelectedDay('ALL');
              }}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold underline px-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid of 5 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart A: Daily Energy Wastage (Line Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Chart A • Chronological Trend
              </span>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                Daily Energy Wastage (kWh)
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Total: {formatEnergy(overallFiltered.totalEnergyKWh)}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit=" kWh" />
                <Tooltip
                  formatter={(val: number) => [`${val.toFixed(4)} kWh`, 'Wasted Energy']}
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="energyKWh"
                  name="Energy Wasted (kWh)"
                  stroke="#166534"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  dot={{ r: 4, fill: '#166534' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Classroom Comparison (Bar Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Chart B • Facility Comparison
              </span>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <School className="w-4 h-4 text-teal-600" />
                Classroom-wise Wastage Comparison
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {classroomData.length} Classrooms
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classroomData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="classroom" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit=" kWh" />
                <Tooltip
                  formatter={(val: number) => [`${val.toFixed(4)} kWh`, 'Total Wastage']}
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar
                  dataKey="totalEnergyKWh"
                  name="Total Energy (kWh)"
                  fill="#0d9488"
                  radius={[6, 6, 0, 0]}
                >
                  {classroomData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart C: Fan vs Light Energy Consumption (Donut Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Chart C • Appliance Breakdown
              </span>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-700" />
                Fan vs Light Consumption Share
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              60W Fan / 20W Light
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {donutData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val.toFixed(4)} kWh`, 'Energy Contribution']}
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart D: Daily Carbon Emissions (Area Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Chart D • Carbon Footprint
              </span>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Footprints className="w-4 h-4 text-teal-700" />
                Daily Estimated CO₂ Emissions (kg)
              </h3>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Factor: {settings.emissionFactor} kg/kWh
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit=" kg" />
                <Tooltip
                  formatter={(val: number) => [`${val.toFixed(4)} kg CO₂`, 'Emissions']}
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="co2Kg"
                  name="CO₂ Emissions (kg)"
                  stroke="#0f766e"
                  fillOpacity={1}
                  fill="url(#colorCO2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart E: Daily Electricity Cost (Bar Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Chart E • Financial Cost Analysis
              </span>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-amber-600" />
                Daily Electricity Wastage Cost (₹ INR)
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Total Cost: {formatCurrency(overallFiltered.totalCostINR)} @ ₹{settings.electricityTariff}/unit
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit=" ₹" />
                <Tooltip
                  formatter={(val: number) => [`₹${val.toFixed(2)}`, 'Cost of Wastage']}
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar
                  dataKey="costINR"
                  name="Daily Cost (₹)"
                  fill="#d97706"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
