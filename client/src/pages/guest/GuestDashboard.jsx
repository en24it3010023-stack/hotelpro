import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import {
  CalendarCheck,
  Heart,
  ConciergeBell,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';

const GuestDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuestData = async () => {
      try {
        const res = await axiosClient.get('/bookings/my-bookings');
        if (res.success) {
          setBookings(res.bookings || []);
        }
      } catch (err) {
        console.warn('Failed to load guest reservations:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGuestData();
  }, []);

  const upcomingBookings = bookings.filter((b) => ['Confirmed', 'Pending'].includes(b.bookingStatus));
  const activeStay = bookings.find((b) => b.bookingStatus === 'Checked In');
  const pastBookings = bookings.filter((b) => ['Checked Out', 'Cancelled'].includes(b.bookingStatus));

  return (
    <div className="space-y-8">
      <DashboardHeader
        title={`Welcome, ${user.name}`}
        subtitle="Manage your sanctuary reservations, room requests, and VIP privileges"
        action={
          <Link
            to="/explore"
            className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Book New Stay
          </Link>
        }
      />

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Upcoming Stays"
          value={upcomingBookings.length}
          subtitle="Confirmed future escapes"
          icon={CalendarCheck}
          color="gold"
        />
        <StatCard
          title="Active Stay"
          value={activeStay ? 'Checked In' : 'None'}
          subtitle={activeStay ? activeStay.hotel?.name : 'No active stay today'}
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Completed Stays"
          value={pastBookings.length}
          subtitle="Past sanctuary memories"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Saved Sanctuaries"
          value={user.favorites?.length || 0}
          subtitle="In your private wishlist"
          icon={Heart}
          color="purple"
        />
      </div>

      {/* Active Stay Card (if checked in) */}
      {activeStay && (
        <div className="rounded-3xl border-2 border-gold-500 bg-gradient-to-r from-gold-500/10 via-amber-500/5 to-transparent p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gold-500 text-slate-950">
              Current Active Stay
            </span>
            <span className="text-xs font-mono font-bold">{activeStay.bookingReference}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                {activeStay.hotel?.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeStay.roomCategory?.name} • Room{' '}
                <strong className="text-gold-600 dark:text-gold-400">
                  {activeStay.assignedRoom?.roomNumber || 'Assigned at Desk'}
                </strong>
              </p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300">
              <p>
                <strong>Check-Out:</strong>{' '}
                {new Date(activeStay.checkOutDate).toLocaleDateString()}
              </p>
              <p className="text-slate-400">Keycard active on door scanner</p>
            </div>

            <div className="flex gap-2 justify-end">
              <Link
                to="/dashboard/guest/services"
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs"
              >
                Request Room Service
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Next Upcoming Reservation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
            Next Upcoming Reservation
          </h2>
          <Link
            to="/dashboard/guest/bookings"
            className="text-xs font-bold text-gold-600 dark:text-gold-400 hover:underline"
          >
            View all {bookings.length} reservations →
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-8 text-center space-y-3">
            <CalendarCheck className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="font-serif text-base font-bold text-slate-900 dark:text-white">
              No upcoming escapes scheduled
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ready for your next luxury journey? Explore our private island villas and mountain chalets.
            </p>
            <Link
              to="/explore"
              className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs"
            >
              Browse Hotels
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
            <div className="md:col-span-4 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={
                  upcomingBookings[0].hotel?.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
                }
                alt={upcomingBookings[0].hotel?.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {upcomingBookings[0].bookingReference}
                  </span>
                  <StatusBadge status={upcomingBookings[0].bookingStatus} />
                </div>

                <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {upcomingBookings[0].hotel?.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gold-500" />
                  {upcomingBookings[0].hotel?.address?.city},{' '}
                  {upcomingBookings[0].hotel?.address?.country}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 p-3 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Check-In</span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {new Date(upcomingBookings[0].checkInDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Check-Out</span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {new Date(upcomingBookings[0].checkOutDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Length</span>
                    <p className="font-bold text-gold-600 dark:text-gold-400">
                      {upcomingBookings[0].totalNights} Nights
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total Paid</span>
                  <p className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                    ${upcomingBookings[0].pricing?.totalAmount?.toFixed(2)} USD
                  </p>
                </div>
                <Link
                  to={`/dashboard/guest/bookings/${upcomingBookings[0]._id}`}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-gold-500 hover:text-slate-950 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  Itinerary & Invoice <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestDashboard;
