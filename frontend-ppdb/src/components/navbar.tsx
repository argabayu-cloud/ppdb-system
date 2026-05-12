"use client";

import NotificationBell from "./notifikasiBell";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  FileText,
  Settings,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <>
      {/* NAVBAR */}
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

          {/* NOTIFIKASI */}
          <NotificationBell />

          {/* BUTTON USER */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {/* AVATAR */}
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
              {user?.nama
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "?"}
            </div>

            {/* NAMA */}
            <span className="text-sm text-slate-700 hidden sm:block font-medium">
              {user?.nama || "Loading..."}
            </span>
          </button>
        </div>
      </nav>

      {/* OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* HEADER */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            Profil Saya
          </h2>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* PROFILE */}
        <div className="p-6 flex flex-col items-center border-b border-slate-100 bg-slate-50/50">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-lg ring-4 ring-white">
            {user?.nama
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "?"}
          </div>

          <h3 className="font-semibold text-lg text-slate-800 text-center">
            {user?.nama || "User"}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {user?.email || "Siswa Baru"}
          </p>
        </div>

        {/* MENU */}
        <div className="flex-1 py-4 flex flex-col gap-2 px-4 overflow-y-auto">

          {/* BIODATA */}
          <Link
            href="/dashboard/biodata"
            onClick={() => setIsSidebarOpen(false)}
            className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all group border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-800">
                  Biodata Lengkap
                </span>

                <span className="text-xs text-slate-500">
                  Lihat dan lengkapi data diri
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>

          {/* UPLOAD */}
          <Link
            href="/dashboard/upload"
            onClick={() => setIsSidebarOpen(false)}
            className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all group border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-800">
                  Edit Berkas
                </span>

                <span className="text-xs text-slate-500">
                  Unggah dokumen persyaratan
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </Link>

          {/* SETTINGS */}
          <Link
            href="/dashboard/biodata"
            onClick={() => setIsSidebarOpen(false)}
            className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all group border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-800">
                  Ganti Nama
                </span>

                <span className="text-xs text-slate-500">
                  Ubah nama profil anda
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </Link>
        </div>

        {/* LOGOUT */}
        <div className="p-6 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition-colors"
          >
            <LogOut className="w-5 h-5" />

            <span>Keluar Akun</span>
          </button>
        </div>
      </div>
    </>
  );
}