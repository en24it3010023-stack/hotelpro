import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import {
  Users,
  LogIn,
  LogOut,
  BedDouble,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const StaffDashboard = () => {
  const [deskData, setDeskData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const res = await axiosClient.get('/staff/desk-summary');
      if (res.success) {
        setDeskData(res);
      }
    } catch (err) {
      console.warn('Failed to load front desk summary:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const stats = deskData?.stats || {
    totalRooms: 8,
    occupiedRooms: 2,
    dirtyRooms: 1,
    todayArrivalsCount: 1,
    todayDeparturesCount: 1,
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Front Desk & Operations Command"
        subtitle="Manage daily arrivals, departures, room inventory turnaround, and guest requests"
        action={
          <Link
            to="/dashboard/staff/desk"
            className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" /> Check-In / Out Desk
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Arrivals"
          value={stats.todayArrivalsCount}
          subtitle="Guests checking in today"
          icon={LogIn}
          color="gold"
        />
        <StatCard
          title="Today's Departures"
          value={stats.todayDeparturesCount}
          subtitle="Guests checking out today"
          icon={LogOut}
          color="blue"
        />
        <StatCard
          title="Occupied Suites"
          value={stats.occupiedRooms}
          subtitle={`Out of ${stats.totalRooms} total inventory`}
          icon={BedDouble}
          color="purple"
        />
        <StatCard
          title="Dirty / Cleaning Needed"
          value={stats.dirtyRooms}
          subtitle="Housekeeping turnarounds"
          icon={Sparkles}
          color="rose"
        />
      </div>

      {/* Split View: Expected Arrivals & Departures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Arrivals Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LogIn className="w-5 h-5 text-gold-500" /> Today's Arrivals
            </h3>
            <Link
              to="/dashboard/staff/desk"
              className="text-xs font-bold text-gold-600 dark:text-gold-400 hover:underline"
            >
              Open Desk →
            </Link>
          </div>

          {loading ? (
            <SkeletonLoader count={2} />
          ) : (deskData?.arrivals || []).length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No more arrivals scheduled today.</p>
          ) : (
            <div className="space-y-3">
              {deskData.arrivals.map((b) => (
                <div
                  key={b._id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {b.guestDetails?.fullName || b.guest?.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {b.roomCategory?.name} • Ref: {b.bookingReference}
                    </p>
                  </div>
                  <Link
                    to="/dashboard/staff/desk"
                    className="px-3 py-1.5 rounded-lg bg-gold-500 text-slate-950 font-bold text-xs"
                  >
                    Check In
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Departures Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LogOut className="w-5 h-5 text-blue-500" /> Today's Departures
            </h3>
            <Link
              to="/dashboard/staff/desk"
              className="text-xs font-bold text-gold-600 dark:text-gold-400 hover:underline"
            >
              Open Desk →
            </Link>
          </div>

          {loading ? (
            <SkeletonLoader count={2} />
          ) : (deskData?.departures || []).length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No departures scheduled today.</p>
          ) : (
            <div className="space-y-3">
              {deskData.departures.map((b) => (
                <div
                  key={b._id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {b.guestDetails?.fullName || b.guest?.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Room {b.assignedRoom?.roomNumber || 'TBD'} • Ref: {b.bookingReference}
                    </p>
                  </div>
                  <Link
                    to="/dashboard/staff/desk"
                    className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs"
                  >
                    Check Out
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
