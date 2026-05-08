"use client";

import { signOut, useSession } from "next-auth/react";
import { Bell, LogOut, UserCircle } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Judul halaman / breadcrumb bisa ditaruh sini */}
      <h2 className="text-gray-700 font-semibold text-sm">Super Admin</h2>

      {/* Kanan: notif + profil */}
      <div className="flex items-center gap-4">
        {/* Notifikasi */}
        <button className="relative text-gray-500 hover:text-blue-600 transition">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Profil */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <UserCircle size={22} className="text-blue-700" />
          <span className="font-medium">
            {session?.user?.name ?? "Super Admin"}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </header>
  );
}