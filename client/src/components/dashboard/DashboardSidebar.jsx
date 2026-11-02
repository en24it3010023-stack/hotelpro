import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Heart,
  User,
  Bell,
  ConciergeBell,
  ClipboardList,
  BedDouble,
  Hotel,
  Shield,
  CreditCard,
  History,
  CheckCircle,
  FileText,
  LogOut,
} from 'lucide-react';

const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const role = user.role;

  const guestNav = [
    { label: 'Guest Overview', path: '/dashboard/guest', icon: LayoutDashboard },
    { label: 'My Bookings', path: '/dashboard/guest/bookings', icon: CalendarCheck },
    { label: 'Saved Hotels', path: '/dashboard/guest/saved', icon: Heart },
    { label: 'Service Requests', path: '/dashboard/guest/services', icon: ConciergeBell },
    { label: 'Profile Settings', path: '/dashboard/guest/profile', icon: User },
  ];

  const staffNav = [
    { label: 'Staff Front Desk', path: '/dashboard/staff', icon: LayoutDashboard },
    { label: 'Check-In / Out Desk', path: '/dashboard/staff/desk', icon: CalendarCheck },
    { label: 'Room Status Board', path: '/dashboard/staff/rooms', icon: BedDouble },
    { label: 'Housekeeping Tasks', path: '/dashboard/staff/tasks', icon: ClipboardList },
    { label: 'Guest Requests', path: '/dashboard/staff/services', icon: ConciergeBell },
  ];

  const managerNav = [
    { label: 'Manager Overview', path: '/dashboard/manager', icon: LayoutDashboard },
    { label: 'My Properties', path: '/dashboard/manager/hotels', icon: Hotel },
    { label: 'Rooms & Categories', path: '/dashboard/manager/rooms', icon: BedDouble },
    { label: 'All Reservations', path: '/dashboard/manager/bookings', icon: CalendarCheck },
  ];

  const adminNav = [
    { label: 'Platform Overview', path: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'User Directory', path: '/dashboard/admin/users', icon: User },
    { label: 'Hotel Approvals', path: '/dashboard/admin/hotels', icon: Hotel },
    { label: 'Payments & Refunds', path: '/dashboard/admin/payments', icon: CreditCard },
    { label: 'Audit Trail Logs', path: '/dashboard/admin/logs', icon: History },
  ];

  let currentNav = guestNav;
  if (role === 'staff') currentNav = staffNav;
  if (role === 'manager') currentNav = managerNav;
  if (role === 'admin') currentNav = adminNav;

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between min-h-[calc(100vh-80px)]">
      <div className="space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-100 dark:border-slate-800">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-gold-500/40"
          />
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user.name}
            </h4>
            <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gold-100 dark:bg-gold-950/60 text-gold-700 dark:text-gold-400">
              {role}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === `/dashboard/${role}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gold-500 text-slate-950 shadow-md shadow-gold-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
