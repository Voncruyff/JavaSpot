/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import { Destination, ProvinceType, CategoryType } from '../types';

interface DestinationFormModalProps {
  destination: Destination | null; // null if adding new, object if editing
  onClose: () => void;
  onSave: (destData: Partial<Destination>) => Promise<boolean>;
}

const PROVINCES: ProvinceType[] = [
  'Banten',
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur'
];

const CATEGORIES: CategoryType[] = [
  'Alam',
  'Sejarah & Budaya',
  'Taman Rekreasi',
  'Kuliner'
];

export default function DestinationFormModal({ 
  destination, 
  onClose, 
  onSave 
}: DestinationFormModalProps) {
  const isEdit = !!destination;

  // Form Fields State
  const [name, setName] = useState('');
  const [province, setProvince] = useState<ProvinceType>('DKI Jakarta');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState<CategoryType>('Alam');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [entranceFee, setEntranceFee] = useState<number>(0);
  const [locationCoordinates, setLocationCoordinates] = useState('');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('');
  const [featured, setFeatured] = useState(false);
  const [rating, setRating] = useState<number>(4.5);
  const [reviewsCount, setReviewsCount] = useState<number>(10);

  // Tips array builder
  const [tips, setTips] = useState<string[]>([]);
  const [newTip, setNewTip] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load destination values if in Edit Mode
  useEffect(() => {
    if (destination) {
      setName(destination.name || '');
      setProvince(destination.province || 'DKI Jakarta');
      setCity(destination.city || '');
      setCategory(destination.category || 'Alam');
      setDescription(destination.description || '');
      setImageUrl(destination.imageUrl || '');
      setEntranceFee(destination.entranceFee || 0);
      setLocationCoordinates(destination.locationCoordinates || '');
      setBestTimeToVisit(destination.bestTimeToVisit || '');
      setFeatured(destination.featured || false);
      setRating(destination.rating || 4.5);
      setReviewsCount(destination.reviewsCount || 10);
      setTips(destination.recommendedTips ? [...destination.recommendedTips] : []);
    } else {
      // Default placeholder values for a new destination to make editing fast/fun for the reviewer
      setName('');
      setProvince('DKI Jakarta');
      setCity('');
      setCategory('Alam');
      setDescription('');
      setImageUrl('');
      setEntranceFee(0);
      setLocationCoordinates('');
      setBestTimeToVisit('');
      setFeatured(false);
      setRating(4.5);
      setReviewsCount(10);
      setTips([]);
    }
  }, [destination]);

  // Handle adding tip to list
  const handleAddTip = () => {
    if (newTip.trim()) {
      setTips([...tips, newTip.trim()]);
      setNewTip('');
    }
  };

  // Handle removing tip
  const handleRemoveTip = (indexToRemove: number) => {
    setTips(tips.filter((_, idx) => idx !== indexToRemove));
  };

  // Pre-fill a beautiful stock Unsplash image depending on selected category to make adding destinations easy!
  const handleAutoFillImage = () => {
    let url = 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=1200&q=80';
    if (category === 'Alam') {
      url = 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80';
    } else if (category === 'Sejarah & Budaya') {
      url = 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1200&q=80';
    } else if (category === 'Taman Rekreasi') {
      url = 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=80';
    } else if (category === 'Kuliner') {
      url = 'https://images.unsplash.com/photo-1571731956686-34372ed41b0c?auto=format&fit=crop&w=1200&q=80';
    }
    setImageUrl(url);
  };

  // Handle Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple validations
    if (!name.trim()) return setError('Nama destinasi wajib diisi.');
    if (!city.trim()) return setError('Nama kota wajib diisi.');
    if (!description.trim()) return setError('Deskripsi lengkap wajib diisi.');
    if (!imageUrl.trim()) return setError('URL Gambar destinasi wajib diisi.');
    if (rating < 1 || rating > 5) return setError('Rating harus bernilai antara 1.0 s/d 5.0.');

    setSaving(true);

    const payload: Partial<Destination> = {
      name: name.trim(),
      province,
      city: city.trim(),
      category,
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      entranceFee: Number(entranceFee),
      locationCoordinates: locationCoordinates.trim() || '0.0, 0.0',
      bestTimeToVisit: bestTimeToVisit.trim() || 'Kapan saja',
      featured,
      rating: Number(rating),
      reviewsCount: Number(reviewsCount),
      recommendedTips: tips
    };

    const success = await onSave(payload);
    setSaving(false);
    if (success) {
      onClose();
    } else {
      setError('Gagal menyimpan destinasi. Periksa koneksi server atau otentikasi Admin Anda.');
    }
  };

  return (
    <div id="form-modal-backdrop" className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        id="form-modal-container"
        className="relative bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white p-5 px-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-black tracking-tight">
              {isEdit ? 'Ubah Destinasi Wisata' : 'Tambah Destinasi Baru'}
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {isEdit ? `Mengedit data objek wisata: ${destination?.name}` : 'Menyimpan objek wisata baru ke dalam database JavaSpot'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          
          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-700 p-4 rounded-xl text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Name field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Nama Wisata *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Candi Sewu"
                className="w-full text-sm p-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-amber-500 text-neutral-800"
                required
              />
            </div>

            {/* City Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Kota / Kabupaten *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Contoh: Sleman"
                className="w-full text-sm p-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-amber-500 text-neutral-800"
                required
              />
            </div>

            {/* Province selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Provinsi *</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value as ProvinceType)}
                className="w-full text-sm p-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-amber-500 text-neutral-800 bg-white"
              >
                {PROVINCES.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            {/* Category selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Kategori Wisata *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full text-sm p-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-amber-500 text-neutral-800 bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Entrance fee */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Biaya Masuk (IDR) *</label>
              <input
                type="number"
                min="0"
                value={entranceFee}
                onChange={(e) => setEntranceFee(Number(e.target.value))}
                placeholder="Gunakan 0 jika gratis"
                className="w-full text-sm p-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-amber-500 text-neutral-800"
                required
              />
            </div>

            {/* Coordinates */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Koordinat Google Maps</label>
              <input
                type="text"
                value={locationCoordinates}
                onChange={(e) => setLocationCoordinates(e.target.value)}
                placeholder="Contoh: -7.7520, 110.4914"
                className="w-full text-sm p-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-amber-500 text-neutral-800"
              />
            </div>

            {/* Best time to visit */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Waktu Terbaik Berkunjung</label>
              <input
                type="text"
                value={bestTimeToVisit}
                onChange={(e) => setBestTimeToVisit(e.target.value)}
                placeholder="Contoh: Pagi hari s/d Sore"
                className="w-full text-sm p-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-amber-500 text-neutral-800"
              />
            </div>

            {/* Rating Simulator (Only for seeding mockup) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Rating (1.0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full text-sm p-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-amber-500 text-neutral-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Jumlah Review</label>
                <input
                  type="number"
                  min="0"
                  value={reviewsCount}
                  onChange={(e) => setReviewsCount(Number(e.target.value))}
                  className="w-full text-sm p-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-amber-500 text-neutral-800"
                />
              </div>
            </div>

          </div>

          {/* Image Url */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">URL Gambar Ilustrasi *</label>
              <button
                type="button"
                onClick={handleAutoFillImage}
                className="text-[10px] font-extrabold text-amber-600 hover:text-amber-700 bg-amber-500/10 px-2 py-1 rounded-md"
              >
                Gunakan Gambar Template Unsplash
              </button>
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full text-sm p-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-amber-500 text-neutral-800"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Deskripsi Destinasi *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan sejarah, daya tarik, keindahan alam, maupun rute dari objek wisata ini secara mendalam..."
              rows={4}
              className="w-full text-sm p-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-amber-500 text-neutral-800 leading-relaxed"
              required
            ></textarea>
          </div>

          {/* Tips List Builder */}
          <div className="space-y-2 bg-neutral-50 border border-neutral-200/60 p-4 rounded-xl">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">Tips Perjalanan Pengunjung</label>
            <p className="text-[11px] text-neutral-400 -mt-1">Masukkan beberapa saran penting bagi wisatawan demi kenyamanan perjalanan mereka.</p>
            
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                placeholder="Contoh: Kenakan sandal anti-licin saat turun ke bibir kawah"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTip())}
                className="flex-1 text-xs p-2.5 rounded-lg border border-neutral-200 focus:outline-hidden focus:border-amber-500 bg-white"
              />
              <button
                type="button"
                onClick={handleAddTip}
                className="bg-neutral-900 hover:bg-neutral-800 text-white p-2.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Tambah
              </button>
            </div>

            {tips.length > 0 ? (
              <ul className="space-y-1.5 mt-3">
                {tips.map((tip, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3 bg-white px-3 py-2 rounded-lg border border-neutral-100 text-xs text-neutral-700">
                    <span className="line-clamp-1">{tip}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTip(idx)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-sm shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] text-neutral-400 text-center py-4 bg-white rounded-lg border border-neutral-100/50">Belum ada tips yang ditambahkan.</p>
            )}
          </div>

          {/* Featured checkbox */}
          <div className="flex items-center gap-2.5 bg-neutral-50 border border-neutral-200/60 p-4 rounded-xl">
            <input
              type="checkbox"
              id="featured-checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-amber-500 border-neutral-300 rounded-sm focus:ring-amber-500"
            />
            <label htmlFor="featured-checkbox" className="select-none">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">Soroti Sebagai Rekomendasi Unggulan</span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">Destinasi ini akan disorot di carousel/banner depan website.</span>
            </label>
          </div>

        </form>

        {/* Footer controls */}
        <div className="p-5 border-t border-neutral-100 bg-neutral-50 shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg text-xs font-bold text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-100 transition-colors"
          >
            Batal
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-neutral-950 font-bold text-xs px-6 py-2.5 rounded-lg transition-colors inline-flex items-center gap-1"
          >
            {saving ? 'Menyimpan...' : (
              <>
                <Check className="w-4 h-4" /> Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
