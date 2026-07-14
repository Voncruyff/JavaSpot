import React, {
  useEffect,
  useState,
} from 'react';

import {
  Check,
  ChevronsUpDown,
  Save,
  Search,
  X,
  Plus,
} from 'lucide-react';

import { supabase } from '../lib/supabase';

interface Destination {
  id: string;
  name: string;
  category: string | null;
  city: string | null;
  province: string | null;
  image_url: string | null;
}

interface TrendingRow {
  destination_id: string;
  position: number;
}

export default function ManajemenTrend() {
  const [destinations, setDestinations] =
    useState<Destination[]>([]);

  const [trendIds, setTrendIds] =
    useState<string[]>([]);

  const [tempTrendIds, setTempTrendIds] =
    useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [isDirty, setIsDirty] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [errorMessage, setErrorMessage] =
    useState('');

  const [draggedIdx, setDraggedIdx] =
    useState<number | null>(null);

  /**
   * Mengambil daftar destinasi dan trending
   * langsung dari Supabase.
   */
  const fetchData = async (): Promise<void> => {
    setLoading(true);
    setErrorMessage('');

    try {
      const [
        destinationResult,
        trendingResult,
      ] = await Promise.all([
        supabase
          .from('destinations')
          .select(
            'id, name, category, city, province, image_url',
          )
          .order('name', {
            ascending: true,
          }),

        supabase
          .from('trending_destinations')
          .select(
            'destination_id, position',
          )
          .order('position', {
            ascending: true,
          }),
      ]);

      if (destinationResult.error) {
        throw destinationResult.error;
      }

      if (trendingResult.error) {
        throw trendingResult.error;
      }

      const destinationData =
        (destinationResult.data ??
          []) as Destination[];

      const trendingData =
        (trendingResult.data ??
          []) as TrendingRow[];

      setDestinations(destinationData);

      /**
       * Hanya ambil ID trending yang
       * destinasi induknya masih tersedia.
       */
      const validIds = trendingData
        .map((item) =>
          String(item.destination_id),
        )
        .filter((id) =>
          destinationData.some(
            (destination) =>
              String(destination.id) === id,
          ),
        );

      setTrendIds(validIds);
      setIsDirty(false);
    } catch (error) {
      console.error(
        'Gagal mengambil data trending:',
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Data trending gagal dimuat.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  /**
   * Membuka modal penambahan destinasi.
   */
  const openAddModal = (): void => {
    setTempTrendIds([...trendIds]);
    setSearchTerm('');
    setMessage('');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  /**
   * Memilih atau membatalkan pilihan destinasi
   * di dalam modal.
   */
  const toggleSelection = (
    destinationId: string,
  ): void => {
    if (
      tempTrendIds.includes(destinationId)
    ) {
      setTempTrendIds((current) =>
        current.filter(
          (id) => id !== destinationId,
        ),
      );

      return;
    }

    if (tempTrendIds.length >= 10) {
      alert(
        'Maksimal 10 destinasi trending.',
      );

      return;
    }

    setTempTrendIds((current) => [
      ...current,
      destinationId,
    ]);
  };

  /**
   * Menerapkan pilihan modal ke tabel.
   * Belum menyimpan ke Supabase.
   */
  const applySelection = (): void => {
    const hasChanged =
      JSON.stringify(tempTrendIds) !==
      JSON.stringify(trendIds);

    setTrendIds([...tempTrendIds]);

    if (hasChanged) {
      setIsDirty(true);
    }

    setMessage(
      'Pilihan telah diterapkan. Klik SAVE untuk menyimpan ke database.',
    );

    setIsModalOpen(false);
  };

  /**
   * Menyimpan pilihan trending dan urutannya
   * ke Supabase.
   */
  const saveTrends = async (): Promise<void> => {
    setSaving(true);
    setMessage('');
    setErrorMessage('');

    try {
      /**
       * Hapus daftar lama agar posisi tidak
       * bertabrakan dengan unique constraint.
       */
      const { error: deleteError } =
        await supabase
          .from('trending_destinations')
          .delete()
          .gte('position', 1);

      if (deleteError) {
        throw deleteError;
      }

      const newRows = trendIds.map(
        (destinationId, index) => ({
          destination_id: destinationId,
          position: index + 1,
          updated_at:
            new Date().toISOString(),
        }),
      );

      if (newRows.length > 0) {
        const { error: insertError } =
          await supabase
            .from(
              'trending_destinations',
            )
            .insert(newRows);

        if (insertError) {
          throw insertError;
        }
      }

      setIsDirty(false);

      setMessage(
        'Trending berhasil disimpan ke database.',
      );
    } catch (error) {
      console.error(
        'Gagal menyimpan trending:',
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Trending gagal disimpan.',
      );
    } finally {
      setSaving(false);
    }
  };

  const getDestination = (
    destinationId: string,
  ): Destination | undefined => {
    return destinations.find(
      (destination) =>
        String(destination.id) ===
        String(destinationId),
    );
  };

  const validTrendIds = trendIds.filter(
    (id) => Boolean(getDestination(id)),
  );

  const filteredDestinations =
    destinations.filter((destination) =>
      destination.name
        .toLowerCase()
        .includes(
          searchTerm
            .trim()
            .toLowerCase(),
        ),
    );

  /**
   * Drag and drop untuk mengubah urutan.
   */
  const handleDragStart = (
    event: React.DragEvent<HTMLTableRowElement>,
    index: number,
  ): void => {
    setDraggedIdx(index);
    event.dataTransfer.effectAllowed =
      'move';
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLTableRowElement>,
    targetIndex: number,
  ): void => {
    event.preventDefault();

    if (
      draggedIdx === null ||
      draggedIdx === targetIndex
    ) {
      return;
    }

    const newOrder = [...validTrendIds];

    const [draggedItem] =
      newOrder.splice(draggedIdx, 1);

    if (!draggedItem) {
      return;
    }

    newOrder.splice(
      targetIndex,
      0,
      draggedItem,
    );

    setTrendIds(newOrder);
    setDraggedIdx(targetIndex);
    setIsDirty(true);
    setMessage(
      'Urutan telah diubah. Klik SAVE untuk menyimpan.',
    );
  };

  const handleDragEnd = (): void => {
    setDraggedIdx(null);
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h3 className="text-lg font-black tracking-tight text-gray-900 uppercase">
              DAFTAR DESTINASI
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Pilih dan atur maksimal 10
              destinasi trending.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tombol ADD */}
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 bg-[#2c5340] hover:bg-[#1e3c2e] text-white px-6 py-2.5 rounded-xl text-xs font-bold tracking-widest transition-colors shadow-sm"
            >
              <Plus size={16} />
              ADD
            </button>

            {/* Tombol SAVE */}
            <button
              type="button"
              onClick={() =>
                void saveTrends()
              }
              disabled={
                saving || !isDirty
              }
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-xs font-bold tracking-widest transition-colors shadow-sm"
            >
              <Save size={16} />

              {saving
                ? 'SAVING...'
                : 'SAVE'}
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#8db596] text-[#2c5340]">
                <th className="py-3 px-4 font-bold text-sm text-center w-16">
                  Action
                </th>

                <th className="py-3 px-4 font-bold text-sm text-center w-16">
                  No
                </th>

                <th className="py-3 px-4 font-bold text-sm w-32">
                  Gambar
                </th>

                <th className="py-3 px-4 font-bold text-sm">
                  Nama Destinasi
                </th>

                <th className="py-3 px-4 font-bold text-sm">
                  Kategori
                </th>

                <th className="py-3 px-4 font-bold text-sm">
                  Lokasi
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-gray-500 font-medium"
                  >
                    Memuat data trending...
                  </td>
                </tr>
              ) : validTrendIds.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-gray-500 font-medium"
                  >
                    Belum ada destinasi
                    trending. Klik ADD untuk
                    menambahkan.
                  </td>
                </tr>
              ) : (
                validTrendIds.map(
                  (id, index) => {
                    const destination =
                      getDestination(id);

                    if (!destination) {
                      return null;
                    }

                    return (
                      <tr
                        key={id}
                        draggable
                        onDragStart={(
                          event,
                        ) =>
                          handleDragStart(
                            event,
                            index,
                          )
                        }
                        onDragOver={(
                          event,
                        ) =>
                          handleDragOver(
                            event,
                            index,
                          )
                        }
                        onDragEnd={
                          handleDragEnd
                        }
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          draggedIdx ===
                          index
                            ? 'opacity-60 bg-green-50'
                            : ''
                        }`}
                      >
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center items-center cursor-move text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full w-8 h-8 mx-auto transition-colors">
                            <ChevronsUpDown
                              size={16}
                            />
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center text-sm font-bold text-gray-600">
                          {index + 1}
                        </td>

                        <td className="py-4 px-4">
                          <div className="w-24 h-14 rounded-lg bg-gray-200 overflow-hidden shrink-0 shadow-sm border border-gray-100">
                            {destination.image_url ? (
                              <img
                                src={
                                  destination.image_url
                                }
                                alt={
                                  destination.name
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No Img
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-sm font-medium text-gray-800">
                          {destination.name}
                        </td>

                        <td className="py-4 px-4 text-sm text-gray-600">
                          {destination.category ||
                            '-'}
                        </td>

                        <td className="py-4 px-4 text-sm text-gray-600">
                          {destination.city ||
                            '-'}
                          ,{' '}
                          {destination.province ||
                            '-'}
                        </td>
                      </tr>
                    );
                  },
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal ADD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#fcfcfa]">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">
                  Tambahkan Destinasi
                  Trending
                </h2>

                <p className="text-xs text-gray-500 font-medium mt-1">
                  Terpilih:{' '}
                  {tempTrendIds.length} / 10
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsModalOpen(false)
                }
                aria-label="Tutup modal"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Cari destinasi..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value,
                    )
                  }
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2c5340]/20 focus:border-[#2c5340] text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50/50">
              {filteredDestinations.map(
                (destination) => {
                  const isSelected =
                    tempTrendIds.includes(
                      destination.id,
                    );

                  return (
                    <button
                      type="button"
                      key={destination.id}
                      onClick={() =>
                        toggleSelection(
                          destination.id,
                        )
                      }
                      className={`w-full text-left flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#2c5340] bg-[#2c5340]/5 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-[#2c5340] border-[#2c5340]'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <Check
                            size={14}
                            className="text-white"
                          />
                        )}
                      </div>

                      <div className="w-16 h-10 rounded-md bg-gray-200 overflow-hidden shrink-0">
                        {destination.image_url ? (
                          <img
                            src={
                              destination.image_url
                            }
                            alt={
                              destination.name
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                            No Img
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-gray-900 truncate">
                          {destination.name}
                        </div>

                        <div className="text-xs text-gray-500 truncate">
                          {destination.city ||
                            '-'}
                          ,{' '}
                          {destination.province ||
                            '-'}
                        </div>
                      </div>
                    </button>
                  );
                },
              )}

              {filteredDestinations.length ===
                0 && (
                <div className="text-center py-12 text-gray-500 text-sm font-medium">
                  Destinasi tidak
                  ditemukan.
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setIsModalOpen(false)
                }
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                BATAL
              </button>

              <button
                type="button"
                onClick={applySelection}
                className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-[#2c5340] hover:bg-[#1e3c2e] shadow-sm transition-colors"
              >
                TAMBAHKAN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}