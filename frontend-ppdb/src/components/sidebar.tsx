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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 bg-white border-r border-slate-100 shadow-sm fixed top-[64px] left-0 bottom-0 flex flex-col justify-between z-40">
      
      {/* MENU */}
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

      {/* FOOTER SIDEBAR */}
      <div className="p-4 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center leading-relaxed">
          © 2025 Dinas Pendidikan
          <br />
          PPDB SMP Terpadu
        </p>
      </div>
    </aside>
  );
}