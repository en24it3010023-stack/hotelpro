import React from 'react';
import { Filter, Star, Check } from 'lucide-react';

const COMMON_AMENITIES = [
  'Free High-Speed WiFi',
  'Infinity Swimming Pool',
  'Private Ocean Beach Access',
  'Clarins Luxury Spa & Wellness',
  'Fine Dining Seafood Restaurant',
  '24/7 Concierge Service',
  'Valet Parking',
  'Fitness Center & Yoga Pavilion',
  'Airport Limousine Transfer',
];

const PriceFilter = ({ filters, onChange, onReset }) => {
  const handlePriceChange = (e) => {
    onChange({ ...filters, maxPrice: Number(e.target.value) });
  };

  const handleStarRating = (rating) => {
    onChange({
      ...filters,
      starRating: filters.starRating === rating ? '' : rating,
    });
  };

  const handleAmenityToggle = (amenity) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    onChange({ ...filters, amenities: updated });
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold-500" />
          <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">
            Filter Properties
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gold-600 dark:text-gold-400 font-semibold hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* Max Price Range Slider */}
      <div>
        <div className="flex justify-between items-center text-xs font-bold mb-2">
          <span className="text-slate-500 dark:text-slate-400">Max Nightly Rate</span>
          <span className="text-slate-900 dark:text-white font-serif text-sm">
            ${filters.maxPrice || 1000}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="1200"
          step="50"
          value={filters.maxPrice || 1000}
          onChange={handlePriceChange}
          className="w-full accent-gold-500 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>$100</span>
          <span>$1,200+</span>
        </div>
      </div>

      {/* Star Rating Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
          Star Rating
        </label>
        <div className="flex gap-2">
          {[5, 4, 3].map((stars) => (
            <button
              key={stars}
              type="button"
              onClick={() => handleStarRating(stars)}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                filters.starRating === stars
                  ? 'bg-gold-500 text-slate-950 border-gold-500 shadow-md shadow-gold-500/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              {stars} Star
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Checkboxes */}
      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
          Luxury Amenities
        </label>
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {COMMON_AMENITIES.map((amenity) => {
            const isChecked = (filters.amenities || []).includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none group"
              >
                <div
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-gold-500 border-gold-500 text-slate-950'
                      : 'border-slate-300 dark:border-slate-700 group-hover:border-gold-500'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
