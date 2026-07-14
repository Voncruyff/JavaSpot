import { supabase } from '../lib/supabase';

export const logActivity = async (action: string) => {
  const adminName = localStorage.getItem('adminName') || 'Budi';
  
  try {
    const { error } = await supabase.from('activity_logs').insert([{ 
      admin_name: adminName, 
      action 
    }]);
    
    if (error) {
      console.error('Supabase error logging activity:', error);
    }
  } catch (error) {
    console.error('Failed to log activity', error);
  }
};
