"use client";

import NotificationBell from "./notifikasiBell";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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

        <span className="font-semibold text-slate-800 text-sm">
          PPDB SMP Terpadu
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* Notifikasi*/}
        <div className="bg-blue-600 p-2 rounded-full shadow-md">
          <NotificationBell />
        </div>
      
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
          {user?.nama
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "?"}
        </div>

        {/* Nama */}
        <span className="text-sm text-slate-700 hidden sm:block">
          {user?.nama || "Loading..."}
        </span>
      </div>
    </nav>
  );
}
