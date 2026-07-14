import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { ActivityLog } from '../types';

interface LogActivityProps {
  logs: ActivityLog[];
  fetchLogs: () => void;
  loadingLogs: boolean;
}

export default function LogActivity({ logs, fetchLogs, loadingLogs }: LogActivityProps) {
  return (
    <section className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 space-y-6">
      
      {/* Log Control Header */}
      <div className="flex items-center justify-between pb-5 border-b border-neutral-800">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
            <Activity className="w-5 h-5 text-amber-500 animate-pulse" /> Log Audit Aktivitas Admin
          </h2>
          <p className="text-xs text-neutral-400">Audit pencatatan aktivitas keamanan serta transaksi database real-time JavaSpot.</p>
        </div>

        <div>
          <button
            onClick={fetchLogs}
            disabled={loadingLogs}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
            {loadingLogs ? 'Memuat...' : 'Muat Ulang Log'}
          </button>
        </div>
      </div>

      {/* Logs List Table */}
      <div className="overflow-x-auto border border-neutral-800 rounded-xl bg-neutral-950">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-bold select-none">
              <th className="p-4 w-40">Waktu Audit UTC</th>
              <th className="p-4 w-44">Jenis Tindakan</th>
              <th className="p-4">Deskripsi Audit Sistem</th>
              <th className="p-4 w-28 text-right">Otoritas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 font-mono text-[11px] text-neutral-300">
            {logs.length > 0 ? (
              logs.map((log) => {
                // Get a color badge based on action type
                let badgeColor = 'bg-neutral-800 text-neutral-400';
                if (log.action.includes('Tambah') || log.action.includes('Login')) {
                  badgeColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                } else if (log.action.includes('Edit')) {
                  badgeColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                } else if (log.action.includes('Hapus') || log.action.includes('Gagal')) {
                  badgeColor = 'bg-red-500/10 text-red-400 border border-red-500/20';
                } else if (log.action.includes('Reset')) {
                  badgeColor = 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
                }

                return (
                  <tr key={log.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="p-4 text-neutral-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-300 font-sans leading-relaxed text-left">
                      {log.details}
                    </td>
                    <td className="p-4 text-right font-bold text-amber-500">
                      @{log.nickname}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-12 text-center text-neutral-500">
                  <Activity className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
                  <div className="text-sm font-semibold">Log Kosong</div>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1 font-sans">
                    Belum ada aktivitas yang dicatat di server. Jalankan CRUD atau masuk kembali untuk melihat entri log.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </section>
  );
}
