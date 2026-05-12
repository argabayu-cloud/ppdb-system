"use client";

import { useRouter } from "next/navigation";

export default function NavbarSuperAdmin() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("superAdminToken");
    localStorage.removeItem("user");
    
    router.replace("/auth/login");
  };

  return (
    <nav className="w-full bg-indigo-700 text-white px-6 py-3 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <span className="text-indigo-700 font-bold text-sm">P</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-sm tracking-wide uppercase hidden sm:block">
            PPDB SMP Terpadu
          </span>
          <span className="text-indigo-200 text-xs hidden sm:block">
            Panel Super Admin · Dinas Pendidikan
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="font-semibold text-sm">Super Admin</span>
          <span className="text-indigo-200 text-xs">Dinas Pendidikan Kota Bandar Lampung</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">
          S
        </div>
        <button
          onClick={handleLogout}
          className="text-indigo-200 hover:text-white text-xs border border-indigo-500 hover:border-white px-3 py-1 rounded-lg transition-colors"
        >
          Keluar
        </button>
      </div>
    </nav>
  );
}