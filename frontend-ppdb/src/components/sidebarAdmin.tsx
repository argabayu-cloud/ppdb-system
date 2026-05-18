"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardCheck,
  LayoutDashboard,
  Settings,
  Users,
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
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-60 border-r border-slate-200 bg-white">
      <div className="flex h-full flex-col">
        {/* langsung menu */}

        <nav className="flex-1 space-y-2 p-4">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${active
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-blue-50 p-4">
            <p className="text-xs font-medium text-blue-600">
              Tahun Ajaran
            </p>

            <p className="mt-1 text-sm font-bold text-slate-800">
              2025 / 2026
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}