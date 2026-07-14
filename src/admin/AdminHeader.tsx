import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ChevronDown,
  LogOut,
  User,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface AdminProfile {
  user_id: string;
  username: string | null;
  nickname: string | null;
  role: string | null;
}

export default function AdminHeader() {
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [adminName, setAdminName] =
    useState('Admin');

  const [loadingProfile, setLoadingProfile] =
    useState(true);

  const dropdownRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isActive = true;

    const fetchAdminProfile =
      async (): Promise<void> => {
        setLoadingProfile(true);

        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError) {
            throw userError;
          }

          if (!user) {
            if (isActive) {
              setAdminName('Admin');
            }

            return;
          }

          /*
           * Ambil nickname langsung dari tabel admin_users.
           * Tabel menjadi sumber utama, bukan localStorage
           * atau metadata lama.
           */
          const {
            data: profile,
            error: profileError,
          } = await supabase
            .from('admin_users')
            .select(
              'user_id, username, nickname, role',
            )
            .eq('user_id', user.id)
            .maybeSingle<AdminProfile>();

          if (profileError) {
            throw profileError;
          }

          const resolvedName =
            profile?.nickname?.trim() ||
            profile?.username?.trim() ||
            user.user_metadata?.nickname ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'Admin';

          if (isActive) {
            setAdminName(resolvedName);
          }
        } catch (error) {
          console.error(
            'Gagal mengambil profil admin:',
            error,
          );

          if (isActive) {
            setAdminName('Admin');
          }
        } finally {
          if (isActive) {
            setLoadingProfile(false);
          }
        }
      };

    void fetchAdminProfile();

    /*
     * Memperbarui nama saat akun login berubah.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event) => {
        if (
          event === 'SIGNED_IN' ||
          event === 'TOKEN_REFRESHED' ||
          event === 'USER_UPDATED'
        ) {
          void fetchAdminProfile();
        }

        if (event === 'SIGNED_OUT') {
          setAdminName('Admin');
        }
      },
    );

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );
    };
  }, []);

  const handleLogout =
    async (): Promise<void> => {
      setShowDropdown(false);

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        console.error(
          'Gagal logout:',
          error,
        );

        return;
      }

      /*
       * Hapus data lama yang mungkin masih
       * tersimpan dari kode sebelumnya.
       */
      localStorage.removeItem('adminName');

      navigate('/adminlogin', {
        replace: true,
      });
    };

  return (
    <header className="h-[72px] bg-[#2c5340] flex items-center justify-between px-8 shrink-0 z-10 shadow-sm relative">
      <div className="text-white font-bold text-sm tracking-widest uppercase">
        ADMIN PANEL
      </div>

      <div
        ref={dropdownRef}
        className="relative"
      >
        <button
          type="button"
          onClick={() =>
            setShowDropdown(
              (current) => !current,
            )
          }
          className="flex items-center gap-3 text-white hover:text-gray-200 transition-colors"
        >
          <span className="text-sm font-medium">
            {loadingProfile
              ? 'Memuat...'
              : adminName}
          </span>

          <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center bg-white/10">
            <User size={18} />
          </div>

          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${
              showDropdown
                ? 'rotate-180'
                : ''
            }`}
          />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            <button
              type="button"
              onClick={() =>
                void handleLogout()
              }
              className="w-full px-4 py-2 text-left flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}