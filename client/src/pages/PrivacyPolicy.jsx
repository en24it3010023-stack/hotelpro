import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-gold-500">
          Trust & Confidentiality
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          Privacy Policy & Escrow Safeguards
        </h1>
        <p className="text-xs text-slate-500">Effective Date: November 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            1. Our Commitment to Discretion
          </h3>
          <p>
            HotelPro (Roomly) operates on the highest ethical standards of hospitality privacy. We collect only necessary details to fulfill luxury reservations, process verified escrow transactions, and cater to personalized guest dietary and stay preferences.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-gold-500" />
            2. Payment Security & Zero Card Storage
          </h3>
          <p>
            HotelPro never stores raw credit card numbers, CVVs, or bank credentials on our servers. All transactions are securely routed through PCI-DSS Level 1 certified gateways including Stripe and Razorpay, using 256-bit cryptographic tokens.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-500" />
            3. Verified Stay Review Integrity
          </h3>
          <p>
            To eliminate fabricated or spam evaluations, reviews can only be posted by accounts with matching completed stay records in our reservation ledger.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
