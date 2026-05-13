"use client";

import NotificationBell from "./notifikasiBell";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";

export default function NavbarAdmin() {
  const [admin, setAdmin] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");

    if (storedAdmin) {
      const data = JSON.parse(storedAdmin);
      console.log("DATA ADMIN:", data);
      setAdmin(data);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");

    router.push("/auth/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between font-sans">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo-ppdb.png"
          alt="Logo"
          width={36}
          height={36}
          className="rounded-lg"
        />

        <span className="font-semibold text-slate-800 text-sm">
          Admin Sekolah
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <NotificationBell />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1.5 rounded-lg"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              {admin?.nama
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "A"}
            </div>

            <span className="hidden sm:block text-sm font-medium text-slate-700">
              {admin?.nama || "Admin"}
            </span>

            <ChevronDown className="w-4 h-4" />
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-xl shadow-xl">
              <div className="px-5 py-4 border-b">
                <p className="font-semibold">
                  {admin?.nama || "Admin"}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  {admin?.email || "admin@school"}
                </p>
              </div>

              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}