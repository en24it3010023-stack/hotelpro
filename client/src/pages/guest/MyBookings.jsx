import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import Modal from '../../components/common/Modal';
import RatingStars from '../../components/common/RatingStars';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import {
  CalendarCheck,
  FileText,
  XCircle,
  Star,
  MapPin,
  ExternalLink,
} from 'lucide-react';

const MyBookings = () => {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Cancel reservation state
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Review modal state
  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/bookings/my-bookings');
      if (res.success) {
        setBookings(res.bookings || []);
      }
    } catch (err) {
      showToast('Could not load reservations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async () => {
    if (!cancellingBooking) return;
    setCancelLoading(true);
    try {
      const res = await axiosClient.put(`/bookings/${cancellingBooking._id}/cancel`);
      if (res.success) {
        showToast(res.message || 'Reservation cancelled.', 'success');
        setCancellingBooking(null);
        fetchBookings();
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel reservation.', 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewTitle || !reviewComment) {
      showToast('Please complete review title and comments.', 'error');
      return;
    }

    setReviewLoading(true);
    try {
      const res = await axiosClient.post('/reviews', {
        bookingId: reviewBooking._id,
        rating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (res.success) {
        showToast('Thank you! Your verified stay review has been published.', 'success');
        setReviewBooking(null);
        setReviewTitle('');
        setReviewComment('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit review.', 'error');
    } finally {
      setReviewLoading(false);
    }
  };

  const filtered = bookings.filter((b) => {
    if (activeFilter === 'UPCOMING') return ['Confirmed', 'Pending'].includes(b.bookingStatus);
    if (activeFilter === 'ACTIVE') return b.bookingStatus === 'Checked In';
    if (activeFilter === 'COMPLETED') return b.bookingStatus === 'Checked Out';
    if (activeFilter === 'CANCELLED') return ['Cancelled', 'Refund Pending'].includes(b.bookingStatus);
    return true;
  });

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="My Sanctuary Reservations"
        subtitle="Manage upcoming stays, download invoices, cancel bookings, or share verified stay feedback"
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { key: 'ALL', label: `All (${bookings.length})` },
          { key: 'UPCOMING', label: 'Upcoming' },
          { key: 'ACTIVE', label: 'Active Stay' },
          { key: 'COMPLETED', label: 'Completed' },
          { key: 'CANCELLED', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === tab.key
                ? 'bg-gold-500 text-slate-950 shadow-md shadow-gold-500/20'
                : 'bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonLoader count={3} />
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-12 text-center space-y-4">
          <CalendarCheck className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
            No reservations in this category
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our curated luxury portfolio to plan your next peaceful escape.
          </p>
          <Link
            to="/explore"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs"
          >
            Explore Sanctuaries
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <div
              key={booking._id}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-6 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-3 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src={
                    booking.hotel?.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={booking.hotel?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {booking.bookingReference}
                  </span>
                  <StatusBadge status={booking.bookingStatus} />
                </div>

                <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                  {booking.hotel?.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gold-500" />
                  {booking.hotel?.address?.city}, {booking.hotel?.address?.country}
                </p>

                <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Dates</span>
                    <span className="font-semibold">
                      {new Date(booking.checkInDate).toLocaleDateString()} –{' '}
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Suite</span>
                    <span className="font-semibold">{booking.roomCategory?.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Paid Total</span>
                    <span className="font-bold text-gold-600 dark:text-gold-400 font-serif text-sm">
                      ${booking.pricing?.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col gap-2 justify-center">
                <Link
                  to={`/dashboard/guest/bookings/${booking._id}`}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-gold-500 text-xs font-bold text-slate-800 dark:text-slate-200 text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-gold-500" /> View Invoice
                </Link>

                {/* Cancel button if confirmed */}
                {['Confirmed', 'Pending'].includes(booking.bookingStatus) && (
                  <button
                    onClick={() => setCancellingBooking(booking)}
                    className="w-full py-2 px-4 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    Cancel Stay
                  </button>
                )}

                {/* Verified Review button if completed */}
                {booking.bookingStatus === 'Checked Out' && (
                  <button
                    onClick={() => setReviewBooking(booking)}
                    className="w-full py-2 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Star className="w-3.5 h-3.5" /> Share Stay Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancellation Dialog */}
      <ConfirmationDialog
        isOpen={!!cancellingBooking}
        onClose={() => setCancellingBooking(null)}
        onConfirm={handleCancel}
        title="Cancel This Reservation?"
        message={`Are you sure you want to cancel booking ${cancellingBooking?.bookingReference}? In accordance with ${cancellingBooking?.hotel?.name}'s cancellation policy, eligible refunds are automatically computed and credited back to your original payment method.`}
        confirmText="Confirm Cancellation"
        isDanger={true}
        loading={cancelLoading}
      />

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewBooking}
        onClose={() => setReviewBooking(null)}
        title="Share Your Verified Stay Feedback"
        maxWidth="max-w-lg"
      >
        {reviewBooking && (
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 mb-2">
                Stay at <strong>{reviewBooking.hotel?.name}</strong> (
                {reviewBooking.roomCategory?.name})
              </p>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Overall Experience Rating
              </label>
              <div className="flex gap-2 text-gold-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        s <= rating ? 'fill-gold-500 text-gold-500' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Review Headline *
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Divine ocean views and impeccable concierge service"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Detailed Comments *
              </label>
              <textarea
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience regarding room comfort, breakfast, staff attentiveness, and spa treatments..."
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={reviewLoading}
              className="w-full py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md shadow-gold-500/20 transition-all"
            >
              {reviewLoading ? 'Publishing Review...' : 'Publish Verified Review'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default MyBookings;
