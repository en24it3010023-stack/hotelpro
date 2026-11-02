import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Save, Hotel, MapPin, DollarSign, Clock, ShieldCheck } from 'lucide-react';

const ManageHotels = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState(150);
  const [checkInTime, setCheckInTime] = useState('15:00');
  const [checkOutTime, setCheckOutTime] = useState('11:00');
  const [cancellationDays, setCancellationDays] = useState(2);
  const [petPolicy, setPetPolicy] = useState('');

  const fetchHotel = async () => {
    setLoading(true);
    try {
      const hotelId = user.assignedHotel?._id || user.assignedHotel;
      let hData = null;
      if (hotelId) {
        const res = await axiosClient.get(`/hotels/${hotelId}`);
        if (res.success) hData = res.hotel;
      } else {
        const res = await axiosClient.get('/hotels?limit=1');
        if (res.success && res.hotels?.length > 0) hData = res.hotels[0];
      }

      if (hData) {
        setHotel(hData);
        setName(hData.name || '');
        setTagline(hData.tagline || '');
        setDescription(hData.description || '');
        setStartingPrice(hData.startingPrice || 150);
        setCheckInTime(hData.policies?.checkInTime || '15:00');
        setCheckOutTime(hData.policies?.checkOutTime || '11:00');
        setCancellationDays(hData.policies?.cancellationDays || 2);
        setPetPolicy(hData.policies?.petPolicy || '');
      }
    } catch (err) {
      showToast('Could not load property details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotel();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!hotel) return;

    setSaving(true);
    try {
      const res = await axiosClient.put(`/hotels/${hotel._id}`, {
        name,
        tagline,
        description,
        startingPrice: Number(startingPrice),
        policies: {
          ...hotel.policies,
          checkInTime,
          checkOutTime,
          cancellationDays: Number(cancellationDays),
          petPolicy,
        },
      });

      if (res.success) {
        showToast('Property settings updated successfully.', 'success');
        setHotel(res.hotel);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update property.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <DashboardHeader
        title="Property Profile & Operational Policies"
        subtitle="Configure guest policies, check-in schedules, and room starting pricing"
      />

      <form onSubmit={handleSave} className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Hotel Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Starting Nightly Rate ($ USD) *
            </label>
            <input
              type="number"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              required
              min={1}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Marketing Tagline
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Property Description & History
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Check-In Time
            </label>
            <input
              type="text"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              placeholder="15:00"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Check-Out Time
            </label>
            <input
              type="text"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              placeholder="11:00"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Free Cancellation Days Window
            </label>
            <input
              type="number"
              value={cancellationDays}
              onChange={(e) => setCancellationDays(e.target.value)}
              min={0}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Pet Policy Notice
          </label>
          <input
            type="text"
            value={petPolicy}
            onChange={(e) => setPetPolicy(e.target.value)}
            placeholder="e.g. Small dogs allowed under 25 lbs"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Update Property Profile'}
        </button>
      </form>
    </div>
  );
};

export default ManageHotels;
