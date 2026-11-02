import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Copy, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const PROMOS = [
  {
    code: 'WELCOME10',
    title: 'New Member Sanctuary Welcome',
    discount: '10% OFF',
    description: 'Enjoy a 10% privilege reduction on your initial stay at any HotelPro flagship property worldwide.',
    validity: 'Valid across all room suites and luxury chalets.',
    badge: 'Popular Welcome Gift',
  },
  {
    code: 'SUMMER25',
    title: 'Luxury Summer Coastal Getaway',
    discount: '25% OFF',
    description: 'Save 25% on oceanfront suites and overwater villas when reserving 3 nights or longer this season.',
    validity: 'Miami Beach & Bora Bora flagship properties.',
    badge: 'Limited-Time Privilege',
  },
  {
    code: 'WEEKEND15',
    title: 'Extended Weekend Romance Retreat',
    discount: '15% OFF',
    description: 'Complimentary champagne welcome and 15% off weekend reservations checking in Friday or Saturday.',
    validity: 'Central Park Manhattan & Jaipur Palaces.',
    badge: 'Couples & Romance',
  },
  {
    code: 'HONEYMOON',
    title: 'Honeymoon Private Plunge Package',
    discount: '20% OFF',
    description: 'Celebrate your union with 20% off master suites, daily champagne breakfast, and Clarins couple spa treatment.',
    validity: 'Minimum 4 nights stay in Presidential & Villa tiers.',
    badge: 'Signature Package',
  },
];

const Offers = () => {
  const { showToast } = useToast();

  const handleCopy = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      showToast(`Promo code "${code}" copied to clipboard! Paste at checkout.`, 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-gold-500">
          Exclusive Privileges
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
          Curated Seasonal Offers
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Enhance your sanctuary stay with exclusive voucher codes, complimentary room upgrades, and limited-time package privileges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROMOS.map((promo, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gold-100 dark:bg-gold-950/60 text-gold-700 dark:text-gold-400 border border-gold-300 dark:border-gold-800">
                  {promo.badge}
                </span>
                <span className="font-serif text-2xl font-bold text-gold-600 dark:text-gold-400">
                  {promo.discount}
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                {promo.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {promo.description}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                Terms: {promo.validity}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-navy-950 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-slate-900 dark:text-white">
                <Tag className="w-3.5 h-3.5 text-gold-500" />
                <span>{promo.code}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(promo.code)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-gold-500 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
                <Link
                  to="/explore"
                  className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 text-xs font-bold shadow-md shadow-gold-500/20 transition-all flex items-center gap-1"
                >
                  Book Now <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
