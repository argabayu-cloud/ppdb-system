"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

import Footer from "@/components/footer";
import NavbarAdmin from "@/components/navbarAdmin";
import SidebarAdmin from "@/components/sidebarAdmin";

export default function AdminSekolahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSidebarOpen(false); // Close sidebar on route change (mobile)

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <NavbarAdmin onMenuClick={() => setSidebarOpen(true)} />
      <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-h-screen flex flex-col transition-all duration-300 lg:ml-60 pt-16">
        <div className="flex-1 p-4 md:p-6">
          {loading ? (
            <div className="flex min-h-[70vh] items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="text-sm font-semibold text-slate-600">
                  Memuat halaman...
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}