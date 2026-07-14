import React, { useState, useEffect } from 'react';
import { User, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminHeader() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminName, setAdminName] = useState(() => localStorage.getItem('adminName') || 'Budi');

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        
        let newName = 'Budi';

        // Coba dari metadata terlebih dahulu
        if (session.user.user_metadata?.nickname) {
          newName = session.user.user_metadata.nickname;
        } else if (session.user.user_metadata?.name) {
          newName = session.user.user_metadata.name;
        } else {
          // Coba query ke admin_users
          const { data, error } = await supabase
            .from('admin_users')
            .select('nickname')
            .eq('user_id', session.user.id)
            .maybeSingle();
            
          if (!error && data && data.nickname) {
            newName = data.nickname;
          }
        }
        
        setAdminName(newName);
        localStorage.setItem('adminName', newName);
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      setAdminName('Budi');
      localStorage.setItem('adminName', 'Budi');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminName');
    navigate('/adminlogin');
  };

  return (
    <div className="h-[72px] bg-[#2c5340] flex items-center justify-between px-8 shrink-0 z-10 shadow-sm relative">
      <div className="text-white font-bold text-sm tracking-widest uppercase">
        ADMIN PANEL
      </div>
      <div className="relative">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 text-white hover:text-gray-200 transition-colors"
        >
          <span className="text-sm font-medium">{adminName}</span>
          <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center bg-white/10">
            <User size={18} />
          </div>
          <ChevronDown size={18} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
