import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from './NotificationBell';
import {
  Hotel,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  CalendarCheck,
  Shield,
  Briefcase,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'manager') return '/dashboard/manager';
    if (user.role === 'staff') return '/dashboard/staff';
    return '/dashboard/guest';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-slate-950 shadow-md shadow-gold-500/20 group-hover:scale-105 transition-transform">
            <Hotel className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Hotel<span className="text-gold-500">Pro</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-gold-100 text-gold-800 dark:bg-gold-950/60 dark:text-gold-400 border border-gold-300 dark:border-gold-800">
                Roomly
              </span>
            </div>
            <p className="text-[10px] tracking-widest uppercase text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
              Luxury Hospitality
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            to="/explore"
            className={`text-sm font-semibold transition-colors hover:text-gold-500 ${
              isActive('/explore') ? 'text-gold-500 font-bold' : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            Explore Hotels
          </Link>
          <Link
            to="/offers"
            className={`text-sm font-semibold transition-colors hover:text-gold-500 flex items-center gap-1.5 ${
              isActive('/offers') ? 'text-gold-500 font-bold' : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-gold-500" />
            Special Offers
          </Link>
          <Link
            to="/about"
            className={`text-sm font-semibold transition-colors hover:text-gold-500 ${
              isActive('/about') ? 'text-gold-500 font-bold' : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-semibold transition-colors hover:text-gold-500 ${
              isActive('/contact') ? 'text-gold-500 font-bold' : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Action Icons & User Menu */}
        <div className="flex items-center gap-3">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-gold-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications (if authenticated) */}
          {isAuthenticated && <NotificationBell />}

          {/* User Auth Section */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:ring-2 hover:ring-gold-500/50 transition-all"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-gold-500/40"
                />
                <span className="hidden lg:inline text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-navy-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1.5 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-100 dark:bg-gold-950/60 text-gold-700 dark:text-gold-400 border border-gold-300 dark:border-gold-800">
                      Role: {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to={getDashboardPath()}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gold-500" />
                      {user.role === 'admin'
                        ? 'Admin Control Center'
                        : user.role === 'manager'
                        ? 'Manager Dashboard'
                        : user.role === 'staff'
                        ? 'Staff Desk'
                        : 'Guest Dashboard'}
                    </Link>

                    {user.role === 'guest' && (
                      <Link
                        to="/dashboard/guest/bookings"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <CalendarCheck className="w-4 h-4 text-emerald-500" />
                        My Reservations
                      </Link>
                    )}

                    <Link
                      to="/dashboard/guest/profile"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Account Settings
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-gold-500 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 shadow-md shadow-gold-500/25 transition-all"
              >
                Join / Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 p-4 space-y-3">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Explore Hotels
          </Link>
          <Link
            to="/offers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Special Offers
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Contact
          </Link>
          {isAuthenticated && (
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg bg-gold-500/10 text-gold-600 dark:text-gold-400 font-bold"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
