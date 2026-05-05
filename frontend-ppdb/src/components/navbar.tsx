"use client";

import NotificationBell from "./notifikasiBell";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo-ppdb.jpeg"
          alt="Logo PPDB"
          width={36}
          height={36}
          className="rounded-lg object-cover"
        />

        <span className="font-semibold text-slate-800 text-sm">
          PPDB SMP Terpadu
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <NotificationBell />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
            A
          </div>
          <span className="text-sm text-slate-700 hidden sm:block">
            Arga Bayu
          </span>
        </div>
      </div>
    </nav>
  );
}