import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import { ClipboardList, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

const HousekeepingTasks = () => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/staff/tasks');
      if (res.success) {
        setTasks(res.tasks || []);
      }
    } catch (err) {
      showToast('Could not load housekeeping tasks.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const res = await axiosClient.put(`/staff/tasks/${taskId}`, { status: newStatus });
      if (res.success) {
        showToast(res.message, 'success');
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update task status.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Housekeeping & Turnaround Tasks"
        subtitle="Manage suite sanitization, linen replacement, and room turnover workflows"
      />

      {loading ? (
        <SkeletonLoader count={3} />
      ) : tasks.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-12 text-center text-slate-500 text-xs">
          No housekeeping tasks currently assigned.
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-500">
                    Room {task.targetRoom?.roomNumber || 'General'}
                  </span>
                  <StatusBadge status={task.status} />
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Priority: {task.priority}
                  </span>
                </div>
                <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {task.status !== 'in_progress' && task.status !== 'completed' && (
                  <button
                    onClick={() => handleUpdateStatus(task._id, 'in_progress')}
                    className="px-4 py-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold text-xs hover:bg-blue-200 transition-colors flex items-center gap-1.5"
                  >
                    <PlayCircle className="w-3.5 h-3.5" /> Start Cleaning
                  </button>
                )}

                {task.status !== 'completed' && (
                  <button
                    onClick={() => handleUpdateStatus(task._id, 'completed')}
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete & Mark Clean
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HousekeepingTasks;
