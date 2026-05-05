"use client";

import { useState } from "react";

const daftarSekolah = Array.from({ length: 45 }, (_, i) => `SMP Negeri ${i + 1} Bandar Lampung`);

const jalurPendaftaran = [
  {
    id: "zonasi",
    label: "Zonasi",
    icon: "📍",
    desc: "Berdasarkan jarak tempat tinggal ke sekolah",
    warna: "blue",
  },
  {
    id: "afirmasi",
    label: "Afirmasi",
    icon: "🤝",
    desc: "Untuk keluarga tidak mampu / pemegang KIP",
    warna: "green",
  },
  {
    id: "mutasi",
    label: "Mutasi / Domisili",
    icon: "🏠",
    desc: "Perpindahan domisili orang tua / wali",
    warna: "orange",
  },
  {
    id: "prestasi",
    label: "Prestasi",
    icon: "🏆",
    desc: "Berdasarkan nilai rapor atau prestasi lomba",
    warna: "purple",
  },
];

const warnaMap: Record<string, string> = {
  blue: "border-blue-400 bg-blue-50 text-blue-700",
  green: "border-green-400 bg-green-50 text-green-700",
  orange: "border-orange-400 bg-orange-50 text-orange-700",
  purple: "border-purple-400 bg-purple-50 text-purple-700",
};

const warnaActive: Record<string, string> = {
  blue: "border-blue-600 bg-blue-600 text-white",
  green: "border-green-600 bg-green-600 text-white",
  orange: "border-orange-600 bg-orange-600 text-white",
  purple: "border-purple-600 bg-purple-600 text-white",
};

export default function PendaftaranPage() {
  const [jalur, setJalur] = useState("");
  const [form, setForm] = useState({
    nisn: "",
    namaSekolahAsal: "",
    npsn: "",
    tahunLulus: "",
    nilaiRataRata: "",
    // Khusus afirmasi
    noKip: "",
    // Khusus prestasi
    jenisPrestasi: "",
    tingkatPrestasi: "",
    // Khusus mutasi
    alasanMutasi: "",
  });

  const [pilihan1, setPilihan1] = useState("");
  const [pilihan2, setPilihan2] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!jalur) { alert("Pilih jalur pendaftaran terlebih dahulu!"); return; }
    if (!form.nisn) { alert("NISN wajib diisi!"); return; }
    if (!pilihan1) { alert("Pilihan sekolah pertama wajib diisi!"); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">✅</div>
        <h2 className="text-xl font-bold text-slate-800">Pendaftaran Tersimpan!</h2>
        <p className="text-slate-500 text-sm text-center max-w-sm">
          Jalur <strong>{jalurPendaftaran.find(j => j.id === jalur)?.label}</strong> berhasil didaftarkan.
          Selanjutnya upload berkas persyaratan.
        </p>
        <a href="/dashboard/upload"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
          Upload Berkas →
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">📋 Form Pendaftaran</h1>
        <p className="text-slate-500 text-sm mt-1">
          Pilih jalur pendaftaran dan lengkapi data dengan benar.
        </p>
      </div>

      {/* Pilih Jalur */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-blue-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
          🛤️ Jalur Pendaftaran <span className="text-red-500">*</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {jalurPendaftaran.map((j) => (
            <button
              key={j.id}
              onClick={() => setJalur(j.id)}
              className={`border-2 rounded-xl p-4 text-left transition-all
                ${jalur === j.id ? warnaActive[j.warna] : warnaMap[j.warna] + " hover:opacity-80"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{j.icon}</span>
                <span className="font-semibold text-sm">{j.label}</span>
              </div>
              <p className={`text-xs ${jalur === j.id ? "text-white/80" : "text-slate-500"}`}>
                {j.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Form muncul setelah pilih jalur */}
      {jalur && (
        <>
          {/* Data Akademik */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-blue-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
              📚 Data Akademik
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "NISN", name: "nisn", placeholder: "Nomor Induk Siswa Nasional", required: true },
                { label: "Nama Sekolah Asal", name: "namaSekolahAsal", placeholder: "SD/MI asal" },
                { label: "NPSN Sekolah Asal", name: "npsn", placeholder: "Nomor Pokok Sekolah Nasional" },
                { label: "Tahun Lulus", name: "tahunLulus", placeholder: "Contoh: 2025" },
                { label: "Nilai Rata-rata Rapor", name: "nilaiRataRata", placeholder: "Contoh: 85.5" },
              ].map((item) => (
                <div key={item.name} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    {item.label} {item.required && <span className="text-red-500">*</span>}
                  </label>
                  <input type="text" name={item.name} value={(form as Record<string, string>)[item.name]}
                    onChange={handleChange} placeholder={item.placeholder}
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Form tambahan sesuai jalur */}
          {jalur === "afirmasi" && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-green-700 text-sm uppercase tracking-wide border-b border-green-200 pb-2">
                🤝 Data Afirmasi
              </h2>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Nomor KIP / PKH</label>
                <input type="text" name="noKip" value={form.noKip} onChange={handleChange}
                  placeholder="Nomor Kartu Indonesia Pintar"
                  className="border border-green-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all bg-white" />
              </div>
            </div>
          )}

          {jalur === "prestasi" && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-purple-700 text-sm uppercase tracking-wide border-b border-purple-200 pb-2">
                🏆 Data Prestasi
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Jenis Prestasi</label>
                  <select name="jenisPrestasi" value={form.jenisPrestasi} onChange={handleChange}
                    className="border border-purple-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all bg-white">
                    <option value="">-- Pilih --</option>
                    <option>Nilai Rapor</option>
                    <option>Olimpiade / Lomba Akademik</option>
                    <option>Prestasi Olahraga</option>
                    <option>Prestasi Seni & Budaya</option>
                    <option>Hafiz Quran</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Tingkat Prestasi</label>
                  <select name="tingkatPrestasi" value={form.tingkatPrestasi} onChange={handleChange}
                    className="border border-purple-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all bg-white">
                    <option value="">-- Pilih --</option>
                    <option>Tingkat Kecamatan</option>
                    <option>Tingkat Kota / Kabupaten</option>
                    <option>Tingkat Provinsi</option>
                    <option>Tingkat Nasional</option>
                    <option>Tingkat Internasional</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {jalur === "mutasi" && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-orange-700 text-sm uppercase tracking-wide border-b border-orange-200 pb-2">
                🏠 Data Mutasi / Domisili
              </h2>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Alasan Mutasi</label>
                <textarea name="alasanMutasi" value={form.alasanMutasi} onChange={handleChange}
                  placeholder="Jelaskan alasan perpindahan domisili" rows={3}
                  className="border border-orange-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all bg-white resize-none" />
              </div>
            </div>
          )}

          {/* Pilihan Sekolah */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-5">
            <h2 className="font-semibold text-blue-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
              🎯 Pilihan Sekolah Tujuan
            </h2>

            {/* Pilihan 1 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</div>
                <label className="text-sm font-semibold text-slate-700">
                  Pilihan Pertama <span className="text-red-500">*</span>
                </label>
              </div>
              <select value={pilihan1} onChange={(e) => setPilihan1(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
                <option value="">-- Pilih Sekolah Tujuan Pertama --</option>
                {daftarSekolah.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {pilihan1 && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm text-blue-700 font-medium">{pilihan1}</span>
                </div>
              )}
            </div>

            {/* Pilihan 2 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-400 text-white text-xs flex items-center justify-center font-bold">2</div>
                <label className="text-sm font-semibold text-slate-700">
                  Pilihan Kedua <span className="text-slate-400 text-xs font-normal">(opsional)</span>
                </label>
              </div>
              <select value={pilihan2} onChange={(e) => setPilihan2(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
                <option value="">-- Pilih Sekolah Tujuan Kedua --</option>
                {daftarSekolah.filter((s) => s !== pilihan1).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {pilihan2 && (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                  <span className="text-slate-500">✓</span>
                  <span className="text-sm text-slate-700 font-medium">{pilihan2}</span>
                </div>
              )}
            </div>

            {/* Ringkasan */}
            {(pilihan1 || pilihan2) && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">Ringkasan Pilihan</p>
                {pilihan1 && <p className="text-sm text-slate-700"><span className="font-medium">1.</span> {pilihan1}</p>}
                {pilihan2 && <p className="text-sm text-slate-700 mt-1"><span className="font-medium">2.</span> {pilihan2}</p>}
              </div>
            )}
          </div>

          {/* Tombol Submit */}
          <button onClick={handleSubmit} disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors shadow-md text-sm">
            {loading ? "Menyimpan..." : "Simpan Pendaftaran"}
          </button>
        </>
      )}
    </div>
  );
}