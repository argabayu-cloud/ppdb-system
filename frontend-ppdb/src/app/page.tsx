"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-8 py-4 flex items-center justify-between border-b border-slate-100 shadow-sm bg-white">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-blue-700 text-base tracking-wide uppercase">
            PPDB SMP Terpadu
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="max-w-5xl w-full flex flex-col-reverse md:flex-row items-center gap-10">
          
          {/* Kiri - Teks & Tombol */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Badge */}
            <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full w-fit border border-blue-200">
              Tahun Ajaran 2026 / 2027
            </span>

            {/* Heading */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 leading-snug">
                Halo 👋
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 leading-snug mt-1">
                Selamat Datang Di Portal
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-700 leading-snug">
                PPDB SMP TERPADU
              </h2>
            </div>

            {/* Deskripsi */}
            <p className="text-slate-500 text-base leading-relaxed max-w-md">
              Portal resmi Penerimaan Peserta Didik Baru. Daftarkan diri kamu
              sekarang dan wujudkan masa depan yang lebih cerah bersama kami.
            </p>

            {/* Tombol */}
            <div className="flex items-center gap-4 mt-2">
              <Link
                href="auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors shadow-md shadow-blue-200 text-sm"
              >
                Daftar
              </Link>
              <Link
                href="auth/login"
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-7 py-3 rounded-xl transition-colors text-sm"
              >
                Masuk
              </Link>
            </div>
          </div>

          {/* Kanan - Ilustrasi */}
          <div className="flex-1 flex justify-center items-center">
            {/* Placeholder ilustrasi - ganti dengan <Image> jika sudah punya file ilustrasi */}
            <div className="w-full max-w-sm h-72 bg-blue-50 rounded-3xl flex flex-col items-center justify-center border border-blue-100">
              <span className="text-6xl mb-3">🏫</span>
              <p className="text-blue-300 text-sm">
                Ilustrasi PPDB
              </p>
              {/* 
                Kalau sudah punya file ilustrasi, hapus div di atas
                dan ganti dengan:
                
                import Image from "next/image";
                <Image
                  src="/images/ilustrasi-ppdb.png"
                  alt="Ilustrasi PPDB"
                  width={400}
                  height={300}
                  className="object-contain"
                />
              */}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-100">
        © 2025 Dinas Pendidikan · PPDB SMP Terpadu. All rights reserved.
      </footer>
    </div>
  );
}