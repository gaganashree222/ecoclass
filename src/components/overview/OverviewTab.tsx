import React from 'react';
import {
  Zap,
  Footprints,
  IndianRupee,
  School,
  CalendarDays,
  TrendingDown,
  ArrowRight,
  Fan,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { OverallSummary, ClassroomSummary, DailySummary, ActiveTab, AppSettings } from '../../types';
import { KpiCard } from '../common/KpiCard';
import { SimulationBanner } from '../common/SimulationBanner';
import { formatEnergy, formatCO2, formatCurrency, formatPercent } from '../../utils/formatters';

interface OverviewTabProps {
  summary: OverallSummary;
  classrooms: ClassroomSummary[];
  dailySummaries: DailySummary[];
  settings: AppSettings;
  setActiveTab: (tab: ActiveTab) => void;
  isModified: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  summary,
  classrooms,
  dailySummaries,
  settings,
  setActiveTab,
  isModified,
}) => {
  // Identify highest consumer classroom
  const highestRoom = classrooms.length > 0
    ? [...classrooms].sort((a, b) => b.totalEnergyKWh - a.totalEnergyKWh)[0]
    : null;

  // Identify peak day
  const peakDay = dailySummaries.length > 0
    ? [...dailySummaries].sort((a, b) => b.energyKWh - a.energyKWh)[0]
    : null;

  const fanPercentage = summary.totalEnergyKWh > 0 
    ? (summary.totalFansKWh / summary.totalEnergyKWh) * 100 
    : 0;
  const lightPercentage = summary.totalEnergyKWh > 0 
    ? (summary.totalLightsKWh / summary.totalEnergyKWh) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Simulation Banner */}
      <SimulationBanner isModified={isModified} />

      {/* Top Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Classroom Energy & Carbon Footprint Dashboard
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600">
            Understand electricity wastage and explore practical ways to reduce campus emissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Test Intervention Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Six Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <KpiCard
          title="Total Energy Wasted"
          value={summary.totalEnergyKWh.toFixed(3)}
          unit="kWh"
          subtitle="Sum of unnecessary fan & light runtimes"
          icon={Zap}
          variant="forest"
          badgeText="Baseline (7 Days)"
        />
        <KpiCard
          title="Estimated CO₂ Emissions"
          value={summary.totalCO2Kg.toFixed(3)}
          unit="kg"
          subtitle={`Grid factor: ${settings.emissionFactor} kg CO₂/kWh`}
          icon={Footprints}
          variant="teal"
          badgeText="Scope 2 Grid"
        />
        <KpiCard
          title="Estimated Electricity Cost"
          value={`₹${summary.totalCostINR.toFixed(2)}`}
          unit=""
          subtitle={`Institutional tariff: ₹${settings.electricityTariff} / kWh`}
          icon={IndianRupee}
          variant="amber"
          badgeText="Financial Impact"
        />
        <KpiCard
          title="Classrooms Monitored"
          value={String(summary.monitoredClassroomsCount)}
          unit="Rooms"
          subtitle="C101, C102, C103, C104 sampled"
          icon={School}
          variant="slate"
          badgeText="ABL Sample"
        />
        <KpiCard
          title="Monitoring Period"
          value={String(summary.monitoringDaysCount)}
          unit="Days"
          subtitle="Continuous observation window"
          icon={CalendarDays}
          variant="slate"
          badgeText="Day 1 – Day 7"
        />
        <KpiCard
          title="Potential Energy Savings"
          value={summary.potentialEnergySavedKWh.toFixed(3)}
          unit="kWh"
          subtitle={`Modeled at ${settings.interventionReductionPercent}% intervention reduction`}
          icon={TrendingDown}
          variant="emerald"
          badgeText={`Save ₹${summary.potentialMoneySavedINR.toFixed(2)}`}
        />
      </div>

      {/* Quick Analytical Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appliance Contribution Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Appliance Energy Contribution
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Ratings: 60W / 20W
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              Fans vs. Lights Wastage Share
            </h3>

            {/* Split Visual Progress */}
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Fan className="w-4 h-4 text-emerald-700" /> Ceiling Fans (60W)
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatEnergy(summary.totalFansKWh)} ({formatPercent(fanPercentage)})
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${fanPercentage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Lightbulb className="w-4 h-4 text-teal-600" /> Fluorescent/LED Lights (20W)
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatEnergy(summary.totalLightsKWh)} ({formatPercent(lightPercentage)})
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${lightPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Fans account for {formatPercent(fanPercentage)} of all wasted energy</span>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
            >
              View Donut Chart <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Highest Wastage Classroom Highlight */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Priority Classroom Alert
              </span>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                High Consumption
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              {highestRoom ? `Classroom ${highestRoom.classroom}` : 'Classrooms Analysed'}
            </h3>
            {highestRoom && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Energy Wasted:</span>
                  <span className="font-bold text-emerald-800">
                    {formatEnergy(highestRoom.totalEnergyKWh)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Campus Wastage Share:</span>
                  <span className="font-bold text-slate-800">
                    {formatPercent(highestRoom.percentageContribution)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated CO₂ Footprint:</span>
                  <span className="font-bold text-slate-800">
                    {formatCO2(highestRoom.totalCO2Kg)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Cost:</span>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(highestRoom.totalCostINR)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Room {highestRoom?.classroom} has greatest saving potential</span>
            <button
              onClick={() => setActiveTab('classroom')}
              className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
            >
              Explore Rooms <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Peak Day & Intervention Potential */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Weekly Pattern & Peak Day
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                7-Day Trend
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              {peakDay ? `${peakDay.dayLabel} Recorded Highest Wastage` : 'Daily Trend'}
            </h3>
            {peakDay && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Peak Day Consumption:</span>
                  <span className="font-bold text-amber-700">
                    {formatEnergy(peakDay.energyKWh)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Average Daily Wastage:</span>
                  <span className="font-bold text-slate-800">
                    {formatEnergy(summary.avgDailyEnergyKWh)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Modeled Reduction Target:</span>
                  <span className="font-bold text-emerald-700">
                    {settings.interventionReductionPercent}% (Save {formatEnergy(summary.potentialEnergySavedKWh)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Emissions Avoided:</span>
                  <span className="font-bold text-emerald-700">
                    {formatCO2(summary.potentialCO2AvoidedKg)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Targeting reminder signage reduces peaks</span>
            <button
              onClick={() => setActiveTab('simulator')}
              className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
            >
              Adjust Simulator <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Academic Problem & Proposed Solution Summary Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-800/80 text-emerald-200 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                SIT Tumakuru ABL Problem Statement
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Unattended Fans and Lights in Vacant Academic Classrooms
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              When lecture hours conclude, fans and luminaires frequently remain energized in unoccupied halls for 15 to 35 minutes before routine custodial inspection. This project models this simulated baseline across 4 classrooms over 7 days ({summary.totalEnergyKWh.toFixed(3)} kWh wasted) and proves how simple, zero-cost behavioral nudges (student monitor roles & switch reminders) can eliminate over 60% of this energy footprint.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setActiveTab('about')}
              className="px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              Read Project Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
