import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Plus, BedDouble, Key, Sparkles, Edit2 } from 'lucide-react';

const ManageRooms = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [hotel, setHotel] = useState(null);
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Category Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [basePrice, setBasePrice] = useState(250);
  const [bedType, setBedType] = useState('1 King Bed');
  const [roomSize, setRoomSize] = useState(500);
  const [catDesc, setCatDesc] = useState('');
  const [catSubmitting, setCatSubmitting] = useState(false);

  // Add Room Modal
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomFloor, setNewRoomFloor] = useState(1);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [roomSubmitting, setRoomSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const hotelId = user.assignedHotel?._id || user.assignedHotel;
      let hId = hotelId;
      if (!hId) {
        const hRes = await axiosClient.get('/hotels?limit=1');
        if (hRes.success && hRes.hotels?.length > 0) hId = hRes.hotels[0]._id;
      }

      if (hId) {
        const [hRes, rRes] = await Promise.all([
          axiosClient.get(`/hotels/${hId}`),
          axiosClient.get(`/hotels/${hId}/rooms`),
        ]);

        if (hRes.success) {
          setHotel(hRes.hotel);
          setCategories(hRes.roomCategories || []);
          if (hRes.roomCategories?.length > 0 && !selectedCatId) {
            setSelectedCatId(hRes.roomCategories[0]._id);
          }
        }
        if (rRes.success) setRooms(rRes.rooms || []);
      }
    } catch (err) {
      showToast('Could not load inventory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!hotel) return;

    setCatSubmitting(true);
    try {
      const res = await axiosClient.post(`/hotels/${hotel._id}/categories`, {
        name: catName,
        basePrice: Number(basePrice),
        bedType,
        roomSizeSqFt: Number(roomSize),
        description: catDesc,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
            caption: catName,
          },
        ],
      });

      if (res.success) {
        showToast('Room category created.', 'success');
        setIsCatModalOpen(false);
        setCatName('');
        setCatDesc('');
        fetchData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create category.', 'error');
    } finally {
      setCatSubmitting(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!hotel || !selectedCatId || !newRoomNumber) return;

    setRoomSubmitting(true);
    try {
      const res = await axiosClient.post(`/hotels/${hotel._id}/rooms`, {
        roomNumber: newRoomNumber,
        floor: Number(newRoomFloor),
        category: selectedCatId,
      });

      if (res.success) {
        showToast(res.message, 'success');
        setIsRoomModalOpen(false);
        setNewRoomNumber('');
        fetchData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create room.', 'error');
    } finally {
      setRoomSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <DashboardHeader
        title="Room Inventory & Suite Categories"
        subtitle="Manage suite tier configurations, nightly base rates, and individual physical rooms"
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setIsRoomModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-gold-500 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Physical Room
            </button>
            <button
              onClick={() => setIsCatModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> New Suite Category
            </button>
          </div>
        }
      />

      {/* Categories Grid */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
          Suite Categories ({categories.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-serif text-base font-bold text-slate-900 dark:text-white">
                  {cat.name}
                </h4>
                <span className="font-serif text-base font-bold text-gold-600 dark:text-gold-400">
                  ${cat.basePrice}/nt
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {cat.description}
              </p>
              <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p>Bed: {cat.bedType} • Size: {cat.roomSizeSqFt} sq ft</p>
                <p>Total Inventory: {cat.totalRoomsCount || 5} units</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Physical Rooms Table */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
          Physical Room Numbers ({rooms.length})
        </h3>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider bg-slate-50/50 dark:bg-navy-950/40">
                <th className="p-4 px-6">Room Number</th>
                <th className="p-4 px-6">Floor</th>
                <th className="p-4 px-6">Suite Category</th>
                <th className="p-4 px-6">Keycard Code</th>
                <th className="p-4 px-6">Room Status</th>
                <th className="p-4 px-6">Housekeeping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {rooms.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-4 px-6 font-bold font-serif text-sm text-slate-900 dark:text-white">
                    Room {r.roomNumber}
                  </td>
                  <td className="p-4 px-6">Floor {r.floor}</td>
                  <td className="p-4 px-6 font-semibold">{r.category?.name}</td>
                  <td className="p-4 px-6 font-mono text-slate-400">{r.keyCardCode}</td>
                  <td className="p-4 px-6"><StatusBadge status={r.status} /></td>
                  <td className="p-4 px-6"><StatusBadge status={r.housekeepingStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title="Add New Suite Category"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. Royal Horizon Suite"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Base Price ($/night) *
              </label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                required
                min={1}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Room Size (Sq Ft)
              </label>
              <input
                type="number"
                value={roomSize}
                onChange={(e) => setRoomSize(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Bedding Configuration
            </label>
            <input
              type="text"
              value={bedType}
              onChange={(e) => setBedType(e.target.value)}
              placeholder="1 King Bed"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Description & Highlights
            </label>
            <textarea
              rows={3}
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              placeholder="Marble bath, private terrace, oceanfront exposure..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <button
            type="submit"
            disabled={catSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            {catSubmitting ? 'Creating Category...' : 'Save Suite Category'}
          </button>
        </form>
      </Modal>

      {/* Add Room Modal */}
      <Modal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        title="Register Physical Room Number"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Room Number (e.g. 104, 205, PH-03) *
            </label>
            <input
              type="text"
              value={newRoomNumber}
              onChange={(e) => setNewRoomNumber(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Floor
              </label>
              <input
                type="number"
                value={newRoomFloor}
                onChange={(e) => setNewRoomFloor(e.target.value)}
                min={1}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Assign Category *
              </label>
              <select
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={roomSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            {roomSubmitting ? 'Registering...' : 'Add Room Number'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageRooms;
