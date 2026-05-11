"use client";

import { useEffect, useState } from "react";

const dataPendaftar = [
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
  "Menunggu Verifikasi": "bg-amber-100 text-amber-700",
  Terverifikasi: "bg-green-100 text-green-700",
  Ditolak: "bg-red-100 text-red-600",
  Ditunda: "bg-slate-100 text-slate-600",
};

const jalurWarna: Record<string, string> = {
  Zonasi: "bg-blue-100 text-blue-700",
  Prestasi: "bg-purple-100 text-purple-700",
  Afirmasi: "bg-green-100 text-green-700",
  Mutasi: "bg-orange-100 text-orange-700",
};

function SkeletonBox({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 ${className}`}
    />
  );
}

export default function PendaftarPage() {
  const [search, setSearch] = useState("");
  const [filterJalur, setFilterJalur] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const filtered = dataPendaftar.filter((p) => {
    const matchSearch =
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.nisn.includes(search);

    const matchJalur =
      filterJalur === "Semua" || p.jalur === filterJalur;

    const matchStatus =
      filterStatus === "Semua" || p.status === filterStatus;

    return matchSearch && matchJalur && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <SkeletonBox className="h-7 w-56" />
          <SkeletonBox className="h-4 w-80" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow p-4 flex items-center gap-3"
            >
              <SkeletonBox className="w-10 h-10 rounded-xl" />

              <div className="flex flex-col gap-2 flex-1">
                <SkeletonBox className="h-4 w-20" />
                <SkeletonBox className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>

        {/* Filter Skeleton */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row gap-3">
          <SkeletonBox className="h-11 flex-1" />
          <SkeletonBox className="h-11 w-full sm:w-44" />
          <SkeletonBox className="h-11 w-full sm:w-44" />
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="grid grid-cols-6 gap-4"
              >
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          📋 Daftar Pendaftar
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Daftar seluruh siswa yang mendaftar ke sekolah kamu.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Pendaftar",
            value: dataPendaftar.length,
            color: "bg-blue-500",
          },
          {
            label: "Menunggu",
            value: dataPendaftar.filter(
              (p) => p.status === "Menunggu Verifikasi"
            ).length,
            color: "bg-amber-500",
          },
          {
            label: "Terverifikasi",
            value: dataPendaftar.filter(
              (p) => p.status === "Terverifikasi"
            ).length,
            color: "bg-green-500",
          },
          {
            label: "Ditolak",
            value: dataPendaftar.filter(
              (p) => p.status === "Ditolak"
            ).length,
            color: "bg-red-500",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl shadow p-4 flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-white font-bold`}
            >
              {s.value}
            </div>

            <p className="text-xs text-slate-600 font-medium">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Cari nama atau NISN..."
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        />

        <select
          value={filterJalur}
          onChange={(e) => setFilterJalur(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
        >
          <option value="Semua">Semua Jalur</option>
          <option>Zonasi</option>
          <option>Prestasi</option>
          <option>Afirmasi</option>
          <option>Mutasi</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
        >
          <option value="Semua">Semua Status</option>
          <option>Menunggu Verifikasi</option>
          <option>Terverifikasi</option>
          <option>Ditolak</option>
          <option>Ditunda</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold">
                  No
                </th>
                <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold">
                  Nama
                </th>
                <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold">
                  NISN
                </th>
                <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold">
                  Jalur
                </th>
                <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold">
                  Sekolah Asal
                </th>
                <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold">
                  Pilihan 1
                </th>
                <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold">
                  Tanggal
                </th>
                <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-10 text-slate-400 text-sm"
                  >
                    Tidak ada data yang ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-400">
                      {i + 1}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {p.nama}
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                      {p.nisn}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${jalurWarna[p.jalur]}`}
                      >
                        {p.jalur}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {p.sekolahAsal}
                    </td>

                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {p.pilihan1}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${statusWarna[p.status]}`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {p.tanggal}
                    </td>

                    <td className="py-3 px-4">
                      <a
                        href={`/adminsekolah/verifikasi`}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Detail
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Menampilkan {filtered.length} dari{" "}
            {dataPendaftar.length} pendaftar
          </p>
        </div>
      </div>
    </div>
  );
}