import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axiosClient from '../../api/axiosClient';
import {
  Calendar,
  Users,
  CreditCard,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const BookingForm = ({ hotel, category, initialDates = {}, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState(
    initialDates.checkIn ||
      new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [checkOut, setCheckOut] = useState(
    initialDates.checkOut ||
      new Date(Date.now() + 96 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [adults, setAdults] = useState(initialDates.adults || 2);
  const [children, setChildren] = useState(initialDates.children || 0);
  const [rooms, setRooms] = useState(initialDates.rooms || 1);

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('demo');
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Calculate nights
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

  const roomTotal = category.basePrice * nights * rooms;
  const taxAmount = Math.round(roomTotal * 0.12 * 100) / 100;
  const serviceFee = Math.round(roomTotal * 0.05 * 100) / 100;

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = Math.round(roomTotal * (appliedPromo.value / 100) * 100) / 100;
    } else {
      discountAmount = appliedPromo.value;
    }
  }

  const grandTotal = Math.max(0, Math.round((roomTotal + taxAmount + serviceFee - discountAmount) * 100) / 100);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'WELCOME10') {
      setAppliedPromo({ code: clean, type: 'percent', value: 10 });
      showToast('Promo code WELCOME10 applied (10% off)!', 'success');
    } else if (clean === 'SUMMER25') {
      setAppliedPromo({ code: clean, type: 'percent', value: 25 });
      showToast('Promo code SUMMER25 applied (25% luxury discount)!', 'success');
    } else if (clean === 'HONEYMOON') {
      setAppliedPromo({ code: clean, type: 'percent', value: 20 });
      showToast('Honeymoon Special applied (20% off)!', 'success');
    } else {
      showToast('Invalid or expired promo code. Try WELCOME10 or SUMMER25', 'error');
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please sign in to confirm your luxury reservation.', 'info');
      navigate('/login');
      return;
    }

    if (!fullName || !email || !phone) {
      showToast('Please fill in guest contact details.', 'error');
      return;
    }

    setLoading(true);

    try {
      // 1. Submit reservation
      const bookingData = {
        hotelId: hotel._id,
        categoryId: category._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestCount: { adults: Number(adults), children: Number(children), rooms: Number(rooms) },
        guestDetails: {
          fullName,
          email,
          phone,
          specialRequests,
        },
        promoCode: appliedPromo ? appliedPromo.code : '',
        paymentMethod,
      };

      const res = await axiosClient.post('/bookings', bookingData);

      if (res.success && res.booking) {
        setConfirmedBooking(res.booking);
        showToast('Your reservation has been confirmed!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to complete reservation.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // If confirmed, show confirmation receipt card
  if (confirmedBooking) {
    return (
      <div className="text-center py-6 space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-gold-500">
            Reservation Confirmed
          </span>
          <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-1">
            We Look Forward to Welcoming You
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Reference Number:{' '}
            <strong className="text-gold-600 dark:text-gold-400 font-mono text-base">
              {confirmedBooking.bookingReference}
            </strong>
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs text-left space-y-2 max-w-md mx-auto">
          <p>
            <strong>Hotel:</strong> {hotel.name}
          </p>
          <p>
            <strong>Suite Category:</strong> {category.name}
          </p>
          <p>
            <strong>Stay:</strong> {new Date(checkIn).toLocaleDateString()} –{' '}
            {new Date(checkOut).toLocaleDateString()} ({nights} nights)
          </p>
          <p>
            <strong>Total Amount Paid:</strong> ${confirmedBooking.pricing?.totalAmount?.toFixed(2)} USD
          </p>
          <p>
            <strong>Guest Name:</strong> {fullName}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => navigate(`/dashboard/guest/bookings`)}
            className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md shadow-gold-500/20"
          >
            Go to My Reservations
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleBookingSubmit} className="space-y-6">
      {/* Hotel & Category Banner */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold-500">
            Selected Suite
          </span>
          <h4 className="font-serif text-base font-bold text-slate-900 dark:text-white">
            {category.name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{hotel.name}</p>
        </div>
        <div className="text-right">
          <span className="font-serif text-xl font-bold text-slate-900 dark:text-white">
            ${category.basePrice}
          </span>
          <span className="text-[11px] text-slate-400 block">/ night</span>
        </div>
      </div>

      {/* Date & Guest Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Check-In Date
          </label>
          <input
            type="date"
            value={checkIn}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Check-Out Date
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      {/* Guest Details */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
          Primary Guest Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
          />
          <input
            type="tel"
            placeholder="Mobile Phone (+1...)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 sm:col-span-2"
          />
          <textarea
            placeholder="Special Requests (e.g. high floor, early arrival, airport pickup...)"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={2}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 sm:col-span-2"
          />
        </div>
      </div>

      {/* Promo Code section */}
      <div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 text-gold-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Promo Code (Try WELCOME10)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs uppercase font-mono text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyPromo}
            className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-gold-500 hover:text-slate-950 text-white font-bold text-xs transition-colors shrink-0"
          >
            Apply Code
          </button>
        </div>
        {appliedPromo && (
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Promo code {appliedPromo.code} active (-${discountAmount})
          </p>
        )}
      </div>

      {/* Transparent Pricing Breakdown */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span>
            ${category.basePrice} × {nights} Nights ({rooms} Suite)
          </span>
          <span className="font-semibold">${roomTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span>Hospitality Taxes (12%)</span>
          <span className="font-semibold">${taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span>Concierge & Resort Service Fee (5%)</span>
          <span className="font-semibold">${serviceFee.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Special Promotion Discount</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline text-slate-900 dark:text-white font-bold">
          <span className="text-sm">Total Payable Amount</span>
          <span className="font-serif text-lg text-gold-600 dark:text-gold-400">
            ${grandTotal.toFixed(2)} USD
          </span>
        </div>
      </div>

      {/* Payment Gateway Mode Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          Payment Method (Instant Demo or Production)
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('demo')}
            className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
              paymentMethod === 'demo'
                ? 'border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            ⚡ Instant Demo Pay
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('stripe')}
            className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
              paymentMethod === 'stripe'
                ? 'border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            💳 Stripe Sandbox
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('razorpay')}
            className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
              paymentMethod === 'razorpay'
                ? 'border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            🇮🇳 Razorpay UPI/Net
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-sm shadow-xl shadow-gold-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        <CreditCard className="w-4 h-4 stroke-[2.5]" />
        {loading ? 'Securing Your Reservation...' : `Confirm & Pay $${grandTotal.toFixed(2)}`}
      </button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Encrypted 256-bit TLS connection. Guaranteed reservation with 100% refund policy.</span>
      </div>
    </form>
  );
};

export default BookingForm;
