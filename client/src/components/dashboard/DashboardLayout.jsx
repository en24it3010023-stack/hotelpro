import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <DashboardSidebar />
      <main className="flex-1 p-6 sm:p-10 bg-slate-50/50 dark:bg-navy-950/50 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
