import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading HotelPro...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-9 h-9 border-3',
    lg: 'w-14 h-14 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-slate-200 dark:border-slate-800 border-t-gold-500 animate-spin`}
      />
      {text && (
        <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
