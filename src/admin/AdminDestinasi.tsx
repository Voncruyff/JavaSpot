import React, { useState, useEffect } from 'react';
import { Search, Plus, User, ChevronDown, LogOut, X, Upload, Map, ExternalLink, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { supabase } from '../lib/supabase';
import { logActivity } from './activityLogger';

export default function AdminDestinasi() {
  const navigate = useNavigate();
    const [destinations, setDestinations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
    const [filterLokasi, setFilterLokasi] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Gallery Modal state
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [activeGallery, setActiveGallery] = useState<string[]>([]);
  const [activeDestName, setActiveDestName] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    province: '',
    city: '',
    location: '',
    gmaps_url: '',
    description: '',
  });
  
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  
  // For Edit: keep track of existing gallery urls that haven't been removed
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  
  // Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase.from('destinations').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setDestinations(data || []);
    } catch (error: any) {
      console.error('Error fetching destinations:', error);
      alert('Gagal mengambil data destinasi: ' + error.message);
    }
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setGalleryImages(prev => [...prev, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeNewGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (index: number) => {
    setExistingGalleryUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('destinations')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('destinations')
      .getPublicUrl(filePath);
      
    return publicUrl;
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', category: '', province: '', city: '', location: '', gmaps_url: '', description: '' });
    setMainImage(null);
    setMainImagePreview('');
    setExistingGalleryUrls([]);
    setGalleryImages([]);
    setGalleryPreviews([]);
    setIsModalOpen(true);
  };

  const openEditModal = (dest: any) => {
    setEditingId(dest.id);
    setFormData({
      name: dest.name,
      category: dest.category,
      province: dest.province || '',
      city: dest.city || '',
      location: dest.location || '',
      gmaps_url: dest.gmaps_url || '',
      description: dest.description || ''
    });
    setMainImage(null);
    setMainImagePreview(dest.image_url || '');
    setExistingGalleryUrls(dest.gallery || []);
    setGalleryImages([]);
    setGalleryPreviews([]);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      const destinasiToDelete = destinations.find(d => d.id === itemToDelete);
      const destinasiName = destinasiToDelete ? destinasiToDelete.name : 'Unknown';

      const { error } = await supabase.from('destinations').delete().eq('id', itemToDelete);
      if (error) throw error;
      
      await logActivity(`Delete Destinasi "${destinasiName}"`);
      
      fetchDestinations();
    } catch (error: any) {
      console.error('Error deleting:', error.message);
      alert('Gagal menghapus destinasi: ' + error.message);
    }
  };

  const openGallery = (destName: string, gallery: string[]) => {
    setActiveDestName(destName);
    setActiveGallery(gallery || []);
    setIsGalleryModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let finalMainImageUrl = mainImagePreview; // default to existing if not changed
      
      // If a new file is selected, upload it
      if (mainImage) {
        finalMainImageUrl = await uploadFile(mainImage, 'main_images');
      }
      
      // Upload new gallery images
      const newGalleryUrls = [];
      for (const file of galleryImages) {
        const url = await uploadFile(file, 'gallery');
        newGalleryUrls.push(url);
      }
      
      // Combine kept existing images with newly uploaded ones
      const finalGalleryUrls = [...existingGalleryUrls, ...newGalleryUrls];
      
      const locationString = `${formData.city}, ${formData.province}`;
      
      const destinationData = {
        name: formData.name,
        category: formData.category,
        province: formData.province,
        city: formData.city,
        location: locationString,
        gmaps_url: formData.gmaps_url,
        description: formData.description,
        image_url: finalMainImageUrl,
        gallery: finalGalleryUrls
      };
      
      if (editingId) {
        const { error } = await supabase.from('destinations').update(destinationData).eq('id', editingId);
        if (error) throw error;
        await logActivity(`Edit Destinasi "${destinationData.name}"`);
      } else {
        const { error } = await supabase.from('destinations').insert([destinationData]);
        if (error) throw error;
        await logActivity(`Add Destinasi "${destinationData.name}"`);
      }
      
      setIsModalOpen(false);
      fetchDestinations();
      
    } catch (error: any) {
      console.error('Error saving destination:', error.message);
      alert(`Gagal menyimpan destinasi: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#f4ebd9] font-sans overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <AdminHeader />

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="mb-8">
              <h3 className="text-[#2c5340] font-medium text-sm mb-1">Manajemen Destinasi</h3>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Add, Edit or Delete Destinasi</h2>
            </div>

            {/* Controls Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Search */}
              <div className="md:col-span-5 bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
                <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Search</h4>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Cari berdasarkan nama..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-5 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#2c5340] transition-colors"
                  />
                  <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Filter */}
              <div className="md:col-span-4 bg-[#ede2ce] p-4 rounded-xl shadow-inner border border-gray-200/50 flex flex-col justify-center">
                <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Filter</h4>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-medium text-gray-600 block mb-1">Lokasi</label>
                    <select 
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-600 appearance-none focus:outline-none"
                      value={filterLokasi}
                      onChange={(e) => setFilterLokasi(e.target.value)}
                    >
                      <option value="">Semua Lokasi</option>
                      {Array.from(new Set(destinations.map(d => d.province).filter(Boolean))).map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-medium text-gray-600 block mb-1">Kategori</label>
                    <select 
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-600 appearance-none focus:outline-none"
                      value={filterKategori}
                      onChange={(e) => setFilterKategori(e.target.value)}
                    >
                      <option value="">Semua Kategori</option>
                      <option value="Alam">Alam</option>
                      <option value="Budaya">Budaya</option>
                      <option value="Kota">Kota</option>
                      <option value="Sejarah">Sejarah</option>
                      <option value="Hiburan">Hiburan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Add Button */}
              <div className="md:col-span-3 bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center items-center">
                <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Tambah Destinasi</h4>
                <button 
                  onClick={openAddModal}
                  className="w-full bg-[#3d6553] hover:bg-[#2c5340] text-white py-2.5 rounded-lg font-bold text-xs tracking-widest transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> ADD
                </button>
              </div>

            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-6">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h4 className="text-lg font-black text-gray-900 tracking-tight uppercase">DAFTAR DESTINASI</h4>
                <span className="text-sm text-gray-500 font-medium">Total: {destinations.length}</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-[#3d6553]/20 bg-gray-50/50">
                      <th className="py-4 px-6 text-sm font-bold text-[#2c5340]">No</th>
                      <th className="py-4 px-6 text-sm font-bold text-[#2c5340]">Gambar</th>
                      <th className="py-4 px-6 text-sm font-bold text-[#2c5340]">Nama Destinasi</th>
                      <th className="py-4 px-6 text-sm font-bold text-[#2c5340]">Kategori</th>
                      <th className="py-4 px-6 text-sm font-bold text-[#2c5340]">Lokasi</th>
                      <th className="py-4 px-6 text-sm font-bold text-[#2c5340] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {destinations.filter(d => 
                      d.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                      (filterLokasi === '' || d.location?.includes(filterLokasi) || d.province?.includes(filterLokasi)) &&
                      (filterKategori === '' || d.category === filterKategori)
                    ).map((dest, index) => (
                      <tr key={dest.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-6 text-sm text-gray-600">{index + 1}</td>
                        <td className="py-4 px-6 flex items-center gap-2">
                          {dest.image_url ? (
                            <img src={dest.image_url} alt={dest.name} className="w-20 h-12 object-cover rounded shadow-sm" />
                          ) : (
                            <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>
                          )}
                          {dest.gallery && dest.gallery.length > 0 && (
                            <button 
                              onClick={() => openGallery(dest.name, dest.gallery)}
                              title="Lihat Koleksi Foto"
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#2c5340] hover:text-white text-[#2c5340] flex items-center justify-center transition-colors shadow-sm"
                            >
                              <ChevronRight size={18} />
                            </button>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-900">{dest.name}</td>
                        <td className="py-4 px-6">
                          <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded">
                            {dest.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{dest.location || `${dest.city}, ${dest.province}`}</td>
                        <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                          <button 
                            onClick={() => openEditModal(dest)}
                            className="bg-[#3d6553] hover:bg-[#2c5340] text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider transition-colors shadow-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(dest.id)}
                            className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider transition-colors shadow-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {destinations.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-500">
                          Belum ada destinasi. Klik tombol "+ ADD" untuk menambahkan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal Tambah/Edit Destinasi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-[#2c5340] px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="text-white font-bold text-lg">{editingId ? 'Edit Destinasi' : 'Tambah Destinasi Baru'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <form id="add-destination-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Destinasi</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c5340] focus:border-[#2c5340] outline-none transition-all"
                      placeholder="Contoh: Candi Borobudur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c5340] focus:border-[#2c5340] outline-none transition-all"
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="Alam">Alam</option>
                      <option value="Budaya">Budaya</option>
                      <option value="Kota">Kota</option>
                      <option value="Sejarah">Sejarah</option>
                      <option value="Pantai">Pantai</option>
                      <option value="Gunung">Gunung</option>
                      <option value="Hiburan">Hiburan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Provinsi</label>
                    <input 
                      type="text" 
                      required
                      value={formData.province}
                      onChange={(e) => setFormData({...formData, province: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c5340] focus:border-[#2c5340] outline-none transition-all"
                      placeholder="Contoh: Jawa Tengah"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kota / Kabupaten</label>
                    <input 
                      type="text" 
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c5340] focus:border-[#2c5340] outline-none transition-all"
                      placeholder="Contoh: Magelang"
                    />
                  </div>
                </div>

                {/* Google Maps Link */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link Google Maps</label>
                  <div className="relative">
                    <Map size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="url" 
                      value={formData.gmaps_url}
                      onChange={(e) => setFormData({...formData, gmaps_url: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c5340] focus:border-[#2c5340] outline-none transition-all"
                      placeholder="https://maps.app.goo.gl/..."
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c5340] focus:border-[#2c5340] outline-none transition-all resize-none"
                    placeholder="Ceritakan tentang destinasi ini..."
                  ></textarea>
                </div>

                {/* Main Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Foto Utama Destinasi</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors relative">
                    {mainImagePreview ? (
                      <div className="relative w-full max-w-sm">
                        <img src={mainImagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
                        <button 
                          type="button"
                          onClick={() => { setMainImage(null); setMainImagePreview(''); }}
                          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label htmlFor="main-image" className="relative cursor-pointer bg-white rounded-md font-medium text-[#2c5340] hover:text-[#1e3c2e] focus-within:outline-none px-2 py-1">
                            <span>Upload a file</span>
                            <input id="main-image" name="main-image" type="file" accept="image/*" className="sr-only" onChange={handleMainImageChange} required={!editingId} />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Multiple Images Upload (Gallery) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Koleksi Gambar (Gallery)</label>
                  <div className="mt-1 flex flex-col justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    
                    <div className="space-y-1 text-center mb-4">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="gallery-images" className="relative cursor-pointer bg-white rounded-md font-medium text-[#2c5340] hover:text-[#1e3c2e] focus-within:outline-none px-2 py-1 shadow-sm border border-gray-200">
                          <span>Select multiple files (Optional)</span>
                          <input id="gallery-images" name="gallery-images" type="file" accept="image/*" multiple className="sr-only" onChange={handleGalleryChange} />
                        </label>
                      </div>
                    </div>

                    {(existingGalleryUrls.length > 0 || galleryPreviews.length > 0) && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        {/* Existing Images */}
                        {existingGalleryUrls.map((url, idx) => (
                          <div key={`existing-${idx}`} className="relative group">
                            <img src={url} alt={`Gallery ${idx}`} className="w-full h-24 object-cover rounded-lg shadow-sm border-2 border-transparent group-hover:border-blue-300 transition-colors" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                            <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 rounded">Tersimpan</span>
                            <button 
                              type="button"
                              onClick={() => removeExistingGalleryImage(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        
                        {/* New Preview Images */}
                        {galleryPreviews.map((preview, idx) => (
                          <div key={`new-${idx}`} className="relative group">
                            <img src={preview} alt={`New Gallery ${idx}`} className="w-full h-24 object-cover rounded-lg shadow-sm border-2 border-green-300" />
                            <span className="absolute bottom-1 left-1 text-[10px] bg-green-500 text-white px-1.5 rounded">Baru</span>
                            <button 
                              type="button"
                              onClick={() => removeNewGalleryImage(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200 shrink-0">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button 
                type="submit"
                form="add-destination-form"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#2c5340] hover:bg-[#1e3c2e] text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Menyimpan...
                  </>
                ) : (
                  editingId ? 'Simpan Perubahan' : 'Simpan Destinasi'
                )}
              </button>
            </div>
            
          </div>
        </div>
      )}
      
      {/* Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <ImageIcon size={20} /> Koleksi Foto: {activeDestName}
              </h3>
              <button 
                onClick={() => setIsGalleryModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {activeGallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {activeGallery.map((imgUrl, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-200">
                      <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                  <ImageIcon size={48} className="mb-2 opacity-20" />
                  <p>Tidak ada koleksi foto tambahan untuk destinasi ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Hapus Destinasi"
        message="Apakah Anda yakin ingin menghapus destinasi ini? Tindakan ini tidak dapat dibatalkan dan semua data termasuk foto akan terhapus."
      />

    </div>
  );
}
