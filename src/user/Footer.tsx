import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Instagram, Twitter, Facebook, Youtube, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="kontak" className="w-full mt-32">
      <div className="bg-[#2c5340] min-h-[450px] py-20 px-8 md:px-20 lg:px-32 text-white flex flex-col md:flex-row justify-between items-start md:items-start gap-12 lg:gap-20">
        
        <div className="flex flex-col flex-1 max-w-sm">
          <h2 className="text-4xl md:text-[50px] font-serif font-medium mb-6">Java spot.</h2>
          <p className="text-xs font-medium tracking-[0.15em] uppercase opacity-90 leading-relaxed mb-8">
            Pusat informasi dan direktori wisata terbaik untuk mengeksplorasi keindahan alam dan budaya di seluruh pelosok Pulau Jawa.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Instagram className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Facebook className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Twitter className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Youtube className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <h3 className="text-lg font-bold mb-6 tracking-wide uppercase opacity-90">Tautan Cepat</h3>
          <ul className="flex flex-col gap-4 text-sm font-medium opacity-80">
            <li><Link to="/destinasi" className="hover:text-[#84c8a2] transition-colors">Destinasi Populer</Link></li>
            <li><Link to="/trend" className="hover:text-[#84c8a2] transition-colors">Trend Wisata</Link></li>
            <li><Link to="/artikel" className="hover:text-[#84c8a2] transition-colors">Artikel Wisata</Link></li>
            <li><Link to="/tentang" className="hover:text-[#84c8a2] transition-colors">Tentang Kami</Link></li>
          </ul>
        </div>

        <div className="flex flex-col flex-1">
          <h3 className="text-lg font-bold mb-6 tracking-wide uppercase opacity-90">Jelajahi</h3>
          <ul className="flex flex-col gap-4 text-sm font-medium opacity-80">
            <li><a href="#" className="hover:text-[#84c8a2] transition-colors">Jawa Barat</a></li>
            <li><a href="#" className="hover:text-[#84c8a2] transition-colors">Jawa Tengah</a></li>
            <li><a href="#" className="hover:text-[#84c8a2] transition-colors">Jawa Timur</a></li>
            <li><a href="#" className="hover:text-[#84c8a2] transition-colors">Yogyakarta</a></li>
            <li><a href="#" className="hover:text-[#84c8a2] transition-colors">Banten</a></li>
          </ul>
        </div>

        <div className="flex flex-col flex-1">
          <h3 className="text-lg font-bold mb-6 tracking-wide uppercase opacity-90">Kontak Kami</h3>
          <div className="flex flex-col gap-4 text-sm font-medium opacity-80">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">Jl. Panglima Sudirman No. 123,<br/>Pati, Jawa Tengah 59111</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 flex-shrink-0" />
              <p>+62 800 0000 0000</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 flex-shrink-0" />
              <p>halo@javaspot.com</p>
            </div>
          </div>
        </div>
        
      </div>
      
      <div className="bg-[#1e3c2e] py-6 text-center text-xs text-white opacity-80 font-medium">
        <p>Copyright ©2026 Java Spot. Sekolah Tinggi Teknik Pati. All rights reserved.</p>
      </div>
    </footer>
  );
}
