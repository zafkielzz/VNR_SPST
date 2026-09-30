import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import BackgroundMusic from './components/BackgroundMusic.jsx';

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-vn-black px-6 py-24 text-vn-ivory">
      <div className="mx-auto max-w-3xl rounded-3xl border border-vn-gold-antique/30 bg-vn-charcoal/80 p-8 text-center sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-vn-gold">Không tìm thấy nội dung</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-white">Đường dẫn này chưa có trang</h1>
        <a href="/" className="mt-8 inline-flex rounded-full border border-vn-gold/50 px-5 py-2.5 text-sm font-semibold text-vn-gold transition hover:bg-vn-red-deep/30">
          Về Triển lãm Lịch sử Đảng
        </a>
      </div>
    </main>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      {/* Global Background Music throughout the exhibition */}
      <BackgroundMusic />
      <Routes>
        {/* Đường dẫn gốc / hiển thị ngay toàn bộ Web Storytelling Lịch sử Đảng (VNR) */}
        <Route path="/" element={<App />} />
        <Route path="/home" element={<App />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
