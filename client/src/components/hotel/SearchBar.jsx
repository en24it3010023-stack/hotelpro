import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, MapPin, ChevronDown } from 'lucide-react';

const SearchBar = ({ initialValues = {}, compact = false }) => {
  const navigate = useNavigate();

  // Tomorrow & 3 days later defaults
  const getDefaultDates = () => {
    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + 1);
    const checkOut = new Date(today);
    checkOut.setDate(today.getDate() + 4);

    return {
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
    };
  };

  const defaultDates = getDefaultDates();

  const [destination, setDestination] = useState(initialValues.search || initialValues.city || '');
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || defaultDates.checkIn);
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || defaultDates.checkOut);
  const [adults, setAdults] = useState(initialValues.adults || 2);
  const [children, setChildren] = useState(initialValues.children || 0);
  const [rooms, setRooms] = useState(initialValues.rooms || 1);
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.append('search', destination.trim());
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (adults) params.append('adults', adults);
    if (children) params.append('children', children);
    if (rooms) params.append('rooms', rooms);

    navigate(`/explore?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`w-full rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 sm:p-4 text-slate-800 dark:text-slate-200 ${
        compact ? '' : 'max-w-5xl mx-auto'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Destination input */}
        <div className="md:col-span-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
          <label className="block text-[11px] uppercase font-bold text-slate-400 tracking-wider">
            Destination / Hotel
          </label>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where is your journey taking you?"
              className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Dates Range */}
        <div className="md:col-span-4 grid grid-cols-2 gap-2 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              Check-In
            </label>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5 text-gold-500 shrink-0" />
              <input
                type="date"
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              Check-Out
            </label>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5 text-gold-500 shrink-0" />
              <input
                type="date"
                value={checkOut}
                min={checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Guest & Room Selector */}
        <div className="md:col-span-2 relative p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
          <label className="block text-[11px] uppercase font-bold text-slate-400 tracking-wider">
            Guests & Rooms
          </label>
          <button
            type="button"
            onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
            className="w-full flex items-center justify-between mt-1 text-xs font-semibold text-slate-900 dark:text-white"
          >
            <span className="flex items-center gap-1.5 truncate">
              <Users className="w-3.5 h-3.5 text-gold-500 shrink-0" />
              {adults + children} Guests, {rooms} Rm
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Guest Selector Popover */}
          {guestDropdownOpen && (
            <div
              className="absolute left-0 mt-3 w-64 bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl z-50 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Adults</p>
                  <p className="text-[10px] text-slate-400">Ages 13 and above</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold w-4 text-center">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Children</p>
                  <p className="text-[10px] text-slate-400">Ages 0 to 12</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold w-4 text-center">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Rooms</p>
                  <p className="text-[10px] text-slate-400">Total suites needed</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold w-4 text-center">{rooms}</span>
                  <button
                    type="button"
                    onClick={() => setRooms(rooms + 1)}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGuestDropdownOpen(false)}
                className="w-full mt-2 py-1.5 rounded-lg bg-gold-500 text-slate-950 font-bold text-xs"
              >
                Apply Guests
              </button>
            </div>
          )}
        </div>

        {/* Submit Search Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full h-14 rounded-2xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-gold-500/25 transition-all"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            Find Hotels
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
