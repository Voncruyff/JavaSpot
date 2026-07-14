import React from 'react';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Tentang() {
  return (
    <div className="min-h-screen bg-[#f5f1ea] font-sans text-neutral-800 flex flex-col overflow-x-hidden">
      <NavigationBar theme="light" />
      
      {/* Banner */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=1920&h=400&fit=crop" 
          alt="Pemandangan Jawa" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white pt-16">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-center drop-shadow-lg mb-4 tracking-widest">TENTANG</h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl text-center px-6 drop-shadow-md text-white/90">Tentang Java Spot</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-sm mb-16 border border-neutral-100/50">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-8 text-center">Apa itu Java Spot?</h2>
          <p className="text-neutral-600 leading-relaxed text-lg mb-6 text-center">
            Java Spot adalah platform ensiklopedia interaktif yang didedikasikan untuk mempromosikan pariwisata di Pulau Jawa. Kami menyajikan informasi destinasi, mulai dari cagar alam yang masih asri, pantai-pantai eksotis, hingga situs sejarah dan candi-candi peninggalan masa lampau yang mengesankan.
          </p>
          <p className="text-neutral-600 leading-relaxed text-lg text-center">
            Misi kami adalah membantu para penjelajah, baik wisatawan lokal maupun mancanegara, untuk menemukan keindahan tersembunyi Indonesia, merencanakan perjalanan mereka dengan mudah, dan turut melestarikan kekayaan budaya serta alam yang kita miliki.
          </p>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[32px] p-8 text-center shadow-sm flex flex-col items-center border border-neutral-100/50">
            <div className="w-16 h-16 bg-[#f5f1ea] rounded-full flex items-center justify-center mb-6 text-[#2c5340]">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-neutral-900">Alamat Kami</h3>
            <p className="text-neutral-600 text-[15px] leading-relaxed">
              Jl. Panglima Sudirman No. 123<br />
              Pati, Jawa Tengah 59111
            </p>
          </div>
          
          <div className="bg-white rounded-[32px] p-8 text-center shadow-sm flex flex-col items-center border border-neutral-100/50">
            <div className="w-16 h-16 bg-[#f5f1ea] rounded-full flex items-center justify-center mb-6 text-[#2c5340]">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-neutral-900">Email</h3>
            <p className="text-neutral-600 text-[15px] leading-relaxed">
              halo@javaspot.com<br />
              support@javaspot.com
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-8 text-center shadow-sm flex flex-col items-center border border-neutral-100/50">
            <div className="w-16 h-16 bg-[#f5f1ea] rounded-full flex items-center justify-center mb-6 text-[#2c5340]">
              <Phone className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-neutral-900">Telepon</h3>
            <p className="text-neutral-600 text-[15px] leading-relaxed">
              +62 800 0000 0000<br />
              Senin - Jumat, 09:00 - 17:00
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
