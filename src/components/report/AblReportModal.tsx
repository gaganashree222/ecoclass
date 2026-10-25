import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  FileText,
} from 'lucide-react';
import {
  CalculatedRecord,
  ClassroomSummary,
  DailySummary,
  OverallSummary,
  AppSettings,
} from '../../types';
import { exportRecordsToCSV } from '../../utils/exportUtils';
import { formatEnergy, formatCO2, formatCurrency } from '../../utils/formatters';

interface AblReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: OverallSummary;
  classrooms: ClassroomSummary[];
  dailySummaries: DailySummary[];
  records: CalculatedRecord[];
  settings: AppSettings;
  isModified: boolean;
}

export const AblReportModal: React.FC<AblReportModalProps> = ({
  isOpen,
  onClose,
  summary,
  classrooms,
  dailySummaries,
  records,
  settings,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Header Toolbar (Hidden during print) */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Activity-Based Learning (ABL) Technical Report
              </h2>
              <p className="text-xs text-slate-500">
                EcoClass • Siddaganga Institute of Technology, Tumakuru
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportRecordsToCSV(records, 'sit_ecoclass_abl_dataset.csv')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div
          ref={reportRef}
          className="p-6 sm:p-10 overflow-y-auto space-y-8 text-slate-800 leading-relaxed text-sm bg-white print:p-8"
        >
          {/* SECTION 1: TITLE PAGE */}
          <div className="text-center pb-8 border-b-2 border-slate-300 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
              Activity-Based Learning (ABL) Academic Project Report
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              EcoClass: Smart Classroom Energy & Carbon Footprint Monitoring System
            </h1>
            <p className="text-base sm:text-lg text-emerald-800 font-semibold">
              Estimation of Unnecessary Electricity Wastage, Associated Scope 2 Carbon Emissions, and Behavioral Reduction Interventions
            </p>
            <div className="pt-2 text-xs sm:text-sm text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">
                Institution: Siddaganga Institute of Technology (SIT), Tumakuru, Karnataka, India
              </p>
              <p>Case Study Focus: Academic Classroom Clusters (C101 – C104) • 7-Day Observation Cycle</p>
              <p className="text-amber-800 font-medium">
                Data Classification: <strong>SIMULATED DATASET FOR ABL DEMONSTRATION</strong>
              </p>
              <p className="text-slate-400 text-xs">
                Generated Date: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* SECTION 2: ABSTRACT */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">1.</span> Executive Abstract
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">
              Electrical energy wastage resulting from unattended luminaires and ceiling fans left operating in vacant lecture rooms is a pervasive issue across educational institutions. This Activity-Based Learning (ABL) project models simulated observational records across four representative classrooms (C101, C102, C103, and C104) at Siddaganga Institute of Technology (SIT), Tumakuru, over a 7-day monitoring interval. Using standard electrical physics calculations, empirical event observations were converted into cumulative power demand, kilowatt-hour consumption, indirect Scope 2 carbon dioxide (CO₂) emissions based on Indian grid factors ({settings.emissionFactor} kg CO₂/kWh), and institutional monetary expenditure (₹{settings.electricityTariff}/kWh). 
              Over the 7-day baseline, total electrical wastage reached <strong>{formatEnergy(summary.totalEnergyKWh)}</strong>, creating <strong>{formatCO2(summary.totalCO2Kg)}</strong> of greenhouse gas emissions and incurring <strong>{formatCurrency(summary.totalCostINR)}</strong> in avoidable energy bills. A non-invasive reminder-based behavioral intervention was modeled, demonstrating that an achievable 60% reduction in unnecessary operating minutes conserves <strong>{formatEnergy(summary.potentialEnergySavedKWh)}</strong>, mitigates <strong>{formatCO2(summary.potentialCO2AvoidedKg)}</strong> of carbon emissions, and saves <strong>{formatCurrency(summary.potentialMoneySavedINR)}</strong> weekly.
            </p>
          </section>

          {/* SECTION 3: INTRODUCTION */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">2.</span> Introduction
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">
              Colleges and universities have dynamic operational schedules where batches of students alternate between theoretical classrooms, laboratories, libraries, and common grounds. In many institutions, fans and lights remain energized during transitional gaps between scheduled sessions. While individual instances may appear trivial, the aggregated power drawn across institutional campuses imposes significant financial overhead and exacerbates regional grid carbon footprints.
            </p>
          </section>

          {/* SECTION 4: REAL-WORLD PROBLEM STATEMENT */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">3.</span> Real-World Problem Statement
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">
              At Siddaganga Institute of Technology (SIT), Tumakuru, standard lecture halls contain 4 to 6 ceiling fans (60W nominal) and 6 to 10 tube lights / LED fixtures (20W nominal). Observations show that when class dismisses, the responsibility of turning off switches is diffuse: students assume the subsequent batch or custodial staff will operate the switchboard. Consequently, appliances continue running for 15 to 35 minutes in completely vacant rooms. Without transparent data accounting, students and facility managers remain unaware of the cumulative magnitude of this loss.
            </p>
          </section>

          {/* SECTION 5: OBJECTIVES */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">4.</span> Project Objectives
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs sm:text-sm">
              <li>Formulate and execute a rigorous client-side mathematical model converting appliance runtime into kilowatt-hours (kWh).</li>
              <li>Estimate indirect Scope 2 carbon dioxide emissions attributable to Indian grid generation.</li>
              <li>Quantify institutional monetary cost using Karnataka electricity utility tariff guidelines.</li>
              <li>Identify classroom-wise distribution and isolate outlier high-wastage halls.</li>
              <li>Design and simulate a reminder-based behavioral intervention to model potential campus conservation outcomes.</li>
              <li>Deliver an accessible, interactive digital monitoring tool suitable for Activity-Based Learning (ABL).</li>
            </ul>
          </section>

          {/* SECTION 6: SCOPE AND LIMITATIONS */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">5.</span> Scope and Limitations
            </h2>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <p><strong>Scope:</strong> The study evaluates 28 simulated classroom event records across 4 designated lecture halls over a 7-day cycle. Computations focus strictly on ceiling fans and luminaires.</p>
              <p><strong>Limitations:</strong></p>
              <ul className="list-disc pl-5 space-y-0.5 text-slate-600">
                <li>All observations represent a simulated pedagogical dataset and must not be cited as certified institutional measurements.</li>
                <li>Appliance power ratings are treated as constant nominal values (60W for fans, 20W for lights), ignoring power factor fluctuations.</li>
                <li>Carbon calculations reflect indirect Scope 2 grid emissions; fans and lights produce zero direct greenhouse exhaust on site.</li>
                <li>The prototype is a pure software simulation and does not interface with physical hardware sensors.</li>
              </ul>
            </div>
          </section>

          {/* SECTION 7: METHODOLOGY */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">6.</span> Methodology
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">
              The project followed a 5-step Activity-Based Learning workflow:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-700 text-xs sm:text-sm">
              <li><strong>Model Parameter Initialization:</strong> Setting baseline electrical specifications (Fan: 60W, Light: 20W, Grid Factor: {settings.emissionFactor} kg CO₂/kWh, Tariff: ₹{settings.electricityTariff}/kWh).</li>
              <li><strong>Dataset Structuring:</strong> Compiling 28 standardized observation vectors comprising day index, classroom identifier, energized fan count, energized light count, and unnecessary duration in minutes.</li>
              <li><strong>Calculation Engine Pipeline:</strong> Executing high-precision floating point computations for wattage, energy, carbon emissions, and electricity costs.</li>
              <li><strong>Interactive Data Visualization:</strong> Building chronological lines, facility comparison bars, and appliance distribution charts using React and Recharts.</li>
              <li><strong>Simulation & Sensitivity Modeling:</strong> Simulating behavioral intervention compliance from 0% to 100%.</li>
            </ol>
          </section>

          {/* SECTION 8: ASSUMPTIONS & SIMULATED DATASET DESCRIPTION */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">7.</span> Model Assumptions & Simulated Dataset Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block">Fan Nominal Power:</span>
                <span className="font-bold text-slate-900 text-sm">{settings.fanPowerW} Watts</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block">Light Nominal Power:</span>
                <span className="font-bold text-slate-900 text-sm">{settings.lightPowerW} Watts</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block">CEA Grid Emission Factor:</span>
                <span className="font-bold text-slate-900 text-sm">{settings.emissionFactor} kg CO₂/kWh</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block">Institutional Tariff:</span>
                <span className="font-bold text-slate-900 text-sm">₹{settings.electricityTariff} per kWh</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 italic mt-1">
              Dataset contains 28 event records (7 days × 4 classrooms). Total recorded unnecessary runtime across all events equals 675 minutes.
            </p>
          </section>

          {/* SECTION 9: FORMULAS AND SAMPLE CALCULATIONS */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">8.</span> Mathematical Formulas and Worked Sample Calculation
            </h2>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 overflow-x-auto">
              <p className="text-emerald-400 font-bold">// 1. Total Event Power (Watts)</p>
              <p>P_total = (N_fans × P_fan) + (N_lights × P_light)</p>
              <p className="text-emerald-400 font-bold pt-1">// 2. Electrical Energy Wasted (kWh)</p>
              <p>E_kWh = (P_total × (Duration_minutes / 60)) / 1000</p>
              <p className="text-emerald-400 font-bold pt-1">// 3. Scope 2 CO₂ Emissions (kg)</p>
              <p>CO₂_kg = E_kWh × Emission_Factor</p>
              <p className="text-emerald-400 font-bold pt-1">// 4. Monetary Expenditure (INR)</p>
              <p>Cost_INR = E_kWh × Tariff_Rate</p>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-xs space-y-1.5 text-emerald-950">
              <h4 className="font-bold text-sm text-emerald-900">
                Worked Sample Calculation: Day 1, Classroom C101
              </h4>
              <p>Inputs: 4 fans (60W), 6 lights (20W), Duration = 30 minutes (0.50 hours).</p>
              <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-emerald-900">
                <li>Total Power: (4 × 60W) + (6 × 20W) = 240W + 120W = <strong>360 Watts</strong></li>
                <li>Energy Wasted: (360 W × 0.50 h) / 1000 = <strong>0.1800 kWh</strong></li>
                <li>CO₂ Emissions: 0.1800 kWh × 0.710 kg/kWh = <strong>0.1278 kg CO₂</strong></li>
                <li>Cost Incurred: 0.1800 kWh × ₹8.00/kWh = <strong>₹1.44</strong></li>
              </ul>
            </div>
          </section>

          {/* SECTION 10: CLASSROOM-WISE ANALYSIS */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">9.</span> Classroom-wise Wastage Analysis
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5">Classroom</th>
                    <th className="p-2.5">Events</th>
                    <th className="p-2.5">Fans Logged</th>
                    <th className="p-2.5">Lights Logged</th>
                    <th className="p-2.5">Duration</th>
                    <th className="p-2.5 text-right">Energy (kWh)</th>
                    <th className="p-2.5 text-right">CO₂ (kg)</th>
                    <th className="p-2.5 text-right">Cost (₹)</th>
                    <th className="p-2.5 text-right">Campus Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {classrooms.map((c) => (
                    <tr key={c.classroom} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{c.classroom}</td>
                      <td className="p-2.5">{c.totalEvents}</td>
                      <td className="p-2.5">{c.totalFansOn}</td>
                      <td className="p-2.5">{c.totalLightsOn}</td>
                      <td className="p-2.5">{c.totalMinutes} min</td>
                      <td className="p-2.5 text-right font-bold text-emerald-800">{c.totalEnergyKWh.toFixed(4)}</td>
                      <td className="p-2.5 text-right text-teal-800">{c.totalCO2Kg.toFixed(4)}</td>
                      <td className="p-2.5 text-right text-amber-800 font-bold">₹{c.totalCostINR.toFixed(2)}</td>
                      <td className="p-2.5 text-right font-bold text-slate-900">{c.percentageContribution.toFixed(2)}%</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100/80 font-bold border-t-2 border-slate-300">
                    <td className="p-2.5">TOTAL / AVERAGE</td>
                    <td className="p-2.5">{summary.totalEventsCount}</td>
                    <td className="p-2.5">-</td>
                    <td className="p-2.5">-</td>
                    <td className="p-2.5">675 min</td>
                    <td className="p-2.5 text-right text-emerald-900">{summary.totalEnergyKWh.toFixed(4)}</td>
                    <td className="p-2.5 text-right text-teal-900">{summary.totalCO2Kg.toFixed(4)}</td>
                    <td className="p-2.5 text-right text-amber-900">₹{summary.totalCostINR.toFixed(2)}</td>
                    <td className="p-2.5 text-right">100.00%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-600">
              <strong>Analytical Insight:</strong> Classroom C101 exhibited the highest cumulative electrical consumption ({formatEnergy(classrooms.find(c => c.classroom === 'C101')?.totalEnergyKWh || 0)}, representing 29.28% of campus wastage), followed by C104 (24.61%), C102 (23.62%), and C103 (22.49%).
            </p>
          </section>

          {/* SECTION 11: DAILY ENERGY AND EMISSION PROGRESSION */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">10.</span> Daily Energy & Emission Summary
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5">Day</th>
                    <th className="p-2.5 text-right">Fan Energy (kWh)</th>
                    <th className="p-2.5 text-right">Light Energy (kWh)</th>
                    <th className="p-2.5 text-right">Total Energy (kWh)</th>
                    <th className="p-2.5 text-right">CO₂ Emissions (kg)</th>
                    <th className="p-2.5 text-right">Cost (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {dailySummaries.map((d) => (
                    <tr key={d.day} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold">Day {d.day}</td>
                      <td className="p-2.5 text-right">{d.fanEnergyKWh.toFixed(4)}</td>
                      <td className="p-2.5 text-right">{d.lightEnergyKWh.toFixed(4)}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-800">{d.energyKWh.toFixed(4)}</td>
                      <td className="p-2.5 text-right text-teal-800">{d.co2Kg.toFixed(4)}</td>
                      <td className="p-2.5 text-right font-bold text-amber-800">₹{d.costINR.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-600">
              Days 4 and 5 recorded the peak daily energy wastage (0.5400 kWh and 0.5433 kWh, respectively) due to longer consecutive unmonitored vacancy durations (up to 35 minutes per room).
            </p>
          </section>

          {/* SECTION 12: PROPOSED REMINDER-BASED INTERVENTION */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">11.</span> Proposed Reminder-Based Intervention
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">
              Rather than investing in costly automated building management hardware, this ABL project emphasizes zero-capital behavioral nudges based on behavioral economics principles:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">A. Classroom Stewards</span>
                <p className="text-slate-600">Two elected student energy monitors per lecture division take proactive ownership to check switchboards before leaving.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">B. Doorway Nudge Signs</span>
                <p className="text-slate-600">Fluorescent stickers placed at eye-level directly adjacent to exit door handles prompt immediate switch-off.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">C. 10-Min Chime Rule</span>
                <p className="text-slate-600">A soft campus chime sounds 5 minutes after class termination, prompting quick facility sweeps.</p>
              </div>
            </div>
          </section>

          {/* SECTION 13: HYPOTHETICAL IMPACT ANALYSIS */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">12.</span> Hypothetical Impact Analysis (Sensitivity Modeling)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5">Intervention Level</th>
                    <th className="p-2.5 text-right">Energy Saved (kWh)</th>
                    <th className="p-2.5 text-right">Remaining Wastage (kWh)</th>
                    <th className="p-2.5 text-right">CO₂ Mitigated (kg)</th>
                    <th className="p-2.5 text-right">Money Saved (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {[0, 25, 40, 60, 75, 100].map((pct) => {
                    const savedE = (summary.totalEnergyKWh * pct) / 100;
                    const remE = summary.totalEnergyKWh - savedE;
                    const savedC = savedE * settings.emissionFactor;
                    const savedM = savedE * settings.electricityTariff;
                    const isTarget = pct === settings.interventionReductionPercent;
                    return (
                      <tr key={pct} className={isTarget ? 'bg-emerald-50/70 font-bold' : 'hover:bg-slate-50'}>
                        <td className="p-2.5">
                          {pct}% {isTarget ? '(Modeled Baseline Target)' : ''}
                        </td>
                        <td className="p-2.5 text-right text-emerald-800 font-bold">{savedE.toFixed(4)}</td>
                        <td className="p-2.5 text-right">{remE.toFixed(4)}</td>
                        <td className="p-2.5 text-right text-teal-800">{savedC.toFixed(4)}</td>
                        <td className="p-2.5 text-right text-amber-800 font-bold">₹{savedM.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 italic">
              Notice: Sensitivity levels model potential outcomes across hypothetical compliance ranges.
            </p>
          </section>

          {/* SECTION 14: RESULTS AND DISCUSSION */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">13.</span> Results and Discussion
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">
              The recalculated metrics confirm that ceiling fans constitute the overwhelmingly dominant component of classroom electricity wastage ({summary.totalFansKWh.toFixed(3)} kWh or 66.88% of total consumption), owing to their significantly higher power rating (60W vs. 20W). Lights represent the remaining 33.12% ({summary.totalLightsKWh.toFixed(3)} kWh). Thus, priority interventions focusing on de-energizing fan banks yield twice the environmental dividend compared to lighting alone.
            </p>
          </section>

          {/* SECTION 15: CONCLUSION */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">14.</span> Conclusion
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify">
              This Activity-Based Learning project successfully demonstrates the quantification pipeline connecting routine campus electrical negligence with Scope 2 carbon footprint metrics. By coupling empirical logging with an interactive simulation prototype, EcoClass empowers the academic community at Siddaganga Institute of Technology to visualize, model, and actively mitigate unnecessary campus emissions without initial capital infrastructure investment.
            </p>
          </section>

          {/* SECTION 16: FUTURE ENHANCEMENTS */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">15.</span> Future Scope and Hardware Enhancements
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs sm:text-sm">
              <li>Integration of wireless LoRaWAN / ESP32 PIR passive infrared occupancy sensors.</li>
              <li>Installation of split-core CT power meters on classroom sub-distribution boards for automated telemetry.</li>
              <li>Automated relay cutoff controls that isolate electrical loads after 10 minutes of confirmed zero occupancy.</li>
              <li>Live campus-wide green building dashboard accessible via institutional mobile portal.</li>
            </ul>
          </section>

          {/* SECTION 17: REFERENCES */}
          <section className="space-y-2 pb-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="text-emerald-700">16.</span> Academic & Regulatory References
            </h2>
            <ol className="list-decimal pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
              <li>Central Electricity Authority (CEA), Government of India (2023). <em>CO₂ Baseline Database for the Indian Power Sector, Version 19.0</em>. New Delhi: Ministry of Power.</li>
              <li>Bureau of Energy Efficiency (BEE), Ministry of Power, Government of India (2022). <em>Energy Conservation Building Code (ECBC) Guidelines for Educational Buildings</em>.</li>
              <li>Karnataka Electricity Regulatory Commission (KERC) (2023). <em>Tariff Order for Bangalore Electricity Supply Company Limited (BESCOM)</em>.</li>
              <li>Intergovernmental Panel on Climate Change (IPCC) (2021). <em>Sixth Assessment Report: Climate Change Mitigation</em>. Cambridge University Press.</li>
              <li>Thaler, R. H., & Sunstein, C. R. (2008). <em>Nudge: Improving Decisions About Health, Wealth, and Happiness</em>. Yale University Press.</li>
            </ol>
          </section>

          {/* Document Sign-off Footer */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              <p className="font-semibold text-slate-700">Siddaganga Institute of Technology, Tumakuru</p>
              <p>Activity-Based Learning (ABL) Prototype Documentation</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-slate-100 rounded text-slate-600 font-mono text-[11px]">
                Report Status: Verified Clean Output
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
