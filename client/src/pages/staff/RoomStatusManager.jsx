import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { BedDouble, Sparkles, Filter, Check, Wrench } from 'lucide-react';

const RoomStatusManager = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const hotelId = user.assignedHotel?._id || user.assignedHotel;

  const fetchRooms = async () => {
    setLoading(true);
    try {
      // If hotelId exists, use it; else fallback to first hotel
      let hId = hotelId;
      if (!hId) {
        const hRes = await axiosClient.get('/hotels?limit=1');
        if (hRes.success && hRes.hotels?.length > 0) {
          hId = hRes.hotels[0]._id;
        }
      }

      if (hId) {
        const res = await axiosClient.get(`/hotels/${hId}/rooms`);
        if (res.success) {
          setRooms(res.rooms || []);
        }
      }
    } catch (err) {
      showToast('Could not load physical rooms.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleUpdateStatus = async (roomId, newStatus, newHousekeeping) => {
    try {
      const res = await axiosClient.put(`/rooms/${roomId}/status`, {
        status: newStatus,
        housekeepingStatus: newHousekeeping,
      });

      if (res.success) {
        showToast(res.message, 'success');
        setRooms((prev) =>
          prev.map((r) => (r._id === roomId ? { ...r, ...res.room } : r))
        );
      }
    } catch (err) {
      showToast(err.message || 'Status update failed.', 'error');
    }
  };

  const filtered = rooms.filter((r) => {
    if (filterStatus === 'CLEAN') return r.housekeepingStatus === 'clean';
    if (filterStatus === 'DIRTY') return r.housekeepingStatus === 'dirty';
    if (filterStatus === 'OCCUPIED') return r.status === 'occupied';
    if (filterStatus === 'MAINTENANCE') return r.status === 'maintenance';
    return true;
  });

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Physical Room & Housekeeping Status Matrix"
        subtitle="Live occupancy and sanitation overview across property floors"
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { key: 'ALL', label: `All Rooms (${rooms.length})` },
          { key: 'CLEAN', label: 'Clean & Ready' },
          { key: 'DIRTY', label: 'Dirty / Cleaning Needed' },
          { key: 'OCCUPIED', label: 'Occupied' },
          { key: 'MAINTENANCE', label: 'Maintenance Block' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === tab.key
                ? 'bg-gold-500 text-slate-950 shadow-md shadow-gold-500/20'
                : 'bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonLoader count={4} />
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-12 text-center text-slate-500 text-xs">
          No rooms matching this status filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((room) => (
            <div
              key={room._id}
              className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                  Room {room.roomNumber}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Floor {room.floor}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {room.category?.name || 'Luxury Suite'}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <StatusBadge status={room.status} />
                <StatusBadge status={room.housekeepingStatus} />
              </div>

              {/* Occupied Guest details if available */}
              {room.currentBooking && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-0.5">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    Guest: {room.currentBooking.guestDetails?.fullName || room.currentBooking.guest?.name}
                  </p>
                  <p>Ref: {room.currentBooking.bookingReference}</p>
                </div>
              )}

              {/* Action Controls */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      room._id,
                      room.status,
                      room.housekeepingStatus === 'clean' ? 'dirty' : 'clean'
                    )
                  }
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    room.housekeepingStatus === 'clean'
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-teal-500 text-slate-950 hover:bg-teal-600'
                  }`}
                >
                  {room.housekeepingStatus === 'clean' ? 'Mark Dirty' : 'Mark Clean'}
                </button>

                <button
                  onClick={() =>
                    handleUpdateStatus(
                      room._id,
                      room.status === 'maintenance' ? 'available' : 'maintenance',
                      room.housekeepingStatus
                    )
                  }
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  title="Toggle Maintenance Block"
                >
                  <Wrench className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomStatusManager;
