"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  PieChart,
} from "lucide-react";

import { getDashboardAdmin } from "@/lib/api";

type Stats = {
  total: number;
  menunggu: number;
  diterima: number;
  ditolak: number;
  zonasi: number;
  prestasi: number;
  progress: number;
};

type DashboardAdminResponse = {
  sekolah?: {
    id: string;
    nama: string;
  };
  stats?: Partial<Stats>;
};

const initialStats: Stats = {
  total: 0,
  menunggu: 0,
  diterima: 0,
  ditolak: 0,
  zonasi: 0,
  prestasi: 0,
  progress: 0,
};

function normalizeStats(stats?: Partial<Stats>): Stats {
  return {
    total: Number(stats?.total || 0),
    menunggu: Number(stats?.menunggu || 0),
    diterima: Number(stats?.diterima || 0),
    ditolak: Number(stats?.ditolak || 0),
    zonasi: Number(stats?.zonasi || 0),
    prestasi: Number(stats?.prestasi || 0),
    progress: Number(stats?.progress || 0),
  };
}

export default function StatistikPage() {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [namaSekolah, setNamaSekolah] = useState("Sekolah");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistik = async () => {
      try {
        setLoading(true);

        const res = await getDashboardAdmin();
        const data: DashboardAdminResponse = res?.data || {};

        setStats(normalizeStats(data.stats));
        setNamaSekolah(data.sekolah?.nama || "Sekolah");
      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
        setStats(initialStats);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistik();
  }, []);

  const total = stats.total;
  const menunggu = stats.menunggu;
  const diterima = stats.diterima;
  const ditolak = stats.ditolak;
  const zonasi = stats.zonasi;
  const prestasi = stats.prestasi;

  const progress =
    total === 0 ? 0 : Math.round(((diterima + ditolak) / total) * 100);

  const totalJalur = zonasi + prestasi;

  const getJalurPercent = (value: number) => {
    if (totalJalur === 0) return 0;
    return Math.round((value / totalJalur) * 100);
  };

  const zonasiPercent = getJalurPercent(zonasi);
  const prestasiPercent = getJalurPercent(prestasi);

  const maxChartValue = Math.max(zonasi, prestasi, 1);

  const cards = [
    {
      label: "Total Pendaftar",
      value: total,
      desc:
        total > 0
          ? "Total peserta yang sudah mendaftar"
          : "Belum ada siswa mendaftar",
      icon: Users,
    },
    {
      label: "Menunggu",
      value: menunggu,
      desc:
        menunggu > 0
          ? "Pendaftar yang masih perlu diverifikasi"
          : "Belum ada berkas menunggu",
      icon: Clock,
    },
    {
      label: "Diterima",
      value: diterima,
      desc:
        diterima > 0
          ? "Peserta yang sudah diterima"
          : "Belum ada siswa diterima",
      icon: CheckCircle2,
    },
    {
      label: "Ditolak",
      value: ditolak,
      desc:
        ditolak > 0
          ? "Peserta yang tidak lolos seleksi"
          : "Belum ada siswa ditolak",
      icon: XCircle,
    },
    {
      label: "Progress",
      value: `${progress}%`,
      desc:
        progress > 0
          ? "Progress seleksi diterima dan ditolak"
          : "Progress verifikasi belum berjalan",
      icon: BarChart3,
    },
  ];

  const jalurChart = [
    {
      label: "Zonasi",
      jumlah: zonasi,
      percent: zonasiPercent,
      barClass: "bg-blue-600",
      softClass: "bg-blue-50 text-blue-700",
    },
    {
      label: "Prestasi",
      jumlah: prestasi,
      percent: prestasiPercent,
      barClass: "bg-purple-600",
      softClass: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white shadow-sm">
        <p className="text-sm text-blue-100">Statistik PPDB</p>

        <h1 className="mt-1 text-2xl font-bold">
          Ringkasan Data Pendaftaran
        </h1>

        <p className="mt-2 text-sm text-blue-100">
          Statistik pendaftaran untuk {loading ? "..." : namaSekolah}. Data
          otomatis diperbarui dari backend berdasarkan pendaftaran siswa.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="min-h-[220px] rounded-[1.4rem] border border-slate-200 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(15,23,42,0.10)]"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-base font-semibold text-slate-500">
                  {item.label}
                </p>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon className="h-7 w-7" />
                </div>
              </div>

              <h2 className="mt-8 text-4xl font-bold tracking-tight text-slate-950">
                {loading ? "..." : item.value}
              </h2>

              <div className="mt-7 border-t border-slate-100 pt-5">
                <p className="text-base leading-6 text-slate-500">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">
                Chart Jalur Pendaftaran
              </h2>

              <p className="text-sm text-slate-500">
                Perbandingan jumlah pendaftar jalur Zonasi dan Prestasi.
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>

          <div className="flex h-72 items-end justify-center gap-10 rounded-2xl bg-slate-50 px-6 py-6">
            {jalurChart.map((item) => {
              const height =
                item.jumlah === 0
                  ? 8
                  : Math.max((item.jumlah / maxChartValue) * 100, 12);

              return (
                <div
                  key={item.label}
                  className="flex h-full max-w-[180px] flex-1 flex-col items-center justify-end"
                >
                  <div className="mb-3 text-center">
                    <p className="text-2xl font-bold text-slate-800">
                      {loading ? "..." : item.jumlah}
                    </p>

                    <p className="text-xs font-semibold text-slate-500">
                      {loading ? "..." : `${item.percent}%`}
                    </p>
                  </div>

                  <div className="flex h-44 w-full items-end justify-center rounded-2xl bg-white px-6 py-4 shadow-sm">
                    <div
                      className={`w-full rounded-t-2xl ${item.barClass} transition-all`}
                      style={{
                        height: loading ? "20%" : `${height}%`,
                      }}
                    />
                  </div>

                  <div
                    className={`mt-3 rounded-full px-4 py-1 text-sm font-bold ${item.softClass}`}
                  >
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">
                Komposisi Jalur
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Persentase pendaftar berdasarkan jalur.
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <PieChart className="h-5 w-5" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-slate-100">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    totalJalur === 0
                      ? "conic-gradient(#e2e8f0 0deg 360deg)"
                      : `conic-gradient(#2563eb 0deg ${
                          zonasiPercent * 3.6
                        }deg, #9333ea ${zonasiPercent * 3.6}deg 360deg)`,
                }}
              />

              <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Total</p>

                <p className="text-3xl font-bold text-slate-900">
                  {loading ? "..." : totalJalur}
                </p>
              </div>
            </div>

            <div className="mt-6 w-full space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-600" />

                  <span className="text-sm font-semibold text-blue-700">
                    Zonasi
                  </span>
                </div>

                <span className="text-sm font-bold text-blue-700">
                  {loading ? "..." : `${zonasi} siswa (${zonasiPercent}%)`}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-purple-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-purple-600" />

                  <span className="text-sm font-semibold text-purple-700">
                    Prestasi
                  </span>
                </div>

                <span className="text-sm font-bold text-purple-700">
                  {loading
                    ? "..."
                    : `${prestasi} siswa (${prestasiPercent}%)`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-800">Ringkasan</h2>

        <p className="mt-1 text-sm text-slate-500">
          Kondisi pendaftaran saat ini berdasarkan data yang masuk dari backend.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-xs text-blue-600">Total Jalur Aktif</p>

            <p className="mt-1 text-2xl font-bold text-blue-700">2</p>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-xs text-emerald-600">Diterima</p>

            <p className="mt-1 text-2xl font-bold text-emerald-700">
              {loading
                ? "..."
                : `${total === 0 ? 0 : Math.round((diterima / total) * 100)}%`}
            </p>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-xs text-amber-600">Perlu Dicek</p>

            <p className="mt-1 text-2xl font-bold text-amber-700">
              {loading ? "..." : `${menunggu} Data`}
            </p>
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