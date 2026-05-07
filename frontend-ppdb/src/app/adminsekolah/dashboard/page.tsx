"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const statsData = [
  {
    label: "Total Pendaftar",
    value: 100,
    icon: "👥",
    color: "bg-blue-500",
  },
  {
    label: "Menunggu Verifikasi",
    value: 250,
    icon: "⏳",
    color: "bg-amber-500",
  },
  {
    label: "Terverifikasi",
    value: 250,
    icon: "✅",
    color: "bg-green-500",
  },
  {
    label: "Ditolak",
    value: 50,
    icon: "❌",
    color: "bg-red-500",
  },
];

const pendaftarTerbaru = [
  {
    nama: "Arga Bayu R",
    jalur: "Zonasi",
    status: "Menunggu Verifikasi",
    tanggal: "04 Mei 2025",
  },
  {
    nama: "Erwin Gutawa",
    jalur: "Prestasi",
    status: "Terverifikasi",
    tanggal: "04 Mei 2025",
  },
  {
    nama: "Amelia Rizki",
    jalur: "Zonasi",
    status: "Ditolak",
    tanggal: "03 Mei 2025",
  },
  {
    nama: "Diva P",
    jalur: "Domisili",
    status: "Terverifikasi",
    tanggal: "02 Mei 2025",
  },
];

const statusWarna: Record<string, string> = {
  "Menunggu Verifikasi": "bg-amber-100 text-amber-700",
  Terverifikasi: "bg-green-100 text-green-700",
  Ditolak: "bg-red-100 text-red-600",
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [admin, setAdmin] = useState<any>(null);

  // 🔐 Protect Admin Route + Ambil Admin
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("admin");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      {loading ? (
        <Skeleton className="h-36 w-full rounded-2xl" />
      ) : (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm mb-1">
              Selamat Datang 👋
            </p>

            <h1 className="text-2xl font-bold">
              {admin?.nama || "Admin Sekolah"}
            </h1>

            <p className="text-blue-100 text-sm mt-1">
              SMP Negeri 3 Bandar Lampung · Tahun Ajaran
              2025/2026
            </p>
          </div>

          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
            {admin?.nama
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "A"}
          </div>
        </div>
      )}

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-32 w-full rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statsData.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow p-5 flex flex-col gap-2"
            >
              <div
                className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-xl`}
              >
                {stat.icon}
              </div>

              <p className="text-2xl font-bold text-slate-800">
                {stat.value}
              </p>

              <p className="text-xs text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pendaftar Terbaru */}
      {loading ? (
        <Skeleton className="h-80 w-full rounded-2xl" />
      ) : (
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">
              📋 Pendaftar Terbaru
            </h2>

            <a
              href="/admin/pendaftar"
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Lihat Semua →
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-3 text-xs text-slate-500 font-medium">
                    Nama
                  </th>

                  <th className="text-left py-2 px-3 text-xs text-slate-500 font-medium">
                    Jalur
                  </th>

                  <th className="text-left py-2 px-3 text-xs text-slate-500 font-medium">
                    Status
                  </th>

                  <th className="text-left py-2 px-3 text-xs text-slate-500 font-medium">
                    Tanggal
                  </th>
                </tr>
              </thead>

              <tbody>
                {pendaftarTerbaru.map((p, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {p.nama}
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      {p.jalur}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${statusWarna[p.status]}`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-400 text-xs">
                      {p.tanggal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-28 w-full rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Verifikasi Berkas",
              desc: "250 berkas menunggu",
              href: "/admin/verifikasi",
              icon: "✅",
              color: "border-green-400",
            },
            {
              label: "Lihat Pendaftar",
              desc: "100 total pendaftar",
              href: "/admin/pendaftar",
              icon: "📋",
              color: "border-blue-400",
            },
            {
              label: "Lihat Statistik",
              desc: "Grafik per jalur",
              href: "/admin/statistik",
              icon: "📊",
              color: "border-purple-400",
            },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`bg-white rounded-2xl shadow border-l-4 ${item.color} p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}
            >
              <span className="text-3xl">
                {item.icon}
              </span>

              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  {item.label}
                </p>

                <p className="text-xs text-slate-500 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}