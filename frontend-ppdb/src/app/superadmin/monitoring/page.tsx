"use client";

import {
  Eye,
  Search,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

export default function MonitoringSuperAdminPage() {
  const data: {
    nama: string;
    sekolah: string;
    jalur: "ZONASI" | "PRESTASI";
    status: string;
  }[] = [];

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-slate-950 p-8 text-white shadow-sm">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute right-24 bottom-0 h-28 w-28 rounded-full bg-white/10" />

        <div className="relative">
          <p className="text-sm font-semibold text-blue-100">Monitoring</p>

          <h1 className="mt-2 text-3xl font-bold">
            Monitoring Zonasi & Prestasi
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
            Pantau seluruh pendaftar dari jalur Zonasi dan Prestasi di semua
            sekolah.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card title="Total Pendaftar" value="0" icon={<Users />} />
        <Card title="Jalur Zonasi" value="0" icon={<ShieldCheck />} />
        <Card title="Jalur Prestasi" value="0" icon={<Trophy />} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            placeholder="Cari nama siswa, sekolah, atau jalur..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="font-bold text-slate-900">Data Monitoring</h2>
          <p className="mt-1 text-sm text-slate-500">
            Tabel pendaftar jalur Zonasi dan Prestasi dari seluruh sekolah.
          </p>
        </div>

        {data.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
              <Users className="h-8 w-8" />
            </div>

            <h3 className="font-bold text-slate-800">
              Belum ada data pendaftar
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Data pendaftar dari seluruh sekolah akan muncul di sini setelah
              siswa melakukan pendaftaran.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["No", "Nama", "Sekolah", "Jalur", "Status", "Aksi"].map(
                    (head) => (
                      <th
                        key={head}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-500"
                      >
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={`${item.nama}-${index}`}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 text-slate-400">{index + 1}</td>

                    <td className="px-4 py-4 font-semibold text-slate-800">
                      {item.nama}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {item.sekolah}
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

                    <td className="px-4 py-4 text-slate-600">
                      {item.status}
                    </td>

                    <td className="px-4 py-4">
                      <button className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100">
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
    </div>
  );
}

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h2 className="text-4xl font-bold text-slate-900">{value}</h2>
      <p className="mt-1 text-sm text-slate-500">{title}</p>
    </div>
  );
}