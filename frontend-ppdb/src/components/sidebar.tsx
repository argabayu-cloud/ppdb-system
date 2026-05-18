"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Home,
  Megaphone,
  UploadCloud,
  UserRound,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Biodata",
    href: "/dashboard/biodata",
    icon: UserRound,
  },
  {
    label: "Pendaftaran",
    href: "/dashboard/pendaftaran",
    icon: FileText,
  },
  {
    label: "Upload",
    href: "/dashboard/upload",
    icon: UploadCloud,
  },
  {
    label: "Pengumuman",
    href: "/dashboard/pengumuman",
    icon: Megaphone,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 top-16 w-56 border-r border-slate-200 bg-white px-3 pt-8 pb-4 shadow-sm">
      <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
          Menu Peserta
        </p>
        <p className="mt-1 text-sm font-bold text-slate-800">Dashboard PPDB</p>
      </div>

      <nav className="flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-md shadow-blue-200"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  active
                    ? "bg-white/15 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>

              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}