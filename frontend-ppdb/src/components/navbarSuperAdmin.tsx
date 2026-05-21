"use client";

import Image from "next/image";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavbarSuperAdmin() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    router.push("/auth/login");
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100">
            <Image
              src="/images/logo-ppdb.png"
              alt="Logo PPDB"
              width={30}
              height={30}
              className="h-8 w-8 object-contain"
            />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">Super Admin</p>
            <p className="text-xs text-slate-500">Monitoring PPDB Kota</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100">
            <Bell className="h-5 w-5" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
              SA
            </div>
            <span className="hidden text-sm font-semibold text-slate-700 sm:block">
              Super Admin
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          <button
            onClick={handleLogout}
            className="hidden rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 md:flex"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}