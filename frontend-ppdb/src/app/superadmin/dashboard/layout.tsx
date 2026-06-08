"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import FooterSuperAdmin from "@/components/footer";
import NavbarSuperAdmin from "@/components/navbarSuperAdmin";
import SidebarSuperAdmin from "@/components/sidebarSuperAdmin";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <NavbarSuperAdmin onMenuClick={() => setSidebarOpen(true)} />
      <SidebarSuperAdmin
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex min-h-screen flex-col pt-16 transition-all duration-300 lg:ml-60">
        <div className="flex-1 p-4 md:p-6">{children}</div>
        <FooterSuperAdmin />
      </main>
    </div>
  );
}
