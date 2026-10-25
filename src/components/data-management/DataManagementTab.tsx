import React, { useState, useRef } from 'react';
import {
  Search,
  Filter,
  Plus,
  RotateCcw,
  Download,
  Upload,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { EnergyRecord, CalculatedRecord, AppSettings } from '../../types';
import { RecordModal } from './RecordModal';
import { SimulationBanner } from '../common/SimulationBanner';
import { exportRecordsToCSV, parseCSVToRecords } from '../../utils/exportUtils';

interface DataManagementTabProps {
  records: CalculatedRecord[];
  onAddRecord: (record: EnergyRecord) => void;
  onUpdateRecord: (record: EnergyRecord) => void;
  onDeleteRecord: (id: string) => void;
  onRestoreOriginal: () => void;
  onImportRecords: (newRecords: EnergyRecord[]) => void;
  settings: AppSettings;
  isModified: boolean;
}

export const DataManagementTab: React.FC<DataManagementTabProps> = ({
  records,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  onRestoreOriginal,
  onImportRecords,
  settings,
  isModified,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dayFilter, setDayFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EnergyRecord | null>(null);
  const [importStatus, setImportStatus] = useState<{ message: string; isError?: boolean } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter records
  const filtered = records.filter((r) => {
    const matchesSearch = r.classroom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = dayFilter === 'ALL' || r.day === Number(dayFilter);
    return matchesSearch && matchesDay;
  });

  const handleEditClick = (record: CalculatedRecord) => {
    setEditingRecord({
      id: rId(record),
      day: record.day,
      classroom: record.classroom,
      fans: record.fans,
      lights: record.lights,
      minutes: record.minutes,
      sourceType: record.sourceType,
    });
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const rId = (r: CalculatedRecord) => r.id || `${r.day}-${r.classroom}-${r.minutes}`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const { records: parsedRecords, errors } = parseCSVToRecords(text, 'user-added');

      if (errors.length > 0 && parsedRecords.length === 0) {
        setImportStatus({ message: `CSV Import Error: ${errors.join(', ')}`, isError: true });
      } else {
        onImportRecords(parsedRecords);
        setImportStatus({
          message: `Successfully imported ${parsedRecords.length} records! (${errors.length} skipped rows)`,
          isError: false,
        });
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <SimulationBanner isModified={isModified} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Classroom Observation Data Management
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600">
            View, audit, edit, import, and export classroom observations with instant engineering recalculation.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Record */}
          <button
            onClick={handleAddNewClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event Record</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={() => exportRecordsToCSV(records)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {/* Import CSV */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,text/csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-all"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Import CSV</span>
          </button>

          {/* Restore Original */}
          {isModified && (
            <button
              onClick={onRestoreOriginal}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-2xs"
            >
              <RotateCcw className="w-4 h-4 text-amber-700" />
              <span>Restore 28 Baseline Records</span>
            </button>
          )}
        </div>
      </div>

      {/* Import Status Alert */}
      {importStatus && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${
            importStatus.isError
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {importStatus.isError ? (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
          <button
            onClick={() => setImportStatus(null)}
            className="font-bold underline text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by classroom (e.g. C101)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filter by Day */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500">Day:</span>
            <select
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Days</option>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={String(d)}>
                  Day {d}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || dayFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setDayFilter('ALL');
              }}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold underline"
            >
              Reset
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filtered.length}</strong> of <strong>{records.length}</strong> observations
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-3">Day</th>
                <th className="px-3.5 py-3">Classroom</th>
                <th className="px-3.5 py-3 text-center">Fans ON</th>
                <th className="px-3.5 py-3 text-center">Lights ON</th>
                <th className="px-3.5 py-3 text-center">Duration</th>
                <th className="px-3.5 py-3 text-right">Power (W)</th>
                <th className="px-3.5 py-3 text-right">Energy (kWh)</th>
                <th className="px-3.5 py-3 text-right">CO₂ (kg)</th>
                <th className="px-3.5 py-3 text-right">Cost (₹)</th>
                <th className="px-3.5 py-3 text-center">Data Origin</th>
                <th className="px-3.5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-slate-400">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filtered.map((record) => {
                  const id = rId(record);
                  return (
                    <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3.5 py-2.5 font-bold text-slate-900">
                        Day {record.day}
                      </td>
                      <td className="px-3.5 py-2.5">
                        <span className="font-bold text-emerald-900 px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-100">
                          {record.classroom}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-center">{record.fans}</td>
                      <td className="px-3.5 py-2.5 text-center">{record.lights}</td>
                      <td className="px-3.5 py-2.5 text-center font-medium text-slate-600">
                        {record.minutes} min
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono text-slate-700">
                        {record.totalPowerW} W
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono font-bold text-emerald-800">
                        {record.energyKWh.toFixed(4)}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono text-teal-800">
                        {record.co2Kg.toFixed(4)}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono font-bold text-amber-800">
                        ₹{record.costINR.toFixed(2)}
                      </td>
                      <td className="px-3.5 py-2.5 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            record.sourceType === 'measured'
                              ? 'bg-blue-100 text-blue-800'
                              : record.sourceType === 'user-added'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {record.sourceType || 'simulated'}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleEditClick(record)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit this record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteRecord(id)}
                            className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete this record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit Record */}
      <RecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(rec) => {
          if (editingRecord) {
            onUpdateRecord(rec);
          } else {
            onAddRecord(rec);
          }
        }}
        initialData={editingRecord}
        settings={settings}
      />
    </div>
  );
};
