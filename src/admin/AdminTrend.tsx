import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import ManajemenTrend from './ManajemenTrend';

export default function AdminTrend() {
  return (
    <div className="h-screen w-full flex bg-[#f4ebd9] font-sans overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <AdminHeader />
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h3 className="text-[#2c5340] font-medium text-sm mb-1">Manajemen Trend</h3>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tentukan TOP 10 Destinasi Trending</h2>
            </div>
            <ManajemenTrend />
          </div>
        </div>
      </div>
    </div>
  );
}
