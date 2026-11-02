import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Search, Calendar, Filter } from 'lucide-react';

const ManagerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (statusFilter) query.append('status', statusFilter);
      query.append('page', page);
      query.append('limit', 12);

      const res = await axiosClient.get(`/bookings?${query.toString()}`);
      if (res.success) {
        setBookings(res.bookings || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Reservations & Guest Stay Ledger"
        subtitle={`Total ${total} guest reservations tracked in hotel management database`}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reference or guest name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="">All Reservation Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked In">Checked In</option>
            <option value="Checked Out">Checked Out</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <SkeletonLoader count={4} />
      ) : (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider bg-slate-50/50 dark:bg-navy-950/40">
                  <th className="p-4 px-6">Reference</th>
                  <th className="p-4 px-6">Guest Details</th>
                  <th className="p-4 px-6">Suite Category</th>
                  <th className="p-4 px-6">Room Assigned</th>
                  <th className="p-4 px-6">Check-In / Out</th>
                  <th className="p-4 px-6">Amount Paid</th>
                  <th className="p-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 px-6 font-mono font-bold text-slate-400">{b.bookingReference}</td>
                    <td className="p-4 px-6">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {b.guestDetails?.fullName || b.guest?.name}
                      </p>
                      <p className="text-[11px] text-slate-400">{b.guestDetails?.email || b.guest?.email}</p>
                    </td>
                    <td className="p-4 px-6">{b.roomCategory?.name}</td>
                    <td className="p-4 px-6">
                      {b.assignedRoom ? (
                        <span className="font-bold text-slate-900 dark:text-white">
                          Room {b.assignedRoom.roomNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4 px-6">
                      <p className="font-semibold">
                        {new Date(b.checkInDate).toLocaleDateString()}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        to {new Date(b.checkOutDate).toLocaleDateString()} ({b.totalNights} nts)
                      </p>
                    </td>
                    <td className="p-4 px-6 font-bold text-gold-600 dark:text-gold-400 font-serif">
                      ${b.pricing?.totalAmount?.toFixed(2)}
                    </td>
                    <td className="p-4 px-6">
                      <StatusBadge status={b.bookingStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ManagerBookings;
