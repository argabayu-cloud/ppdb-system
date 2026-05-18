"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  ClipboardCheck,
  Clock3,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { emptyStats } from "@/lib/adminData";

type AdminData = {
  nama?: string;
  namaSekolah?: string;
  sekolah?: string;
  schoolName?: string;
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
  icon: React.ReactNode;
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
  const stats = emptyStats;
  const [namaSekolah, setNamaSekolah] = useState("Sekolah");

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");

    if (!storedAdmin) return;

    try {
      const admin: AdminData = JSON.parse(storedAdmin);

      setNamaSekolah(
        admin.namaSekolah ||
        admin.schoolName ||
        admin.sekolah ||
        admin.nama ||
        "Sekolah"
      );
    } catch {
      setNamaSekolah("Sekolah");
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 p-8 text-white shadow-sm">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute right-24 bottom-0 h-28 w-28 rounded-full bg-white/10" />

        <div className="relative max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            Panel Admin Sekolah
          </div>

          <h1 className="text-3xl font-bold">{namaSekolah}</h1>

          <p className="mt-3 text-sm leading-6 text-blue-100">
            Monitoring pendaftaran jalur Zonasi dan Prestasi untuk{" "}
            {namaSekolah}. Data akan otomatis terisi saat siswa mulai
            melakukan pendaftaran.
          </p>
        </div>
      </section>

      {/* CARDS */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Total Pendaftar"
          value={stats.total}
          desc="Belum ada siswa mendaftar"
          icon={<Users className="h-6 w-6" />}
        />

        <Card
          title="Menunggu"
          value={stats.menunggu}
          desc="Belum ada berkas menunggu"
          icon={<Clock3 className="h-6 w-6" />}
        />

        <Card
          title="Diterima"
          value={stats.diterima}
          desc="Belum ada siswa diterima"
          icon={<ClipboardCheck className="h-6 w-6" />}
        />

        <Card
          title="Progress"
          value={`${stats.progress}%`}
          desc="Progress verifikasi belum berjalan"
          icon={<BarChart3 className="h-6 w-6" />}
        />
      </section>

      {/* JALUR */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Jalur Zonasi
              </p>
              <h2 className="mt-2 text-4xl font-bold text-slate-900">
                {stats.zonasi}
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
                {stats.prestasi}
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

      {/* EMPTY STATE */}
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
          <Users className="h-8 w-8" />
        </div>

        <h2 className="text-lg font-bold text-slate-800">
          Belum ada pendaftar
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Data pendaftar, verifikasi, dan statistik akan otomatis muncul
          setelah siswa melakukan pendaftaran melalui sistem.
        </p>
      </section>
    </div>
  );
}