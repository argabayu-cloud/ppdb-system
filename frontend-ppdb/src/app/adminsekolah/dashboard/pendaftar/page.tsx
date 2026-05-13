"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
} from "lucide-react";

type Pendaftar = {
  id: number;
  nama: string;
  nisn: string;
  jalur: string;
  sekolahAsal: string;
  pilihan1: string;
  pilihan2: string;
  status: string;
  tanggal: string;
};

const dataAwal: Pendaftar[] = [
  {
    id: 1,
    nama: "Arga Bayu R",
    nisn: "1234567890",
    jalur: "Zonasi",
    sekolahAsal: "SDN 1 Bandar Lampung",
    pilihan1: "SMP Negeri 3 Bandar Lampung",
    pilihan2: "SMP Negeri 7 Bandar Lampung",
    status: "Menunggu Verifikasi",
    tanggal: "04 Mei 2025",
  },
  {
    id: 2,
    nama: "Andi Prasetyo",
    nisn: "0987654321",
    jalur: "Prestasi",
    sekolahAsal: "SDN 2 Bandar Lampung",
    pilihan1: "SMP Negeri 3 Bandar Lampung",
    pilihan2: "SMP Negeri 5 Bandar Lampung",
    status: "Terverifikasi",
    tanggal: "04 Mei 2025",
  },
  {
    id: 3,
    nama: "Ardi Setiawan",
    nisn: "1122334455",
    jalur: "Afirmasi",
    sekolahAsal: "MI Al-Hidayah",
    pilihan1: "SMP Negeri 3 Bandar Lampung",
    pilihan2: "-",
    status: "Menunggu Verifikasi",
    tanggal: "03 Mei 2025",
  },
  {
    id: 4,
    nama: "Amelia Rizki",
    nisn: "5566778899",
    jalur: "Zonasi",
    sekolahAsal: "SDN 3 Bandar Lampung",
    pilihan1: "SMP Negeri 3 Bandar Lampung",
    pilihan2: "SMP Negeri 2 Bandar Lampung",
    status: "Ditolak",
    tanggal: "03 Mei 2025",
  },
  {
    id: 5,
    nama: "Diva Permana Putra",
    nisn: "9988776655",
    jalur: "Mutasi",
    sekolahAsal: "SDN 4 Bandar Lampung",
    pilihan1: "SMP Negeri 3 Bandar Lampung",
    pilihan2: "-",
    status: "Terverifikasi",
    tanggal: "02 Mei 2025",
  },
  {
    id: 6,
    nama: "Erwin Gutawa",
    nisn: "1357924680",
    jalur: "Prestasi",
    sekolahAsal: "SDN 5 Bandar Lampung",
    pilihan1: "SMP Negeri 3 Bandar Lampung",
    pilihan2: "SMP Negeri 1 Bandar Lampung",
    status: "Menunggu Verifikasi",
    tanggal: "02 Mei 2025",
  },
  {
    id: 7,
    nama: "Putri Handayani",
    nisn: "2468013579",
    jalur: "Zonasi",
    sekolahAsal: "SDN 6 Bandar Lampung",
    pilihan1: "SMP Negeri 3 Bandar Lampung",
    pilihan2: "SMP Negeri 4 Bandar Lampung",
    status: "Terverifikasi",
    tanggal: "01 Mei 2025",
  },
];

const statusWarna: Record<string, string> = {
  "Menunggu Verifikasi": "bg-amber-100 text-amber-700 border-amber-200",
  Terverifikasi: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Ditolak: "bg-red-100 text-red-700 border-red-200",
};

const jalurWarna: Record<string, string> = {
  Zonasi: "bg-blue-100 text-blue-700 border-blue-200",
  Prestasi: "bg-purple-100 text-purple-700 border-purple-200",
  Afirmasi: "bg-green-100 text-green-700 border-green-200",
  Mutasi: "bg-orange-100 text-orange-700 border-orange-200",
};

function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200 ${className}`} />;
}

export default function PendaftarPage() {
  const [pendaftar, setPendaftar] = useState<Pendaftar[]>(dataAwal);
  const [search, setSearch] = useState("");
  const [filterJalur, setFilterJalur] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleVerifikasi = (id: number) => {
    setPendaftar((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Terverifikasi" } : item
      )
    );
  };

  const handleTolak = (id: number) => {
    setPendaftar((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Ditolak" } : item
      )
    );
  };

  const filtered = pendaftar.filter((p) => {
    const matchSearch =
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.nisn.includes(search);

    const matchJalur = filterJalur === "Semua" || p.jalur === filterJalur;
    const matchStatus = filterStatus === "Semua" || p.status === filterStatus;

    return matchSearch && matchJalur && matchStatus;
  });

  const total = pendaftar.length;
  const menunggu = pendaftar.filter(
    (p) => p.status === "Menunggu Verifikasi"
  ).length;
  const terverifikasi = pendaftar.filter(
    (p) => p.status === "Terverifikasi"
  ).length;
  const ditolak = pendaftar.filter((p) => p.status === "Ditolak").length;

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <SkeletonBox className="h-36 w-full" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBox key={i} className="h-32 w-full" />
          ))}
        </div>
        <SkeletonBox className="h-20 w-full" />
        <SkeletonBox className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 p-6 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute right-24 bottom-0 h-28 w-28 rounded-full bg-white/10" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-blue-100">
              Data Pendaftar
            </p>

            <h1 className="text-3xl font-bold tracking-tight">
              Pendaftar PPDB
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
              Pantau data siswa yang masuk dan lakukan verifikasi untuk jalur
              Zonasi serta Prestasi.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/15 px-5 py-4 backdrop-blur-sm">
            <p className="text-xs text-blue-100">Total Pendaftar</p>
            <p className="mt-1 text-3xl font-bold">{total}</p>
            <p className="mt-1 text-xs text-blue-100">Data masuk tahun ini</p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Total",
            value: total,
            icon: Users,
            style: "from-blue-500 to-blue-700 text-blue-700 bg-blue-50",
          },
          {
            label: "Menunggu",
            value: menunggu,
            icon: Clock,
            style: "from-amber-500 to-orange-600 text-amber-700 bg-amber-50",
          },
          {
            label: "Terverifikasi",
            value: terverifikasi,
            icon: CheckCircle2,
            style: "from-emerald-500 to-emerald-700 text-emerald-700 bg-emerald-50",
          },
          {
            label: "Ditolak",
            value: ditolak,
            icon: XCircle,
            style: "from-red-500 to-red-700 text-red-700 bg-red-50",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${item.style
                  .split(" ")
                  .slice(2)
                  .join(" ")}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <h2 className="mt-1 text-3xl font-bold text-slate-800">
                {item.value}
              </h2>
              <p className="mt-1 text-xs text-slate-400">Data PPDB sekolah</p>
            </div>
          );
        })}
      </section>

      {/* FILTER */}
      <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau NISN..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <Filter className="h-5 w-5 text-slate-400" />
            <select
              value={filterJalur}
              onChange={(e) => setFilterJalur(e.target.value)}
              className="bg-white text-sm outline-none"
            >
              <option value="Semua">Semua Jalur</option>
              <option>Zonasi</option>
              <option>Prestasi</option>
              <option>Afirmasi</option>
              <option>Mutasi</option>
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="Semua">Semua Status</option>
            <option>Menunggu Verifikasi</option>
            <option>Terverifikasi</option>
            <option>Ditolak</option>
          </select>
        </div>
      </section>

      {/* TABLE */}
      <section className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-b from-white to-slate-50 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-800">Tabel Pendaftar</h2>
            <p className="mt-1 text-xs text-slate-400">
              Menampilkan {filtered.length} dari {total} data
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-blue-50/70">
              <tr>
                {[
                  "No",
                  "Nama",
                  "NISN",
                  "Jalur",
                  "Sekolah Asal",
                  "Pilihan 1",
                  "Status",
                  "Tanggal",
                  "Aksi",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-600"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-12 text-center text-sm text-slate-400"
                  >
                    Tidak ada data yang ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => {
                  const bisaVerifikasi =
                    p.jalur === "Zonasi" || p.jalur === "Prestasi";

                  return (
                    <tr
                      key={p.id}
                      className="border-b border-slate-100 transition-colors hover:bg-blue-50/40"
                    >
                      <td className="px-4 py-4 text-slate-400">{i + 1}</td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm">
                            {p.nama
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {p.nama}
                            </p>
                            <p className="text-xs text-slate-400">
                              Pilihan 2: {p.pilihan2}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 font-mono text-xs text-slate-600">
                        {p.nisn}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${jalurWarna[p.jalur]}`}
                        >
                          {p.jalur}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-600">
                        {p.sekolahAsal}
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-600">
                        {p.pilihan1}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${statusWarna[p.status]}`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-400">
                        {p.tanggal}
                      </td>

                      <td className="px-4 py-4">
                        {bisaVerifikasi ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleVerifikasi(p.id)}
                              className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 px-3 py-2 text-xs font-semibold text-white shadow-md transition hover:opacity-90"
                            >
                              Verifikasi
                            </button>

                            <button
                              onClick={() => handleTolak(p.id)}
                              className="rounded-xl bg-gradient-to-r from-red-500 to-red-700 px-3 py-2 text-xs font-semibold text-white shadow-md transition hover:opacity-90"
                            >
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-500">
                            Tidak tersedia
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}