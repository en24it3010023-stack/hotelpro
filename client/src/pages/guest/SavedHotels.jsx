import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import HotelCard from '../../components/hotel/HotelCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Heart, Compass } from 'lucide-react';

const SavedHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const userRes = await axiosClient.get('/auth/me');
        if (userRes.success && userRes.user.favorites?.length > 0) {
          // Fetch hotels corresponding to favorites
          const hotelRes = await axiosClient.get('/hotels?limit=50');
          if (hotelRes.success) {
            const favIds = userRes.user.favorites.map((f) => (typeof f === 'string' ? f : f._id));
            const favHotels = (hotelRes.hotels || []).filter((h) => favIds.includes(h._id));
            setHotels(favHotels);
          }
        }
      } catch (err) {
        console.warn('Could not load saved hotels:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Saved Sanctuaries"
        subtitle="Your personalized wishlist of flagship resorts and private estates"
      />

      {loading ? (
        <SkeletonLoader count={3} />
      ) : hotels.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-12 text-center space-y-4">
          <Heart className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any hotel card to curate your private collection.
          </p>
          <Link
            to="/explore"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs"
          >
            Explore Hotels
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedHotels;
