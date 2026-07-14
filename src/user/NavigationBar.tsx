import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';

interface NavigationBarProps {
  theme?: 'light' | 'dark';
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
}

export default function NavigationBar({ 
  theme = 'light',
  showSearch = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Cari...'
}: NavigationBarProps) {
  const isDark = theme === 'dark';
  const location = useLocation();
  const currentPath = location.pathname;
  
  const links = [
    { name: 'HOME', path: '/home' },
    { name: 'DESTINASI', path: '/destinasi' },
    { name: 'TREND', path: '/trend' },
    { name: 'ARTIKEL', path: '/artikel' },
    { name: 'TENTANG', path: '/tentang' },
  ];

  return (
    <nav 
      className={`w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] mx-auto px-6 py-[15px] md:px-8 mt-4 md:mt-6 flex items-center justify-between ${isDark ? 'bg-white/80 border-neutral-200 shadow-md text-neutral-800' : 'bg-black/30 text-white border-white/10 shadow-lg saturate-150'} backdrop-blur-2xl fixed top-0 left-0 right-0 z-50 rounded-full transition-colors duration-300`}
    >
      {/* Brand/Logo */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${isDark ? 'text-neutral-900' : 'text-white drop-shadow-md'} text-[25px] font-normal font-serif tracking-normal ml-2 md:ml-4 cursor-pointer shrink-0`}
      >
        <Link to="/home">Java spot.</Link>
      </motion.div>
      
      {/* Search Bar */}
      {showSearch && (
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none w-[250px] lg:w-[350px] xl:w-[400px] justify-center items-center">
          <motion.div 
            initial={{ width: "0%", opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="pointer-events-auto relative h-[40px] flex items-center overflow-hidden rounded-full w-full"
          >
            <Search className={`absolute left-4 w-4 h-4 z-10 ${isDark ? 'text-neutral-400' : 'text-white/60'}`} />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className={`w-full pl-11 pr-16 h-full rounded-full text-sm outline-hidden transition-all duration-300 shadow-sm ${
                isDark 
                  ? 'bg-neutral-100/70 border border-neutral-200 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10 text-neutral-800 placeholder:text-neutral-400' 
                  : 'bg-white/10 border border-white/20 focus:bg-white/25 focus:border-white/40 text-white placeholder:text-white/70 backdrop-blur-md'
              }`}
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange?.('')}
                className={`absolute right-3 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider transition-colors ${
                  isDark ? 'text-neutral-500 bg-neutral-200/50 hover:bg-neutral-200' : 'text-white/80 bg-white/20 hover:bg-white/30'
                }`}
              >
                Clear
              </button>
            )}
          </motion.div>
        </div>
      )}

      {/* Nav Links */}
      <div className={`hidden lg:flex items-center gap-1 xl:gap-3 ${isDark ? 'text-neutral-600' : 'text-white/90'} text-[13px] tracking-wider uppercase shrink-0`}>
        {links.map((link) => {
          const isActive = currentPath === link.path;
          return (
            <Link 
              key={link.name}
              to={link.path} 
              className="relative px-3 py-1.5 rounded-[20px] transition-colors"
            >
              <span className={`relative z-10 transition-all duration-300 ${
                  isActive 
                    ? (isDark ? 'text-neutral-900 font-bold' : 'text-white font-bold drop-shadow-sm') 
                    : (isDark ? 'hover:text-neutral-900 font-normal' : 'hover:text-white font-normal drop-shadow-sm')
                }`}>
                {link.name}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="activeNavOutline"
                  className={`absolute inset-0 rounded-[20px] border ${isDark ? 'border-neutral-900' : 'border-white'} z-0`}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
