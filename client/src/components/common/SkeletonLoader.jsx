import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 overflow-hidden animate-pulse p-4 space-y-4"
          >
            <div className="h-56 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div
          key={i}
          className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse w-full"
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
