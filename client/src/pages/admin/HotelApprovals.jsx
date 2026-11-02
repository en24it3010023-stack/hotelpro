import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import { Hotel, CheckCircle2, ShieldAlert, Star, MapPin } from 'lucide-react';

const HotelApprovals = () => {
  const { showToast } = useToast();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/hotels?limit=50');
      if (res.success) {
        setHotels(res.hotels || []);
      }
    } catch (err) {
      showToast('Could not load hotels.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleToggleStatus = async (hotelId, newStatus) => {
    try {
      const res = await axiosClient.put(`/hotels/${hotelId}`, { status: newStatus });
      if (res.success) {
        showToast(`Hotel status changed to ${newStatus}.`, 'success');
        setHotels((prev) =>
          prev.map((h) => (h._id === hotelId ? { ...h, status: newStatus } : h))
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update hotel status.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Sanctuary Hotels Portfolio & Moderation"
        subtitle={`Total ${hotels.length} luxury partner properties operating on HotelPro`}
      />

      {loading ? (
        <SkeletonLoader count={3} />
      ) : (
        <div className="space-y-4">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    hotel.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={hotel.name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                      {hotel.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        hotel.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                      }`}
                    >
                      {hotel.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold-500" />
                    {hotel.address?.city}, {hotel.address?.country} • Rating: ★ {hotel.ratingSummary?.averageRating?.toFixed(1) || '4.9'}
                  </p>
                  <p className="text-xs font-serif font-bold text-gold-600 dark:text-gold-400">
                    From ${hotel.startingPrice} / night
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {hotel.status !== 'active' ? (
                  <button
                    onClick={() => handleToggleStatus(hotel._id, 'active')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Activate
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleStatus(hotel._id, 'suspended')}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" /> Suspend Listing
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelApprovals;
