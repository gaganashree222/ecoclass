import React, { useState, useMemo, useEffect } from 'react';
import { ActiveTab, AppSettings, EnergyRecord } from './types';
import { initialDataset } from './data/initialDataset';
import { defaultSettings } from './data/defaultSettings';
import {
  calculateAllRecords,
  calculateClassroomSummaries,
  calculateOverallSummary,
  calculateDailySummaries,
} from './utils/calculations';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewTab } from './components/overview/OverviewTab';
import { ClassroomMonitoringTab } from './components/classroom/ClassroomMonitoringTab';
import { EnergyAnalyticsTab } from './components/analytics/EnergyAnalyticsTab';
import { CarbonFootprintTab } from './components/carbon/CarbonFootprintTab';
import { SolutionSimulatorTab } from './components/simulator/SolutionSimulatorTab';
import { DataManagementTab } from './components/data-management/DataManagementTab';
import { AboutProjectTab } from './components/about/AboutProjectTab';
import { AblReportModal } from './components/report/AblReportModal';

export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Settings State (with localStorage persistence)
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('ecoclass_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to read settings from localStorage', e);
    }
    return defaultSettings;
  });

  // Dataset State (with localStorage persistence)
  const [records, setRecords] = useState<EnergyRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ecoclass_dataset');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to read dataset from localStorage', e);
    }
    return initialDataset;
  });

  // Check if dataset is modified from initial 28 simulated records
  const isModified = useMemo(() => {
    if (records.length !== initialDataset.length) return true;
    return records.some((r, i) => {
      const init = initialDataset[i];
      if (!init) return true;
      return (
        r.day !== init.day ||
        r.classroom !== init.classroom ||
        r.fans !== init.fans ||
        r.lights !== init.lights ||
        r.minutes !== init.minutes ||
        r.sourceType !== init.sourceType
      );
    });
  }, [records]);

  // Persist settings changes
  useEffect(() => {
    try {
      localStorage.setItem('ecoclass_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  }, [settings]);

  // Persist dataset changes
  useEffect(() => {
    try {
      localStorage.setItem('ecoclass_dataset', JSON.stringify(records));
    } catch (e) {
      console.warn('Failed to save dataset', e);
    }
  }, [records]);

  // Dynamic calculations engine
  const calculatedRecords = useMemo(() => {
    return calculateAllRecords(records, settings);
  }, [records, settings]);

  const classroomsSummary = useMemo(() => {
    return calculateClassroomSummaries(calculatedRecords, settings);
  }, [calculatedRecords, settings]);

  const overallSummary = useMemo(() => {
    return calculateOverallSummary(calculatedRecords, settings);
  }, [calculatedRecords, settings]);

  const dailySummaries = useMemo(() => {
    return calculateDailySummaries(calculatedRecords, 7);
  }, [calculatedRecords]);

  // Dataset Handlers
  const handleAddRecord = (newRec: EnergyRecord) => {
    setRecords((prev) => [...prev, newRec]);
  };

  const handleUpdateRecord = (updatedRec: EnergyRecord) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === updatedRec.id) return updatedRec;
        // Fallback matching if ID wasn't preset
        if (r.day === updatedRec.day && r.classroom === updatedRec.classroom && r.minutes === updatedRec.minutes) {
          return updatedRec;
        }
        return r;
      })
    );
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => (r.id || `${r.day}-${r.classroom}-${r.minutes}`) !== id));
  };

  const handleRestoreOriginal = () => {
    setRecords(initialDataset);
    setSettings(defaultSettings);
    try {
      localStorage.removeItem('ecoclass_dataset');
      localStorage.removeItem('ecoclass_settings');
    } catch (e) {
      console.warn('Failed to clear storage', e);
    }
  };

  const handleImportRecords = (newRecords: EnergyRecord[]) => {
    setRecords(newRecords);
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleUpdateInterventionPercent = (percent: number) => {
    setSettings((prev) => ({ ...prev, interventionReductionPercent: percent }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        institutionName={settings.institution}
        isModified={isModified}
        onOpenReport={() => setIsReportModalOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          settings={settings}
        />

        {/* Main Workspace Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewTab
              summary={overallSummary}
              classrooms={classroomsSummary}
              dailySummaries={dailySummaries}
              settings={settings}
              setActiveTab={setActiveTab}
              isModified={isModified}
            />
          )}

          {activeTab === 'classroom' && (
            <ClassroomMonitoringTab
              classrooms={classroomsSummary}
              records={calculatedRecords}
              settings={settings}
              isModified={isModified}
            />
          )}

          {activeTab === 'analytics' && (
            <EnergyAnalyticsTab
              records={calculatedRecords}
              settings={settings}
              isModified={isModified}
            />
          )}

          {activeTab === 'carbon' && (
            <CarbonFootprintTab
              summary={overallSummary}
              classrooms={classroomsSummary}
              dailySummaries={dailySummaries}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              isModified={isModified}
            />
          )}

          {activeTab === 'simulator' && (
            <SolutionSimulatorTab
              summary={overallSummary}
              settings={settings}
              onUpdateInterventionPercent={handleUpdateInterventionPercent}
              isModified={isModified}
            />
          )}

          {activeTab === 'data' && (
            <DataManagementTab
              records={calculatedRecords}
              onAddRecord={handleAddRecord}
              onUpdateRecord={handleUpdateRecord}
              onDeleteRecord={handleDeleteRecord}
              onRestoreOriginal={handleRestoreOriginal}
              onImportRecords={handleImportRecords}
              settings={settings}
              isModified={isModified}
            />
          )}

          {activeTab === 'about' && (
            <AboutProjectTab
              isModified={isModified}
              onOpenReport={() => setIsReportModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* ABL Technical Academic Report Modal */}
      <AblReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        summary={overallSummary}
        classrooms={classroomsSummary}
        dailySummaries={dailySummaries}
        records={calculatedRecords}
        settings={settings}
        isModified={isModified}
      />
    </div>
  );
};

export default App;
