import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Pagination from '../../components/common/Pagination';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import { Search, UserCheck, Shield, Filter } from 'lucide-react';

const UserManagement = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (roleFilter) query.append('role', roleFilter);
      query.append('page', page);
      query.append('limit', 10);

      const res = await axiosClient.get(`/admin/users?${query.toString()}`);
      if (res.success) {
        setUsers(res.users || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      showToast('Could not load user directory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await axiosClient.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.success) {
        showToast(res.message, 'success');
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update user role.', 'error');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Global User Directory & Permissions"
        subtitle={`Managing ${total} accounts with role-based access control`}
      />

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="guest">Guest</option>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <SkeletonLoader count={4} />
      ) : (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider bg-slate-50/50 dark:bg-navy-950/40">
                  <th className="p-4 px-6">User Profile</th>
                  <th className="p-4 px-6">Email Address</th>
                  <th className="p-4 px-6">Contact Phone</th>
                  <th className="p-4 px-6">Assigned Property</th>
                  <th className="p-4 px-6">Current Role</th>
                  <th className="p-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4 px-6 font-mono text-slate-500">{u.email}</td>
                    <td className="p-4 px-6">{u.phone || '—'}</td>
                    <td className="p-4 px-6">{u.assignedHotel?.name || 'Global'}</td>
                    <td className="p-4 px-6">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 px-6">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-950 text-xs font-semibold focus:outline-none"
                      >
                        <option value="guest">Guest</option>
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
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

export default UserManagement;
