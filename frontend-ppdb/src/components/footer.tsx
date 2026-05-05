"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-white/80 backdrop-blur-md border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TOP */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          
          {/* KIRI */}
          <div>
            <h2 className="font-semibold text-slate-800">
              PPDB SMP Terpadu
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Sistem Penerimaan Peserta Didik Baru berbasis web
            </p>
          </div>

          {/* TENGAH */}
          <div className="flex flex-col text-sm text-slate-600">
            <span className="font-medium mb-1">Menu</span>
            <a href="#" className="hover:text-blue-600">Dashboard</a>
            <a href="#" className="hover:text-blue-600">Pendaftaran</a>
            <a href="#" className="hover:text-blue-600">Pengumuman</a>
          </div>

          {/* KANAN */}
          <div className="flex flex-col text-sm text-slate-600">
            <span className="font-medium mb-1">Kontak</span>
            <span>Email: ppdb@smp.sch.id</span>
            <span>Telp: 0812-3456-7890</span>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} PPDB SMP Terpadu. All rights reserved.
        </div>
      </div>
    </footer>
  );
}