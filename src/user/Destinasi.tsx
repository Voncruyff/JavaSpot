import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Compass, Star, DollarSign, ChevronRight, Filter, TreePine, Building2, Sparkles, UtensilsCrossed, Map, ChevronLeft } from 'lucide-react';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import { supabase } from '../lib/supabase';







function DestinationCard({ dest, getCategoryIcon }: any) {
  return (
    <Link 
      to={`/destinasi/${dest.id}`} 
      className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 border border-gray-100 flex flex-col"
    >
      <div className="relative h-64 overflow-hidden bg-neutral-200">
        <img 
          src={dest.image_url} 
          alt={dest.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-[#5c6e5c] shadow-sm flex items-center gap-2 uppercase tracking-widest">
          {getCategoryIcon(dest.category)}
          {dest.category}
        </div>
      </div>
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-extrabold text-neutral-900 mb-3 group-hover:text-[#5c6e5c] transition-colors">{dest.name}</h3>
        <div className="flex items-center gap-2 text-neutral-500 mb-6 font-medium">
          <MapPin className="w-4 h-4 text-[#5c6e5c]" />
          <span>{dest.location}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
           <div className="flex items-center gap-1.5 text-amber-500 font-bold">
             <Star className="w-5 h-5 fill-current" />
             <span className="text-neutral-700 text-lg">{dest.rating || 4.5}</span>
           </div>
           <div className="w-10 h-10 rounded-full bg-[#f5efe6] flex items-center justify-center group-hover:bg-[#5c6e5c] group-hover:text-white transition-colors text-[#5c6e5c]">
             <ChevronRight className="w-5 h-5" />
           </div>
        </div>
      </div>
    </Link>
  );
}



export default function Destinasi() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('Semua');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('populer');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    const { data } = await supabase.from('destinations').select('*').order('created_at', { ascending: false });
    if (data) setDestinations(data);
  };

  const categories = ['Semua', ...Array.from(new Set(destinations.map(d => d.category).filter(Boolean)))];
  const cities = ['Semua', ...Array.from(new Set(destinations.map(d => d.city).filter(Boolean)))];

  const filteredDestinations = useMemo(() => {
    return destinations.filter(dest => {
      const matchSearch = dest.name?.toLowerCase().includes(searchTerm.toLowerCase()) || dest.city?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCity = selectedCity === 'Semua' || dest.city === selectedCity;
      const matchCategory = selectedCategory === 'Semua' || dest.category === selectedCategory;
      return matchSearch && matchCity && matchCategory;
    });
  }, [searchTerm, selectedCity, selectedCategory, destinations]);

  const sortedDestinations = useMemo(() => {
    let result = [...filteredDestinations];
    switch (sortBy) {
      case 'nama-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nama-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'terbaru':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        // populer (default, let's just keep as is)
        break;
    }
    return result;
  }, [filteredDestinations, sortBy]);

  const totalPages = Math.ceil(sortedDestinations.length / itemsPerPage);
  const currentDestinations = sortedDestinations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Alam': return <TreePine className="w-5 h-5 text-emerald-600" />;
      case 'Budaya': return <Building2 className="w-5 h-5 text-amber-600" />;
      case 'Wahana': return <Sparkles className="w-5 h-5 text-blue-600" />;
      case 'Kuliner': return <UtensilsCrossed className="w-5 h-5 text-orange-600" />;
      default: return <Compass className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5efe6] font-sans text-neutral-800">
      <NavigationBar 
        theme="light" 
        showSearch={true}
        searchValue={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
      />
      
      {/* Banner */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80&w=1920&h=400" 
          alt="Destinasi Wisata" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white pt-16">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-center drop-shadow-lg mb-4 tracking-widest uppercase">DESTINASI</h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl text-center px-6 drop-shadow-md text-white/90">Temukan pesona alam dan kekayaan budaya yang tersebar di seluruh pelosok Pulau Jawa.</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
        
        {/* Filter Section */}
        <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm mb-12 flex flex-col md:flex-row gap-6 items-center justify-between border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            <div className="flex items-center gap-3 text-[#5c6e5c] font-bold uppercase tracking-wider text-sm border-r border-gray-200 pr-6 mr-2 shrink-0">
              <Filter className="w-5 h-5" /> Filter
            </div>
            <select 
              className="bg-neutral-50 border-none text-neutral-700 text-sm rounded-full focus:ring-0 cursor-pointer font-medium px-6 py-3 w-full sm:w-auto"
              value={selectedCity}
              onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }}
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <select 
              className="bg-neutral-50 border-none text-neutral-700 text-sm rounded-full focus:ring-0 cursor-pointer font-medium px-6 py-3 w-full sm:w-auto"
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="text-sm font-bold text-neutral-400 uppercase tracking-wider shrink-0">Urutkan:</span>
            <select 
              className="bg-neutral-50 border-none text-neutral-700 text-sm rounded-full focus:ring-0 cursor-pointer font-medium px-6 py-3 w-full"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="populer">Paling Populer</option>
              <option value="terbaru">Terbaru</option>
              <option value="nama-asc">Nama (A-Z)</option>
              <option value="nama-desc">Nama (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-neutral-800">Menampilkan {sortedDestinations.length} Destinasi</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {currentDestinations.length > 0 ? currentDestinations.map(dest => (
            <DestinationCard dest={dest} getCategoryIcon={getCategoryIcon} />
          )) : (
            <div className="col-span-full py-20 text-center text-neutral-500">
              Tidak ada destinasi yang ditemukan.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 text-neutral-500 hover:bg-[#5c6e5c] hover:text-white hover:border-[#5c6e5c] transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-neutral-500 disabled:hover:border-gray-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  currentPage === i + 1 
                    ? 'bg-[#5c6e5c] text-white border border-[#5c6e5c]' 
                    : 'border border-gray-200 text-neutral-500 hover:border-[#5c6e5c] hover:text-[#5c6e5c]'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 text-neutral-500 hover:bg-[#5c6e5c] hover:text-white hover:border-[#5c6e5c] transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-neutral-500 disabled:hover:border-gray-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
