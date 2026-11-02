import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import HotelCard from '../components/hotel/HotelCard';
import PriceFilter from '../components/hotel/PriceFilter';
import SearchBar from '../components/hotel/SearchBar';
import Pagination from '../components/common/Pagination';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const ExploreHotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Parse filters from URL
  const filters = {
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    starRating: searchParams.get('starRating') || '',
    amenities: searchParams.get('amenities') ? searchParams.get('amenities').split(',') : [],
    sort: searchParams.get('sort') || 'recommended',
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.search) query.append('search', filters.search);
      if (filters.city) query.append('city', filters.city);
      if (filters.minPrice) query.append('minPrice', filters.minPrice);
      if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);
      if (filters.starRating) query.append('starRating', filters.starRating);
      if (filters.amenities.length > 0) query.append('amenities', filters.amenities.join(','));
      if (filters.sort && filters.sort !== 'recommended') query.append('sort', filters.sort);
      query.append('page', filters.page);
      query.append('limit', 9);

      const res = await axiosClient.get(`/hotels?${query.toString()}`);
      if (res.success) {
        setHotels(res.hotels || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.warn('Failed to fetch hotels:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [searchParams]);

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.append('search', newFilters.search);
    if (newFilters.city) params.append('city', newFilters.city);
    if (newFilters.minPrice) params.append('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.append('maxPrice', newFilters.maxPrice);
    if (newFilters.starRating) params.append('starRating', newFilters.starRating);
    if (newFilters.amenities?.length > 0) params.append('amenities', newFilters.amenities.join(','));
    if (newFilters.sort && newFilters.sort !== 'recommended') params.append('sort', newFilters.sort);
    params.append('page', '1'); // Reset to page 1 on filter change

    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Bar on top */}
      <div>
        <SearchBar
          initialValues={{
            search: filters.search,
            city: filters.city,
            checkIn: searchParams.get('checkIn'),
            checkOut: searchParams.get('checkOut'),
          }}
          compact
        />
      </div>

      {/* Main Grid: Filters Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28">
          <PriceFilter
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
          />
        </aside>

        {/* Results Column */}
        <main className="lg:col-span-9 space-y-6">
          {/* Header Bar: Count and Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                {filters.city ? `Luxury Stays in ${filters.city}` : 'All Flagship Properties'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Found {total} five-star sanctuary resorts
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-gold-500" />
                Filters
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilters({ ...filters, sort: e.target.value })}
                  className="bg-transparent font-bold text-slate-800 dark:text-slate-200 border-none focus:outline-none cursor-pointer"
                >
                  <option value="recommended">Featured & Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Highest Guest Rating</option>
                  <option value="newest">Recently Added</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filter Collapsible */}
          {showMobileFilter && (
            <div className="lg:hidden">
              <PriceFilter
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
              />
            </div>
          )}

          {/* Hotel Grid */}
          {loading ? (
            <SkeletonLoader count={6} />
          ) : hotels.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gold-100 dark:bg-gold-950/60 text-gold-600 dark:text-gold-400 flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                No matching sanctuaries found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                We couldn't find any hotels matching your exact filter preferences. Try adjusting your price range or clearing active amenity filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
};

export default ExploreHotels;
