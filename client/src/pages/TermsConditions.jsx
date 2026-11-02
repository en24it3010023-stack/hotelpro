import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

const TermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-gold-500">
          Hospitality Charter
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          Terms & Conditions of Reservation
        </h1>
        <p className="text-xs text-slate-500">Last updated: November 2026</p>
      </div>

      <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white">
            1. Guaranteed Inventory Allocation
          </h3>
          <p>
            When you complete a booking on HotelPro, room inventory is locked atomically in our reservation engine to prevent double bookings. Your reservation reference guarantees suite allocation upon arrival.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white">
            2. Cancellation and Refund Processing
          </h3>
          <p>
            Cancellations made within the free cancellation window displayed on the suite card are refunded 100% to the original payment method. Late cancellations requested less than 48 hours before check-in are subject to a standard 50% reservation retention fee.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white">
            3. Hotel Policies & House Rules
          </h3>
          <p>
            Guests agree to abide by designated check-in and check-out times, non-smoking policies across enclosed suites, and individual property guidelines regarding pets and visitor access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
