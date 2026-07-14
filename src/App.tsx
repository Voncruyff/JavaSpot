import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './user/Home';
import Destinasi from './user/Destinasi';
import DetailDestinasi from './user/DetailDestinasi';
import Artikel from './user/Artikel';
import Trend from './user/Trend';
import Tentang from './user/Tentang';
import LoginAdmin from './admin/LoginAdmin';
import AdminDashboard from './admin/AdminDashboard';
import AdminDestinasi from './admin/AdminDestinasi';
import AdminTrend from './admin/AdminTrend';
import AdminArtikel from './admin/AdminArtikel';
import TulisArtikel from './admin/TulisArtikel';
import AdminLogActivity from './admin/AdminLogActivity';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/destinasi" element={<Destinasi />} />
        <Route path="/destinasi/:id" element={<DetailDestinasi />} />
        <Route path="/trend" element={<Trend />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/adminlogin" element={<LoginAdmin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admin/destinasi" element={<AdminDestinasi />} />
        <Route path="/admin/trend" element={<AdminTrend />} />
        <Route path="/admin/artikel" element={<AdminArtikel />} />
        <Route path="/admin/artikel/tulis" element={<TulisArtikel />} />
        <Route path="/admin/artikel/edit/:id" element={<TulisArtikel />} />
        <Route path="/admin/log-activity" element={<AdminLogActivity />} />
      </Routes>
    </Router>
  );
}
