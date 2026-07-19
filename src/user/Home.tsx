import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import NavigationBar from './NavigationBar';
import Footer from './Footer';
import ArtikelPopup from './ArtikelPopup';

import { supabase } from '../lib/supabase';
import { getTrendingDestinations } from '../lib/trending';

interface Destination {
  id: string;
  name: string;
  category?: string | null;
  location?: string | null;
  province?: string | null;
  city?: string | null;
  description?: string | null;
  image_url?: string | null;
  rating?: number | null;
  created_at?: string | null;
}

interface Article {
  id: string;
  title: string;
  author?: string | null;
  content?: string | null;
  thumbnail_url?: string | null;
  created_at?: string | null;
  views?: number | null;
}

interface Slide {
  id: string | number;
  title: string;
  image: string;
}

const DEFAULT_SLIDE: Slide = {
  id: 'default',
  title: 'Candi Borobudur',
  image:
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1920&q=80',
};

export default function Home() {
  const [currentSlide, setCurrentSlide] =
    useState(0);

  const [
    selectedArticle,
    setSelectedArticle,
  ] = useState<Article | null>(null);

  const carouselRef =
    useRef<HTMLDivElement>(null);

  const [destinations, setDestinations] =
    useState<Destination[]>([]);

  const [slides, setSlides] =
    useState<Slide[]>([DEFAULT_SLIDE]);

  const [articles, setArticles] =
    useState<Article[]>([]);

  const [popularTrends, setPopularTrends] =
    useState<Destination[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    setLoading(true);

    try {
      const [
        destinationResult,
        articleResult,
        trendingResult,
      ] = await Promise.all([
        supabase
          .from('destinations')
          .select('*')
          .order('created_at', {
            ascending: false,
          }),

        supabase
          .from('articles')
          .select('*')
          .order('created_at', {
            ascending: false,
          })
          .limit(4),

        getTrendingDestinations(10),
      ]);

      if (destinationResult.error) {
        throw destinationResult.error;
      }

      if (articleResult.error) {
        throw articleResult.error;
      }

      const destinationData =
        (destinationResult.data ??
          []) as Destination[];

      const articleData =
        (articleResult.data ??
          []) as Article[];

      setDestinations(destinationData);
      setArticles(articleData);
      setPopularTrends(
        trendingResult as Destination[],
      );

      if (destinationData.length > 0) {
        const shuffled = [
          ...destinationData,
        ].sort(() => 0.5 - Math.random());

        const generatedSlides = shuffled
          .filter(
            (destination) =>
              Boolean(destination.image_url),
          )
          .slice(0, 10)
          .map((destination) => ({
            id: destination.id,
            title: destination.name,
            image:
              destination.image_url ||
              DEFAULT_SLIDE.image,
          }));

        setSlides(
          generatedSlides.length > 0
            ? generatedSlides
            : [DEFAULT_SLIDE],
        );
      }
    } catch (error) {
      console.error(
        'Gagal mengambil data halaman utama:',
        error,
      );

      setPopularTrends([]);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (
    direction: 'left' | 'right',
  ): void => {
    if (!carouselRef.current) {
      return;
    }

    const scrollAmount = 300;

    carouselRef.current.scrollBy({
      left:
        direction === 'left'
          ? -scrollAmount
          : scrollAmount,
      behavior: 'smooth',
    });
  };

  const nextSlide = (): void => {
    if (slides.length === 0) {
      return;
    }

    setCurrentSlide(
      (previous) =>
        (previous + 1) % slides.length,
    );
  };

  const prevSlide = (): void => {
    if (slides.length === 0) {
      return;
    }

    setCurrentSlide((previous) =>
      previous === 0
        ? slides.length - 1
        : previous - 1,
    );
  };

  useEffect(() => {
    if (slides.length === 0) {
      return;
    }

    const timer = window.setInterval(
      () => {
        setCurrentSlide(
          (previous) =>
            (previous + 1) %
            slides.length,
        );
      },
      5000,
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [slides.length]);

  useEffect(() => {
    if (
      currentSlide >= slides.length &&
      slides.length > 0
    ) {
      setCurrentSlide(0);
    }
  }, [currentSlide, slides.length]);

  /*
   * Viewer tidak ditambah di sini.
   * ArtikelPopup yang akan menambah view satu kali.
   */
  const handleOpenArticle = (
    article: Article,
  ): void => {
    setSelectedArticle(article);
  };

  const formatDate = (
    dateString?: string | null,
  ): string => {
    if (!dateString) {
      return '-';
    }

    try {
      const date = new Date(dateString);

      if (Number.isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString(
        'id-ID',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        },
      );
    } catch {
      return dateString;
    }
  };

  const stripHtml = (
    content?: string | null,
  ): string => {
    if (!content) {
      return '';
    }

    return content
      .replace(/<[^>]*>?/gm, '')
      .replace(/&nbsp;/g, ' ')
      .trim();
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea] font-sans text-neutral-800 overflow-x-hidden">
      <NavigationBar
        theme={
          currentSlide === 0
            ? 'light'
            : 'dark'
        }
      />

      {/* Hero Slider */}
      <section className="relative w-full h-[85vh] md:h-screen min-h-[600px] overflow-hidden bg-black">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 bg-black/40 z-10" />

            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            <div className="absolute inset-0 z-20 flex flex-col justify-center text-white w-[92%] max-w-[1600px] mx-auto">
              <h1 className="text-5xl md:text-7xl font-extrabold font-display drop-shadow-xl tracking-tight mb-2 leading-[1.1]">
                JELAJAHI
                <br />
                KEINDAHAN JAWA
              </h1>

              <div className="mt-4 mb-8">
                <p className="text-lg md:text-xl font-medium drop-shadow-md">
                  Eksplorasi Jawa
                </p>

                <p className="text-base md:text-lg drop-shadow-md text-white/90">
                  Temukan Destinasi Liburan
                  Terbaik Anda
                </p>
              </div>

              <Link
                to="/destinasi"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/40 text-white px-10 py-5 rounded-full font-bold text-xl tracking-wide transition-all duration-300 inline-flex items-center gap-4 w-fit shadow-2xl hover:scale-105"
              >
                Jelajahi Sekarang

                <span className="w-10 h-10 rounded-full border-2 border-white/60 flex items-center justify-center">
                  <ArrowRight className="w-6 h-6" />
                </span>
              </Link>
            </div>

            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 text-white text-center w-full">
              <p className="font-bold text-xl drop-shadow-md">
                {slide.title}
              </p>
            </div>
          </div>
        ))}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3 items-center">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              onClick={() =>
                setCurrentSlide(index)
              }
              aria-label={`Tampilkan slide ${
                index + 1
              }`}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-3 h-3'
                  : 'bg-white/40 hover:bg-white/80 w-2 h-2'
              }`}
            />
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Slide sebelumnya"
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 border border-white/30 hover:scale-110 shadow-lg"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Slide berikutnya"
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 border border-white/30 hover:scale-110 shadow-lg"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}
      </section>

      {/* Destinations Carousel */}
      <section
        id="destinasi"
        className="pt-20 pb-10 w-full overflow-hidden"
      >
        <div className="w-[92%] max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div className="max-w-2xl">
              <p className="text-[#2c5340] font-bold text-sm tracking-widest uppercase mb-2">
                Destinasi
              </p>

              <h2 className="text-4xl md:text-5xl font-extrabold text-black uppercase tracking-tight leading-[1.1]">
                Eksplorasi Keindahan Jawa
              </h2>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Link
                to="/destinasi"
                className="hidden md:flex items-center gap-2 text-[#2c5340] font-bold uppercase tracking-wider hover:text-black transition-colors mr-4"
              >
                Lihat Semua
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    scroll('left')
                  }
                  className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 bg-white shadow-sm hover:bg-gray-50 text-[#2c5340] transition-colors"
                  aria-label="Geser ke kiri"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scroll('right')
                  }
                  className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 bg-white shadow-sm hover:bg-gray-50 text-[#2c5340] transition-colors"
                  aria-label="Geser ke kanan"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex overflow-x-auto hide-scrollbar gap-6 pb-8 snap-x snap-mandatory"
          >
            {destinations.map(
              (destination) => (
                <Link
                  to={`/destinasi/${destination.id}`}
                  key={destination.id}
                  className="group bg-white rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-300 w-[260px] md:w-[280px] flex-shrink-0 snap-start border border-gray-100 flex flex-col cursor-pointer"
                >
                  <div className="h-[200px] overflow-hidden bg-neutral-200">
                    {destination.image_url ? (
                      <img
                        src={
                          destination.image_url
                        }
                        alt={destination.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col relative bg-white">
                    <p className="text-[#2c5340] text-sm font-medium mb-1">
                      {destination.category ||
                        '-'}
                    </p>

                    <div className="flex justify-between items-end">
                      <div className="flex-1 pr-4 overflow-hidden">
                        <h3 className="font-bold text-lg mb-1 text-black truncate">
                          {destination.name}
                        </h3>

                        <p className="text-gray-500 text-sm truncate">
                          {destination.location ||
                            `${destination.city || '-'}, ${
                              destination.province ||
                              '-'
                            }`}
                        </p>
                      </div>

                      <ArrowRight className="w-6 h-6 text-[#2c5340] flex-shrink-0 mb-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Artikel dan Trending */}
      <section
        id="artikel"
        className="pt-8 pb-20 w-full"
      >
        <div className="w-[92%] max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Artikel */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 md:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.25)] flex flex-col">
            <p className="text-[#2c5340] font-bold text-xs tracking-widest uppercase mb-2">
              Artikel
            </p>

            <h2 className="text-3xl md:text-4xl font-extrabold text-black uppercase tracking-tight mb-8">
              Temukan Informasi
            </h2>

            {articles.length > 0 ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    handleOpenArticle(
                      articles[0],
                    )
                  }
                  className="w-full text-left flex flex-col md:flex-row gap-6 mb-8 group cursor-pointer bg-white rounded-[32px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100"
                >
                  <div className="w-full md:w-1/2 h-64 md:h-[300px] rounded-[24px] overflow-hidden flex-shrink-0">
                    {articles[0]
                      .thumbnail_url ? (
                      <img
                        src={
                          articles[0]
                            .thumbnail_url
                        }
                        alt={
                          articles[0].title
                        }
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-neutral-100">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center w-full md:w-1/2 pt-2 md:pt-0 pr-4">
                    <p className="text-[#2c5340] text-[10px] font-bold uppercase tracking-widest mb-3">
                      {articles[0].author ||
                        'JavaSpot'}
                    </p>

                    <h3 className="text-2xl md:text-3xl font-extrabold text-black leading-[1.2] mb-4 group-hover:text-[#2c5340] transition-colors">
                      {articles[0].title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-6 line-clamp-4 leading-relaxed text-justify font-normal">
                      {stripHtml(
                        articles[0].content,
                      )}
                    </p>

                    <p className="text-[#2c5340] text-[10px] font-bold uppercase tracking-wider mt-auto">
                      {formatDate(
                        articles[0]
                          .created_at,
                      )}
                    </p>
                  </div>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 flex-grow">
                  {articles
                    .slice(1, 4)
                    .map((article) => (
                      <button
                        type="button"
                        key={article.id}
                        onClick={() =>
                          handleOpenArticle(
                            article,
                          )
                        }
                        className="w-full text-left group cursor-pointer flex flex-col bg-white rounded-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 hover:shadow-[0_15px_40px_rgba(0,0,0,0.16)] transition-shadow"
                      >
                        <div className="w-full h-40 rounded-[16px] overflow-hidden mb-4 flex-shrink-0">
                          {article.thumbnail_url ? (
                            <img
                              src={
                                article.thumbnail_url
                              }
                              alt={
                                article.title
                              }
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-neutral-100">
                              No Image
                            </div>
                          )}
                        </div>

                        <p className="text-[#2c5340] text-[10px] font-bold uppercase tracking-widest mb-2">
                          {article.author ||
                            'JavaSpot'}
                        </p>

                        <h4 className="font-extrabold text-black leading-snug mb-2 text-sm line-clamp-2 group-hover:text-[#2c5340] transition-colors">
                          {article.title}
                        </h4>

                        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 mb-3 text-justify font-normal flex-grow">
                          {stripHtml(
                            article.content,
                          )}
                        </p>

                        <p className="text-[#2c5340] text-[10px] font-bold uppercase tracking-wider mt-auto pt-2 border-t border-neutral-100">
                          {formatDate(
                            article.created_at,
                          )}
                        </p>
                      </button>
                    ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex justify-center items-center py-20 text-gray-500">
                {loading
                  ? 'Memuat artikel...'
                  : 'Belum ada artikel.'}
              </div>
            )}

            <Link
              to="/artikel"
              className="w-full bg-[#2c5340] hover:bg-[#1e3c2e] text-white font-bold py-4 rounded-[20px] transition-colors flex items-center justify-center gap-2 mt-auto"
            >
              Lihat Semua
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Trending */}
          <div
            id="trend"
            className="bg-[#efece4] rounded-[32px] p-8 md:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.4)] flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#2c5340] flex items-center justify-center shadow-md shrink-0">
                <TrendingUp className="text-white w-7 h-7" />
              </div>

              <div className="flex flex-col">
                <p className="text-[#2c5340] font-bold text-xs tracking-widest uppercase mb-1">
                  Trend
                </p>

                <h2 className="text-3xl font-extrabold text-black uppercase tracking-tight leading-none">
                  Populer
                </h2>
              </div>
            </div>

            <div className="flex flex-col flex-grow mt-[15px] mb-4">
              {popularTrends.length > 0 ? (
                popularTrends.map(
                  (trend, index) => (
                    <Link
                      key={trend.id}
                      to={`/destinasi/${trend.id}`}
                      className="group cursor-pointer block"
                    >
                      <div
                        className={`flex items-center gap-5 pb-5 ${
                          index === 0
                            ? 'pt-[25px]'
                            : 'pt-[5px]'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-[#2c5340] text-white font-bold flex items-center justify-center flex-shrink-0 text-xl shadow-md">
                          {index + 1}
                        </div>

                        <div className="w-24 h-16 rounded-[12px] overflow-hidden flex-shrink-0 shadow-sm bg-neutral-200">
                          {trend.image_url ? (
                            <img
                              src={
                                trend.image_url
                              }
                              alt={trend.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="flex-grow min-w-0 pr-2">
                          <h4 className="font-bold text-black text-sm mb-1 leading-tight group-hover:text-[#2c5340] transition-colors">
                            {trend.name}
                          </h4>

                          <p className="text-gray-600 text-[11px] font-medium truncate">
                            {trend.location ||
                              `${trend.city || '-'}, ${
                                trend.province ||
                                '-'
                              }`}
                          </p>
                        </div>
                      </div>

                      {index <
                        popularTrends.length -
                          1 && (
                        <div className="h-px w-full bg-gray-300/60" />
                      )}
                    </Link>
                  ),
                )
              ) : (
                <div className="py-10 text-center text-gray-500">
                  {loading
                    ? 'Memuat trending...'
                    : 'Belum ada destinasi populer.'}
                </div>
              )}
            </div>

            <Link
              to="/trend"
              className="w-full bg-[#2c5340] hover:bg-[#1e3c2e] text-white font-bold py-4 rounded-[20px] transition-colors flex items-center justify-center gap-2 mt-auto"
            >
              Lihat Semua
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <ArtikelPopup
        article={selectedArticle}
        onClose={() =>
          setSelectedArticle(null)
        }
      />

      <Footer />

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