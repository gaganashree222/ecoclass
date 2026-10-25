import React from 'react';
import {
  LayoutDashboard,
  School,
  BarChart3,
  Footprints,
  Sliders,
  Database,
  Info,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { ActiveTab, AppSettings } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  settings: AppSettings;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  settings,
}) => {
  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Campus summary & key KPIs',
    },
    {
      id: 'classroom' as ActiveTab,
      label: 'Classroom Monitoring',
      icon: School,
      description: 'Room-by-room observations',
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Energy Analytics',
      icon: BarChart3,
      description: 'Interactive consumption charts',
    },
    {
      id: 'carbon' as ActiveTab,
      label: 'Carbon Footprint',
      icon: Footprints,
      description: 'Emissions & grid factor',
    },
    {
      id: 'simulator' as ActiveTab,
      label: 'Solution Simulator',
      icon: Sliders,
      description: 'What-if savings model',
      badge: 'Interactive',
    },
    {
      id: 'data' as ActiveTab,
      label: 'Data Management',
      icon: Database,
      description: 'Edit, add, import/export CSV',
    },
    {
      id: 'about' as ActiveTab,
      label: 'About Project',
      icon: Info,
      description: 'ABL context & future scope',
    },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="px-3 py-2">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </p>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-600 hover:text-emerald-950 hover:bg-emerald-50/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-emerald-700/80 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-sm leading-tight truncate">
                        {item.label}
                      </div>
                      <div
                        className={`text-[11px] truncate ${
                          isActive ? 'text-emerald-200' : 'text-slate-400'
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                        isActive
                          ? 'bg-emerald-900 text-emerald-100'
                          : 'bg-teal-50 text-teal-700 border border-teal-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Model Parameters Quick Reference Card in Sidebar */}
      <div className="p-4 m-3 bg-slate-50 border border-slate-200/90 rounded-2xl">
        <div className="flex items-center gap-2 mb-2 text-slate-800">
          <Zap className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider">Model Parameters</span>
        </div>
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-500">Fan Rating:</span>
            <span className="font-semibold text-slate-800">{settings.fanPowerW} W</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Light Rating:</span>
            <span className="font-semibold text-slate-800">{settings.lightPowerW} W</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Grid CO₂ Factor:</span>
            <span className="font-semibold text-slate-800">{settings.emissionFactor} kg/kWh</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tariff:</span>
            <span className="font-semibold text-slate-800">₹{settings.electricityTariff}/kWh</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-emerald-800">
          <span className="flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> SIT Tumakuru ABL
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 bg-white border-r border-slate-200 flex-shrink-0 min-h-[calc(100vh-4rem)]">
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-4">
          {navContent}
        </div>
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-50 py-4 overflow-y-auto">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
