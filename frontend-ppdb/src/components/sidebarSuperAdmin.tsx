"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartColumnBig,
  ClipboardCheck,
  LayoutDashboard,
  X,
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

export default function SidebarSuperAdmin({
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
        className={`fixed bottom-0 left-0 top-16 z-40 w-60 border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 p-4 lg:hidden">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Menu Super Admin
            </p>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

        <nav className="flex-1 space-y-1.5 p-4">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
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
    </>
  );
}
