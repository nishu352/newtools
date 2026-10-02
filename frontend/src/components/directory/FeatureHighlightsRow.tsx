import React from 'react';
import { Grid, CheckCircle2, ShieldCheck, Monitor } from 'lucide-react';

interface FeatureHighlightsRowProps {
  totalToolsCount: number;
}

export function FeatureHighlightsRow({ totalToolsCount }: FeatureHighlightsRowProps) {
  const highlights = [
    {
      title: `${totalToolsCount} Tools`,
      subtitle: 'All in one place',
      icon: Grid,
      color: '#EA580C',
      bg: '#FFF7ED',
      border: '#FED7AA',
    },
    {
      title: '100% Free',
      subtitle: 'No signup required',
      icon: CheckCircle2,
      color: '#10B981',
      bg: '#ECFDF5',
      border: '#A7F3D0',
    },
    {
      title: 'Fast & Secure',
      subtitle: 'Your files are safe',
      icon: ShieldCheck,
      color: '#F59E0B',
      bg: '#FFFBEB',
      border: '#FDE68A',
    },
    {
      title: 'Works on All Devices',
      subtitle: 'Desktop, tablet, mobile',
      icon: Monitor,
      color: '#06B6D4',
      bg: '#ECFEFF',
      border: '#A5F3FC',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-6">
      {highlights.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="flex items-center gap-3 p-3.5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: item.bg, color: item.color }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[13px] font-bold text-slate-900 dark:text-white truncate">
                {item.title}
              </h4>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate">
                {item.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
