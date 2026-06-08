"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  FileText,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";

import NotificationBell from "./notifikasiBell";

type UserData = {
  nama?: string;
  email?: string;
};

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
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

  const namaUser = user?.nama || "Peserta";
  const emailUser = user?.email || "Siswa Baru";

  const initials =
    namaUser
      .split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "P";

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-slate-200 bg-white px-4 md:px-6 shadow-sm">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100">
            <Image
              src="/images/logo-ppdb.png"
              alt="Logo PPDB"
              width={30}
              height={30}
              priority
              className="h-8 w-8 object-contain"
            />
          </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900">
                PPDB SMP Terpadu
              </p>
              <p className="text-xs text-slate-500">Portal Peserta</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                {initials}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-40 truncate text-sm font-semibold text-slate-800">
                  {namaUser}
                </p>
                <p className="text-xs text-slate-400">Peserta</p>
              </div>

              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl sm:w-72">
                <div className="border-b border-slate-100 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {namaUser}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {emailUser}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    href="/dashboard/biodata"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 transition hover:bg-slate-50"
                  >
                    <User className="h-5 w-5 text-slate-400" />
                    <span>Biodata Lengkap</span>
                  </Link>

                  <Link
                    href="/dashboard/upload"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 transition hover:bg-slate-50"
                  >
                    <FileText className="h-5 w-5 text-slate-400" />
                    <span>Edit Berkas</span>
                  </Link>

                  <Link
                    href="/dashboard/biodata"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 transition hover:bg-slate-50"
                  >
                    <Settings className="h-5 w-5 text-slate-400" />
                    <span>Ganti Nama</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Keluar Akun
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