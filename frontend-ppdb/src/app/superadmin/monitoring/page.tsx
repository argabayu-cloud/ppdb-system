"use client";

import { useEffect, useState } from "react";

import NavbarSuperAdmin from "@/components/navbarSuperAdmin";
import SidebarSuperAdmin from "@/components/sidebarSuperAdmin";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";

const dataMonitoring = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  nama: `SMP Negeri ${i + 1} Bandar Lampung`,
  kuota: 100 + (i % 3) * 20,
  pendaftar: 80 + i * 5,
  terverifikasi: 50 + i * 3,
  menunggu: 20 + i,
  ditolak: 10 + i,
  zonasi: 30 + i * 2,
  prestasi: 20 + i,
  afirmasi: 15 + i,
  domisili: 10 + i,
}));

export default function MonitoringPage() {
  const [search, setSearch] = useState("");
  const [filterJalur, setFilterJalur] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterJalur]);

  const filtered = dataMonitoring.filter((s) =>
    s.nama.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const totalPage = Math.max(1, Math.ceil(filtered.length / itemPerPage));

  const startIndex = (currentPage - 1) * itemPerPage;
  const endIndex = currentPage * itemPerPage;

  const paginated = filtered.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-slate-100">
      <NavbarSuperAdmin />

      <div className="flex">
        <SidebarSuperAdmin />

        <main className="flex-1 p-6 mt-16 ml-64">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                📡 Monitoring PPDB
              </h1>

              <p className="text-slate-500 text-sm mt-1">
                Pantau perkembangan PPDB di seluruh sekolah secara real-time.
              </p>
            </div>

            {isLoading ? (
              <MonitoringSkeleton />
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Pendaftar",
                      value: dataMonitoring.reduce(
                        (a, s) => a + s.pendaftar,
                        0,
                      ),
                      color: "bg-blue-500",
                      icon: "👥",
                    },
                    {
                      label: "Terverifikasi",
                      value: dataMonitoring.reduce(
                        (a, s) => a + s.terverifikasi,
                        0,
                      ),
                      color: "bg-green-500",
                      icon: "✅",
                    },
                    {
                      label: "Menunggu",
                      value: dataMonitoring.reduce(
                        (a, s) => a + s.menunggu,
                        0,
                      ),
                      color: "bg-amber-500",
                      icon: "⏳",
                    },
                    {
                      label: "Ditolak",
                      value: dataMonitoring.reduce(
                        (a, s) => a + s.ditolak,
                        0,
                      ),
                      color: "bg-red-500",
                      icon: "❌",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-white rounded-2xl shadow p-5 flex flex-col gap-2"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl`}
                      >
                        {s.icon}
                      </div>

                      <p className="text-2xl font-bold text-slate-800">
                        {s.value}
                      </p>

                      <p className="text-xs text-slate-500">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl shadow p-4 flex gap-3">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 Cari sekolah..."
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />

                  <select
                    value={filterJalur}
                    onChange={(e) => setFilterJalur(e.target.value)}
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-all"
                  >
                    <option>Semua</option>
                    <option>Zonasi</option>
                    <option>Prestasi</option>
                    <option>Afirmasi</option>
                    <option>Domisili</option>
                  </select>
                </div>

                <div className="bg-white rounded-2xl shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold">
                            Sekolah
                          </th>
                          <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">
                            Kuota
                          </th>
                          <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">
                            Pendaftar
                          </th>
                          <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">
                            Terverifikasi
                          </th>
                          <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">
                            Menunggu
                          </th>
                          <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">
                            Ditolak
                          </th>
                          <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">
                            % Terisi
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginated.map((s) => {
                          const persen = Math.round(
                            (s.terverifikasi / s.kuota) * 100,
                          );

                          return (
                            <tr
                              key={s.id}
                              className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                            >
                              <td className="py-3 px-4 font-medium text-slate-800 text-xs">
                                {s.nama}
                              </td>

                              <td className="py-3 px-4 text-center text-slate-600">
                                {s.kuota}
                              </td>

                              <td className="py-3 px-4 text-center font-bold text-blue-600">
                                {s.pendaftar}
                              </td>

                              <td className="py-3 px-4 text-center font-bold text-green-600">
                                {s.terverifikasi}
                              </td>

                              <td className="py-3 px-4 text-center font-bold text-amber-600">
                                {s.menunggu}
                              </td>

                              <td className="py-3 px-4 text-center font-bold text-red-500">
                                {s.ditolak}
                              </td>

                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-16 bg-slate-100 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        persen >= 80
                                          ? "bg-red-500"
                                          : persen >= 50
                                            ? "bg-amber-500"
                                            : "bg-green-500"
                                      }`}
                                      style={{
                                        width: `${Math.min(persen, 100)}%`,
                                      }}
                                    />
                                  </div>

                                  <span className="text-xs font-semibold text-slate-600">
                                    {persen}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                      Menampilkan{" "}
                      {filtered.length === 0 ? 0 : startIndex + 1} dari{" "}
                      {filtered.length} sekolah
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Prev
                      </button>

                      <span className="text-sm text-slate-600">
                        {currentPage} / {totalPage}
                      </span>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPage),
                          )
                        }
                        disabled={currentPage === totalPage}
                        className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}

function MonitoringSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-5 flex flex-col gap-3"
          >
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-4 flex gap-3">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="grid grid-cols-7 gap-4 px-4 py-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-12 mx-auto" />
              <Skeleton className="h-4 w-12 mx-auto" />
              <Skeleton className="h-4 w-12 mx-auto" />
              <Skeleton className="h-4 w-12 mx-auto" />
              <Skeleton className="h-4 w-12 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>
      </div>
    </>
  );
}
