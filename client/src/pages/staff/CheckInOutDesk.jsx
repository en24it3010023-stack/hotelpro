import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import {
  LogIn,
  LogOut,
  Search,
  Key,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  BedDouble,
} from 'lucide-react';

const CheckInOutDesk = () => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [deskData, setDeskData] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check-In modal state
  const [checkInBooking, setCheckInBooking] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [keyCard, setKeyCard] = useState('');
  const [checkInLoading, setCheckInLoading] = useState(false);

  // Check-Out modal state
  const [checkOutBooking, setCheckOutBooking] = useState(null);
  const [damages, setDamages] = useState('None');
  const [checkOutLoading, setCheckOutLoading] = useState(false);

  const fetchDesk = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/staff/desk-summary');
      if (res.success) {
        setDeskData(res);
      }
    } catch (err) {
      showToast('Failed to fetch desk data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesk();
  }, []);

  const openCheckInModal = async (booking) => {
    setCheckInBooking(booking);
    setKeyCard(`KEY-${Math.floor(100000 + Math.random() * 900000)}`);

    // Fetch clean available rooms for this hotel
    try {
      const res = await axiosClient.get(`/hotels/${booking.hotel._id || booking.hotel}/rooms?status=available&housekeepingStatus=clean`);
      if (res.success) {
        setAvailableRooms(res.rooms || []);
        if (res.rooms?.length > 0) {
          setSelectedRoomId(res.rooms[0]._id);
        }
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleConfirmCheckIn = async (e) => {
    e.preventDefault();
    if (!checkInBooking) return;

    setCheckInLoading(true);
    try {
      const res = await axiosClient.post('/staff/check-in', {
        bookingId: checkInBooking._id,
        roomId: selectedRoomId,
        keyCardIssued: keyCard,
      });

      if (res.success) {
        showToast(res.message, 'success');
        setCheckInBooking(null);
        fetchDesk();
      }
    } catch (err) {
      showToast(err.message || 'Check-in failed.', 'error');
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleConfirmCheckOut = async (e) => {
    e.preventDefault();
    if (!checkOutBooking) return;

    setCheckOutLoading(true);
    try {
      const res = await axiosClient.post('/staff/check-out', {
        bookingId: checkOutBooking._id,
        damagesReported: damages,
      });

      if (res.success) {
        showToast(res.message, 'success');
        setCheckOutBooking(null);
        fetchDesk();
      }
    } catch (err) {
      showToast(err.message || 'Check-out failed.', 'error');
    } finally {
      setCheckOutLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Check-In / Check-Out Concierge Desk"
        subtitle="Process guest arrivals, room keycard issuance, and departure turnaround"
      />

      {/* Desk Grid: Arrivals on Left, Departures on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Arrivals Desk */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LogIn className="w-5 h-5 text-gold-500" /> Pending Arrivals (Check-In)
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {deskData?.arrivals?.length || 0} scheduled
            </span>
          </div>

          {(deskData?.arrivals || []).length === 0 ? (
            <p className="text-xs text-slate-400 py-10 text-center">No arrivals pending check-in.</p>
          ) : (
            <div className="space-y-3">
              {deskData.arrivals.map((b) => (
                <div
                  key={b._id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      {b.bookingReference}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {b.guestDetails?.fullName || b.guest?.name}
                    </h4>
                    <p className="text-slate-500">
                      {b.roomCategory?.name} • {b.totalNights} Nights
                    </p>
                  </div>

                  <button
                    onClick={() => openCheckInModal(b)}
                    className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Check In
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Departures Desk */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LogOut className="w-5 h-5 text-blue-500" /> Current Guests (Check-Out)
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {deskData?.departures?.length || 0} active
            </span>
          </div>

          {(deskData?.departures || []).length === 0 ? (
            <p className="text-xs text-slate-400 py-10 text-center">No guests checking out today.</p>
          ) : (
            <div className="space-y-3">
              {deskData.departures.map((b) => (
                <div
                  key={b._id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      {b.bookingReference}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {b.guestDetails?.fullName || b.guest?.name}
                    </h4>
                    <p className="text-slate-500">
                      Room{' '}
                      <strong className="text-gold-600 dark:text-gold-400">
                        {b.assignedRoom?.roomNumber || 'Assigned'}
                      </strong>{' '}
                      • {b.roomCategory?.name}
                    </p>
                  </div>

                  <button
                    onClick={() => setCheckOutBooking(b)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Check Out
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Check-In Modal */}
      <Modal
        isOpen={!!checkInBooking}
        onClose={() => setCheckInBooking(null)}
        title="Process Guest Check-In & Issue Keycard"
        maxWidth="max-w-md"
      >
        {checkInBooking && (
          <form onSubmit={handleConfirmCheckIn} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <p>
                <strong>Guest:</strong> {checkInBooking.guestDetails?.fullName || checkInBooking.guest?.name}
              </p>
              <p>
                <strong>Category:</strong> {checkInBooking.roomCategory?.name}
              </p>
              <p>
                <strong>Stay Period:</strong> {new Date(checkInBooking.checkInDate).toLocaleDateString()} –{' '}
                {new Date(checkInBooking.checkOutDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Assign Clean Physical Room *
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-bold"
              >
                {availableRooms.map((r) => (
                  <option key={r._id} value={r._id}>
                    Room {r.roomNumber} (Floor {r.floor}) — Clean & Ready
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Keycard Electronic Access Code *
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-gold-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={keyCard}
                  onChange={(e) => setKeyCard(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={checkInLoading || availableRooms.length === 0}
              className="w-full py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              {checkInLoading ? 'Activating Keycard...' : 'Complete Check-In & Hand Keycard'}
            </button>
          </form>
        )}
      </Modal>

      {/* Check-Out Modal */}
      <Modal
        isOpen={!!checkOutBooking}
        onClose={() => setCheckOutBooking(null)}
        title="Process Guest Check-Out & Finalize Room"
        maxWidth="max-w-md"
      >
        {checkOutBooking && (
          <form onSubmit={handleConfirmCheckOut} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <p>
                <strong>Guest:</strong> {checkOutBooking.guestDetails?.fullName}
              </p>
              <p>
                <strong>Room to be vacated:</strong> Room{' '}
                {checkOutBooking.assignedRoom?.roomNumber || 'TBD'}
              </p>
              <p>
                <strong>Total Settled:</strong> ${checkOutBooking.pricing?.totalAmount?.toFixed(2)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Room Inspection / Damages Report
              </label>
              <input
                type="text"
                value={damages}
                onChange={(e) => setDamages(e.target.value)}
                placeholder="None reported"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={checkOutLoading}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
            >
              {checkOutLoading ? 'Processing...' : 'Confirm Check-Out & Mark Room Dirty'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default CheckInOutDesk;
