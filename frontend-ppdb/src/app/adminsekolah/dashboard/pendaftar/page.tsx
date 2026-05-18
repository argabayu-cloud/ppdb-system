"use client";

import { useEffect, useState } from "react";
import { Search, Users, Trophy, MapPin, Eye } from "lucide-react";

type Pendaftaran = {
  id: string;
  jalur: "ZONASI" | "PRESTASI";
  status: string;
  createdAt?: string;
  user?: {
    nama?: string;
    email?: string;
  };
  pilihan?: {
    jarak?: number;
    sekolah?: {
      nama?: string;
    };
  }[];
};

export default function PendaftarPage() {
  const [data, setData] = useState<Pendaftaran[]>([]);
  const [search, setSearch] = useState("");
  const [filterJalur, setFilterJalur] = useState("SEMUA");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPendaftar() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!baseUrl) return setData([]);

        const res = await fetch(`${baseUrl}/pendaftaran`, {
          cache: "no-store",
        });

        const result = await res.json();
        const list: Pendaftaran[] = result.data || result || [];

        setData(
          list.filter(
            (item) => item.jalur === "ZONASI" || item.jalur === "PRESTASI"
          )
        );
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPendaftar();
  }, []);

  const filtered = data.filter((item) => {
    const nama = item.user?.nama?.toLowerCase() || "";
    const email = item.user?.email?.toLowerCase() || "";
    const keyword = search.toLowerCase();

    const matchSearch = nama.includes(keyword) || email.includes(keyword);
    const matchJalur = filterJalur === "SEMUA" || item.jalur === filterJalur;

    return matchSearch && matchJalur;
  });

  const total = data.length;
  const zonasi = data.filter((item) => item.jalur === "ZONASI").length;
  const prestasi = data.filter((item) => item.jalur === "PRESTASI").length;

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 p-8 text-white shadow-sm">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute right-24 bottom-0 h-28 w-28 rounded-full bg-white/10" />

        <div className="relative">
          <p className="text-sm font-semibold text-blue-100">Data Pendaftar</p>
          <h1 className="mt-2 text-3xl font-bold">Pendaftar Zonasi & Prestasi</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
            Data pendaftar akan otomatis muncul setelah siswa melakukan
            pendaftaran melalui sistem.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card title="Total Pendaftar" value={loading ? "..." : total} icon={<Users className="h-6 w-6" />} />
        <Card title="Jalur Zonasi" value={loading ? "..." : zonasi} icon={<MapPin className="h-6 w-6" />} />
        <Card title="Jalur Prestasi" value={loading ? "..." : prestasi} icon={<Trophy className="h-6 w-6" />} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={filterJalur}
            onChange={(e) => setFilterJalur(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="SEMUA">Semua Jalur</option>
            <option value="ZONASI">Zonasi</option>
            <option value="PRESTASI">Prestasi</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-800">Tabel Pendaftar</h2>
          <p className="mt-1 text-sm text-slate-500">
            Menampilkan {loading ? "..." : filtered.length} data
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Memuat data pendaftar...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
              <Users className="h-8 w-8" />
            </div>

            <h3 className="font-bold text-slate-800">Belum ada pendaftar</h3>
            <p className="mt-2 text-sm text-slate-500">
              Data pendaftar jalur Zonasi dan Prestasi akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["No", "Nama", "Email", "Jalur", "Status", "Sekolah Tujuan", "Aksi"].map((head) => (
                    <th key={head} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((item, index) => (
                  <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4 text-slate-400">{index + 1}</td>
                    <td className="px-4 py-4 font-semibold text-slate-800">
                      {item.user?.nama || "Nama belum tersedia"}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {item.user?.email || "-"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${item.jalur === "ZONASI"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                          }`}
                      >
                        {item.jalur}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{item.status}</td>
                    <td className="px-4 py-4 text-slate-600">
                      {item.pilihan?.[0]?.sekolah?.nama || "-"}
                    </td>
                    <td className="px-4 py-4">
                      <a
                        href="/adminsekolah/dashboard/verifikasi"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4" />
                        Detail
                      </a>
                    </td>
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
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <h2 className="text-4xl font-bold text-slate-900">{value}</h2>
      <p className="mt-1 text-sm text-slate-500">{title}</p>
    </div>
  );
}