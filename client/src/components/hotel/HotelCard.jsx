import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';

const HotelCard = ({ hotel }) => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const isFavorite = user?.favorites?.includes(hotel._id);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in to save favorite luxury hotels.', 'info');
      return;
    }

    try {
      const updatedFavorites = isFavorite
        ? user.favorites.filter((id) => id !== hotel._id)
        : [...(user.favorites || []), hotel._id];

      const res = await axiosClient.put('/auth/profile', { favorites: updatedFavorites });
      if (res.success) {
        updateUser({ ...user, favorites: updatedFavorites });
        showToast(
          isFavorite ? 'Removed from saved hotels.' : 'Added to your private collection.',
          'success'
        );
      }
    } catch (err) {
      showToast('Could not update favorites.', 'error');
    }
  };

  const primaryImage =
    hotel.images?.find((img) => img.isPrimary)?.url ||
    hotel.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group rounded-3xl overflow-hidden bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Card Image Banner */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
          <img
            src={primaryImage}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {hotel.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-gold-500 text-slate-950 shadow-md">
                <Sparkles className="w-3 h-3" /> Flagship
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md">
              <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
              {hotel.starRating} Stars
            </span>
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-all hover:scale-110"
            aria-label="Save hotel"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
              }`}
            />
          </button>

          {/* Location on image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 drop-shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              {hotel.address?.city}, {hotel.address?.country}
            </span>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold">
              ★ {hotel.ratingSummary?.averageRating?.toFixed(1) || '4.9'}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <Link to={`/hotels/${hotel._id}`}>
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white group-hover:text-gold-500 transition-colors line-clamp-1">
              {hotel.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {hotel.tagline || hotel.description}
          </p>

          {/* Amenities snippets */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hotel.amenities?.slice(0, 3).map((a, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {a}
              </span>
            ))}
            {hotel.amenities?.length > 3 && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/50 text-slate-400">
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Starting Price & CTA */}
      <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Starting from
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              ${hotel.startingPrice}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ night</span>
          </div>
        </div>

        <Link
          to={`/hotels/${hotel._id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-gold-500 text-white hover:text-slate-950 font-bold text-xs transition-all shadow-sm"
        >
          View Suites <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default HotelCard;
