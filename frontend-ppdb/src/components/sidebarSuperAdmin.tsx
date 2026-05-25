"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartColumnBig,
  ClipboardCheck,
  LayoutDashboard,
} from "lucide-react";

const menu = [
  {
    label: "Dashboard",
    href: "/superadmin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Monitoring",
    href: "/superadmin/dashboard/monitoring",
    icon: ClipboardCheck,
  },
  {
    label: "Statistik Kota",
    href: "/superadmin/dashboard/statistik",
    icon: ChartColumnBig,
  },
];

export default function SidebarSuperAdmin() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-60 border-r border-slate-200 bg-white">
      <div className="flex h-full flex-col">
        <nav className="flex-1 space-y-1.5 p-4">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-blue-50 p-4">
            <p className="text-xs font-medium text-blue-600">
              Jalur Monitoring
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              Zonasi & Prestasi
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}