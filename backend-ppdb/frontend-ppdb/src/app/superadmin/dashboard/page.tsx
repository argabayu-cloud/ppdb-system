"use client";

const statsSekolah = [
  { nama: "SMP Negeri 1 Bandar Lampung", pendaftar: 120, terverifikasi: 80, menunggu: 30, ditolak: 10 },
  { nama: "SMP Negeri 2 Bandar Lampung", pendaftar: 95, terverifikasi: 60, menunggu: 25, ditolak: 10 },
  { nama: "SMP Negeri 3 Bandar Lampung", pendaftar: 110, terverifikasi: 75, menunggu: 20, ditolak: 15 },
  { nama: "SMP Negeri 4 Bandar Lampung", pendaftar: 88, terverifikasi: 55, menunggu: 22, ditolak: 11 },
  { nama: "SMP Negeri 5 Bandar Lampung", pendaftar: 102, terverifikasi: 70, menunggu: 18, ditolak: 14 },
];

const totalPendaftar = statsSekolah.reduce((acc, s) => acc + s.pendaftar, 0);
const totalTerverifikasi = statsSekolah.reduce((acc, s) => acc + s.terverifikasi, 0);
const totalMenunggu = statsSekolah.reduce((acc, s) => acc + s.menunggu, 0);
const totalDitolak = statsSekolah.reduce((acc, s) => acc + s.ditolak, 0);

const dataJalur = [
  { jalur: "Zonasi", jumlah: 215, warna: "bg-blue-500", persen: 43 },
  { jalur: "Prestasi", jumlah: 150, warna: "bg-purple-500", persen: 30 },
  { jalur: "Afirmasi", jumlah: 85, warna: "bg-green-500", persen: 17 },
  { jalur: "Domisili", jumlah: 65, warna: "bg-orange-500", persen: 13 },
];

export default function SuperAdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-indigo-200 text-sm mb-1">Selamat Datang 👋</p>
        <h1 className="text-2xl font-bold">Super Admin</h1>
        <p className="text-indigo-100 text-sm mt-1">
          Dinas Pendidikan Kota Bandar Lampung · PPDB 2025/2026
        </p>
      </div>

      {/* Stats Utama */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Pendaftar", value: totalPendaftar, icon: "👥", color: "bg-blue-500" },
          { label: "Terverifikasi", value: totalTerverifikasi, icon: "✅", color: "bg-green-500" },
          { label: "Menunggu", value: totalMenunggu, icon: "⏳", color: "bg-amber-500" },
          { label: "Ditolak", value: totalDitolak, icon: "❌", color: "bg-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow p-5 flex flex-col gap-2">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Info tambahan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Sekolah", value: 45, icon: "🏫", color: "border-indigo-400" },
          { label: "Sekolah Aktif", value: 45, icon: "✅", color: "border-green-400" },
          { label: "Jalur Tersedia", value: 4, icon: "🛤️", color: "border-blue-400" },
        ].map((item) => (
          <div key={item.label} className={`bg-white rounded-2xl shadow border-l-4 ${item.color} p-5 flex items-center gap-4`}>
            <span className="text-3xl">{item.icon}</span>
            <div>
              <p className="text-2xl font-bold text-slate-800">{item.value}</p>
              <p className="text-xs text-slate-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Statistik Per Jalur */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-semibold text-slate-700 mb-4">🛤️ Pendaftar Per Jalur</h2>
        <div className="flex flex-col gap-3">
          {dataJalur.map((j) => (
            <div key={j.jalur} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-20">{j.jalur}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-4">
                <div
                  className={`${j.warna} h-4 rounded-full transition-all duration-500`}
                  style={{ width: `${j.persen}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-700 w-12 text-right">{j.jumlah}</span>
              <span className="text-xs text-slate-400 w-10 text-right">{j.persen}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabel Per Sekolah */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-700">🏫 Rekap Per Sekolah</h2>
          <a href="/superadmin/monitoring"
            className="text-xs text-indigo-600 hover:underline font-medium">
            Lihat Semua →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold">Sekolah</th>
                <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">Pendaftar</th>
                <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">Terverifikasi</th>
                <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">Menunggu</th>
                <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">Ditolak</th>
              </tr>
            </thead>
            <tbody>
              {statsSekolah.map((s, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800 text-xs">{s.nama}</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-800">{s.pendaftar}</td>
                  <td className="py-3 px-4 text-center text-green-600 font-semibold">{s.terverifikasi}</td>
                  <td className="py-3 px-4 text-center text-amber-600 font-semibold">{s.menunggu}</td>
                  <td className="py-3 px-4 text-center text-red-500 font-semibold">{s.ditolak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Kelola Sekolah", desc: "45 sekolah terdaftar", href: "/superadmin/sekolah", icon: "🏫", color: "border-indigo-400" },
          { label: "Monitoring", desc: "Pantau semua sekolah", href: "/superadmin/monitoring", icon: "📡", color: "border-blue-400" },
          { label: "Laporan", desc: "Unduh laporan PPDB", href: "/superadmin/laporan", icon: "📊", color: "border-purple-400" },
        ].map((item) => (
          <a key={item.label} href={item.href}
            className={`bg-white rounded-2xl shadow border-l-4 ${item.color} p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}>
            <span className="text-3xl">{item.icon}</span>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}