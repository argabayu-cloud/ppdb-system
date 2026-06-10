"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChartColumnBig,
  ClipboardCheck,
  LayoutDashboard,
  Medal,
  School,
  UserRound,
} from "lucide-react";

import { getSekolah, getSuperAdminPendaftaran } from "@/lib/api";

type Jalur = "ZONASI" | "PRESTASI";

type Pendaftaran = {
  id: string;
  jalur: Jalur;
  hasil?: {
    statusFinal?: "DITERIMA" | "DITOLAK";
  } | null;
};

type ApiListResponse<T> = T[] | { data?: T[] };

function unwrapList<T>(res: ApiListResponse<T>): T[] {
  return Array.isArray(res) ? res : res.data || [];
}

export default function DashboardSuperAdminPage() {
  const [pendaftaran, setPendaftaran] = useState<Pendaftaran[]>([]);
  const [totalSekolah, setTotalSekolah] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const pendaftaranRes = await getSuperAdminPendaftaran();
      setPendaftaran(unwrapList<Pendaftaran>(pendaftaranRes));

      try {
        const sekolahRes = await getSekolah();
        setTotalSekolah(unwrapList(sekolahRes).length);
      } catch {
        setTotalSekolah(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const zonasi = pendaftaran.filter((item) => item.jalur === "ZONASI").length;
    const prestasi = pendaftaran.filter(
      (item) => item.jalur === "PRESTASI",
    ).length;
    const tervalidasi = pendaftaran.filter((item) =>
      Boolean(item.hasil?.statusFinal),
    ).length;

    return {
      totalSekolah,
      zonasi,
      prestasi,
      tervalidasi,
      hasData: pendaftaran.length > 0,
    };
  }, [pendaftaran, totalSekolah]);

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-slate-950 p-8 text-white shadow-sm">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute bottom-0 right-24 h-28 w-28 rounded-full bg-white/10" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard Super Admin
          </div>

          <h1 className="text-3xl font-bold">
            Monitoring PPDB Zonasi & Prestasi
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
            Pantau ringkasan data sekolah, pendaftar, verifikasi, dan statistik
            PPDB secara terpusat.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Total Sekolah"
          value={loading ? "..." : stats.totalSekolah}
          icon={<School />}
        />
        <Card
          title="Pendaftar Zonasi"
          value={loading ? "..." : stats.zonasi}
          icon={<UserRound />}
        />
        <Card
          title="Pendaftar Prestasi"
          value={loading ? "..." : stats.prestasi}
          icon={<Medal />}
        />
        <Card
          title="Terverifikasi"
          value={loading ? "..." : stats.tervalidasi}
          icon={<BadgeCheck />}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <QuickCard
          title="Monitoring Pendaftar"
          desc="Lihat data pendaftar jalur Zonasi dan Prestasi dari seluruh sekolah."
          href="/superadmin/dashboard/monitoring"
          icon={<ClipboardCheck className="h-7 w-7" />}
        />

        <QuickCard
          title="Statistik Kuota"
          desc="Lihat perkembangan statistik PPDB berdasarkan jalur dan sekolah."
          href="/superadmin/dashboard/statistik"
          icon={<ChartColumnBig className="h-7 w-7" />}
        />
      </section>

      {!loading && !stats.hasData && (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
            <ClipboardCheck className="h-8 w-8" />
          </div>

          <h2 className="font-bold text-slate-800">
            Belum ada data monitoring
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Data akan otomatis muncul setelah sekolah memiliki pendaftar jalur
            Zonasi atau Prestasi.
          </p>
        </section>
      )}
    </div>
  );
}

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h2 className="text-4xl font-bold text-slate-900">{value}</h2>
      <p className="mt-1 text-sm text-slate-500">{title}</p>
    </div>
  );
}

function QuickCard({
  title,
  desc,
  href,
  icon,
}: {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h2 className="font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>

      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
        Buka halaman
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}