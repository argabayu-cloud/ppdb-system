"use client";

import NotificationBell from "./notifikasiBell";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo-ppdb.png"
          alt="Logo PPDB"
          width={36}
          height={36}
          className="w-9 h-9 rounded-lg object-cover"
        />

        <span className="font-semibold text-slate-800 text-sm">
          PPDB SMP Terpadu
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <NotificationBell />

        {/* USER DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1.5 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
              {user?.nama
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "?"}
            </div>

            <span className="hidden sm:block text-sm font-medium text-slate-700">
              {user?.nama || "User"}
            </span>

            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-[100]">
              {/* HEADER USER */}
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                <p className="font-semibold text-slate-800">
                  {user?.nama || "User"}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {user?.email || "Siswa Baru"}
                </p>
              </div>

              {/* MENU */}
              <div className="py-2">
                <Link
                  href="/dashboard/biodata"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Biodata Lengkap</p>
                    <p className="text-xs text-slate-500">
                      Lihat dan lengkapi data diri
                    </p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/upload"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium">Edit Berkas</p>
                    <p className="text-xs text-slate-500">
                      Unggah dokumen persyaratan
                    </p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/biodata"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium">Ganti Nama</p>
                    <p className="text-xs text-slate-500">
                      Ubah nama profil pengguna
                    </p>
                  </div>
                </Link>
              </div>

              {/* LOGOUT */}
              <div className="border-t border-slate-100 p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}