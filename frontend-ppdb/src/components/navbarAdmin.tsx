"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Admin = {
  nama: string;
  role: string;
  namaSekolah?: string;
};

export default function Navbar() {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
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
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
          {admin?.nama
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "A"}
        </div>

        {/* Nama */}
          <div className="hidden sm:flex flex-col leading-tight">

            {/* nama admin */}
            <span className="text-sm font-semibold text-slate-800">
                {admin?.nama || "Loading"}
                </span>

            {/* role admin */}
            <span className="text-[10px] font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5 w-fit mt-1">
              {admin?.role?.toUpperCase()}
            </span>
          </div>
      </div>
    </nav>
  );
}