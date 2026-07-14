import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { logActivity } from './activityLogger';

export default function ManajemenArtikel() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('None');
  const [filterYear, setFilterYear] = useState('None');
  const [sortOrder, setSortOrder] = useState('Terbaru ke Terlama');
  
  // Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    // In actual implementation this fetches from 'articles' table.
    // Assuming table exists, we'll try to fetch.
    const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setArticles(data);
    }
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      const articleToDelete = articles.find(a => a.id === itemToDelete);
      const articleTitle = articleToDelete ? articleToDelete.title : 'Unknown';
      
      await supabase.from('articles').delete().eq('id', itemToDelete);
      
      await logActivity(`Delete Artikel "${articleTitle}"`);
      fetchArticles();
    }
  };

  // Filter and sort logic
  let filtered = articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
  if (filterAuthor !== 'None') {
    filtered = filtered.filter(a => a.author === filterAuthor);
  }
  if (filterYear !== 'None') {
    filtered = filtered.filter(a => new Date(a.created_at).getFullYear().toString() === filterYear);
  }

  if (sortOrder === 'Terbaru ke Terlama') {
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else {
    filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  // Get unique authors and years for filters
  const authors = ['None', ...Array.from(new Set(articles.map(a => a.author).filter(Boolean)))];
  const years = ['None', ...Array.from(new Set(articles.map(a => new Date(a.created_at).getFullYear().toString())))];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Search */}
        <div className="md:col-span-6 bg-[#fcfcfa] p-6 rounded-3xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-black tracking-widest text-gray-900 uppercase mb-4">SEARCH</h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="SEARCH" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-11 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2c5340]/20 text-sm font-bold tracking-wide uppercase shadow-sm"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          </div>
        </div>

        {/* Filter */}
        <div className="md:col-span-3 bg-[#fcfcfa] p-6 rounded-3xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-black tracking-widest text-gray-900 uppercase mb-4">FILTER</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-600 w-12">Author</span>
              <div className="relative flex-1">
                <select 
                  value={filterAuthor}
                  onChange={(e) => setFilterAuthor(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 text-xs font-bold text-gray-500 py-1.5 pl-3 pr-8 rounded focus:outline-none"
                >
                  {authors.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#2c5340] flex items-center justify-center rounded-r pointer-events-none">
                  <ChevronDown className="text-white" size={14} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-600 w-12">Tahun</span>
              <div className="relative flex-1">
                <select 
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 text-xs font-bold text-gray-500 py-1.5 pl-3 pr-8 rounded focus:outline-none"
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#2c5340] flex items-center justify-center rounded-r pointer-events-none">
                  <ChevronDown className="text-white" size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tambah Artikel */}
        <div className="md:col-span-3 bg-[#fcfcfa] p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-center">
          <h3 className="text-sm font-black tracking-widest text-gray-900 uppercase mb-4">TAMBAH ARTIKEL</h3>
          <button 
            onClick={() => navigate('/admin/artikel/tulis')}
            className="w-full bg-[#3d6553] hover:bg-[#2c5340] text-white py-3 rounded-xl font-black text-sm tracking-widest shadow-sm transition-colors"
          >
            + ADD
          </button>
        </div>
      </div>

      {/* Daftar Artikel */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black tracking-widest text-gray-900 uppercase">DAFTAR ARTIKEL</h3>
          <div className="relative">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-xs font-bold text-gray-600 py-2 pl-4 pr-10 rounded focus:outline-none shadow-sm"
            >
              <option>Terbaru ke Terlama</option>
              <option>Terlama ke Terbaru</option>
            </select>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#2c5340] flex items-center justify-center rounded-r pointer-events-none">
              <ChevronDown className="text-white" size={14} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-[#8db596] text-[#2c5340]">
                <th className="py-3 px-4 font-bold text-xs tracking-widest uppercase text-center w-16">No</th>
                <th className="py-3 px-4 font-bold text-xs tracking-widest uppercase w-32">Thumbnail</th>
                <th className="py-3 px-4 font-bold text-xs tracking-widest uppercase">Judul</th>
                <th className="py-3 px-4 font-bold text-xs tracking-widest uppercase">Author</th>
                <th className="py-3 px-4 font-bold text-xs tracking-widest uppercase">Tanggal Publish</th>
                <th className="py-3 px-4 font-bold text-xs tracking-widest uppercase text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((art, index) => (
                <tr key={art.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-center text-sm font-bold text-gray-600">{index + 1}</td>
                  <td className="py-4 px-4">
                    <div className="w-24 h-14 rounded-lg bg-gray-200 overflow-hidden shadow-sm">
                      {art.thumbnail_url ? (
                        <img src={art.thumbnail_url} alt={art.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-bold text-gray-800">{art.title}</td>
                  <td className="py-4 px-4 text-xs font-bold text-gray-600">{art.author}</td>
                  <td className="py-4 px-4 text-xs font-bold text-gray-600">
                    {new Date(art.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/artikel/edit/${art.id}`)}
                        className="bg-[#2c5340] hover:bg-[#1e3c2e] text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded shadow-sm"
                      >
                        EDIT
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(art.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded shadow-sm"
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">
                    Belum ada artikel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Hapus Artikel"
        message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}
