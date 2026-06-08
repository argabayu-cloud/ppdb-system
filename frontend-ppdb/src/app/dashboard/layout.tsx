"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
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
    <div className="min-h-screen bg-slate-50">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex pt-16 min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0 p-4 md:p-5 flex flex-col transition-all duration-300 lg:ml-56">
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
