import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { supabase } from '../lib/supabase';

interface ActivityLog {
  id: string;
  admin_name: string;
  action: string;
  created_at: string;
}

export default function AdminLogActivity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setLogs(data);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-screen w-full flex bg-[#f4ebd9] font-sans overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <AdminHeader />
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h3 className="text-[#2c5340] font-medium text-sm mb-1">Log Activity</h3>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">History of Activity</h2>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
              <h3 className="text-sm font-black tracking-widest text-gray-900 uppercase mb-6">LOG ACTIVITY</h3>
              
              {loading ? (
                <div className="text-center py-8 text-gray-500">Memuat log aktivitas...</div>
              ) : logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Belum ada aktivitas. (Pastikan tabel activity_logs sudah dibuat)</div>
              ) : (
                <ul className="space-y-4">
                  {logs.map((log) => (
                    <li key={log.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#2c5340] mt-2 shrink-0"></div>
                      <p className="text-gray-600 text-sm font-medium">
                        <span className="font-bold text-[#2c5340]">{log.admin_name}</span>
                        {' - '}
                        {formatDate(log.created_at)}
                        {' - '}
                        {log.action}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
