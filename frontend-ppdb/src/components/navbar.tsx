"use client";

import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LEFT: Logo + School Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo-ppdb.jpeg"
              alt="Logo PPDB"
              width={36}
              height={36}
              className="rounded-lg object-cover"
            />

            <div className="leading-tight hidden sm:block">
              <h1 className="font-semibold text-slate-800 text-sm">
                PPDB SMP Terpadu
              </h1>
              <p className="text-xs text-slate-500">
                Sistem Penerimaan Peserta Didik Baru
              </p>
            </div>
          </div>
        </div>

        {/* CENTER (optional info badge) */}
        <div className="hidden md:flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
          Tahun Ajaran 2025 / 2026
        </div>

        {/* RIGHT: User */}
        <div className="flex items-center gap-4 relative">
          
          {/* Notifikasi / status */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Online
          </div>

          {/* User */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1 rounded-lg transition"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              A
            </div>

            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-sm font-medium text-slate-800">
                Arga Bayu
              </span>
              <span className="text-xs text-slate-500">
                Siswa
              </span>
            </div>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">
                Profil
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">
                Pengaturan
              </button>
              <button
                onClick={() => alert("Logout")}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}