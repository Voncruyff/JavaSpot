/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  CheckCircle2, 
  ArrowLeft, 
  ExternalLink, 
  Compass, 
  Sparkles,
  Map
} from 'lucide-react';
import { Destination } from '../types';

interface DestinationDetailProps {
  destination: Destination | null;
  onClose: () => void;
}

export default function DestinationDetail({ destination, onClose }: DestinationDetailProps) {
  if (!destination) return null;

  return (
    <div id="destination-detail-backdrop" className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Container */}
      <div 
        id="destination-detail-container"
        className="relative bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Header Image Cover */}
        <div className="relative h-64 md:h-80 w-full bg-neutral-100 shrink-0">
          <img 
            src={destination.imageUrl} 
            alt={destination.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent"></div>
          
          {/* Close Button absolute */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-colors border border-white/10"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Quick Labels absolute bottom */}
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <span className="bg-amber-500 text-neutral-950 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider mb-2.5 inline-block shadow-sm">
              {destination.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-md">
              {destination.name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-neutral-200">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                {destination.city}, {destination.province}
              </span>
              <span className="hidden md:inline text-neutral-400">•</span>
              <span className="flex items-center gap-1 text-amber-300">
                <Star className="w-3.5 h-3.5 fill-current" />
                {destination.rating.toFixed(1)} ({destination.reviewsCount} Ulasan)
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          
          {/* Destinasi Metadata Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b border-neutral-100 pb-5 text-neutral-700">
            <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/50">
              <div className="text-[10px] font-extrabold uppercase text-neutral-400 mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-600" /> Harga Tiket Masuk
              </div>
              <div className="text-sm font-black text-neutral-900">
                {destination.entranceFee === 0 ? 'Gratis' : `${destination.entranceFee.toLocaleString('id-ID')} IDR`}
              </div>
            </div>

            <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/50">
              <div className="text-[10px] font-extrabold uppercase text-neutral-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-600" /> Waktu Terbaik Berkunjung
              </div>
              <div className="text-xs font-semibold text-neutral-800 line-clamp-1" title={destination.bestTimeToVisit}>
                {destination.bestTimeToVisit}
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 bg-neutral-50 rounded-xl p-3 border border-neutral-200/50">
              <div className="text-[10px] font-extrabold uppercase text-neutral-400 mb-1 flex items-center gap-1">
                <Map className="w-3 h-3 text-red-500" /> Koordinat Lokasi
              </div>
              <div className="text-xs font-mono text-neutral-800 flex items-center justify-between">
                <span>{destination.locationCoordinates}</span>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.name + ' ' + destination.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-700 font-bold ml-1 flex items-center gap-0.5"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-neutral-500" /> Tentang Destinasi
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal whitespace-pre-line">
              {destination.description}
            </p>
          </div>

          {/* Recommended Tips Checklist */}
          {destination.recommendedTips && destination.recommendedTips.length > 0 && (
            <div className="space-y-3 bg-amber-500/5 border border-amber-500/10 p-5 rounded-xl">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Tips & Rekomendasi Pengunjung
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {destination.recommendedTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-neutral-100 bg-neutral-50 shrink-0 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-xs font-bold text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-100 transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali Ke Daftar
          </button>
          
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.name + ' ' + destination.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            Buka Navigasi Rute <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
