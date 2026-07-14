import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { supabase } from '../lib/supabase';

interface Destinasi {
  id: string;
  name: string;
  category: string;
  city: string;
  province: string;
}

interface Artikel {
  id: string;
  title: string;
  author: string;
  created_at: string;
  views?: number;
}

interface ActivityLog {
  id: string;
  admin_name: string;
  action: string;
  created_at: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destinasi[]>([]);
  const [articles, setArticles] = useState<Artikel[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [trendingDestinations, setTrendingDestinations] = useState<Destinasi[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch destinations
      const { data: destData } = await supabase.from('destinations').select('*');
      if (destData) setDestinations(destData);

      // Fetch articles
      const { data: artData } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (artData) setArticles(artData);

      // Fetch logs
      const { data: logData } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(5);
      if (logData) setLogs(logData);

        // Setup trending
      if (destData) {
        const trendIdsStr = localStorage.getItem('trendingDestinations');
        let trendIds: string[] = [];
        if (trendIdsStr) {
          try {
            trendIds = JSON.parse(trendIdsStr);
          } catch (e) { }
        }
        const trending = trendIds.map(id => destData.find(d => d.id === id)).filter(Boolean).slice(0, 4) as Destinasi[];
        setTrendingDestinations(trending);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Process Destination Stats
  const totalDestinasi = destinations.length;
  const categories = Array.from(new Set(destinations.map(d => d.category).filter(Boolean)));
  const categoryStats = categories.map(cat => ({
    name: cat,
    count: destinations.filter(d => d.category === cat).length
  })).sort((a, b) => b.count - a.count); // Highest count first

  const colors = ['#16a34a', '#f59e0b', '#ea580c', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

  let currentOffset = 0;
  const chartSlices = categoryStats.map((stat, i) => {
    const pct = totalDestinasi === 0 ? 0 : Math.round((stat.count / totalDestinasi) * 100);
    const dash = `${pct} 100`;
    const offset = `-${currentOffset}`;
    currentOffset += pct;
    return { ...stat, pct, dash, offset, color: colors[i % colors.length] };
  });

  // Process Articles Stats
  const totalArtikel = articles.length;
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const articlesToday = articles.filter(a => new Date(a.created_at) >= startOfDay).length;
  const articlesThisWeek = articles.filter(a => new Date(a.created_at) >= startOfWeek).length;
  const articlesThisMonth = articles.filter(a => new Date(a.created_at) >= startOfMonth).length;
  const articlesThisYear = articles.filter(a => new Date(a.created_at) >= startOfYear).length;
  const artMonthPct = totalArtikel === 0 ? 0 : Math.round((articlesThisMonth / totalArtikel) * 100);

  // Top articles by view
  const topArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);

  return (
    <div className="h-screen w-full flex bg-neutral-100 font-sans overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full bg-[#f4ebd9] overflow-hidden">
        <AdminHeader />
        
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="mb-8">
              <h3 className="text-[#2c5340] font-medium text-sm mb-1">Dashboard</h3>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Overview & Statistics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-2 space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Destinasi Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h4 className="text-[11px] font-bold text-gray-800 mb-6 text-center tracking-widest uppercase">JUMLAH DESTINASI</h4>
                    <div className="flex items-center justify-center gap-8">
                      <div className="relative flex items-center justify-center w-[120px] h-[120px]">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                          {chartSlices.map((slice, i) => (
                            <circle key={i} cx="21" cy="21" r="15.915" fill="transparent" stroke={slice.color} strokeWidth="6" strokeDasharray={slice.dash} strokeDashoffset={slice.offset} />
                          ))}
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center bg-white rounded-full w-[60px] h-[60px] shadow-sm z-10">
                          <span className="font-black text-xl text-gray-900 leading-none">{totalDestinasi}</span>
                          <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase">destinasi</span>
                        </div>
                      </div>
                      <div className="space-y-3 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                        {chartSlices.map((slice, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: slice.color }}></div>
                            <span className="text-[11px] font-black tracking-wider uppercase truncate max-w-[90px]" style={{ color: slice.color }} title={`${slice.count} ${slice.name}`}>
                              {slice.count} {slice.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Artikel Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
                    <h4 className="text-[11px] font-bold text-gray-800 text-center tracking-widest uppercase">JUMLAH ARTIKEL</h4>
                    <div className="flex items-center justify-center gap-6 mt-4 mb-4">
                      <span className="text-7xl font-black text-gray-900 leading-none">{totalArtikel}</span>
                      <div className="flex flex-col gap-1 text-[11px] font-bold text-[#2c5340] tracking-wide border-l-2 border-gray-100 pl-4 py-1">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#2c5340]"></div> {articlesToday} Hari ini</span>
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#3d6553]"></div> {articlesThisWeek} Minggu ini</span>
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#497761]"></div> {articlesThisMonth} Bulan ini</span>
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#6a8b7a]"></div> {articlesThisYear} Tahun ini</span>
                      </div>
                    </div>
                    <div className="mt-auto w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
                      <div className="h-full bg-gray-900" style={{ width: `${100 - artMonthPct}%` }}></div>
                      <div className="h-full bg-[#497761]" style={{ width: `${artMonthPct}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Viewer of Artikel - Expanded */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h4 className="text-[11px] font-bold text-gray-800 mb-6 text-center tracking-widest uppercase">VIEWER OF ARTIKEL</h4>
                  <div className="space-y-6">
                    {topArticles.length === 0 ? (
                      <div className="text-center text-gray-500 text-sm py-4">Belum ada data artikel.</div>
                    ) : topArticles.map((art) => {
                      // Calculate width based on max views
                      const maxViews = Math.max(...topArticles.map(a => a.views || 0), 1);
                      const widthPct = Math.max(10, Math.round(((art.views || 0) / maxViews) * 100));
                      
                      return (
                        <div key={art.id}>
                          <div className="text-[11px] font-medium text-gray-800 mb-1 truncate">{art.title} - {art.author}</div>
                          <div className="flex items-center gap-3">
                            <div className="h-9 bg-[#3d6553] rounded-r-sm transition-all duration-1000" style={{ width: `${widthPct}%` }}></div>
                            <span className="text-xs font-bold text-[#2c5340]">{art.views || 0}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: 1/3 width */}
              <div className="col-span-1 space-y-6">
                
                {/* Log Activity */}
                <div className="bg-[#fcfcfa] p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h4 className="text-[11px] font-bold text-gray-800 mb-6 text-center tracking-widest uppercase">LOG ACTIVITY</h4>
                  <div className="space-y-4 mb-8">
                    {logs.length === 0 ? (
                      <div className="text-center text-gray-500 text-xs py-2">Belum ada aktivitas.</div>
                    ) : logs.map((log) => {
                      const dateObj = new Date(log.created_at);
                      const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
                      return (
                        <div key={log.id} className="text-[13px] text-[#3d6553] font-medium leading-snug">
                          {log.admin_name} - {log.action} <span className="text-[10px] text-gray-400 block mt-0.5">{dateStr}</span>
                        </div>
                      )
                    })}
                  </div>
                  <button onClick={() => navigate('/admin/log-activity')} className="w-full bg-[#2c5340] text-white py-3 rounded-xl font-bold text-[11px] tracking-widest shadow-sm hover:bg-[#1e3c2e] transition-colors">
                    VIEW
                  </button>
                </div>

                {/* Trending */}
                <div className="bg-[#fcfcfa] p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h4 className="text-[11px] font-bold text-gray-800 mb-6 text-center tracking-widest uppercase">TRENDING</h4>
                  <div className="space-y-4 mb-8">
                    {trendingDestinations.length === 0 ? (
                      <div className="text-center text-gray-500 text-xs py-2">Belum ada trending.</div>
                    ) : trendingDestinations.map((item, idx) => (
                      <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200/60 last:border-0 last:pb-0">
                        <div className="w-[34px] h-[34px] rounded-full bg-[#2c5340] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                          {idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-[13px] text-gray-900 leading-tight mb-0.5 truncate">{item.name}</div>
                          <div className="text-[10px] text-gray-500 font-medium truncate">{item.city}, {item.province}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate('/admin/trend')} className="w-full bg-[#2c5340] text-white py-3 rounded-xl font-bold text-[11px] tracking-widest shadow-sm hover:bg-[#1e3c2e] transition-colors">
                    EDIT
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
