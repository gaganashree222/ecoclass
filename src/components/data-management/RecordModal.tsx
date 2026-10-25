import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { EnergyRecord, AppSettings } from '../../types';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: EnergyRecord) => void;
  initialData?: EnergyRecord | null;
  settings: AppSettings;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  settings,
}) => {
  const isEditing = Boolean(initialData);

  const [day, setDay] = useState<number>(1);
  const [classroom, setClassroom] = useState<string>('C101');
  const [fans, setFans] = useState<number>(4);
  const [lights, setLights] = useState<number>(6);
  const [minutes, setMinutes] = useState<number>(30);
  const [sourceType, setSourceType] = useState<'simulated' | 'measured' | 'user-added'>('user-added');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setDay(initialData.day);
      setClassroom(initialData.classroom);
      setFans(initialData.fans);
      setLights(initialData.lights);
      setMinutes(initialData.minutes);
      setSourceType(initialData.sourceType || 'user-added');
    } else {
      setDay(1);
      setClassroom('C101');
      setFans(4);
      setLights(6);
      setMinutes(25);
      setSourceType('user-added');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!day || day < 1 || day > 365) {
      newErrors.day = 'Day must be between 1 and 365.';
    }
    if (!classroom.trim()) {
      newErrors.classroom = 'Classroom identifier cannot be blank.';
    }
    if (fans < 0 || isNaN(fans)) {
      newErrors.fans = 'Fans count cannot be negative.';
    } else if (fans > 20) {
      newErrors.fans = 'Fans count cannot exceed 20 for standard rooms.';
    }
    if (lights < 0 || isNaN(lights)) {
      newErrors.lights = 'Lights count cannot be negative.';
    } else if (lights > 40) {
      newErrors.lights = 'Lights count cannot exceed 40.';
    }
    if (minutes <= 0 || isNaN(minutes)) {
      newErrors.minutes = 'Duration must be greater than 0 minutes.';
    } else if (minutes > 720) {
      newErrors.minutes = 'Duration cannot exceed 720 minutes (12 hours).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const record: EnergyRecord = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      day: Number(day),
      classroom: classroom.trim().toUpperCase(),
      fans: Number(fans),
      lights: Number(lights),
      minutes: Number(minutes),
      sourceType,
    };

    onSave(record);
    onClose();
  };

  // Preview real-time calculated values in modal
  const previewPowerW = fans * settings.fanPowerW + lights * settings.lightPowerW;
  const previewEnergyKWh = (previewPowerW * (minutes / 60)) / 1000;
  const previewCO2 = previewEnergyKWh * settings.emissionFactor;
  const previewCost = previewEnergyKWh * settings.electricityTariff;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? `Edit Observation Record` : 'Add New Classroom Event'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Day */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Day Number (1–7)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                  errors.day ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.day && <p className="text-[11px] text-red-600 mt-1">{errors.day}</p>}
            </div>

            {/* Classroom */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Classroom Code
              </label>
              <input
                type="text"
                placeholder="e.g. C101"
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                  errors.classroom ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.classroom && <p className="text-[11px] text-red-600 mt-1">{errors.classroom}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Fans */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fans ON (60W)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={fans}
                onChange={(e) => setFans(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                  errors.fans ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.fans && <p className="text-[11px] text-red-600 mt-1">{errors.fans}</p>}
            </div>

            {/* Lights */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lights ON (20W)
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={lights}
                onChange={(e) => setLights(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                  errors.lights ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.lights && <p className="text-[11px] text-red-600 mt-1">{errors.lights}</p>}
            </div>

            {/* Minutes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Minutes Left ON
              </label>
              <input
                type="number"
                min="1"
                max="720"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                  errors.minutes ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                }`}
              />
              {errors.minutes && <p className="text-[11px] text-red-600 mt-1">{errors.minutes}</p>}
            </div>
          </div>

          {/* Data Source Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Data Category / Classification
            </label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 bg-white rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="simulated">Simulated Model Observation (ABL Default)</option>
              <option value="measured">Institutionally Measured Event</option>
              <option value="user-added">User-Entered Scenario Observation</option>
            </select>
          </div>

          {/* Live Dynamic Preview in Modal */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
              Instant Engineering Recalculation Preview
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>
                Power: <strong className="text-slate-900">{previewPowerW} W</strong>
              </div>
              <div>
                Energy: <strong className="text-emerald-800">{previewEnergyKWh.toFixed(4)} kWh</strong>
              </div>
              <div>
                CO₂: <strong className="text-teal-800">{previewCO2.toFixed(4)} kg</strong>
              </div>
              <div>
                Cost: <strong className="text-amber-800">₹{previewCost.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Update Record' : 'Add Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
