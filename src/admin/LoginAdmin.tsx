/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    // Auth menggunakan Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage('katasandi atau email salah');
    } else if (data.user) {
      // (Opsional) Cek role di tabel jika diperlukan:
      // const { data: profile } = await supabase.from('nama_tabel_anda').select('*').eq('user_id', data.user.id).single();
      
      navigate('/admindashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full relative flex font-sans overflow-hidden bg-neutral-900">
      
      {/* Full Background Image */}
      <img 
        src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1920&q=80" 
        alt="Borobudur"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      
      {/* Top Left Text */}
      <div className="absolute top-12 left-10 md:top-16 md:left-16 z-20">
        <h1 className="text-white font-serif text-5xl md:text-6xl font-bold tracking-wide drop-shadow-md">
          Java spot.
        </h1>
        <p className="text-white/90 text-sm md:text-base mt-2 font-normal drop-shadow-md tracking-wide">
          Discover the Joy of Java's Nature
        </p>
      </div>

      {/* Right Green Panel */}
      <div className="absolute right-0 top-0 h-full w-full md:w-[25%] bg-[#2c5340] md:rounded-tl-[120px] z-10 shadow-2xl opacity-90 md:opacity-100 overflow-hidden">
        {/* Batik Motif Overlay */}
        <div 
          className="absolute inset-0 w-full h-full opacity-40 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M11 18c13.866 0 25.36-11.2 28.5-25h-6c-2.67 9.89-11.4 17-22.5 17-11.09 0-19.83-7.11-22.5-17h-6c3.14 13.8 14.63 25 28.5 25zm40 50c13.866 0 25.36-11.2 28.5-25h-6c-2.67 9.89-11.4 17-22.5 17-11.09 0-19.83-7.11-22.5-17h-6c3.14 13.8 14.63 25 28.5 25zM11 68c13.866 0 25.36-11.2 28.5-25h-6c-2.67 9.89-11.4 17-22.5 17-11.09 0-19.83-7.11-22.5-17h-6c3.14 13.8 14.63 25 28.5 25z'/%3E%3Cpath d='M50 0v100h2V0h-2zM0 50h100v2H0v-2z'/%3E%3Ccircle cx='50' cy='50' r='8'/%3E%3Ccircle cx='0' cy='0' r='8'/%3E%3Ccircle cx='100' cy='0' r='8'/%3E%3Ccircle cx='0' cy='100' r='8'/%3E%3Ccircle cx='100' cy='100' r='8'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '120px' }}
        ></div>
      </div>

      {/* Center/Right Content Wrapper (Card centered on the boundary) */}
      {/* Boundary is at right: 25% on desktop. We center the card exactly on that line. */}
      <div className="absolute z-30 right-1/2 translate-x-1/2 md:right-[25%] md:translate-x-1/2 top-1/2 -translate-y-1/2 w-full max-w-[380px] px-6 md:px-0">
        
        {/* Title over boundary */}
        <div className="flex justify-center items-center mb-4 gap-2">
          <span className="text-white font-black text-xl md:text-2xl tracking-widest drop-shadow-md">ADMIN</span>
          <span className="text-white font-black text-xl md:text-2xl tracking-widest drop-shadow-md">LOGIN</span>
        </div>

        {/* The Card */}
        <div className="w-full bg-white/10 backdrop-blur-2xl rounded-[32px] p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-white/30 relative overflow-hidden">
          
          <h2 className="text-white text-2xl font-black text-center mb-8 tracking-widest drop-shadow-sm">LOGIN</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="text-red-400 text-sm text-center font-bold bg-red-900/30 py-2 px-4 rounded-lg border border-red-500/50 backdrop-blur-md drop-shadow-md">
                {errorMessage}
              </div>
            )}
            <div className="space-y-2 text-center">
              <label className="text-white text-xs font-bold tracking-wide drop-shadow-md">Email</label>
              <input 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Ketik di sini"
                className="w-full text-center px-4 py-3.5 rounded-full border border-white/30 bg-white/10 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] focus:outline-hidden focus:border-white focus:ring-2 focus:ring-white/30 transition-all placeholder:text-white/60 text-sm font-medium backdrop-blur-md"
              />
            </div>

            <div className="space-y-2 text-center">
              <label className="text-white text-xs font-bold tracking-wide drop-shadow-md">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Ketik di sini"
                className="w-full text-center px-4 py-3.5 rounded-full border border-white/30 bg-white/10 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] focus:outline-hidden focus:border-white focus:ring-2 focus:ring-white/30 transition-all placeholder:text-white/60 text-sm font-medium backdrop-blur-md"
              />
            </div>

            <button 
              type="submit"
              className="w-full mt-4 bg-white hover:bg-neutral-100 text-[#2c5340] font-bold py-3.5 rounded-full transition-colors shadow-[0_4px_14px_rgba(255,255,255,0.25)] flex justify-center items-center gap-2"
            >{loading ? "Loading..." : "Masuk"}</button>
          </form>
        </div>
      </div>
      
    </div>
  );
}

