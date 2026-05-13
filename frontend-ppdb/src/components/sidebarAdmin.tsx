"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  Settings,
  BarChart3,
} from "lucide-react";

const menu = [
  {
    label: "Dashboard",
    href: "/adminsekolah/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Verifikasi",
    href: "/adminsekolah/dashboard/verifikasi",
    icon: ClipboardCheck,
  },
  {
    label: "Pendaftar",
    href: "/adminsekolah/dashboard/pendaftar",
    icon: Users,
  },
  {
    label: "Pengaturan",
    href: "/adminsekolah/dashboard/pengaturan",
    icon: Settings,
  },
  {
    label: "Statistik",
    href: "/adminsekolah/dashboard/statistik",
    icon: BarChart3,
  },
];

export default function SidebarAdmin() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 flex flex-col">

      {/* MENU */}
      <div className="flex-1 p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all
              ${active
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center
                ${active
                    ? "bg-white/20"
                    : "bg-slate-100 group-hover:bg-blue-100"
                  }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {item.label}
            </Link>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-100">
        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-xs text-blue-600 font-medium">
            Tahun Ajaran
          </p>

          <p className="text-sm font-bold text-slate-800 mt-1">
            2025 / 2026
          </p>
        </div>
      </div>
    </aside>
  );
}