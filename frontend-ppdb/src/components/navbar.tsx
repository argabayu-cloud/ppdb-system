"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, FileText, LogOut, Settings, User } from "lucide-react";

import NotificationBell from "./notifikasiBell";

type UserData = {
  nama?: string;
  email?: string;
};

export default function Navbar() {
  const [user, setUser] = useState<UserData | null>(null);
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

  const initials =
    user?.nama
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/90 px-5 py-3 text-white shadow-lg shadow-slate-950/10 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
            <Image
              src="/images/logo-ppdb.png"
              alt="Logo PPDB"
              width={32}
              height={32}
              priority
              className="object-contain"
            />
          </div>

          <div>
            <p className="text-sm font-bold tracking-wide">
              PPDB SMP Terpadu
            </p>
            <p className="text-xs text-blue-200">Portal Peserta</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/10 p-2 backdrop-blur">
            <NotificationBell />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-2 py-1.5 transition hover:bg-white/15"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
                {initials}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-36 truncate text-sm font-semibold text-white">
                  {user?.nama || "User"}
                </p>
                <p className="text-xs text-blue-200">Peserta</p>
              </div>

              <ChevronDown
                className={`h-4 w-4 text-blue-100 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 z-[100] mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-sm font-bold">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-bold">
                        {user?.nama || "User"}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-blue-100">
                        {user?.email || "Siswa Baru"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Link
                    href="/dashboard/biodata"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-slate-700 transition hover:bg-blue-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">Biodata Lengkap</p>
                      <p className="text-xs text-slate-500">
                        Lihat dan lengkapi data diri
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/upload"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-slate-700 transition hover:bg-blue-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">Edit Berkas</p>
                      <p className="text-xs text-slate-500">
                        Unggah dokumen persyaratan
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/biodata"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-slate-700 transition hover:bg-blue-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                      <Settings className="h-5 w-5 text-emerald-600" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">Ganti Nama</p>
                      <p className="text-xs text-slate-500">
                        Ubah nama profil pengguna
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="border-t border-slate-100 p-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                      <LogOut className="h-5 w-5" />
                    </div>

                    <span className="font-semibold">Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}