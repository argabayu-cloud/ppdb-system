"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  School,
  Users,
  BarChart3,
  CalendarDays,
  ClipboardList,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
  { label: "Kelola Sekolah", href: "/super-admin/sekolah", icon: School },
  { label: "Kelola Admin", href: "/super-admin/admin", icon: Users },
  { label: "Periode PPDB", href: "/super-admin/periode", icon: CalendarDays },
  { label: "Monitoring", href: "/super-admin/monitoring", icon: ClipboardList },
  { label: "Laporan", href: "/super-admin/laporan", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-blue-700">
        <h1 className="text-lg font-bold leading-tight">PPDB Terpadu</h1>
        <span className="text-xs text-blue-300">Super Admin Panel</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-blue-700 text-xs text-blue-400">
        © 2025 PPDB Terpadu
      </div>
    </aside>
  );
}