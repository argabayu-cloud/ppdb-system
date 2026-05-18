"use client";

import { useEffect, useState } from "react";
import {
  Users,
  ClipboardCheck,
  Clock,
  BarChart3,
  UserCheck,
  FileWarning,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function AdminSekolahDashboardPage() {
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const namaSekolah =
    admin?.namaSekolah || admin?.sekolah || admin?.schoolName || "SMP Terpadu";

  const cards = [
    {
      label: "Total Pendaftar",
      value: "100",
      desc: "Siswa sudah mendaftar",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Menunggu Verifikasi",
      value: "25",
      desc: "Berkas perlu dicek",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Terverifikasi",
      value: "75",
      desc: "Berkas sudah valid",
      icon: ClipboardCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Statistik",
      value: "75%",
      desc: "Progress verifikasi",
      icon: BarChart3,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  const pendaftarTerbaru = [
    {
      nama: "Arga Bayu R",
      status: "Menunggu",
      color: "bg-amber-50 text-amber-600",
    },
    {
      nama: "Erwin Gutawa",
      status: "Terverifikasi",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      nama: "Amelia Rizki",
      status: "Menunggu",
      color: "bg-amber-50 text-amber-600",
    },
    {
      nama: "Diva P",
      status: "Ditinjau",
      color: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <div className="flex flex-col gap-6 bg-slate-50 min-h-screen p-6">
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute right-12 bottom-0 w-24 h-24 bg-white/10 rounded-full" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <p className="text-blue-200 text-sm mb-1">Selamat Datang 👋</p>

            <h1 className="text-2xl font-bold">
              Admin Sekolah {namaSekolah}
            </h1>

            <p className="text-blue-100 text-sm mt-2 max-w-xl">
              Kelola data pendaftar, verifikasi berkas, dan pantau statistik
              PPDB sekolah secara lebih mudah.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4 min-w-[180px] border border-white/20">
            <p className="text-xs text-blue-100 mb-1">Status Panel</p>
            <p className="text-lg font-bold">Aktif</p>
            <p className="text-xs text-blue-200 mt-1">Tahun Ajaran 2025/2026</p>
          </div>
        </div>
      </section>

      {/* CARD STATISTIK */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all"
            >
              <div
                className={`w-11 h-11 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <p className="text-sm text-slate-500">{item.label}</p>

              <h2 className="text-2xl font-bold text-slate-800 mt-1">
                {item.value}
              </h2>

              <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
            </div>
          );
        })}
      </section>

      {/* GRID BAWAH */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PENDAFTAR TERBARU */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-slate-700">
                📋 Pendaftar Terbaru
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Data siswa yang baru masuk ke sistem PPDB.
              </p>
            </div>

            <button className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
              Lihat semua
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {pendaftarTerbaru.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {item.nama
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p className="font-medium text-slate-800 text-sm">
                      {item.nama}
                    </p>
                    <p className="text-xs text-slate-500">
                      Berkas pendaftaran PPDB
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${item.color}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RINGKASAN VERIFIKASI */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-1">
            Ringkasan Verifikasi
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            Progress pengecekan data pendaftar.
          </p>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="flex items-center gap-2 text-slate-600">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Data Lengkap
                </span>
                <span className="font-semibold text-emerald-600">75%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full">
                <div className="w-[75%] h-3 bg-emerald-600 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="flex items-center gap-2 text-slate-600">
                  <FileWarning className="w-4 h-4 text-amber-600" />
                  Menunggu Cek
                </span>
                <span className="font-semibold text-amber-600">25%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full">
                <div className="w-[25%] h-3 bg-amber-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="flex items-center gap-2 text-slate-600">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Kuota Terisi
                </span>
                <span className="font-semibold text-blue-600">60%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full">
                <div className="w-[60%] h-3 bg-blue-600 rounded-full" />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-700">
              Tips Hari Ini
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Prioritaskan verifikasi berkas yang masih menunggu agar proses
              seleksi lebih cepat.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}