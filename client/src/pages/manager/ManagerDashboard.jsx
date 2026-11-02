import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import {
  Hotel,
  BedDouble,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const hotelId = user.assignedHotel?._id || user.assignedHotel;
        let hData = null;
        if (hotelId) {
          const hRes = await axiosClient.get(`/hotels/${hotelId}`);
          if (hRes.success) hData = hRes.hotel;
        } else {
          const hRes = await axiosClient.get('/hotels?limit=1');
          if (hRes.success && hRes.hotels?.length > 0) hData = hRes.hotels[0];
        }
        setHotel(hData);

        const bRes = await axiosClient.get('/bookings?limit=10');
        if (bRes.success) {
          setBookings(bRes.bookings || []);
        }
      } catch (err) {
        console.warn('Could not load manager metrics:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, []);

  const totalRevenue = bookings.reduce(
    (acc, b) => (b.bookingStatus !== 'Cancelled' ? acc + (b.pricing?.totalAmount || 0) : acc),
    0
  );

  return (
    <div className="space-y-8">
      <DashboardHeader
        title={`Hotel Management Console: ${hotel?.name || 'Assigned Property'}`}
        subtitle="Manage suite inventory, pricing policies, staff turnaround, and reservation yield"
        action={
          <div className="flex gap-2">
            <Link
              to="/dashboard/manager/rooms"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Manage Inventory
            </Link>
            <Link
              to="/dashboard/manager/hotels"
              className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md"
            >
              Edit Property
            </Link>
          </div>
        }
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Occupancy Yield"
          value="84%"
          subtitle="Above regional average"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Recent Bookings"
          value={bookings.length}
          subtitle="Confirmed reservations"
          icon={CalendarCheck}
          color="gold"
        />
        <StatCard
          title="Gross Bookings Value"
          value={`$${totalRevenue.toLocaleString()}`}
          subtitle="Active guest stay billing"
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Guest Star Rating"
          value={hotel?.ratingSummary?.averageRating?.toFixed(1) || '4.9'}
          subtitle={`${hotel?.ratingSummary?.totalReviews || 128} verified reviews`}
          icon={Sparkles}
          color="purple"
        />
      </div>

      {/* Recent Reservations Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
            Recent Reservations
          </h3>
          <Link
            to="/dashboard/manager/bookings"
            className="text-xs font-bold text-gold-600 dark:text-gold-400 hover:underline flex items-center gap-1"
          >
            All Reservations <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="p-3">Reference</th>
                <th className="p-3">Guest Name</th>
                <th className="p-3">Suite Tier</th>
                <th className="p-3">Stay Dates</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {bookings.slice(0, 6).map((b) => (
                <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-slate-400">{b.bookingReference}</td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">
                    {b.guestDetails?.fullName || b.guest?.name}
                  </td>
                  <td className="p-3">{b.roomCategory?.name}</td>
                  <td className="p-3">
                    {new Date(b.checkInDate).toLocaleDateString()} –{' '}
                    {new Date(b.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-bold text-gold-600 dark:text-gold-400">
                    ${b.pricing?.totalAmount?.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={b.bookingStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
