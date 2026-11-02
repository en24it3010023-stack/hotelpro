import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ContactUs = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Concierge Inquiry',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      showToast('Thank you! Your inquiry has been routed to our Senior Concierge Desk.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Concierge Inquiry',
        message: '',
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-gold-500">
          24/7 Global Concierge
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
          We Are Here to Serve You
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Have an inquiry regarding a reservation, private buyout, or bespoke itinerary? Reach our dedicated hospitality ambassadors anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
              Direct Contact Lines
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-gold-100 dark:bg-gold-950/60 text-gold-600 dark:text-gold-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Toll-Free VIP Line</span>
                  <p className="text-slate-500 dark:text-slate-400">+1 (800) 555-LUXURY (5898)</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-gold-100 dark:bg-gold-950/60 text-gold-600 dark:text-gold-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Concierge Email</span>
                  <p className="text-slate-500 dark:text-slate-400">concierge@hotelpro.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-gold-100 dark:bg-gold-950/60 text-gold-600 dark:text-gold-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Global Headquarters</span>
                  <p className="text-slate-500 dark:text-slate-400">HotelPro Plaza, 100 Hospitality Way, Miami Beach, FL 33139</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-gold-100 dark:bg-gold-950/60 text-gold-600 dark:text-gold-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Operating Schedule</span>
                  <p className="text-slate-500 dark:text-slate-400">24 Hours a Day, 365 Days a Year</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
          >
            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
              Send a Private Message
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Lord Harrington"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Subject / Property
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="General Concierge Inquiry">General Concierge Inquiry</option>
                  <option value="Reservation Modification">Reservation Modification</option>
                  <option value="Private Villa Buyout">Private Villa / Estate Buyout</option>
                  <option value="Wedding & Corporate Events">Wedding & Luxury Events</option>
                  <option value="Partner Hotel Application">Partner Hotel Listing Application</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Your Message *
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Kindly elaborate on your desired stay dates, group specifications, or particular concierge requirements..."
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md shadow-gold-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              {loading ? 'Transmitting Message...' : 'Submit Concierge Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
