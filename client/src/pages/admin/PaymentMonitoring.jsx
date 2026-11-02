import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import { CreditCard, CheckCircle2, XCircle, ArrowUpRight, DollarSign } from 'lucide-react';

const PaymentMonitoring = () => {
  const { showToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [activeTab, setActiveTab] = useState('PAYMENTS');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payRes, refRes] = await Promise.all([
        axiosClient.get('/payments'),
        axiosClient.get('/admin/refunds'),
      ]);

      if (payRes.success) setPayments(payRes.payments || []);
      if (refRes.success) setRefunds(refRes.refunds || []);
    } catch (err) {
      showToast('Could not load payment ledger.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefundAction = async (refundId, status) => {
    try {
      const res = await axiosClient.put(`/payments/refunds/${refundId}`, {
        status,
        adminNotes: `Refund ${status} by administrator`,
      });

      if (res.success) {
        showToast(res.message, 'success');
        fetchData();
      }
    } catch (err) {
      showToast(err.message || 'Action failed.', 'error');
    }
  };

  const totalProcessed = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Payment Gateway Ledger & Refund Escrow"
        subtitle={`Gross volume processed: $${totalProcessed.toFixed(2)} USD across Stripe, Razorpay & Demo engines`}
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('PAYMENTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'PAYMENTS'
              ? 'bg-gold-500 text-slate-950 shadow-md shadow-gold-500/20'
              : 'bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-400'
          }`}
        >
          Payment Transactions ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('REFUNDS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'REFUNDS'
              ? 'bg-gold-500 text-slate-950 shadow-md shadow-gold-500/20'
              : 'bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-400'
          }`}
        >
          Refund Requests ({refunds.length})
        </button>
      </div>

      {loading ? (
        <SkeletonLoader count={4} />
      ) : activeTab === 'PAYMENTS' ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider bg-slate-50/50 dark:bg-navy-950/40">
                  <th className="p-4 px-6">Transaction ID</th>
                  <th className="p-4 px-6">Booking Reference</th>
                  <th className="p-4 px-6">Payer</th>
                  <th className="p-4 px-6">Gateway</th>
                  <th className="p-4 px-6">Amount</th>
                  <th className="p-4 px-6">Status</th>
                  <th className="p-4 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 px-6 font-mono font-bold text-slate-400">{p.transactionId}</td>
                    <td className="p-4 px-6 font-bold text-slate-900 dark:text-white">
                      {p.booking?.bookingReference || 'Manual'}
                    </td>
                    <td className="p-4 px-6">{p.user?.name || 'Guest'}</td>
                    <td className="p-4 px-6 uppercase font-bold text-[10px] tracking-wider text-gold-600 dark:text-gold-400">
                      {p.gateway}
                    </td>
                    <td className="p-4 px-6 font-serif font-bold text-slate-900 dark:text-white">
                      ${p.amount?.toFixed(2)} {p.currency}
                    </td>
                    <td className="p-4 px-6"><StatusBadge status={p.status} /></td>
                    <td className="p-4 px-6 text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {refunds.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">No pending refund requests.</div>
          ) : (
            refunds.map((r) => (
              <div
                key={r._id}
                className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      Booking: {r.booking?.bookingReference}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-white mt-1">
                    Requested Refund: ${r.amountRequested?.toFixed(2)}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Reason: "{r.reason}"</p>
                </div>

                {r.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRefundAction(r._id, 'approved')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      Approve Refund
                    </button>
                    <button
                      onClick={() => handleRefundAction(r._id, 'rejected')}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMonitoring;
