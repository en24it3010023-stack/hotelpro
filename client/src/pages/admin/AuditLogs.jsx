import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { History, Shield, Clock } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosClient.get('/admin/logs');
        if (res.success) {
          setLogs(res.logs || []);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Platform Audit Trail & Security Ledger"
        subtitle="Immutable electronic record of system events, role changes, and inventory actions"
      />

      {loading ? (
        <SkeletonLoader count={4} />
      ) : logs.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs">No audit logs recorded yet.</div>
      ) : (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider bg-slate-50/50 dark:bg-navy-950/40">
                  <th className="p-4 px-6">Timestamp</th>
                  <th className="p-4 px-6">Action</th>
                  <th className="p-4 px-6">Actor / User</th>
                  <th className="p-4 px-6">Resource Target</th>
                  <th className="p-4 px-6">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 px-6 text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 px-6 font-bold font-mono text-gold-600 dark:text-gold-400">
                      {log.action}
                    </td>
                    <td className="p-4 px-6">
                      {log.actor ? (
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{log.actor.name}</p>
                          <p className="text-[10px] text-slate-400">{log.actor.email}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">System Auto</span>
                      )}
                    </td>
                    <td className="p-4 px-6">{log.resourceType}</td>
                    <td className="p-4 px-6 font-mono text-[11px] text-slate-500 max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
