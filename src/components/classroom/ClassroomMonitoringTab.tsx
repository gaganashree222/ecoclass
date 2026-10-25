import React, { useState } from 'react';
import { School, Info, Calendar } from 'lucide-react';
import { ClassroomSummary, CalculatedRecord, AppSettings } from '../../types';
import { ClassroomCard } from './ClassroomCard';
import { ClassroomDetailModal } from './ClassroomDetailModal';
import { SimulationBanner } from '../common/SimulationBanner';
import { calculateClassroomSummaries } from '../../utils/calculations';

interface ClassroomMonitoringTabProps {
  classrooms: ClassroomSummary[];
  records: CalculatedRecord[];
  settings: AppSettings;
  isModified: boolean;
}

export const ClassroomMonitoringTab: React.FC<ClassroomMonitoringTabProps> = ({
  classrooms,
  records,
  settings,
  isModified,
}) => {
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('ALL');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('ALL');
  const [activeModalRoom, setActiveModalRoom] = useState<string | null>(null);

  // Filter records based on selected filters
  const filteredRecords = records.filter((r) => {
    const matchesRoom = selectedRoomFilter === 'ALL' || r.classroom === selectedRoomFilter;
    const matchesDay = selectedDayFilter === 'ALL' || r.day === Number(selectedDayFilter);
    return matchesRoom && matchesDay;
  });

  // Re-aggregate classroom summaries for filtered subset
  const displayedClassroomSummaries = calculateClassroomSummaries(filteredRecords, settings);

  // Available unique classrooms from records
  const availableRooms = Array.from(new Set(records.map((r) => r.classroom))).sort();

  return (
    <div className="space-y-6">
      <SimulationBanner isModified={isModified} />

      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Classroom Energy Monitoring
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600">
            Compare appliance wastage, unnecessary runtimes, and carbon emissions across monitored academic halls.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Classroom Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs text-xs">
            <School className="w-3.5 h-3.5 text-slate-400" />
            <label htmlFor="room-filter" className="font-semibold text-slate-500">
              Room:
            </label>
            <select
              id="room-filter"
              value={selectedRoomFilter}
              onChange={(e) => setSelectedRoomFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Classrooms ({availableRooms.length})</option>
              {availableRooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </div>

          {/* Day 1–Day 7 Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <label htmlFor="day-filter" className="font-semibold text-slate-500">
              Period:
            </label>
            <select
              id="day-filter"
              value={selectedDayFilter}
              onChange={(e) => setSelectedDayFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All 7 Days</option>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={String(d)}>
                  Day {d} Only
                </option>
              ))}
            </select>
          </div>

          {(selectedRoomFilter !== 'ALL' || selectedDayFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSelectedRoomFilter('ALL');
                setSelectedDayFilter('ALL');
              }}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Engineering Clarification Callout */}
      <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800">Observation Methodology Note:</strong> Each classroom card represents cumulative observations over the selected monitoring period. 
          <em> The sum of logged fan and light counts reflects total device instances observed energized across all recorded events, not unique physical appliances.</em> Click any classroom card to inspect daily event logs and chronological charts.
        </div>
      </div>

      {/* Classroom Cards Grid */}
      {displayedClassroomSummaries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <School className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="font-semibold text-base text-slate-800">No classroom data found</p>
          <p className="text-xs mt-1">Try resetting the classroom or day filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedClassroomSummaries.map((roomSummary) => (
            <ClassroomCard
              key={roomSummary.classroom}
              summary={roomSummary}
              onClick={() => setActiveModalRoom(roomSummary.classroom)}
              isSelected={activeModalRoom === roomSummary.classroom}
            />
          ))}
        </div>
      )}

      {/* Detailed Modal */}
      {activeModalRoom && (
        <ClassroomDetailModal
          classroom={activeModalRoom}
          summary={classrooms.find((c) => c.classroom === activeModalRoom)}
          records={records}
          settings={settings}
          onClose={() => setActiveModalRoom(null)}
        />
      )}
    </div>
  );
};
