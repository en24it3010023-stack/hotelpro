import React from 'react';
import { Users, Bed, Maximize2, Eye, Check, ShieldCheck } from 'lucide-react';

const RoomCard = ({ category, onSelect, nights = 1 }) => {
  const primaryImage =
    category.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80';

  const totalPrice = category.basePrice * (nights || 1);
  const isAvailable = category.availableRoomsCount === undefined || category.availableRoomsCount > 0;

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
      {/* Room Photo */}
      <div className="md:col-span-5 relative aspect-[16/11] rounded-2xl overflow-hidden bg-slate-900">
        <img
          src={primaryImage}
          alt={category.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-white">
          {category.view || 'Panoramic Scenic View'}
        </div>
      </div>

      {/* Room Specifications & Details */}
      <div className="md:col-span-7 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
              {category.name}
            </h3>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                isAvailable
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-300 dark:border-rose-800'
              }`}
            >
              {isAvailable ? 'Available for Dates' : 'Sold Out for Dates'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {category.description}
          </p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-gold-500 shrink-0" />
              <span className="truncate">{category.bedType || '1 King Bed'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gold-500 shrink-0" />
              <span>Up to {category.maxGuests?.adults || 2} Guests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-gold-500 shrink-0" />
              <span>{category.roomSizeSqFt || 550} sq ft</span>
            </div>
          </div>

          {/* Amenities checklist */}
          <div className="flex flex-wrap gap-2">
            {category.amenities?.slice(0, 4).map((a, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
              >
                <Check className="w-3 h-3 text-emerald-500" />
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="flex items-end justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                ${category.basePrice}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ night</span>
            </div>
            {nights > 1 && (
              <span className="text-xs text-slate-400 font-medium">
                ${totalPrice} total for {nights} nights (excl. taxes)
              </span>
            )}
          </div>

          <button
            onClick={() => onSelect(category)}
            disabled={!isAvailable}
            className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs shadow-md shadow-gold-500/20 transition-all"
          >
            {isAvailable ? 'Reserve This Suite' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
