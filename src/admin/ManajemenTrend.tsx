import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronsUpDown, X, Search, Check } from 'lucide-react';

export default function ManajemenTrend() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [trendIds, setTrendIds] = useState<string[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempTrendIds, setTempTrendIds] = useState<string[]>([]);

  const fetchDestinations = async () => {
    const { data, error } = await supabase.from('destinations').select('*');
    if (data) {
      setDestinations(data);
      
      const stored = localStorage.getItem('trendingDestinations');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const validIds = parsed.filter((id: string) => data.some((d: any) => d.id === id));
          setTrendIds(validIds);
          if (validIds.length !== parsed.length) {
            localStorage.setItem('trendingDestinations', JSON.stringify(validIds));
          }
        } catch (e) {}
      }
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const openModal = () => {
    setTempTrendIds([...trendIds]);
    setSearchTerm('');
    setIsModalOpen(true);
  };

  const saveTrends = () => {
    setTrendIds(tempTrendIds);
    localStorage.setItem('trendingDestinations', JSON.stringify(tempTrendIds));
    setIsModalOpen(false);
  };

  const toggleSelection = (id: string) => {
    if (tempTrendIds.includes(id)) {
      setTempTrendIds(tempTrendIds.filter(t => t !== id));
    } else {
      if (tempTrendIds.length < 10) {
        setTempTrendIds([...tempTrendIds, id]);
      } else {
        alert('Maksimal 10 destinasi!');
      }
    }
  };

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Drag and drop for reordering
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    
    const newOrder = [...trendIds];
    const draggedItem = newOrder[draggedIdx];
    
    // Remove the item from old position
    newOrder.splice(draggedIdx, 1);
    // Insert at new position
    newOrder.splice(index, 0, draggedItem);
    
    setTrendIds(newOrder);
    localStorage.setItem('trendingDestinations', JSON.stringify(newOrder));
    setDraggedIdx(index); // update dragged index
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const getDestination = (id: string) => destinations.find(d => d.id === id);

  return (
    <>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black tracking-tight text-gray-900 uppercase">DAFTAR DESTINASI</h3>
          <button 
            onClick={openModal}
            className="bg-[#2c5340] hover:bg-[#1e3c2e] text-white px-6 py-2 rounded-xl text-xs font-bold tracking-widest transition-colors shadow-sm"
          >
            EDIT
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#8db596] text-[#2c5340]">
                <th className="py-3 px-4 font-bold text-sm text-center w-16">Action</th>
                <th className="py-3 px-4 font-bold text-sm text-center w-16">No</th>
                <th className="py-3 px-4 font-bold text-sm w-32">Gambar</th>
                <th className="py-3 px-4 font-bold text-sm">Nama Destinasi</th>
                <th className="py-3 px-4 font-bold text-sm">Kategori</th>
                <th className="py-3 px-4 font-bold text-sm">Lokasi</th>
              </tr>
            </thead>
            <tbody>
              {trendIds.filter(id => getDestination(id)).length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 font-medium">
                    Belum ada destinasi trending terpilih. Klik EDIT untuk menambahkan.
                  </td>
                </tr>
              ) : (
                trendIds
                  .filter(id => getDestination(id))
                  .map((id, index) => {
                  const dest = getDestination(id)!;
                  return (
                    <tr 
                      key={id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center items-center cursor-move text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full w-8 h-8 mx-auto transition-colors">
                          <ChevronsUpDown size={16} />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-sm font-bold text-gray-600">{index + 1}</td>
                      <td className="py-4 px-4">
                        <div className="w-24 h-14 rounded-lg bg-gray-200 overflow-hidden shrink-0 shadow-sm border border-gray-100">
                          {dest.image_url ? (
                            <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-800">{dest.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{dest.category}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{dest.city}, {dest.province}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#fcfcfa]">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Pilih TOP 10 Destinasi</h2>
                <p className="text-xs text-gray-500 font-medium mt-1">Terpilih: {tempTrendIds.length} / 10</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari destinasi..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2c5340]/20 focus:border-[#2c5340] text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50/50">
              {filteredDestinations.map((dest) => {
                const isSelected = tempTrendIds.includes(dest.id);
                return (
                  <div 
                    key={dest.id}
                    onClick={() => toggleSelection(dest.id)}
                    className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-[#2c5340] bg-[#2c5340]/5 shadow-sm' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected ? 'bg-[#2c5340] border-[#2c5340]' : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                    <div className="w-16 h-10 rounded-md bg-gray-200 overflow-hidden shrink-0">
                      {dest.image_url ? (
                        <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-900 truncate">{dest.name}</div>
                      <div className="text-xs text-gray-500 truncate">{dest.city}, {dest.province}</div>
                    </div>
                  </div>
                );
              })}
              {filteredDestinations.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm font-medium">
                  Destinasi tidak ditemukan.
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                BATAL
              </button>
              <button 
                onClick={saveTrends}
                className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-[#2c5340] hover:bg-[#1e3c2e] shadow-sm transition-colors"
              >
                SIMPAN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
