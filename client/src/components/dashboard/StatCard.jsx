import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'gold', trend }) => {
  const colorMap = {
    gold: 'bg-gold-50 dark:bg-gold-950/40 text-gold-600 dark:text-gold-400 border-gold-200 dark:border-gold-800/60',
    blue: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
    purple: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60',
    rose: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
  };

  const badgeClass = colorMap[color] || colorMap.gold;

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-6 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${badgeClass}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {value}
        </h3>
        {trend && (
          <span className="text-xs font-bold text-emerald-500">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
