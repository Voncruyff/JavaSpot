import { supabase } from '../lib/supabase';

interface AdminProfile {
  user_id: string;
  username: string | null;
  nickname: string | null;
  role: string | null;
}

export const logActivity = async (
  action: string,
): Promise<void> => {
  try {
    // Ambil akun Supabase Auth yang sedang login
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      console.error(
        'Activity log gagal: tidak ada admin yang sedang login.',
      );

      return;
    }

    // Ambil profil admin berdasarkan user_id
    const {
      data: adminProfile,
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

    // Prioritas nama:
    // nickname tabel → username tabel → metadata → email
    const adminName =
      adminProfile?.nickname?.trim() ||
      adminProfile?.username?.trim() ||
      user.user_metadata?.nickname ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Admin';

    const { error: insertError } =
      await supabase
        .from('activity_logs')
        .insert([
          {
            admin_name: adminName,
            action,
          },
        ]);

    if (insertError) {
      throw insertError;
    }
  } catch (error) {
    console.error(
      'Gagal mencatat aktivitas admin:',
      error,
    );
  }
};