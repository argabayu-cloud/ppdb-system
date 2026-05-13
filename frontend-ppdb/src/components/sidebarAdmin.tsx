"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardCheck, Users, Settings, BarChart3 } from "lucide-react";

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
    <aside className="fixed top-[52px] left-0 w-52 h-[calc(100vh-52px)] bg-white border-r border-slate-200 p-4 font-sans">
      <div className="flex flex-col gap-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-cen  ter gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}