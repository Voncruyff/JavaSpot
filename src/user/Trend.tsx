import {
  useEffect,
  useState,
} from 'react';

import {
  MapPin,
  Star,
  TrendingUp,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import NavigationBar from './NavigationBar';
import Footer from './Footer';

import {
  getTrendingDestinations,
  TrendingDestination,
} from '../lib/trending';

export default function Trend() {
  const [
    trendingDestinations,
    setTrendingDestinations,
  ] = useState<TrendingDestination[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState('');

  useEffect(() => {
    void fetchTrending();
  }, []);

  const fetchTrending =
    async (): Promise<void> => {
      setLoading(true);
      setErrorMessage('');

      try {
        const trending =
          await getTrendingDestinations();

        setTrendingDestinations(
          trending,
        );
      } catch (error) {
        console.error(
          'Gagal mengambil trending:',
          error,
        );

        setTrendingDestinations([]);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Trending gagal dimuat.',
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-neutral-800 flex flex-col font-sans">
      <NavigationBar theme="light" />

      {/* Banner */}
      <div className="relative w-full h-[400px] overflow-hidden shrink-0">
        <img
          src="https://images.unsplash.com/photo-1506501139174-099022df5260?q=80&w=1920&h=400&fit=crop"
          alt="Tren Wisata"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white pt-16">
          <p className="text-[48px] font-bold tracking-[0.2em] uppercase mb-3 text-white/80 drop-shadow-md">
            TRENDING
          </p>

          <h1 className="font-sans text-[20px] font-normal text-center drop-shadow-lg mb-4 text-white">
            Top Destinasi Populer di Jawa
          </h1>
        </div>
      </div>

      <div className="flex-1 py-16 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-10">
          <TrendingUp className="w-8 h-8 text-[#5c6e5c]" />

          <h2 className="text-3xl font-black text-neutral-900">
            Sedang Hangat
            Diperbincangkan
          </h2>
        </div>

        {errorMessage && (
          <div className="mb-8 px-5 py-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-neutral-500">
            Memuat destinasi trending...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trendingDestinations.length >
            0 ? (
              trendingDestinations.map(
                (
                  destination,
                  index,
                ) => (
                  <Link
                    key={destination.id}
                    to={`/destinasi/${destination.id}`}
                    className="flex gap-4 bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                  >
                    <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-xl overflow-hidden bg-neutral-200">
                      {destination.image_url ? (
                        <img
                          src={
                            destination.image_url
                          }
                          alt={
                            destination.name
                          }
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          No Image
                        </div>
                      )}

                      <div className="absolute top-2 left-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-sm">
                        #{index + 1}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center flex-1 py-2 min-w-0">
                      <h3 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-[#5c6e5c] transition-colors line-clamp-1">
                        {destination.name}
                      </h3>

                      <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-2">
                        <MapPin className="w-4 h-4 shrink-0" />

                        <span className="truncate">
                          {destination.location ||
                            `${destination.city || '-'}, ${
                              destination.province ||
                              '-'
                            }`}
                        </span>
                      </div>

                      <p className="text-neutral-600 text-sm line-clamp-2 mb-3 leading-relaxed">
                        {destination.description ||
                          'Informasi destinasi belum tersedia.'}
                      </p>

                      <div className="flex items-center gap-4 mt-auto">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-current" />

                          <span className="font-bold text-sm">
                            {Number(
                              destination.rating ??
                                4.8,
                            ).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ),
              )
            ) : (
              <div className="col-span-full py-16 text-center text-neutral-500">
                Belum ada destinasi
                trending saat ini.
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}