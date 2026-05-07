"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo-ppdb.png"
          alt="Logo PPDB"
          width={36}
          height={36}
          className="rounded-lg object-cover"
        />

        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 text-sm">
            PPDB SMP Terpadu
          </span>
          <span className="text-blue-400 text-xs hidden sm:block">
            Panel Admin Sekolah
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
          {admin?.nama
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "?"}
        </div>

        {/* Nama */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end keading-tight">
            <span className="font-semibold text-sm">Admin Sekolah</span>
            <span className="text-xs text-blue-200 hidden sm:block">
              {admin?.nama || "Loading..."}
            </span>
            <span className="text-xs text-slate-500 hidden sm:block">
              {admin?.role.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
