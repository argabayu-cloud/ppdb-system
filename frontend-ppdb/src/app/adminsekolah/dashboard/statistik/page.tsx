"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
} from "lucide-react";

type Pendaftar = {
  id?: number;
  nama?: string;
  jalur?: string;
  status?: string;
};

export default function StatistikPage() {
  const [data, setData] = useState<Pendaftar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendaftar = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${baseUrl}/pendaftaran`, {
          cache: "no-store",
        });

        const result = await res.json();

        // Sesuaikan kalau response backend bentuknya beda
        setData(result.data || result || []);
      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendaftar();
  }, []);

  const total = data.length;

  const terverifikasi = data.filter(
    (item) =>
      item.status === "Terverifikasi" ||
      item.status === "Diterima" ||
      item.status === "LOLOS"
  ).length;

  const menunggu = data.filter(
    (item) =>
      item.status === "Menunggu" ||
      item.status === "Menunggu Verifikasi" ||
      item.status === "PENDING"
  ).length;

  const ditolak = data.filter(
    (item) => item.status === "Ditolak" || item.status === "DITOLAK"
  ).length;

  const zonasi = data.filter((item) => item.jalur === "Zonasi").length;
  const prestasi = data.filter((item) => item.jalur === "Prestasi").length;
  const afirmasi = data.filter((item) => item.jalur === "Afirmasi").length;
  const mutasi = data.filter((item) => item.jalur === "Mutasi").length;

  const getPercent = (value: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const stats = [
    {
      label: "Total Pendaftar",
      value: total,
      icon: Users,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Terverifikasi",
      value: terverifikasi,
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      label: "Menunggu",
      value: menunggu,
      icon: Clock,
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      label: "Ditolak",
      value: ditolak,
      icon: XCircle,
      bg: "bg-red-50",
      text: "text-red-600",
    },
  ];

  const jalur = [
    { label: "Zonasi", value: getPercent(zonasi), jumlah: zonasi },
    { label: "Prestasi", value: getPercent(prestasi), jumlah: prestasi },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white shadow-sm">
        <p className="text-sm text-blue-100">Statistik PPDB</p>
        <h1 className="mt-1 text-2xl font-bold">
          Ringkasan Data Pendaftaran
        </h1>
        <p className="mt-2 text-sm text-blue-100">
          Data akan otomatis bertambah jika ada siswa yang melakukan pendaftaran.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${item.bg} ${item.text}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <p className="text-sm text-slate-500">{item.label}</p>

              <h2 className="mt-1 text-3xl font-bold text-slate-800">
                {loading ? "..." : item.value}
              </h2>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">
                Distribusi Jalur Pendaftaran
              </h2>
              <p className="text-sm text-slate-500">
                Perbandingan jumlah pendaftar berdasarkan jalur.
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-5">
            {jalur.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {item.label}
                  </span>

                  <span className="font-semibold text-blue-600">
                    {loading ? "..." : `${item.jumlah} siswa (${item.value}%)`}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-blue-600 transition-all"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-800">Ringkasan</h2>
          <p className="mt-1 text-sm text-slate-500">
            Kondisi pendaftaran saat ini.
          </p>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-xs text-blue-600">Kuota Sekolah</p>
              <p className="mt-1 text-2xl font-bold text-blue-700">0</p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs text-emerald-600">Kuota Terisi</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">
                {total === 0 ? "0%" : `${getPercent(total)}%`}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-xs text-amber-600">Perlu Dicek</p>
              <p className="mt-1 text-2xl font-bold text-amber-700">
                {menunggu} Data
              </p>
            </div>
          </div>
        </div>
      </section>

      {total === 0 && !loading && (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <p className="font-semibold text-slate-700">
            Belum ada data pendaftar
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Statistik akan otomatis terisi setelah siswa melakukan pendaftaran.
          </p>
        </section>
      )}
    </div>
  );
}