import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import ManajemenArtikel from './ManajemenArtikel';

export default function AdminArtikel() {
  return (
    <div className="h-screen w-full flex bg-[#f4ebd9] font-sans overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <AdminHeader />
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="mb-6">
              <h3 className="text-[#2c5340] font-medium text-sm mb-1">Manajemen Artikel</h3>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Add, Edit or Delete Artikel</h2>
            </div>
            <ManajemenArtikel />
          </div>
        </div>
      </div>
    </div>
  );
}
