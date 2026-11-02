import React from 'react';
import { Award, ShieldCheck, HeartHandshake, Sparkles, Building, Globe } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-bold tracking-widest text-gold-500">
          Our Heritage & Passion
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white">
          Crafting Unforgettable Hospitality Legacies
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Founded on the uncompromising pursuit of refinement, HotelPro (Roomly) unites the globe's most extraordinary boutique hotels, coastal sanctuaries, and royal heritage estates under a single seamless reservation ecosystem.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-gold-100 dark:bg-gold-950/60 text-gold-600 dark:text-gold-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
            Uncompromising Excellence
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Every property undergoes strict quarterly inspections evaluating acoustics, cleanliness, bed comfort, gastronomy, and personalized concierge attention.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
            Transparent Hospitality Escrow
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Guests deserve peace of mind. We eliminate hidden surcharges, offer clear cancellation windows, and guarantee stay integrity with verified guest records.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
            Dedicated 24/7 Concierge
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            From chauffeured vintage limousine transfers to Michelin-star dinner reservations, our global concierge team ensures your journey is effortless.
          </p>
        </div>
      </div>

      {/* Leadership & Heritage Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center rounded-3xl bg-slate-900 text-white p-8 sm:p-14">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-gold-400">
            The HotelPro Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Redefining Luxury Through Human Care
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            We believe that true luxury is not defined by excess, but by intentional elegance, intuitive warmth, and bespoke attention to every personal detail.
          </p>
          <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-semibold">
            <div className="border-l-2 border-gold-500 pl-4">
              <span className="font-serif text-2xl font-bold text-white block">99.8%</span>
              <span className="text-slate-400">Guest Satisfaction Rating</span>
            </div>
            <div className="border-l-2 border-gold-500 pl-4">
              <span className="font-serif text-2xl font-bold text-white block">15+</span>
              <span className="text-slate-400">Global Destinations</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
            alt="Heritage Hotel Architecture"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
