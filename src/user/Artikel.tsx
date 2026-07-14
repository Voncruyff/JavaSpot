import React, { useState, useEffect } from 'react';
import { BookOpen, User, Clock, ChevronRight, Tag, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import NavigationBar from './NavigationBar';
import ArtikelPopup from './ArtikelPopup';
import Footer from './Footer';

export default function Artikel() {
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        setArticles(data);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenArticle = async (art: any) => {
    setSelectedArticle(art);
    
    // Increment view count
    try {
      // Try to get current views
      const { data } = await supabase.from('articles').select('views').eq('id', art.id).single();
      const currentViews = data?.views || 0;
      
      // Update views
      await supabase.from('articles').update({ views: currentViews + 1 }).eq('id', art.id);
    } catch (err) {
      // If it fails (e.g. column doesn't exist), just log and continue safely
      console.error('Failed to increment views (Pastikan kolom "views" bertipe Integer sudah dibuat di tabel articles):', err);
    }
  };

  const filteredArticles = articles.filter(art => 
    art.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    art.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea] flex flex-col font-sans">
      <NavigationBar 
        theme="light" 
        showSearch={true}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Cari judul atau penulis..."
      />
      
      {/* Banner */}
      <div className="relative w-full h-[400px] overflow-hidden shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80&w=1920&h=400" 
          alt="Artikel Wisata" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white pt-16">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-center drop-shadow-lg mb-4 tracking-widest uppercase">ARTIKEL</h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl text-center px-6 drop-shadow-md text-white/90">Kumpulan artikel panduan wisata, tips perjalanan hemat, dan cerita seru dari para penjelajah Nusantara.</p>
        </div>
      </div>

      <div id="articles-section" className="flex-1 py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-black text-neutral-900 flex items-center gap-2">
              Berita & Informasi Terkini
            </h2>
            {searchTerm && (
               <p className="text-sm font-medium text-neutral-500">
                  Ditemukan {filteredArticles.length} artikel untuk "{searchTerm}"
               </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-neutral-500 text-lg">Memuat artikel...</p>
              </div>
            ) : filteredArticles.length === 0 ? (
               <div className="col-span-full py-20 text-center">
                  <p className="text-neutral-500 text-lg">Belum ada artikel yang tersedia.</p>
               </div>
            ) : filteredArticles.map(art => (
              <div 
                key={art.id}
                className="bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.16)] transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group p-4"
                onClick={() => handleOpenArticle(art)}
              >
                <div className="relative w-full h-48 rounded-[16px] overflow-hidden bg-neutral-200 mb-4 shrink-0">
                  {art.thumbnail_url ? (
                    <img 
                      src={art.thumbnail_url} 
                      alt={art.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <p className="text-[#2c5340] text-[10px] font-bold uppercase tracking-widest mb-2">{art.author}</p>
                  <h4 className="font-extrabold text-black leading-snug mb-2 text-sm line-clamp-2 group-hover:text-[#2c5340] transition-colors">
                    {art.title}
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 mb-3 text-justify font-normal flex-grow">
                    {art.content ? art.content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim() : ''}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-100">
                    <p className="text-[#2c5340] text-[10px] font-bold uppercase tracking-wider">{formatDate(art.created_at)}</p>
                    {art.views !== undefined && (
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{art.views} Views</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Article Detail Modal */}
      <ArtikelPopup 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />

      <Footer />
    </div>
  );
}
