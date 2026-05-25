"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  ChartColumnBig,
  ClipboardCheck,
  Loader2,
  MapPinned,
  Medal,
  RefreshCw,
  School,
  UserRound,
} from "lucide-react";
import {
  getSekolah,
  getSuperAdminPendaftaran,
  type Sekolah as SekolahApi,
} from "@/lib/api";

type Jalur = "ZONASI" | "PRESTASI";
type StatusFinal = "DITERIMA" | "DITOLAK";

type Sekolah = Pick<SekolahApi, "id" | "nama">;

type User = {
  id: string;
  nama: string;
  email: string;
};

type Pilihan = {
  id: string;
  pilihanKe: number;
  status: string;
  sekolah?: Sekolah | null;
};

type HasilSeleksi = {
  id: string;
  statusFinal: StatusFinal;
  sekolah?: Sekolah | null;
};

type Pendaftaran = {
  id: string;
  jalur: Jalur;
  status: string;
  noPendaftaran?: string | null;
  user?: User | null;
  pilihan?: Pilihan[];
  hasil?: HasilSeleksi | null;
};

type ApiListResponse<T> = T[] | { data?: T[] };

type SchoolStat = {
  id: string;
  nama: string;
  total: number;
  zonasi: number;
  prestasi: number;
  diterima: number;
  ditolak: number;
};

function unwrapList<T>(res: ApiListResponse<T>): T[] {
  return Array.isArray(res) ? res : res.data || [];
}

function percent(value: number, total: number) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

function getPrimarySchool(item: Pendaftaran) {
  const pilihanUtama = item.pilihan
    ?.slice()
    .sort((a, b) => a.pilihanKe - b.pilihanKe)[0];

  return item.hasil?.sekolah || pilihanUtama?.sekolah || null;
}

export default function StatistikKotaPage() {
  const [pendaftaran, setPendaftaran] = useState<Pendaftaran[]>([]);
  const [sekolah, setSekolah] = useState<Sekolah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const pendaftaranRes = await getSuperAdminPendaftaran();
      setPendaftaran(unwrapList<Pendaftaran>(pendaftaranRes));

      try {
        const sekolahRes = await getSekolah();
        setSekolah(unwrapList<Sekolah>(sekolahRes));
      } catch {
        setSekolah([]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data statistik super admin",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const zonasi = pendaftaran.filter((item) => item.jalur === "ZONASI").length;
    const prestasi = pendaftaran.filter((item) => item.jalur === "PRESTASI").length;
    const diterima = pendaftaran.filter(
      (item) => item.hasil?.statusFinal === "DITERIMA",
    ).length;
    const ditolak = pendaftaran.filter(
      (item) => item.hasil?.statusFinal === "DITOLAK",
    ).length;
    const belumFinal = pendaftaran.length - diterima - ditolak;

    const map = new Map<string, SchoolStat>();

    sekolah.forEach((item) => {
      map.set(item.id, {
        id: item.id,
        nama: item.nama,
        total: 0,
        zonasi: 0,
        prestasi: 0,
        diterima: 0,
        ditolak: 0,
      });
    });

    pendaftaran.forEach((item) => {
      const school = getPrimarySchool(item);
      const id = school?.id || "unknown";
      const current =
        map.get(id) ||
        ({
          id,
          nama: school?.nama || "Belum ada sekolah",
          total: 0,
          zonasi: 0,
          prestasi: 0,
          diterima: 0,
          ditolak: 0,
        } satisfies SchoolStat);

      current.total += 1;
      if (item.jalur === "ZONASI") current.zonasi += 1;
      if (item.jalur === "PRESTASI") current.prestasi += 1;
      if (item.hasil?.statusFinal === "DITERIMA") current.diterima += 1;
      if (item.hasil?.statusFinal === "DITOLAK") current.ditolak += 1;

      map.set(id, current);
    });

    return {
      totalSekolah: sekolah.length || map.size,
      totalPendaftar: pendaftaran.length,
      zonasi,
      prestasi,
      diterima,
      ditolak,
      belumFinal,
      zonasiPercent: percent(zonasi, pendaftaran.length),
      prestasiPercent: percent(prestasi, pendaftaran.length),
      diterimaPercent: percent(diterima, pendaftaran.length),
      ditolakPercent: percent(ditolak, pendaftaran.length),
      belumFinalPercent: percent(belumFinal, pendaftaran.length),
      schoolStats: Array.from(map.values())
        .filter((item) => item.total > 0)
        .sort((a, b) => b.total - a.total),
    };
  }, [pendaftaran, sekolah]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-44 animate-pulse rounded-3xl bg-slate-100" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-32 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-32 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-32 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-32 animate-pulse rounded-3xl bg-slate-100" />
        </div>
        <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-slate-950 p-8 text-white shadow-sm">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute right-24 bottom-0 h-28 w-28 rounded-full bg-white/10" />

        <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              <ChartColumnBig className="h-4 w-4" />
              Statistik Kota
            </div>

            <h1 className="text-3xl font-bold">
              Statistik PPDB Zonasi & Prestasi
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
              Pantau perkembangan pendaftaran, jalur, dan validasi final dari
              seluruh sekolah.
            </p>
          </div>

          <button
            onClick={loadData}
            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Statistik
          </button>
        </div>
      </section>

      {error ? (
        <section className="flex items-start gap-3 rounded-3xl border border-red-100 bg-red-50 p-5 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <h2 className="font-bold">Gagal memuat statistik</h2>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total Sekolah" value={stats.totalSekolah} icon={<School />} />
        <Card title="Total Pendaftar" value={stats.totalPendaftar} icon={<UserRound />} />
        <Card title="Zonasi" value={stats.zonasi} icon={<MapPinned />} />
        <Card title="Prestasi" value={stats.prestasi} icon={<Medal />} />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <PanelHeader
            title="Distribusi Jalur"
            desc="Perbandingan pendaftar Zonasi dan Prestasi."
            icon={<ChartColumnBig className="h-6 w-6" />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <div className="mt-6 space-y-5">
            <Progress label="Zonasi" value={stats.zonasiPercent} count={stats.zonasi} color="bg-blue-600" />
            <Progress label="Prestasi" value={stats.prestasiPercent} count={stats.prestasi} color="bg-purple-600" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <PanelHeader
            title="Status Validasi Final"
            desc="Ringkasan keputusan final super admin."
            icon={<ClipboardCheck className="h-6 w-6" />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <div className="mt-6 space-y-4">
            <StatusCard
              title="Diterima Final"
              value={stats.diterima}
              percent={stats.diterimaPercent}
              icon={<BadgeCheck />}
              bg="bg-emerald-50"
              text="text-emerald-700"
            />

            <StatusCard
              title="Ditolak Final"
              value={stats.ditolak}
              percent={stats.ditolakPercent}
              icon={<AlertCircle />}
              bg="bg-red-50"
              text="text-red-700"
            />

            <StatusCard
              title="Belum Final"
              value={stats.belumFinal}
              percent={stats.belumFinalPercent}
              icon={<Loader2 />}
              bg="bg-amber-50"
              text="text-amber-700"
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="font-bold text-slate-900">Statistik Sekolah</h2>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan statistik pendaftaran per sekolah.
          </p>
        </div>

        {stats.schoolStats.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
              <School className="h-8 w-8" />
            </div>

            <h3 className="font-bold text-slate-800">
              Belum ada statistik sekolah
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Statistik akan otomatis tampil ketika sekolah sudah memiliki data
              pendaftar.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["No", "Sekolah", "Total", "Zonasi", "Prestasi", "Diterima", "Ditolak"].map(
                    (head) => (
                      <th
                        key={head}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-500"
                      >
                        {head}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {stats.schoolStats.map((item, index) => (
                  <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4 text-slate-400">{index + 1}</td>
                    <td className="px-4 py-4 font-semibold text-slate-800">{item.nama}</td>
                    <td className="px-4 py-4 text-slate-700">{item.total}</td>
                    <td className="px-4 py-4 text-blue-700">{item.zonasi}</td>
                    <td className="px-4 py-4 text-purple-700">{item.prestasi}</td>
                    <td className="px-4 py-4 text-emerald-700">{item.diterima}</td>
                    <td className="px-4 py-4 text-red-700">{item.ditolak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
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

function PanelHeader({
  title,
  desc,
  icon,
  iconClass,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{desc}</p>
      </div>

      <div className={`rounded-2xl p-3 ${iconClass}`}>{icon}</div>
    </div>
  );
}

function Progress({
  label,
  value,
  count,
  color,
}: {
  label: string;
  value: number;
  count: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-bold text-slate-800">
          {count} pendaftar · {value}%
        </span>
      </div>

      <div className="h-3 rounded-full bg-slate-100">
        <div
          className={`h-3 rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function StatusCard({
  title,
  value,
  percent: valuePercent,
  icon,
  bg,
  text,
}: {
  title: string;
  value: number;
  percent: number;
  icon: React.ReactNode;
  bg: string;
  text: string;
}) {
  return (
    <div className={`flex items-center justify-between rounded-2xl p-5 ${bg}`}>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h2 className={`mt-2 text-3xl font-bold ${text}`}>{value}</h2>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          {valuePercent}% dari total pendaftar
        </p>
      </div>

      <div className={text}>{icon}</div>
    </div>
  );
}
