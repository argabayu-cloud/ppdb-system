"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  ClipboardCheck,
  Clock3,
  Sparkles,
  Trophy,
  Users,
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
  stats?: Stats;
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

function Card({
  title,
  value,
  desc,
  icon,
}: {
  title: string;
  value: string | number;
  desc: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h2 className="mt-3 text-4xl font-bold text-slate-900">{value}</h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>

      <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-500">
        {desc}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [namaSekolah, setNamaSekolah] = useState("Sekolah");
  const [stats, setStats] = useState<Stats>(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getDashboardAdmin();
        const data: DashboardAdminResponse = res.data;

        setStats(data.stats || initialStats);
        setNamaSekolah(data.sekolah?.nama || "Sekolah");
      } catch (error) {
        console.error(error);
        setStats(initialStats);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 p-8 text-white shadow-sm">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute bottom-0 right-24 h-28 w-28 rounded-full bg-white/10" />

        <div className="relative max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            Panel Admin Sekolah
          </div>

          <h1 className="text-3xl font-bold">
            {loading ? "Memuat data sekolah..." : namaSekolah}
          </h1>

          <p className="mt-3 text-sm leading-6 text-blue-100">
            Monitoring pendaftaran jalur Zonasi dan Prestasi untuk{" "}
            {namaSekolah}. Statistik ini dihitung dari data pendaftar sekolah
            admin yang sedang login.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Total Pendaftar"
          value={loading ? "..." : stats.total}
          desc={
            stats.total > 0
              ? "Total peserta yang sudah mengirim pendaftaran"
              : "Belum ada siswa mendaftar"
          }
          icon={<Users className="h-6 w-6" />}
        />

        <Card
          title="Menunggu"
          value={loading ? "..." : stats.menunggu}
          desc={
            stats.menunggu > 0
              ? "Pendaftar yang masih perlu diverifikasi"
              : "Belum ada berkas menunggu"
          }
          icon={<Clock3 className="h-6 w-6" />}
        />

        <Card
          title="Diterima"
          value={loading ? "..." : stats.diterima}
          desc={
            stats.diterima > 0
              ? "Peserta yang sudah diterima"
              : "Belum ada siswa diterima"
          }
          icon={<ClipboardCheck className="h-6 w-6" />}
        />

        <Card
          title="Progress"
          value={loading ? "..." : `${stats.progress}%`}
          desc={
            stats.progress > 0
              ? "Progress seleksi diterima dan ditolak"
              : "Progress verifikasi belum berjalan"
          }
          icon={<BarChart3 className="h-6 w-6" />}
        />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Jalur Zonasi
              </p>
              <h2 className="mt-2 text-4xl font-bold text-slate-900">
                {loading ? "..." : stats.zonasi}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Berdasarkan jarak domisili siswa.
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Users className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-600">
                Jalur Prestasi
              </p>
              <h2 className="mt-2 text-4xl font-bold text-slate-900">
                {loading ? "..." : stats.prestasi}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Berdasarkan nilai rapor dan prestasi.
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Trophy className="h-7 w-7" />
            </div>
          </div>
        </div>
      </section>

      {stats.total === 0 && !loading && (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
            <Users className="h-8 w-8" />
          </div>

          <h2 className="text-lg font-bold text-slate-800">
            Belum ada pendaftar
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Data pendaftar, verifikasi, dan statistik akan otomatis muncul
            setelah siswa menyelesaikan pendaftaran dan mengirim berkas.
          </p>
        </section>
      )}
    </div>
  );
}