"use client";

const steps = [
  { label: "Buat Akun", done: true },
  { label: "Isi Biodata", done: false },
  { label: "Pendaftaran", done: false },
  { label: "Upload Berkas", done: false },
  { label: "Verifikasi", done: false },
];

const announcements = [
  {
    date: "1 Mei 2025",
    title: "Pendaftaran PPDB Gelombang 1 Dibuka",
    desc: "Pendaftaran gelombang pertama telah resmi dibuka. Segera lengkapi berkas kamu sebelum 30 Mei 2025.",
  },
  {
    date: "28 Apr 2025",
    title: "Persyaratan Dokumen Diperbarui",
    desc: "Cek kembali daftar dokumen yang diperlukan. Ada penambahan surat keterangan domisili.",
  },
];

export default function DashboardPage() {
  const doneCount = steps.filter((s) => s.done).length;
  const progressPercent = Math.round((doneCount / steps.length) * 100);

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-blue-200 text-sm mb-1">Selamat Datang 👋</p>
          <h1 className="text-2xl font-bold">ARGA BAYU R</h1>
          <p className="text-blue-100 text-sm mt-1">
            Tahun Ajaran 2025/2026 · PPDB SMP Terpadu
          </p>
        </div>
        <div className="bg-white/20 rounded-xl px-5 py-3 text-center min-w-[130px]">
          <p className="text-xs text-blue-100 mb-1">No. Pendaftaran</p>
          <p className="text-lg font-bold tracking-widest">-</p>
          <p className="text-xs text-blue-200 mt-1">Belum terdaftar</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">
          📊 Progress Pendaftaran
        </h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-slate-100 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-bold text-blue-700 w-12 text-right">
            {progressPercent}%
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                  ${step.done ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"}`}
              >
                {step.done ? "✓" : i + 1}
              </div>
              <span className={`text-xs ${step.done ? "text-blue-700 font-semibold" : "text-slate-400"}`}>
                {step.label}
              </span>
              {i < steps.length - 1 && (
                <span className="text-slate-300 text-xs mx-1">›</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Biodata", status: "Belum Lengkap", color: "text-amber-600", bg: "bg-amber-50", icon: "👤" },
          { label: "Pendaftaran", status: "Belum Diisi", color: "text-red-500", bg: "bg-red-50", icon: "📋" },
          { label: "Upload Berkas", status: "Belum Upload", color: "text-red-500", bg: "bg-red-50", icon: "📁" },
          { label: "Pengumuman", status: "Ada Info Baru", color: "text-blue-600", bg: "bg-blue-50", icon: "📢" },
        ].map((item, i) => (
          <div key={i} className={`${item.bg} rounded-2xl p-4 flex flex-col gap-2`}>
            <span className="text-2xl">{item.icon}</span>
            <p className="text-sm font-semibold text-slate-700">{item.label}</p>
            <p className={`text-xs font-medium ${item.color}`}>{item.status}</p>
          </div>
        ))}
      </div>

      {/* Pengumuman */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">
          📢 Pengumuman Terbaru
        </h2>
        <div className="flex flex-col gap-3">
          {announcements.map((a, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-5">
              <p className="text-xs text-slate-400 mb-1">{a.date}</p>
              <h3 className="font-semibold text-slate-800 text-sm">{a.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}