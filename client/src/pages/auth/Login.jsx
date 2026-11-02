import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Hotel, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const redirectByRole = (role) => {
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    if (role === 'admin') navigate('/dashboard/admin');
    else if (role === 'manager') navigate('/dashboard/manager');
    else if (role === 'staff') navigate('/dashboard/staff');
    else navigate('/dashboard/guest');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        redirectByRole(res.user.role);
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Please verify credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    try {
      const res = await demoLogin(role);
      if (res.success) {
        showToast(`Logged in as ${role.toUpperCase()}: ${res.user.name}`, 'success');
        redirectByRole(res.user.role);
      }
    } catch (err) {
      showToast(err.message || 'Demo login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-slate-950 mx-auto shadow-md">
            <Hotel className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to manage your luxury reservations and concierge requests
          </p>
        </div>

        {/* 1-Click Demo Accounts Quick Picker */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gold-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Demo Login (1-Click)
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('guest')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-gold-500 bg-white dark:bg-navy-900 font-bold text-left transition-colors truncate"
            >
              🏖️ Sophia (Guest)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('staff')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-gold-500 bg-white dark:bg-navy-900 font-bold text-left transition-colors truncate"
            >
              🛎️ Marcus (Staff)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('manager')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-gold-500 bg-white dark:bg-navy-900 font-bold text-left transition-colors truncate"
            >
              👔 Elena (Manager)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-gold-500 bg-white dark:bg-navy-900 font-bold text-left transition-colors truncate"
            >
              👑 Alexander (Admin)
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@hotelpro.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-gold-600 dark:text-gold-400 font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md shadow-gold-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Do not possess an account yet?{' '}
          <Link to="/register" className="text-gold-600 dark:text-gold-400 font-bold hover:underline">
            Register as a Guest
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
