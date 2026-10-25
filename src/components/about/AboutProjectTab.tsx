import React from 'react';
import {
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Cpu,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { SimulationBanner } from '../common/SimulationBanner';

interface AboutProjectTabProps {
  isModified: boolean;
  onOpenReport: () => void;
}

export const AboutProjectTab: React.FC<AboutProjectTabProps> = ({
  isModified,
  onOpenReport,
}) => {
  return (
    <div className="space-y-6">
      <SimulationBanner isModified={isModified} />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-forest-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-xs font-semibold text-emerald-200">
            <GraduationCap className="w-4 h-4 text-emerald-300" />
            <span>Activity-Based Learning (ABL) Curriculum Project</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            EcoClass – Smart Classroom Energy & Carbon Footprint Monitor
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Case Study Context: <strong>Siddaganga Institute of Technology (SIT), Tumakuru, Karnataka, India</strong>.
            A modern, data-driven sustainability prototype illustrating the conversion of simulated empty classroom electricity wastage into carbon emissions, operational expenditures, and modeled reminder-based savings.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenReport}
              className="px-4 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <span>View Full 17-Section Academic Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Core Project Tenets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* The Problem */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-amber-800 mb-3">
              <div className="p-2 bg-amber-50 rounded-xl border border-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">The Problem</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
              In tertiary educational institutions like SIT Tumakuru, student schedules transition continuously between theoretical classroom lectures, computer labs, workshops, and tutorials.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
              Due to diffuse responsibility and human oversight, ceiling fans (60W) and lighting fixtures (20W) are frequently abandoned energized in empty halls for 15 to 35 minutes before maintenance rounds. Across hundreds of campus halls over an academic semester, this cumulative wastage results in unmonitored grid electricity costs and avoidable Scope 2 carbon dioxide emissions.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-amber-800">
            Identified: Low individual accountability upon lecture dismissal
          </div>
        </div>

        {/* Proposed Solution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-emerald-800 mb-3">
              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">The Proposed Solution</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              EcoClass delivers a rigorous 4-pillar conservation strategy:
            </p>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Accurate Energy Calculation:</strong> Standardized wattage-to-kilowatt-hour conversion engine.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Dynamic Data Visualization:</strong> Room-by-room and daily chronological chart analytics.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Behavioral Nudge Interventions:</strong> Student ambassadors and door-side switch reminders.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>What-If Solution Simulator:</strong> Interactive modeling of emissions and money saved.</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-800">
            Focus: Zero-capex behavioral nudges combined with transparent metrics
          </div>
        </div>
      </div>

      {/* Expected Benefits */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-600" />
          Expected Outcomes & Benefits
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">
              Awareness
            </span>
            <h3 className="font-bold text-sm text-slate-900">Heightened Conservation Mindset</h3>
            <p className="text-xs text-slate-600 mt-1">
              Transforms abstract electricity waste into visible, quantifiable classroom data.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-teal-800 uppercase block mb-1">
              Carbon Accounting
            </span>
            <h3 className="font-bold text-sm text-slate-900">Quantitative Emissions Metric</h3>
            <p className="text-xs text-slate-600 mt-1">
              Computes exact kg CO₂ indirect footprint using regional CEA grid baseline factors.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-amber-800 uppercase block mb-1">
              Targeted Audits
            </span>
            <h3 className="font-bold text-sm text-slate-900">Identify High-Wastage Halls</h3>
            <p className="text-xs text-slate-600 mt-1">
              Pinpoints outlier rooms (such as C101 with 29.3% wastage) for prompt remediation.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-purple-800 uppercase block mb-1">
              Habit Formation
            </span>
            <h3 className="font-bold text-sm text-slate-900">Lifelong Sustainable Habits</h3>
            <p className="text-xs text-slate-600 mt-1">
              Cultivates active campus environmental citizenship among engineering students.
            </p>
          </div>
        </div>
      </div>

      {/* Future Scope with Explicit Prototype Boundary */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-slate-700" />
              Future Scope & Hardware Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Planned technological evolutions for subsequent phases of the SIT Tumakuru smart campus initiative.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold">
            Roadmap (Not in Current Prototype)
          </span>
        </div>

        {/* Prototype boundary disclaimer */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 mb-4 leading-relaxed">
          <strong>Engineering Prototype Boundary:</strong> The current EcoClass web application is a complete, interactive client-side frontend prototype utilizing local state, calculation models, and local storage. 
          <em> The hardware features listed below are explicitly part of future research scope and have not been implemented in the present software prototype.</em>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <h4 className="font-bold text-sm text-slate-900">1. IoT PIR / Thermal Occupancy Sensors</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Ceiling-mounted passive infrared (PIR) and thermal sensors to automatically verify zero room occupancy.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <h4 className="font-bold text-sm text-slate-900">2. Smart Current Transformers (CT)</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Non-invasive split-core CT sensors on classroom distribution sub-boards for real-time sub-metering.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <h4 className="font-bold text-sm text-slate-900">3. Automated Relay Cut-Offs</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Microcontroller-driven relays (ESP32/Zigbee) that automatically de-energize circuits after 10 minutes of vacant inactivity.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <h4 className="font-bold text-sm text-slate-900">4. Live Campus Energy Dashboard</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Centralized telemetry linking all academic blocks at SIT Tumakuru over MQTT / LoRaWAN network.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <h4 className="font-bold text-sm text-slate-900">5. Telegram/WhatsApp Staff Alerts</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Automated push alerts to floor coordinators when rooms are vacant but drawing continuous electrical power.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <h4 className="font-bold text-sm text-slate-900">6. Solar PV Offset Telemetry</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Integration with rooftop solar arrays to compute net campus carbon neutrality in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
