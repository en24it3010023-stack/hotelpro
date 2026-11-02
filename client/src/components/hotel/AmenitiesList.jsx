import React from 'react';
import {
  Wifi,
  Waves,
  Sparkles,
  Utensils,
  Bell,
  Car,
  Dumbbell,
  Plane,
  Wine,
  Coffee,
  Tv,
  CheckCircle2,
} from 'lucide-react';

const getAmenityIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('wifi') || n.includes('fiber')) return <Wifi className="w-4 h-4 text-gold-500" />;
  if (n.includes('pool') || n.includes('lagoon') || n.includes('swim')) return <Waves className="w-4 h-4 text-cyan-500" />;
  if (n.includes('spa') || n.includes('wellness') || n.includes('massage')) return <Sparkles className="w-4 h-4 text-purple-500" />;
  if (n.includes('dining') || n.includes('restaurant') || n.includes('breakfast')) return <Utensils className="w-4 h-4 text-amber-500" />;
  if (n.includes('concierge') || n.includes('butler') || n.includes('service')) return <Bell className="w-4 h-4 text-gold-500" />;
  if (n.includes('parking') || n.includes('valet')) return <Car className="w-4 h-4 text-blue-500" />;
  if (n.includes('fitness') || n.includes('gym') || n.includes('yoga')) return <Dumbbell className="w-4 h-4 text-emerald-500" />;
  if (n.includes('airport') || n.includes('transfer') || n.includes('shuttle')) return <Plane className="w-4 h-4 text-sky-500" />;
  if (n.includes('bar') || n.includes('lounge') || n.includes('wine')) return <Wine className="w-4 h-4 text-rose-500" />;
  if (n.includes('espresso') || n.includes('coffee') || n.includes('minibar')) return <Coffee className="w-4 h-4 text-amber-600" />;
  if (n.includes('tv') || n.includes('oled') || n.includes('sound')) return <Tv className="w-4 h-4 text-indigo-500" />;
  return <CheckCircle2 className="w-4 h-4 text-gold-500" />;
};

const AmenitiesList = ({ amenities = [], columns = 2 }) => {
  const colClass = columns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className={`grid ${colClass} gap-3`}>
      {amenities.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
        >
          {getAmenityIcon(item)}
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
};

export default AmenitiesList;
