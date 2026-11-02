import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toString().toLowerCase().replace(/[\s_]+/g, '-');

  const badgeStyles = {
    // Booking statuses
    confirmed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
    'checked-in': 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border-blue-300 dark:border-blue-800',
    'checked-out': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300 dark:border-amber-800',
    cancelled: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border-rose-300 dark:border-rose-800',
    'refund-pending': 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400 border-purple-300 dark:border-purple-800',
    
    // Room states
    available: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
    occupied: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800',
    maintenance: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border-rose-300 dark:border-rose-800',
    
    // Housekeeping
    clean: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-400 border-teal-300 dark:border-teal-800',
    dirty: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300 dark:border-amber-800',
    'in-progress': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-400 border-cyan-300 dark:border-cyan-800',
    inspected: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',

    // Payment statuses
    paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
    refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400 border-purple-300 dark:border-purple-800',
    failed: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border-rose-300 dark:border-rose-800',
  };

  const style = badgeStyles[normalized] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border tracking-wide uppercase ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
};

export default StatusBadge;
