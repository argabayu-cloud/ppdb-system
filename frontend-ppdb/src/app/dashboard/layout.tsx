"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: "🏠" },
  { label: "Pendaftaran", href: "/dashboard/pendaftaran", icon: "📋" },
  { label: "Biodata Diri", href: "/dashboard/biodata", icon: "👤" },
  { label: "Upload Berkas", href: "/dashboard/upload", icon: "📁" },
  { label: "Pengumuman", href: "/dashboard/pengumuman", icon: "📢" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="w-full bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-blue-700 font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-sm tracking-wide uppercase hidden sm:block">
            PPDB SMP Terpadu
          </span>
        </div>

        {/* Info User */}
        <div className="flex items-center gap-4 text-sm">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="font-semibold">Budi Santoso</span>
            <span className="text-blue-200 text-xs">Tahun Ajaran 2025/2026</span>
          </div>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">
            B
          </div>
          {/* Logout */}
          <button
            onClick={() => alert("Logout! (sambungkan ke backend)")}
            className="text-blue-200 hover:text-white text-xs border border-blue-500 hover:border-white px-3 py-1 rounded-lg transition-colors"
          >
            Keluar
          </button>
        </div>
      </nav>

      {/* Body = Sidebar + Content */}
      <div className="flex pt-[52px] min-h-screen">
        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-slate-100 shadow-sm fixed top-[52px] left-0 bottom-0 flex flex-col justify-between z-40">
          <nav className="flex flex-col gap-1 p-3 mt-2">
            {menuItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Info di bawah sidebar */}
          <div className="p-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              © 2025 Dinas Pendidikan
              <br />
              PPDB SMP Terpadu
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-52 flex-1 p-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
