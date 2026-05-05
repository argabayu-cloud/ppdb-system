"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Pendaftaran", href: "/dashboard/pendaftaran" },
  { label: "Biodata", href: "/dashboard/biodata" },
  { label: "Upload", href: "/dashboard/upload" },
  { label: "Pengumuman", href: "/dashboard/pengumuman" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r border-slate-200 fixed top-[60px] bottom-0 left-0 p-4">
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}