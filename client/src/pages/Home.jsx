import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import SearchBar from '../components/hotel/SearchBar';
import HotelCard from '../components/hotel/HotelCard';
import RatingStars from '../components/common/RatingStars';
import SkeletonLoader from '../components/common/SkeletonLoader';
import {
  Sparkles,
  Award,
  ShieldCheck,
  Headphones,
  Compass,
  ArrowRight,
  ChevronDown,
  Waves,
  Utensils,
  Coffee,
  CheckCircle2,
} from 'lucide-react';

const POPULAR_DESTINATIONS = [
  {
    city: 'Miami Beach',
    country: 'United States',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    tag: 'Coastal Luxury',
  },
  {
    city: 'Jaipur',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    tag: 'Heritage Palaces',
  },
  {
    city: 'New York',
    country: 'United States',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    tag: 'Metropolis Penthouses',
  },
  {
    city: 'Bora Bora',
    country: 'French Polynesia',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    tag: 'Overwater Lagoon Villas',
  },
];

const FAQS = [
  {
    q: 'How does the HotelPro guaranteed reservation escrow work?',
    a: 'Every reservation booked through HotelPro is instantly confirmed with our direct hotel inventory lock. Your payment is held securely in escrow until check-in is verified by hotel concierge.',
  },
  {
    q: 'What is the standard cancellation and refund policy?',
    a: 'Most of our flagship properties offer 100% full refunds when cancelled at least 48 to 72 hours prior to scheduled check-in. Details are clearly shown on every suite card.',
  },
  {
    q: 'Can I request early check-in or specific room preferences?',
    a: 'Yes! When completing your reservation or via your Guest Dashboard, you can specify arrival times, dietary preferences, extra bedding, and floor requests.',
  },
  {
    q: 'Are pets welcomed across HotelPro properties?',
    a: 'Several of our flagship properties, including The Grand Azure and Skyline Metropolis, feature bespoke VIP pet programs. Review individual hotel policies for weight specifications.',
  },
  {
    q: 'How do verified guest reviews work?',
    a: 'To guarantee genuine transparency, reviews can only be submitted by verified guests who have an active or completed stay record in our reservation database.',
  },
];

const Home = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axiosClient.get('/hotels/featured');
        if (res.success) {
          setFeaturedHotels(res.hotels || []);
        }
      } catch (err) {
        console.warn('Failed to load featured hotels:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury Hotel"
            className="w-full h-full object-cover scale-105 animate-in fade-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-navy-950/75 to-navy-950" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold tracking-widest uppercase backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            Curated Luxury Hospitality Worldwide
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-sm">
            Find Your Sanctuary of <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
              Serenity & Refinement
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Reserve five-star oceanfront suites, heritage palaces, and private overwater villas with transparent pricing, instant verification, and 24/7 dedicated concierge service.
          </p>

          {/* Search Bar Widget */}
          <div className="pt-4">
            <SearchBar />
          </div>

          {/* Quick trust metrics */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 pt-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-400" />
              <span>5-Star Diamond Portfolio</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Guaranteed Escrow</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-sky-400" />
              <span>24/7 Butler & Concierge</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-gold-500">
              Iconic Getaways
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-1">
              Popular Global Destinations
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs font-bold text-gold-600 dark:text-gold-400 hover:gap-3 transition-all"
          >
            Explore all destinations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_DESTINATIONS.map((dest, i) => (
            <Link
              key={i}
              to={`/explore?city=${encodeURIComponent(dest.city)}`}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={dest.image}
                alt={dest.city}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {dest.tag}
                </span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h3 className="font-serif text-xl font-bold group-hover:text-gold-400 transition-colors">
                  {dest.city}
                </h3>
                <p className="text-xs text-slate-300">{dest.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Flagship Hotels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-gold-500">
              The Flagship Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-1">
              Handpicked Luxury Resorts & Suites
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs font-bold text-gold-600 dark:text-gold-400 hover:gap-3 transition-all"
          >
            View Complete Directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        )}
      </section>

      {/* Luxury Hospitality Amenities Showcase */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-gold-400">
              The HotelPro Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Immersive Comfort Designed Around You
            </h2>
            <p className="text-sm text-slate-400">
              Every property in our collection is rigorously inspected to adhere to the world's most discerning hospitality benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-4 hover:border-gold-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold">Infinity Wellness & Spas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hydrotherapy lagoons, Finnish pine saunas, and holistic wellness treatments formulated with Clarins and organic botanicals.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-4 hover:border-gold-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold">Michelin-Inspired Gastronomy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                World-class culinary dining experiences featuring locally sourced seafood, artisan patisseries, and curated wine cellars.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-4 hover:border-gold-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold">Bespoke Suite Amenities</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Egyptian cotton sheets, Bang & Olufsen acoustics, motorized blackout shades, and personalized 24/7 butler attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gold-600 via-gold-500 to-amber-500 p-8 sm:p-14 text-slate-950 shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded-full bg-slate-950 text-gold-400">
              Limited-Time Privilege
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Summer Getaway Special: 25% Off
            </h2>
            <p className="text-sm font-medium text-slate-900 leading-relaxed">
              Apply code <strong className="font-mono bg-slate-950 text-white px-2 py-0.5 rounded">SUMMER25</strong> at checkout for 25% off oceanfront and overwater suites booked this season.
            </p>
            <div className="pt-2">
              <Link
                to="/offers"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-lg transition-all"
              >
                Claim Exclusive Offer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-gold-500">
            Clear Transparency
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 dark:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gold-500 transition-transform ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
