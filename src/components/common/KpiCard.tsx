import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'forest' | 'teal' | 'amber' | 'slate' | 'emerald';
  badgeText?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  variant = 'forest',
  badgeText,
}) => {
  const variantMap = {
    forest: {
      bg: 'bg-emerald-50/70',
      iconBg: 'bg-emerald-600 text-white',
      border: 'border-slate-200/80 hover:border-emerald-300',
      badge: 'bg-emerald-100 text-emerald-800',
    },
    teal: {
      bg: 'bg-teal-50/70',
      iconBg: 'bg-teal-600 text-white',
      border: 'border-slate-200/80 hover:border-teal-300',
      badge: 'bg-teal-100 text-teal-800',
    },
    emerald: {
      bg: 'bg-green-50/70',
      iconBg: 'bg-green-600 text-white',
      border: 'border-slate-200/80 hover:border-green-300',
      badge: 'bg-green-100 text-green-800',
    },
    amber: {
      bg: 'bg-amber-50/70',
      iconBg: 'bg-amber-600 text-white',
      border: 'border-slate-200/80 hover:border-amber-300',
      badge: 'bg-amber-100 text-amber-800',
    },
    slate: {
      bg: 'bg-slate-50',
      iconBg: 'bg-slate-700 text-white',
      border: 'border-slate-200/80 hover:border-slate-300',
      badge: 'bg-slate-200 text-slate-800',
    },
  };

  const style = variantMap[variant];

  return (
    <div
      className={`bg-white rounded-2xl border ${style.border} p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-sm font-semibold text-slate-600">
                {unit}
              </span>
            )}
          </div>
        </div>
        <div
          className={`p-3 rounded-xl ${style.iconBg} shadow-sm group-hover:scale-105 transition-transform flex-shrink-0`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="truncate">{subtitle || 'Computed from 28 event records'}</span>
        {badgeText && (
          <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${style.badge}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};
