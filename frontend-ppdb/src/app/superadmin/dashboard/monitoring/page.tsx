"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  ClipboardCheck,
  Eye,
  Loader2,
  MapPinned,
  Medal,
  RefreshCw,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  getSuperAdminPendaftaran,
  validasiFinalSuperAdmin,
} from "@/lib/api";

type Jalur = "ZONASI" | "PRESTASI";
type StatusFinal = "DITERIMA" | "DITOLAK";

type Sekolah = {
  id: string;
  nama: string;
};

type User = {
  id: string;
  nama: string;
  email: string;
  noTlpn?: string | null;
};

type Pilihan = {
  id: string;
  pilihanKe: number;
  status: string;
  jarak?: number | null;
  alasanPenolakan?: string | null;
  sekolah?: Sekolah | null;
};

type HasilSeleksi = {
  id: string;
  statusFinal: StatusFinal;
  catatan?: string | null;
  sekolah?: Sekolah | null;
};

type Pendaftaran = {
  id: string;
  jalur: Jalur;
  status: string;
  noPendaftaran?: string | null;
  nisn?: string | null;
  namaSekolahAsal?: string | null;
  jenisPrestasi?: string | null;
  tingkatPrestasi?: string | null;
  submittedAt?: string | null;
  user?: User | null;
  pilihan?: Pilihan[];
  hasil?: HasilSeleksi | null;
};

type ApiListResponse<T> = T[] | { data?: T[] };

function unwrapList<T>(res: ApiListResponse<T>): T[] {
  return Array.isArray(res) ? res : res.data || [];
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getPrimarySchool(item: Pendaftaran) {
  const pilihanUtama = item.pilihan
    ?.slice()
    .sort((a, b) => a.pilihanKe - b.pilihanKe)[0];

  return item.hasil?.sekolah?.nama || pilihanUtama?.sekolah?.nama || "-";
}

export default function MonitoringSuperAdminPage() {
  const [data, setData] = useState<Pendaftaran[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Pendaftaran | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getSuperAdminPendaftaran();
      setData(unwrapList<Pendaftaran>(res));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data monitoring super admin",
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
    const zonasi = data.filter((item) => item.jalur === "ZONASI").length;
    const prestasi = data.filter((item) => item.jalur === "PRESTASI").length;
    const tervalidasi = data.filter((item) => Boolean(item.hasil)).length;

    return {
      total: data.length,
      zonasi,
      prestasi,
      tervalidasi,
    };
  }, [data]);

  const filteredData = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return data;

    return data.filter((item) => {
      const searchable = [
        item.user?.nama,
        item.user?.email,
        item.noPendaftaran,
        item.nisn,
        item.jalur,
        item.status,
        getPrimarySchool(item),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [data, query]);

  const handleValidasiFinal = async (
    pendaftaranId: string,
    status: StatusFinal,
  ) => {
    try {
      setProcessingId(`${pendaftaranId}-${status}`);
      await validasiFinalSuperAdmin({ pendaftaranId, status });
      await loadData();
      setSelected((current) =>
        current?.id === pendaftaranId
          ? {
              ...current,
              hasil: {
                id: current.hasil?.id || pendaftaranId,
                statusFinal: status,
                sekolah: current.hasil?.sekolah || null,
              },
            }
          : current,
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal validasi final");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-44 animate-pulse rounded-3xl bg-slate-100" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="h-32 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-32 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-32 animate-pulse rounded-3xl bg-slate-100" />
        </div>
        <div className="h-80 animate-pulse rounded-3xl bg-slate-100" />
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
              <ClipboardCheck className="h-4 w-4" />
              Monitoring Pendaftar
            </div>

            <h1 className="text-3xl font-bold">Monitoring Zonasi & Prestasi</h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
              Pantau data pendaftar dari seluruh sekolah khusus jalur Zonasi dan
              Prestasi secara terpusat.
            </p>
          </div>

          <button
            onClick={loadData}
            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
        </div>
      </section>

      {error ? (
        <section className="flex items-start gap-3 rounded-3xl border border-red-100 bg-red-50 p-5 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <h2 className="font-bold">Gagal memuat data</h2>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <Card title="Total Pendaftar" value={stats.total} icon={<UserRound />} />
        <Card title="Jalur Zonasi" value={stats.zonasi} icon={<MapPinned />} />
        <Card title="Jalur Prestasi" value={stats.prestasi} icon={<Medal />} />
        <Card title="Sudah Diseleksi" value={stats.tervalidasi} icon={<BadgeCheck />} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama siswa, sekolah, no pendaftaran, NISN, atau jalur..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-bold text-slate-900">Data Monitoring</h2>
            <p className="mt-1 text-sm text-slate-500">
              Menampilkan {filteredData.length} dari {data.length} pendaftar.
            </p>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
              <ClipboardCheck className="h-8 w-8" />
            </div>

            <h3 className="font-bold text-slate-800">
              {query ? "Data tidak ditemukan" : "Belum ada data pendaftar"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {query
                ? "Coba gunakan kata kunci lain."
                : "Data pendaftar dari seluruh sekolah akan muncul di sini setelah siswa melakukan pendaftaran jalur Zonasi atau Prestasi."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["No", "Peserta", "Sekolah", "Jalur", "Status", "Final", "Aksi"].map(
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
                {filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 text-slate-400">{index + 1}</td>

                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-800">
                        {item.user?.nama || "-"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.noPendaftaran || "Belum ada nomor"} · NISN {item.nisn || "-"}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {getPrimarySchool(item)}
                    </td>

                    <td className="px-4 py-4">
                      <JalurBadge jalur={item.jalur} />
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-4 py-4">
                      <FinalBadge status={item.hasil?.statusFinal} />
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelected(item)}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4" />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selected ? (
        <DetailPanel
          item={selected}
          processingId={processingId}
          onClose={() => setSelected(null)}
          onValidasi={handleValidasiFinal}
        />
      ) : null}
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

function JalurBadge({ jalur }: { jalur: Jalur }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        jalur === "ZONASI"
          ? "bg-blue-100 text-blue-700"
          : "bg-purple-100 text-purple-700"
      }`}
    >
      {jalur}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      {status.replaceAll("_", " ")}
    </span>
  );
}

function FinalBadge({ status }: { status?: StatusFinal }) {
  if (!status) {
    return (
      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        BELUM FINAL
      </span>
    );
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        status === "DITERIMA"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}

function DetailPanel({
  item,
  processingId,
  onClose,
  onValidasi,
}: {
  item: Pendaftaran;
  processingId: string | null;
  onClose: () => void;
  onValidasi: (pendaftaranId: string, status: StatusFinal) => void;
}) {
  const sekolahPilihan = item.pilihan?.slice().sort((a, b) => a.pilihanKe - b.pilihanKe) || [];

  return (
    <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
            Detail Pendaftaran
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {item.user?.nama || "-"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {item.noPendaftaran || "Belum ada nomor"} · {item.user?.email || "-"}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-fit rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
        >
          Tutup
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <InfoCard label="NISN" value={item.nisn || "-"} />
        <InfoCard label="Jalur" value={item.jalur} />
        <InfoCard label="Tanggal Submit" value={formatDate(item.submittedAt)} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <h3 className="font-bold text-slate-900">Pilihan Sekolah</h3>
          <div className="mt-4 space-y-3">
            {sekolahPilihan.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada pilihan sekolah.</p>
            ) : (
              sekolahPilihan.map((pilihan) => (
                <div
                  key={pilihan.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-800">
                      Pilihan {pilihan.pilihanKe}: {pilihan.sekolah?.nama || "-"}
                    </p>
                    <StatusBadge status={pilihan.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Jarak: {pilihan.jarak ? `${pilihan.jarak.toFixed(2)} km` : "-"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <h3 className="font-bold text-slate-900">Validasi Final Super Admin</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Status final saat ini: <strong>{item.hasil?.statusFinal || "BELUM FINAL"}</strong>
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Sekolah diterima: {item.hasil?.sekolah?.nama || "-"}
          </p>
          {!item.hasil ? (
            <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
              Pendaftar ini belum diseleksi admin sekolah, jadi validasi final
              belum bisa dilakukan.
            </p>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => onValidasi(item.id, "DITERIMA")}
              disabled={!item.hasil || processingId === `${item.id}-DITERIMA`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processingId === `${item.id}-DITERIMA` ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BadgeCheck className="h-4 w-4" />
              )}
              Terima Final
            </button>

            <button
              onClick={() => onValidasi(item.id, "DITOLAK")}
              disabled={!item.hasil || processingId === `${item.id}-DITOLAK`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processingId === `${item.id}-DITOLAK` ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Tolak Final
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 font-bold text-slate-800">{value}</p>
    </div>
  );
}
