import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Map, Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { STATIC_DESTINATIONS } from '../data';



export default function DetailDestinasi() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    if (id) {
      // Fallback for static destinations from original design
      if (id.length < 10) {
        const staticDest = STATIC_DESTINATIONS.find(d => d.id === id || d.id === String(id));
        if (staticDest) {
          setDestination({
            ...staticDest,
            image_url: staticDest.imageUrl,
            location: `${staticDest.city}, ${staticDest.province}`,
            rating: staticDest.rating
          });
          setLoading(false);
          return;
        }
      }

      const { data } = await supabase.from('destinations').select('*').eq('id', id).single();
      if (data) {
        setDestination(data);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5efe6] flex flex-col items-center justify-center font-sans">
        <h1 className="text-xl font-bold text-neutral-900 mb-4">Memuat...</h1>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-[#f5efe6] flex flex-col items-center justify-center font-sans">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Destinasi tidak ditemukan</h1>
        <button onClick={() => navigate(-1)} className="bg-[#5c6e5c] text-white px-6 py-2 rounded-full font-bold">
          Kembali
        </button>
      </div>
    );
  }

  const rawGallery = destination.gallery || [];
  const gallery = destination.image_url ? [destination.image_url, ...rawGallery] : rawGallery;


  return (
    <div className="min-h-screen bg-[#f5efe6] font-sans">
      
      {/* Main Banner */}
      <div className="relative h-[50vh] md:h-[70vh] w-full">
        <img 
          src={destination.image_url} 
          alt={destination.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Title Section */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <span className="inline-block px-4 py-1.5 bg-[#5c6e5c] text-white text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                {destination.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">{destination.name}</h1>
              <div className="flex items-center gap-2 text-white/90 text-lg font-medium">
                <MapPin className="w-5 h-5" />
                {destination.location}
              </div>
            </div>
            
            {destination.gmaps_url ? (
              <a href={destination.gmaps_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-black/30 hover:bg-black/50 backdrop-blur-md px-6 py-4 rounded-3xl transition-colors cursor-pointer group">
                <div className="flex flex-col items-center">
                  <span className="text-amber-400 font-bold text-2xl flex items-center gap-1 group-hover:scale-110 transition-transform">
                    <Star className="w-6 h-6 fill-current" /> {destination.rating || 4.5}
                  </span>
                  <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Lihat Ulasan</span>
                </div>
              </a>
            ) : (
              <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md px-6 py-4 rounded-3xl">
                <div className="flex flex-col items-center">
                  <span className="text-amber-400 font-bold text-2xl flex items-center gap-1">
                    <Star className="w-6 h-6 fill-current" /> {destination.rating || 4.5}
                  </span>
                  <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Rating</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Main Content */}
        <div className="lg:w-2/3">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Tentang Destinasi</h2>
          <div className="prose prose-lg text-neutral-600 leading-relaxed max-w-none space-y-6 text-justify">
            {destination.description?.split('\n').map((paragraph: string, idx: number) => {
              if (!paragraph.trim()) return null;
              if (!isDescExpanded && idx > 0) return null; // Show only first paragraph when not expanded
              return <p key={idx}>{paragraph}</p>;
            })}
          </div>
          {destination.description?.split('\n').filter((p: string) => p.trim()).length > 1 && (
            <button 
              onClick={() => setIsDescExpanded(!isDescExpanded)}
              className="mt-6 font-bold text-[#5c6e5c] hover:text-[#2c5340] flex items-center gap-2 transition-colors"
            >
              {isDescExpanded ? 'Tutup Selengkapnya' : 'Lihat Selengkapnya'}
            </button>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Galeri</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((img: string, idx: number) => (
                  <div 
                    key={idx} 
                    className="aspect-square rounded-2xl overflow-hidden group bg-neutral-200 cursor-pointer"
                    onClick={() => setLightboxIndex(idx)}
                  >
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-[32px] shadow-sm sticky top-10 border border-gray-100">
            <h3 className="text-xl font-bold text-neutral-900 mb-6">Informasi Kunjungan</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f5efe6] flex items-center justify-center text-[#5c6e5c] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-900 mb-1 uppercase tracking-wider">Lokasi</h4>
                  <p className="text-neutral-600 text-sm leading-relaxed">{destination.location}</p>
                </div>
              </div>

              {destination.gmaps_url && (
                <a 
                  href={destination.gmaps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#5c6e5c] hover:bg-[#4a584a] text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-md"
                >
                  <Map className="w-5 h-5" /> Buka di Google Maps
                </a>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
            <span className="text-white/70 font-medium">
              {lightboxIndex + 1} / {gallery.length}
            </span>
            <button 
              onClick={() => setLightboxIndex(null)}
              className="text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <button 
            onClick={() => setLightboxIndex((prev) => (prev === null || prev === 0 ? gallery.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition-colors z-50"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <img 
            src={gallery[lightboxIndex]} 
            alt={`Gallery ${lightboxIndex + 1}`} 
            className="max-w-full max-h-[90vh] object-contain select-none"
          />
          
          <button 
            onClick={() => setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % gallery.length))}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition-colors z-50"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

    </div>
  );
}
