import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, TrendingUp, Star } from 'lucide-react';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import ArtikelPopup from './ArtikelPopup';
import { supabase } from '../lib/supabase';




function HomeDestinationCard({ dest }: any) {
  return (
    <Link 
      to={`/destinasi/${dest.id}`}
      className="group bg-white rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-300 w-[260px] md:w-[280px] flex-shrink-0 snap-start border border-gray-100 flex flex-col cursor-pointer block"
    >
      <div className="h-[200px] overflow-hidden relative">
        <img 
          src={dest.image_url} 
          alt={dest.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-500 shadow-sm flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-current" /> {dest.rating || 4.5}
        </div>
      </div>
      <div className="p-5 flex flex-col relative bg-white">
        <p className="text-[#2c5340] text-sm font-medium mb-1">{dest.category}</p>
        <div className="flex justify-between items-end">
          <div className="flex-1 pr-4 overflow-hidden">
            <h3 className="font-bold text-lg mb-1 text-black truncate">{dest.name}</h3>
            <p className="text-gray-500 text-sm truncate">{dest.location}</p>
          </div>
          <ArrowRight className="w-6 h-6 text-[#2c5340] flex-shrink-0 mb-1 transform transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}


export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);


  const [destinations, setDestinations] = useState<any[]>([]);
  const [slides, setSlides] = useState<any[]>([
    {
      id: 1,
      title: 'Candi Borobudur',
      image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1920&q=80',
    }
  ]);
  const [articles, setArticles] = useState<any[]>([]);
  const [popularTrends, setPopularTrends] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch destinations
    const { data: destData } = await supabase.from('destinations').select('*').order('created_at', { ascending: false });
    if (destData) {

      
      setDestinations(destData);
      const shuffled = [...destData].sort(() => 0.5 - Math.random());
      setSlides(shuffled.slice(0, 10).map(d => ({ id: d.id, title: d.name, image: d.image_url })));
      // Get trending from local storage
      const stored = localStorage.getItem('trendingDestinations');
      let trendIds: string[] = [];
      if (stored) {
        try {
          trendIds = JSON.parse(stored);
        } catch(e) {}
      }
      const trends = trendIds.map(id => destData.find(d => d.id === id)).filter(Boolean).slice(0, 4);
      setPopularTrends(trends);
    }

    // Fetch articles
    const { data: artData } = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(4);
    if (artData) {
      setArticles(artData);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300; 
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [slides]);

  const handleOpenArticle = async (art: any) => {
    setSelectedArticle(art);
    try {
      const { data } = await supabase.from('articles').select('views').eq('id', art.id).single();
      const currentViews = data?.views || 0;
      await supabase.from('articles').update({ views: currentViews + 1 }).eq('id', art.id);
    } catch (err) {}
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch(e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea] font-sans text-neutral-800 overflow-x-hidden">
      <NavigationBar theme={currentSlide === 0 ? "light" : "dark"} />
      
      {/* Hero Slider */}
      <section className="relative w-full h-[85vh] md:h-screen min-h-[600px] overflow-hidden bg-black">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center text-white w-[92%] max-w-[1600px] mx-auto">
              <h1 className="text-5xl md:text-7xl font-extrabold font-display drop-shadow-xl tracking-tight mb-2 leading-[1.1]">
                JELAJAHI<br />KEINDAHAN JAWA
              </h1>
              <div className="mt-4 mb-8">
                <p className="text-lg md:text-xl font-medium drop-shadow-md">Eksplorasi Jawa</p>
                <p className="text-base md:text-lg drop-shadow-md text-white/90">Temukan Destinasi Liburan Terbaik Anda</p>
              </div>
              <Link 
                to={`/destinasi`} 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/40 text-white px-10 py-5 rounded-full font-bold text-xl tracking-wide transition-all duration-300 inline-flex items-center gap-4 w-fit shadow-2xl hover:scale-105"
              >
                Jelajahi Sekarang 
                <div className="w-10 h-10 rounded-full border-2 border-white/60 flex items-center justify-center">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </Link>
            </div>
            
            {/* Slide Title at the bottom center */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 text-white text-center w-full">
              <p className="font-bold text-xl drop-shadow-md">{slide.title}</p>
            </div>
          </div>
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-3 items-center">
          {slides.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white w-3 h-3' : 'bg-white/40 hover:bg-white/80 w-2 h-2'}`}
            />
          ))}
        </div>
        
        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 border border-white/30 hover:scale-110 shadow-lg">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 border border-white/30 hover:scale-110 shadow-lg">
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}
      </section>

      {/* Destinations Carousel Section */}
      <section id="destinasi" className="pt-20 pb-10 w-full overflow-hidden">
        <div className="w-[92%] max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div className="max-w-2xl">
              <p className="text-[#2c5340] font-bold text-sm tracking-widest uppercase mb-2">Destinasi</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-black uppercase tracking-tight leading-[1.1]">Eksplorasi Keindahan Jawa</h2>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link to="/destinasi" className="hidden md:flex items-center gap-2 text-[#2c5340] font-bold uppercase tracking-wider hover:text-black transition-colors mr-4">
                Lihat Semua <ArrowRight className="w-5 h-5" />
              </Link>
              <div className="flex gap-2">
                <button 
                  onClick={() => scroll('left')} 
                  className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 bg-white shadow-sm hover:bg-gray-50 text-[#2c5340] transition-colors"
                  aria-label="Geser ke kiri"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scroll('right')} 
                  className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 bg-white shadow-sm hover:bg-gray-50 text-[#2c5340] transition-colors"
                  aria-label="Geser ke kanan"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div ref={carouselRef} className="flex overflow-x-auto hide-scrollbar gap-6 pb-8 snap-x snap-mandatory">
            {destinations.map((dest) => (
            <Link 
              to={`/destinasi/${dest.id}`}
              key={dest.id} 
              className="group bg-white rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-300 w-[260px] md:w-[280px] flex-shrink-0 snap-start border border-gray-100 flex flex-col cursor-pointer block"
            >
              <div className="h-[200px] overflow-hidden">
                <img 
                  src={dest.image_url} 
                  alt={dest.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-5 flex flex-col relative bg-white">
                <p className="text-[#2c5340] text-sm font-medium mb-1">{dest.category}</p>
                <div className="flex justify-between items-end">
                  <div className="flex-1 pr-4 overflow-hidden">
                    <h3 className="font-bold text-lg mb-1 text-black truncate">{dest.name}</h3>
                    <p className="text-gray-500 text-sm truncate">{dest.location}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-[#2c5340] flex-shrink-0 mb-1 transform transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </section>

      {/* Artikel dan Trend Section */}
      <section id="artikel" className="pt-8 pb-20 w-full">
        <div className="w-[92%] max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Artikel (Takes up 2 columns on lg) */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 md:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.25)] flex flex-col">
            <p className="text-[#2c5340] font-bold text-xs tracking-widest uppercase mb-2">Artikel</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black uppercase tracking-tight mb-8">Temukan Informasi</h2>
            
            {articles.length > 0 ? (
              <>
                {/* Main Featured Article */}
                <div onClick={() => handleOpenArticle(articles[0])} className="flex flex-col md:flex-row gap-6 mb-8 group cursor-pointer bg-white rounded-[32px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100">
                  <div className="w-full md:w-1/2 h-64 md:h-[300px] rounded-[24px] overflow-hidden flex-shrink-0">
                    {articles[0].thumbnail_url ? (
                      <img src={articles[0].thumbnail_url} alt={articles[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-neutral-100">No Image</div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center w-full md:w-1/2 pt-2 md:pt-0 pr-4">
                    <p className="text-[#2c5340] text-[10px] font-bold uppercase tracking-widest mb-3">{articles[0].author}</p>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-black leading-[1.2] mb-4 group-hover:text-[#2c5340] transition-colors">{articles[0].title}</h3>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-4 leading-relaxed text-justify font-normal">
                      {articles[0].content ? articles[0].content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim() : ''}
                    </p>
                    <p className="text-[#2c5340] text-[10px] font-bold uppercase tracking-wider mt-auto">{formatDate(articles[0].created_at)}</p>
                  </div>
                </div>

                {/* Sub Articles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 flex-grow">
                  {articles.slice(1, 4).map((article) => (
                    <div key={article.id} onClick={() => handleOpenArticle(article)} className="group cursor-pointer flex flex-col bg-white rounded-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 hover:shadow-[0_15px_40px_rgba(0,0,0,0.16)] transition-shadow">
                      <div className="w-full h-40 rounded-[16px] overflow-hidden mb-4 flex-shrink-0">
                        {article.thumbnail_url ? (
                          <img src={article.thumbnail_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-neutral-100">No Image</div>
                        )}
                      </div>
                      <p className="text-[#2c5340] text-[10px] font-bold uppercase tracking-widest mb-2">{article.author}</p>
                      <h4 className="font-extrabold text-black leading-snug mb-2 text-sm line-clamp-2 group-hover:text-[#2c5340] transition-colors">{article.title}</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 mb-3 text-justify font-normal flex-grow">
                        {article.content ? article.content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim() : ''}
                      </p>
                      <p className="text-[#2c5340] text-[10px] font-bold uppercase tracking-wider mt-auto pt-2 border-t border-neutral-100">{formatDate(article.created_at)}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex justify-center items-center py-20 text-gray-500">
                Belum ada artikel.
              </div>
            )}
            
            <Link to="/artikel" className="w-full bg-[#2c5340] hover:bg-[#1e3c2e] text-white font-bold py-4 rounded-[20px] transition-colors flex items-center justify-center gap-2 mt-auto">
              Lihat Semua <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right Column: Trend */}
          <div id="trend" className="bg-[#efece4] rounded-[32px] p-8 md:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.4)] flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#2c5340] flex items-center justify-center shadow-md shrink-0">
                <TrendingUp className="text-white w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <p className="text-[#2c5340] font-bold text-xs tracking-widest uppercase mb-1">Trend</p>
                <h2 className="text-3xl font-extrabold text-black uppercase tracking-tight leading-none">Populer</h2>
              </div>
            </div>
            
            <div className="flex flex-col flex-grow mt-[15px] mb-4 pt-0 pl-0 gap-0">
              {popularTrends.length > 0 ? popularTrends.map((trend, index) => (
                <Link key={trend.id} to={`/destinasi/${trend.id}`} className="group cursor-pointer block">
                  <div className={`flex items-center gap-5 ml-0 pl-0 pb-5 ${index === 0 ? 'pt-[25px]' : 'pt-[5px]'}`}>
                    <div className="w-12 h-12 rounded-full bg-[#2c5340] text-white font-bold flex items-center justify-center flex-shrink-0 text-xl shadow-md">
                      {index + 1}
                    </div>
                    <div className="w-24 h-16 rounded-[12px] overflow-hidden flex-shrink-0 shadow-sm">
                      <img src={trend.image_url} alt={trend.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="flex-grow min-w-0 pr-2">
                      <h4 className="font-bold text-black text-sm mb-1 leading-tight group-hover:text-[#2c5340] transition-colors">{trend.name}</h4>
                      <p className="text-gray-600 text-[11px] font-medium truncate">{trend.location}</p>
                    </div>
                  </div>
                  {index < popularTrends.length - 1 && (
                    <div className="h-[1px] w-full bg-gray-300/60"></div>
                  )}
                </Link>
              )) : (
                <div className="py-10 text-center text-gray-500">
                  Belum ada destinasi populer.
                </div>
              )}
            </div>
            <Link to="/trend" className="w-full bg-[#2c5340] hover:bg-[#1e3c2e] text-white font-bold py-4 rounded-[20px] transition-colors flex items-center justify-center gap-2 mt-auto">
              Lihat Semua <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

      <ArtikelPopup article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      <Footer />
      
      {/* Hide Scrollbar Style Helper */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
