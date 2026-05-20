"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User } from "lucide-react";

type AdminProfile = {
  nama?: string;
  email?: string;
  namaSekolah?: string;
  sekolah?: string;
  schoolName?: string;
};

export default function NavbarAdmin() {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");

    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch {
        setAdmin(null);
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const namaSekolah =
    admin?.namaSekolah || admin?.schoolName || admin?.sekolah || "Admin Sekolah";

  const namaAdmin = admin?.nama || "Admin";
  const emailAdmin = admin?.email || "admin@sekolah.sch.id";

  const initials =
    namaAdmin
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A";

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex h-full items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100">
            <Image
              src="/images/logo-ppdb.png"
              alt="Logo PPDB"
              width={30}
              height={30}
              className="h-8 w-8 object-contain"
              priority
            />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">PPDB Admin</p>
            <p className="text-xs text-slate-500">{namaSekolah}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                {initials}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  {namaAdmin}
                </p>
                <p className="text-xs text-slate-400">Admin Sekolah</p>
              </div>

              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                      {initials}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {namaAdmin}
                      </p>
                      <p className="text-xs text-slate-500">{emailAdmin}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600">
                    <User className="h-5 w-5 text-slate-400" />
                    <span>{namaSekolah}</span>
                  </div>

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