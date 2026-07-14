import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, LayoutDashboard, MapPin, TrendingUp, FileText, Activity } from 'lucide-react';

export default function AdminSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', path: '/admindashboard', icon: LayoutDashboard },
    { name: 'Manajemen Destinasi', path: '/admin/destinasi', icon: MapPin },
    { name: 'Manajemen Trend', path: '/admin/trend', icon: TrendingUp },
    { name: 'Manajemen Artikel', path: '/admin/artikel', icon: FileText },
    { name: 'Log Activity', path: '/admin/log-activity', icon: Activity },
  ];

  return (
    <div className={`flex flex-col h-full bg-white shadow-[4px_0_24px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out z-20 ${isOpen ? 'w-72' : 'w-24'} relative shrink-0`}>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="absolute -right-3 top-[22px] bg-white border border-gray-200 text-[#2c5340] rounded-full p-1 shadow-md hover:bg-gray-50 transition-transform duration-300 z-50 flex items-center justify-center h-7 w-7"
      >
        <ChevronLeft size={16} strokeWidth={3} className={`transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Header Sidebar */}
      <div className="h-[72px] bg-[#2c5340] flex items-center justify-center shrink-0 overflow-hidden px-4">
        <h1 className={`text-white font-serif font-bold tracking-tight whitespace-nowrap transition-all duration-300 ${isOpen ? 'text-2xl' : 'text-xl'}`}>
          {isOpen ? 'Java spot.' : 'Js.'}
        </h1>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/admindashboard' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#2c5340] text-white shadow-md shadow-[#2c5340]/20' 
                  : 'text-gray-600 hover:bg-[#f4ebd9]/50 hover:text-[#2c5340]'
              } ${!isOpen ? 'justify-center' : ''}`}
              title={!isOpen ? item.name : ''}
            >
              <Icon 
                size={22} 
                className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#2c5340]'}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              
              {isOpen && (
                <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-gray-700 group-hover:text-[#2c5340]'
                }`}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
