import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, totalReviews, size = 'sm', showNumeric = true }) => {
  const stars = [1, 2, 3, 4, 5];
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const starSize = sizeMap[size] || sizeMap.sm;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-gold-500">
        {stars.map((s) => (
          <Star
            key={s}
            className={`${starSize} ${
              s <= Math.round(rating)
                ? 'fill-gold-500 text-gold-500'
                : 'text-slate-300 dark:text-slate-700'
            }`}
          />
        ))}
      </div>
      {showNumeric && (
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {Number(rating).toFixed(1)}
        </span>
      )}
      {totalReviews !== undefined && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          ({totalReviews} reviews)
        </span>
      )}
    </div>
  );
};

export default RatingStars;
