"use client";

import { useEffect, useState } from "react";

type Admin = {
  nama: string;
  role: string;
  namaSekolah?: string;
};

const statsData = [
  { label: "Total Pendaftar", value: 100, icon: "👥", color: "bg-blue-500" },
  {
    label: "Menunggu Verifikasi",
    value: 250,
    icon: "⏳",
    color: "bg-amber-500",
  },
  { label: "Terverifikasi", value: 250, icon: "✅", color: "bg-green-500" },
  { label: "Ditolak", value: 50, icon: "❌", color: "bg-red-500" },
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
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-5 animate-pulse">
        <div className="h-28 rounded-2xl bg-slate-200" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">
              <div className="w-9 h-9 rounded-lg bg-slate-200 mb-3" />
              <div className="h-5 w-14 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="h-5 w-40 bg-slate-200 rounded mb-5" />

          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 bg-slate-100 rounded" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 h-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-5 text-white shadow-md overflow-hidden">
        <p className="text-blue-100 text-sm mb-1">Selamat Datang 👋</p>

        <h1 className="text-2xl font-bold tracking-tight">Admin Sekolah</h1>

        <p className="text-blue-100 text-sm mt-1">
          {admin?.namaSekolah || "SMP Negeri 1 Bandar Lampung"}
        </p>

        <div className="flex items-center gap-2 mt-2 text-sm text-blue-100">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
          <p>Tahun Ajaran 2025/2026</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statsData.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-2"
          >
            <div
              className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center text-lg`}
            >
              {stat.icon}
            </div>

            <p className="text-xl font-bold text-slate-800">{stat.value}</p>

            <p className="text-xs text-slate-500 leading-tight">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-800 text-sm">
            📋 Pendaftar Terbaru
          </h2>

          <a
            href="/adminsekolah/pendaftar"
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
              {pendaftarTerbaru.map((p) => (
                <tr
                  key={`${p.nama}-${p.tanggal}`}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {p.nama}
                  </td>

                  <td className="py-2.5 px-3 text-slate-600">{p.jalur}</td>

                  <td className="py-2.5 px-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${statusWarna[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-slate-400 text-xs">
                    {p.tanggal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Verifikasi Berkas",
            desc: "250 berkas menunggu",
            href: "/adminsekolah/verifikasi",
            icon: "✅",
            color: "border-green-400",
          },
          {
            label: "Lihat Pendaftar",
            desc: "100 total pendaftar",
            href: "/adminsekolah/pendaftar",
            icon: "📋",
            color: "border-blue-400",
          },
          {
            label: "Lihat Statistik",
            desc: "Grafik per jalur",
            href: "/adminsekolah/statistik",
            icon: "📊",
            color: "border-purple-400",
          },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 ${item.color} p-4 flex items-center gap-3 hover:shadow transition-shadow`}
          >
            <span className="text-2xl">{item.icon}</span>

            <div>
              <p className="font-semibold text-slate-800 text-sm">
                {item.label}
              </p>

              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
