"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", href: "/superadmin/dashboard", icon: "🏠" },
  { label: "Kelola Sekolah", href: "/superadmin/sekolah", icon: "🏫" },
  { label: "Monitoring", href: "/superadmin/monitoring", icon: "📡" },
  { label: "Laporan", href: "/superadmin/laporan", icon: "📊" },
];

export default function SidebarSuperAdmin() {
  const pathname = usePathname();

  return (
    <aside className="w-52 bg-white border-r border-slate-100 shadow-sm fixed top-[52px] left-0 bottom-0 flex flex-col justify-between z-40">
      <nav className="flex flex-col gap-1 p-3 mt-2">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/superadmin/dashboard"
              ? pathname === "/superadmin/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center leading-relaxed">
          © 2025 Dinas Pendidikan
          <br />
          Kota Bandar Lampung
        </p>
      </div>
    </aside>
  );
}