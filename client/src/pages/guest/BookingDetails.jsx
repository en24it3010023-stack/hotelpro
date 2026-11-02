import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Printer,
  ArrowLeft,
  Hotel,
  Calendar,
  CreditCard,
  Key,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const BookingDetails = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/bookings/${id}`);
        if (res.success) {
          setBooking(res.booking);
        }
      } catch (err) {
        showToast(err.message || 'Failed to fetch booking details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Retrieving luxury itinerary..." />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-12 text-center space-y-4">
        <h3 className="text-lg font-bold">Booking Not Found</h3>
        <Link to="/dashboard/guest/bookings" className="text-gold-500 font-bold text-xs">
          Return to Reservations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/dashboard/guest/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Bookings
        </Link>
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-gold-500 text-white hover:text-slate-950 font-bold text-xs shadow-md flex items-center gap-2 transition-all"
        >
          <Printer className="w-4 h-4" /> Print / Download Invoice
        </button>
      </div>

      {/* Printable Invoice Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-8 sm:p-12 shadow-xl space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Invoice Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-slate-950 font-bold text-xl shadow-md">
              <Hotel className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Hotel<span className="text-gold-500">Pro</span>
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Official Reservation Statement
              </p>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <StatusBadge status={booking.bookingStatus} />
            <p className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
              Ref: {booking.bookingReference}
            </p>
            <p className="text-[10px] text-slate-400">
              Issued: {new Date(booking.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Property & Stay Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-500 block mb-1">
              Sanctuary Property
            </span>
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              {booking.hotel?.name}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">
              {booking.hotel?.address?.street}, {booking.hotel?.address?.city},{' '}
              {booking.hotel?.address?.country}
            </p>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Contact: {booking.hotel?.contact?.phone || '+1 (800) 555-LUXURY'}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-500 block mb-1">
              Registered Guest
            </span>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {booking.guestDetails?.fullName || booking.guest?.name}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Email: {booking.guestDetails?.email || booking.guest?.email}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Phone: {booking.guestDetails?.phone || booking.guest?.phone || 'On file'}
            </p>
          </div>
        </div>

        {/* Stay & Room Details Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Check-In</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">
              {new Date(booking.checkInDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Check-Out</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">
              {new Date(booking.checkOutDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Suite Assigned</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">
              {booking.assignedRoom ? `Room ${booking.assignedRoom.roomNumber}` : 'Allocated at Desk'}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Payment Escrow</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 uppercase">
              {booking.paymentStatus}
            </p>
          </div>
        </div>

        {/* Keycard Notice if Checked In */}
        {booking.assignedRoom && (
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300">
              <Key className="w-4 h-4 text-blue-500" />
              <span>
                Keycard Code: <strong className="font-mono text-sm">{booking.assignedRoom.keyCardCode}</strong>
              </span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Door Scanner Active
            </span>
          </div>
        )}

        {/* Pricing Breakdown Table */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Financial Ledger Summary
          </h4>
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="flex justify-between p-3.5">
              <span>
                {booking.roomCategory?.name} ({booking.totalNights} Nights)
              </span>
              <span className="font-bold">${booking.pricing?.roomTotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-3.5">
              <span>Hospitality & City Surcharge Taxes (12%)</span>
              <span>${booking.pricing?.taxAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-3.5">
              <span>Concierge & Maintenance Fee (5%)</span>
              <span>${booking.pricing?.serviceFee?.toFixed(2)}</span>
            </div>
            {booking.pricing?.discountAmount > 0 && (
              <div className="flex justify-between p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Voucher Discount ({booking.pricing?.promoCode})</span>
                <span>-${booking.pricing?.discountAmount?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between p-4 bg-slate-50 dark:bg-navy-950 text-sm font-bold text-slate-900 dark:text-white rounded-b-2xl">
              <span>Total Settled Amount</span>
              <span className="font-serif text-lg text-gold-600 dark:text-gold-400">
                ${booking.pricing?.totalAmount?.toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

        {/* Escrow stamp */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Guaranteed HotelPro Escrow Ledger • Encrypted Electronic Signature</span>
          </div>
          <span>HotelPro Systems Inc.</span>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
