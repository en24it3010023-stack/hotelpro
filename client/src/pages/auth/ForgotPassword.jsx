import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please provide your account email.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post('/auth/forgot-password', { email });
      if (res.success) {
        setSubmitted(true);
        showToast('Password reset link dispatched.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to dispatch reset link.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gold-100 dark:bg-gold-950/60 text-gold-600 dark:text-gold-400 flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your account email to receive cryptographic password reset credentials
          </p>
        </div>

        {submitted ? (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Instructions Dispatched
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If an active account exists with <strong>{email}</strong>, a secure reset token has been dispatched. (In local development mode, preview the link in your backend server logs).
            </p>
            <Link
              to="/login"
              className="inline-block mt-2 text-xs font-bold text-gold-600 dark:text-gold-400 hover:underline"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Account Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-xs shadow-md shadow-gold-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Transmitting Token...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
