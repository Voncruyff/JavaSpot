import React from 'react';
import { RefreshCw, Plus, Search, Compass, Star, Edit, Trash2 } from 'lucide-react';
import { Destination } from '../types';

interface ManajemenDestinasiProps {
  destinations: Destination[];
  destSearch: string;
  setDestSearch: (val: string) => void;
  filteredDestinations: Destination[];
  resetting: boolean;
  handleResetClick: () => void;
  onAddDestination: () => void;
  onEditDestination: (dest: Destination) => void;
  handleDeleteClick: (id: string) => void;
  deletingId: string | null;
}

export default function ManajemenDestinasi({
  destinations, destSearch, setDestSearch, filteredDestinations,
  resetting, handleResetClick, onAddDestination, onEditDestination,
  handleDeleteClick, deletingId
}: ManajemenDestinasiProps) {
  return (
    <section className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 space-y-6">
      
      {/* Action Control Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
        
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-white">Database Destinasi JavaSpot</h2>
          <p className="text-xs text-neutral-400">Buat, perbarui, atau hapus destinasi wisata di Pulau Jawa secara real-time.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Reset Data Button */}
          <button
            onClick={handleResetClick}
            disabled={resetting}
            className="bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-800/50 text-neutral-300 font-semibold text-xs px-4 py-2.5 rounded-xl border border-neutral-700 transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            {resetting ? 'Mereset...' : 'Reset ke Default'}
          </button>

          {/* Add New Destination Button */}
          <button
            onClick={onAddDestination}
            className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Destinasi Baru
          </button>
        </div>

      </div>

      {/* Quick Internal Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
        <input
          type="text"
          value={destSearch}
          onChange={(e) => setDestSearch(e.target.value)}
          placeholder="Cari berdasarkan nama, kota, atau provinsi..."
          className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 text-xs text-white pl-11 pr-4 py-3 rounded-xl focus:outline-hidden transition-all"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-neutral-800 rounded-xl bg-neutral-950">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-bold select-none">
              <th className="p-4 w-16">Gambar</th>
              <th className="p-4">Nama Destinasi</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Provinsi & Kota</th>
              <th className="p-4">Biaya Masuk</th>
              <th className="p-4 text-center">Rating</th>
              <th className="p-4 text-right w-32">Aksi Manajemen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-neutral-300">
            {filteredDestinations.length > 0 ? (
              filteredDestinations.map((dest) => (
                <tr 
                  key={dest.id}
                  className="hover:bg-neutral-900/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-800">
                      <img 
                        src={dest.imageUrl} 
                        alt={dest.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-extrabold text-white text-sm">{dest.name}</div>
                    <div className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5 max-w-xs text-left">
                      {dest.description}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {dest.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-neutral-200">{dest.city}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{dest.province}</div>
                  </td>
                  <td className="p-4 font-bold text-neutral-200">
                    {dest.entranceFee === 0 ? (
                      <span className="text-emerald-400">Gratis</span>
                    ) : (
                      `${dest.entranceFee.toLocaleString('id-ID')} IDR`
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-0.5 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" /> {dest.rating.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">({dest.reviewsCount} review)</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-2 justify-end">
                      
                      {/* Edit button */}
                      <button
                        onClick={() => onEditDestination(dest)}
                        className="p-2 bg-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg border border-neutral-800 transition-colors cursor-pointer"
                        title="Edit Wisata"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteClick(dest.id)}
                        disabled={deletingId === dest.id}
                        className="p-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 rounded-lg border border-red-500/10 transition-colors cursor-pointer"
                        title="Hapus Wisata"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-neutral-500">
                  <Compass className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
                  <div className="text-sm font-semibold">Tidak Ada Destinasi Cocok</div>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1">
                    Cari dengan kata kunci lain atau tambah destinasi baru menggunakan tombol di kanan atas.
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
