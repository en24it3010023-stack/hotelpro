import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import {
  ConciergeBell,
  Plus,
  Utensils,
  Sparkles,
  Wrench,
  Clock,
  Car,
} from 'lucide-react';

const GuestServiceRequests = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Request Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [serviceType, setServiceType] = useState('room_service');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, bookRes] = await Promise.all([
        axiosClient.get('/service-requests'),
        axiosClient.get('/bookings/my-bookings'),
      ]);

      if (reqRes.success) setRequests(reqRes.requests || []);
      if (bookRes.success) {
        setBookings(bookRes.bookings || []);
        if (bookRes.bookings.length > 0 && !bookingId) {
          setBookingId(bookRes.bookings[0]._id);
        }
      }
    } catch (err) {
      showToast('Could not load service requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!bookingId || !title) {
      showToast('Please select a reservation and specify request title.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosClient.post('/service-requests', {
        bookingId,
        serviceType,
        title,
        description,
        priority,
      });

      if (res.success) {
        showToast('Request dispatched to hotel staff.', 'success');
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        fetchData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Guest Concierge & In-Room Requests"
        subtitle="Request in-room dining, extra Egyptian cotton towels, housekeeping refresh, or luggage transport"
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={bookings.length === 0}
            className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Service Request
          </button>
        }
      />

      {loading ? (
        <SkeletonLoader count={3} />
      ) : requests.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-12 text-center space-y-3">
          <ConciergeBell className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
            No active service requests
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Need an extra pillow, midnight dining, or airport limousine? Click the button above to request.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Room {req.roomNumber || 'TBD'} • {req.serviceType?.replace('_', ' ')}
                </span>
                <StatusBadge status={req.status} />
              </div>

              <div>
                <h4 className="font-serif text-base font-bold text-slate-900 dark:text-white">
                  {req.title}
                </h4>
                {req.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {req.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gold-500" />
                  <span>Requested: {new Date(req.requestedAt).toLocaleTimeString()}</span>
                </div>
                {req.assignedStaff && (
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Handled by: {req.assignedStaff.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Dispatch Concierge Service Request"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Select Active Stay *
            </label>
            <select
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            >
              {bookings.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.hotel?.name} (Ref: {b.bookingReference})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Service Category *
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            >
              <option value="room_service">🍽️ In-Room Dining & Breakfast</option>
              <option value="housekeeping">✨ Housekeeping & Fresh Towels</option>
              <option value="maintenance">🔧 Suite Maintenance / Climate</option>
              <option value="concierge">🛎️ VIP Concierge & Luggage</option>
              <option value="transport">🚗 Limousine / Airport Transport</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Request Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Extra Egyptian cotton towels & bathrobes"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Specific Instructions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Delivery time preferences, dietary needs, or quantity details..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            {submitting ? 'Dispatching to Concierge...' : 'Submit Request'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default GuestServiceRequests;
