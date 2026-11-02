import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import RatingStars from '../components/common/RatingStars';
import AmenitiesList from '../components/hotel/AmenitiesList';
import RoomCard from '../components/hotel/RoomCard';
import BookingForm from '../components/hotel/BookingForm';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  MapPin,
  Clock,
  ShieldAlert,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Phone,
  Mail,
  Share2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const HotelDetails = () => {
  const { id } = useParams();
  const { showToast } = useToast();

  const [hotel, setHotel] = useState(null);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reservation dates state
  const [checkIn, setCheckIn] = useState(
    new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [checkOut, setCheckOut] = useState(
    new Date(Date.now() + 96 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  const fetchHotelData = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/hotels/${id}`);
      if (res.success) {
        setHotel(res.hotel);
        setCategories(res.roomCategories || []);
      }

      // Fetch verified reviews
      const reviewRes = await axiosClient.get(`/hotels/${id}/reviews`);
      if (reviewRes.success) {
        setReviews(reviewRes.reviews || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load hotel details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelData();
  }, [id]);

  const handleSelectRoom = (category) => {
    setSelectedCategory(category);
    setIsBookingModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Hotel link copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner text="Unveiling hotel details..." />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold">Property Not Found</h2>
        <p className="text-sm text-slate-500">The requested hotel property does not exist or has been archived.</p>
        <Link to="/explore" className="px-5 py-2.5 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs inline-block">
          Explore Other Sanctuaries
        </Link>
      </div>
    );
  }

  const images = hotel.images && hotel.images.length > 0
    ? hotel.images
    : [{ url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80' }];

  const nights = Math.max(
    1,
    Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-gold-500">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/explore" className="hover:text-gold-500">Hotels</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 dark:text-white font-bold">{hotel.name}</span>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 font-bold hover:text-gold-500 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" /> Share Property
        </button>
      </div>

      {/* Property Title & Rating Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-gold-500">
              5-Star Diamond Sanctuary
            </span>
            <span className="text-slate-300">•</span>
            <RatingStars
              rating={hotel.ratingSummary?.averageRating || 4.9}
              totalReviews={hotel.ratingSummary?.totalReviews || reviews.length}
            />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white mt-1">
            {hotel.name}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-2">
            <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
            <span>
              {hotel.address?.street}, {hotel.address?.city}, {hotel.address?.state}{' '}
              {hotel.address?.zipCode}, {hotel.address?.country}
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-1 text-right">
          <span className="text-xs text-slate-400">from</span>
          <span className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
            ${hotel.startingPrice}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">/ night</span>
        </div>
      </div>

      {/* Multi-Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-3xl overflow-hidden">
        {/* Main large photo */}
        <div className="md:col-span-8 aspect-[16/10] bg-slate-900 relative">
          <img
            src={images[activePhoto]?.url || images[0]?.url}
            alt={hotel.name}
            className="w-full h-full object-cover animate-in fade-in duration-300"
          />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold text-white">
            {images[activePhoto]?.caption || hotel.name}
          </div>
        </div>

        {/* Thumbnail grid */}
        <div className="md:col-span-4 grid grid-cols-2 gap-4">
          {images.slice(0, 4).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhoto(idx)}
              className={`relative aspect-[4/3] rounded-2xl overflow-hidden transition-all ${
                activePhoto === idx
                  ? 'ring-4 ring-gold-500 scale-[0.98]'
                  : 'opacity-80 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={img.caption || `Photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Details + Sticky Reservation Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          {/* About the Property */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              About the Sanctuary
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {hotel.description}
            </p>
          </section>

          {/* Amenities & Signature Services */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              Property Amenities & Facilities
            </h2>
            <AmenitiesList amenities={hotel.amenities || []} columns={2} />
          </section>

          {/* Room Categories Section */}
          <section id="suites-section" className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                  Available Suites & Villas
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Showing suites available for your dates ({nights} nights)
                </p>
              </div>

              {/* Quick Date Inputs */}
              <div className="flex items-center gap-2 text-xs bg-slate-100 dark:bg-navy-850 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Calendar className="w-3.5 h-3.5 text-gold-500" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent font-bold focus:outline-none text-slate-900 dark:text-white"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent font-bold focus:outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-6">
              {categories.map((cat) => (
                <RoomCard
                  key={cat._id}
                  category={cat}
                  nights={nights}
                  onSelect={handleSelectRoom}
                />
              ))}
            </div>
          </section>

          {/* Hotel Policies */}
          <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              Policies & Stay Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Clock className="w-4 h-4 text-gold-500" />
                  <span>Check-In & Check-Out</span>
                </div>
                <p>Check-in time: {hotel.policies?.checkInTime || '15:00'}</p>
                <p>Check-out time: {hotel.policies?.checkOutTime || '11:00'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Award className="w-4 h-4 text-gold-500" />
                  <span>Cancellation & Escrow Policy</span>
                </div>
                <p>
                  Free cancellation up to {hotel.policies?.cancellationDays || 2} days prior to
                  arrival for 100% refund.
                </p>
              </div>
            </div>
          </section>

          {/* Verified Stay Guest Reviews */}
          <section className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                  Verified Guest Experiences
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Authentic reviews verified through completed reservation records
                </p>
              </div>
            </div>

            {/* Sub-Ratings Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Cleanliness</span>
                <p className="font-serif text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {hotel.ratingSummary?.cleanliness || '5.0'} / 5
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Service</span>
                <p className="font-serif text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {hotel.ratingSummary?.service || '4.9'} / 5
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Comfort</span>
                <p className="font-serif text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {hotel.ratingSummary?.comfort || '4.9'} / 5
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
                <p className="font-serif text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {hotel.ratingSummary?.location || '5.0'} / 5
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Value</span>
                <p className="font-serif text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {hotel.ratingSummary?.value || '4.8'} / 5
                </p>
              </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  No public reviews submitted yet.
                </p>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={rev.user?.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {rev.user?.name}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Verified Stay Record
                          </span>
                        </div>
                      </div>
                      <RatingStars rating={rev.rating} />
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      "{rev.title}"
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {rev.comment}
                    </p>

                    {/* Manager reply */}
                    {rev.managerResponse?.responseText && (
                      <div className="p-3 rounded-xl bg-gold-50/50 dark:bg-navy-850 border border-gold-200 dark:border-gold-900/40 text-xs mt-3">
                        <span className="font-bold text-gold-600 dark:text-gold-400 block mb-1">
                          Response from Hotel Management:
                        </span>
                        <p className="text-slate-700 dark:text-slate-300">
                          {rev.managerResponse.responseText}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Sticky Reservation Box */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-6 shadow-xl space-y-6">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Nightly Starting Rate
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
                  ${hotel.startingPrice}
                </span>
                <span className="text-xs text-slate-500">/ night</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Check-In:</span>
                <span className="font-bold">{new Date(checkIn).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Check-Out:</span>
                <span className="font-bold">{new Date(checkOut).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Length of Stay:</span>
                <span className="font-bold text-gold-600 dark:text-gold-400">{nights} Nights</span>
              </div>
            </div>

            <a
              href="#suites-section"
              className="w-full py-4 rounded-2xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 transition-all text-center block"
            >
              Select Available Suite
            </a>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Instant confirmation directly on HotelPro</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>100% Free cancellation policy applies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>VIP concierge service included with every stay</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Complete Your Luxury Reservation"
        maxWidth="max-w-2xl"
      >
        {selectedCategory && (
          <BookingForm
            hotel={hotel}
            category={selectedCategory}
            initialDates={{ checkIn, checkOut }}
            onClose={() => setIsBookingModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default HotelDetails;
