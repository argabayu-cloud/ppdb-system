"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Menu, ShieldCheck, User } from "lucide-react";

type SuperAdminProfile = {
  nama?: string;
  email?: string;
  role?: string;
};

export default function NavbarSuperAdmin({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const [superAdmin, setSuperAdmin] = useState<SuperAdminProfile | null>(null);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    const storedUser = localStorage.getItem("user");

    try {
      if (storedAdmin) {
        setSuperAdmin(JSON.parse(storedAdmin));
        return;
      }

      if (storedUser) {
        setSuperAdmin(JSON.parse(storedUser));
      }
    } catch {
      setSuperAdmin(null);
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

  const namaAdmin = superAdmin?.nama || "Super Admin";
  const emailAdmin = superAdmin?.email || "superadmin@ppdb.sch.id";

  const initials =
    namaAdmin
      .split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SA";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    router.push("/auth/login");
  };

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

          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-900">Super Admin</p>
            <p className="text-xs text-slate-500">Monitoring PPDB Kota</p>
          </div>
        </div>

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
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>

              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div className="absolute right-0 z-[100] mt-3 w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-72">
                <div className="border-b border-slate-100 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {namaAdmin}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {emailAdmin}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600">
                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                    <span>Monitoring PPDB Kota</span>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600">
                    <User className="h-5 w-5 text-slate-400" />
                    <span>Role Super Admin</span>
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