import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { supabase } from '../lib/supabase';
import { logActivity } from './activityLogger';
// @ts-ignore
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function TulisArtikel() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
    if (data) {
      setTitle(data.title || '');
      setAuthor(data.author || '');
      setThumbnailUrl(data.thumbnail_url || '');
      setContent(data.content || '');
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
      setThumbnailUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadThumbnail = async () => {
    if (!thumbnail) return thumbnailUrl;
    const fileExt = thumbnail.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `articles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('articles')
      .upload(filePath, thumbnail);
      
    if (uploadError) {
      throw uploadError;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('articles')
      .getPublicUrl(filePath);
      
    return publicUrl;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const finalThumbUrl = await uploadThumbnail();
      
      const payload = {
        title,
        author,
        thumbnail_url: finalThumbUrl,
        content
      };

      if (id) {
        await supabase.from('articles').update(payload).eq('id', id);
        await logActivity(`Edit Artikel "${title}"`);
      } else {
        await supabase.from('articles').insert([payload]);
        await logActivity(`Publish Artikel "${title}"`);
      }
      navigate('/admin/artikel');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan artikel.');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'align': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="h-screen w-full flex bg-[#f4ebd9] font-sans overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <AdminHeader />
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-[#2c5340] font-medium text-sm mb-1">Manajemen Artikel</h3>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{id ? 'Edit Artikel' : 'Tulis Artikel'}</h2>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate('/admin/artikel')}
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-white shadow-sm border border-transparent transition-colors"
                >
                  BATAL
                </button>
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="px-8 py-2.5 bg-[#2c5340] hover:bg-[#1e3c2e] text-white font-bold rounded-xl shadow-sm transition-colors"
                >
                  {loading ? 'MENYIMPAN...' : 'SIMPAN'}
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-8">
              <div className="space-y-4">
                <label className="block text-sm font-black tracking-widest text-gray-900 uppercase">THUMBNAIL UTAMA</label>
                <div className="flex items-center gap-6">
                  <div className="w-48 h-32 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                    {thumbnailUrl ? (
                      <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">NO IMAGE</div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} className="text-sm font-medium" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-black tracking-widest text-gray-900 uppercase">JUDUL ARTIKEL</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2c5340]/20 text-sm font-bold"
                  placeholder="Masukkan judul artikel"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-black tracking-widest text-gray-900 uppercase">AUTHOR</label>
                <input 
                  type="text" 
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2c5340]/20 text-sm font-bold"
                  placeholder="Nama penulis"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-black tracking-widest text-gray-900 uppercase">ISI ARTIKEL</label>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={setContent} 
                    modules={modules}
                    className="h-96"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
