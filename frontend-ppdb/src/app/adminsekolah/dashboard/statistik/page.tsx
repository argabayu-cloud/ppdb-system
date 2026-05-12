"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { Skeleton } from "@/components/ui/skeleton";

const dataJalur = [
  { jalur: "Zonasi", pendaftar: 45, diterima: 30, ditolak: 15 },
  { jalur: "Prestasi", pendaftar: 30, diterima: 20, ditolak: 10 },
  { jalur: "Afirmasi", pendaftar: 15, diterima: 12, ditolak: 3 },
  { jalur: "Domisili", pendaftar: 10, diterima: 8, ditolak: 2 },
];

const dataPie = [
  { name: "Zonasi", value: 45, color: "#3b82f6" },
  { name: "Prestasi", value: 30, color: "#a855f7" },
  { name: "Afirmasi", value: 15, color: "#22c55e" },
  { name: "Domisili", value: 10, color: "#f97316" },
];

const dataStatus = [
  { name: "Menunggu Verifikasi", value: 40, color: "#f59e0b" },
  { name: "Terverifikasi", value: 50, color: "#22c55e" },
  { name: "Ditolak", value: 10, color: "#ef4444" },
];

const total = dataJalur.reduce((acc, d) => acc + d.pendaftar, 0);
const totalDiterima = dataJalur.reduce((acc, d) => acc + d.diterima, 0);
const totalDitolak = dataJalur.reduce((acc, d) => acc + d.ditolak, 0);

export default function StatistikPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <StatistikSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">📊 Statistik PPDB</h1>
        <p className="text-slate-500 text-sm mt-1">
          Rekap data penerimaan siswa baru per jalur pendaftaran.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Pendaftar",
            value: total,
            color: "bg-blue-500",
            icon: "👥",
          },
          {
            label: "Diterima",
            value: totalDiterima,
            color: "bg-green-500",
            icon: "✅",
          },
          {
            label: "Ditolak",
            value: totalDitolak,
            color: "bg-red-500",
            icon: "❌",
          },
          {
            label: "Sisa Kuota",
            value: 100 - totalDiterima,
            color: "bg-purple-500",
            icon: "🎯",
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
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart - Pendaftar per Jalur */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-semibold text-slate-700 mb-6">
          📊 Pendaftar, Diterima & Ditolak per Jalur
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dataJalur}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="jalur" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Bar
              dataKey="pendaftar"
              name="Pendaftar"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="diterima"
              name="Diterima"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="ditolak"
              name="Ditolak"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pie - Per Jalur */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold text-slate-700 mb-4">
            🥧 Proporsi Per Jalur
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={dataPie}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {dataPie.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pie - Status */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold text-slate-700 mb-4">
            🥧 Status Verifikasi
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={dataStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {dataStatus.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabel Ringkasan */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-semibold text-slate-700 mb-4">
          📋 Ringkasan Per Jalur
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold rounded-l-xl">
                  Jalur
                </th>
                <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">
                  Pendaftar
                </th>
                <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">
                  Diterima
                </th>
                <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">
                  Ditolak
                </th>
                <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold rounded-r-xl">
                  % Diterima
                </th>
              </tr>
            </thead>
            <tbody>
              {dataJalur.map((d) => (
                <tr
                  key={d.jalur}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        d.jalur === "Zonasi"
                          ? "bg-blue-100 text-blue-700"
                          : d.jalur === "Prestasi"
                            ? "bg-purple-100 text-purple-700"
                            : d.jalur === "Afirmasi"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {d.jalur}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-800">
                    {d.pendaftar}
                  </td>
                  <td className="py-3 px-4 text-center text-green-600 font-semibold">
                    {d.diterima}
                  </td>
                  <td className="py-3 px-4 text-center text-red-500 font-semibold">
                    {d.ditolak}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 max-w-[80px]">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${Math.round(
                              (d.diterima / d.pendaftar) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-600 font-medium">
                        {Math.round((d.diterima / d.pendaftar) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}

              <tr className="bg-blue-50 font-semibold">
                <td className="py-3 px-4 text-blue-700 text-sm">Total</td>
                <td className="py-3 px-4 text-center text-slate-800">
                  {total}
                </td>
                <td className="py-3 px-4 text-center text-green-600">
                  {totalDiterima}
                </td>
                <td className="py-3 px-4 text-center text-red-500">
                  {totalDitolak}
                </td>
                <td className="py-3 px-4 text-center text-slate-600">
                  {Math.round((totalDiterima / total) * 100)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatistikSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-7 w-52 mb-3" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

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

      <div className="bg-white rounded-2xl shadow p-6">
        <Skeleton className="h-5 w-72 max-w-full mb-6" />

        <div className="h-[300px] flex items-end gap-4 border-l border-b border-slate-100 px-4 pb-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-t-lg"
              style={{
                height: `${70 + (i % 4) * 42}px`,
              }}
            />
          ))}
        </div>

        <div className="flex justify-center gap-6 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-6">
            <Skeleton className="h-5 w-44 mb-5" />

            <div className="flex flex-col items-center justify-center gap-4">
              <Skeleton className="h-40 w-40 rounded-full" />

              <div className="flex flex-wrap justify-center gap-4">
                {Array.from({ length: i === 0 ? 4 : 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <Skeleton className="h-5 w-48 mb-4" />

        <div className="overflow-hidden">
          <div className="grid grid-cols-5 gap-4 bg-slate-50 px-4 py-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>

          <div className="divide-y divide-slate-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 px-4 py-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-14 mx-auto" />
                <Skeleton className="h-4 w-14 mx-auto" />
                <Skeleton className="h-4 w-14 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}