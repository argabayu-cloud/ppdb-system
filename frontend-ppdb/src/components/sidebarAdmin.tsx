"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardCheck,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from "lucide-react";

const menu = [
  {
    label: "Dashboard",
    href: "/adminsekolah/dashboard",
    icon: LayoutDashboard,
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

export default function SidebarAdmin({
  isOpen = false,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-60 border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 lg:hidden">
            <p className="text-sm font-bold text-slate-800">Menu Admin</p>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-2 p-4">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${
                  active
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
              <p className="text-xs font-medium text-blue-600">Tahun Ajaran</p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                2025 / 2026
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
