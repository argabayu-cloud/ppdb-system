"use client";

import { useState } from "react";

const pilihanPekerjaan = [
  "-- Pilih --",
  "PNS / ASN",
  "TNI / Polri",
  "Pegawai Swasta",
  "Wiraswasta / Pengusaha",
  "Petani",
  "Nelayan",
  "Buruh",
  "Guru / Dosen",
  "Dokter / Tenaga Kesehatan",
  "Pedagang",
  "Ibu Rumah Tangga",
  "Tidak Bekerja",
  "Lainnya",
];

const pilihanPendidikan = [
  "-- Pilih --",
  "Tidak Sekolah",
  "SD / Sederajat",
  "SMP / Sederajat",
  "SMA / Sederajat",
  "D1 / D2 / D3",
  "S1 / D4",
  "S2",
  "S3",
];

export default function BiodataPage() {
  const [form, setForm] = useState({
    namaLengkap: "",
    nik: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    agama: "",
    anakKe: "",
    jumlahSaudara: "",
    beratBadan: "",
    tinggiBadan: "",
    alamat: "",
    kelurahan: "",
    kecamatan: "",
    kotaKabupaten: "",
    provinsi: "",
    noHp: "",
    email: "",
    namaAyah: "",
    nikAyah: "",
    pendidikanAyah: "",
    pekerjaanAyah: "",
    namaIbu: "",
    nikIbu: "",
    pendidikanIbu: "",
    pekerjaanIbu: "",
    noHpOrtu: "",
    alamatOrtu: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
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
        <h2 className="text-xl font-bold text-slate-800">Biodata Tersimpan!</h2>
        <p className="text-slate-500 text-sm text-center max-w-sm">
          Data biodata kamu sudah tersimpan. Lanjutkan ke form pendaftaran.
        </p>
        <a href="/dashboard/pendaftaran"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
          Isi Pendaftaran →
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">👤 Biodata Diri</h1>
        <p className="text-slate-500 text-sm mt-1">
          Lengkapi biodata diri sesuai dokumen resmi (KTP/KK/Akta Lahir).
        </p>
      </div>

      {/* Data Diri Siswa */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-blue-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
          📋 Data Diri Siswa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {[
            { label: "Nama Lengkap", name: "namaLengkap", placeholder: "Sesuai akta kelahiran" },
            { label: "NIK", name: "nik", placeholder: "16 digit nomor KTP/KK" },
            { label: "Tempat Lahir", name: "tempatLahir", placeholder: "Kota tempat lahir" },
          ].map((item) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">{item.label}</label>
              <input type="text" name={item.name} value={(form as any)[item.name]}
                onChange={handleChange} placeholder={item.placeholder}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Tanggal Lahir</label>
            <input type="date" name="tanggalLahir" value={form.tanggalLahir} onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Jenis Kelamin</label>
            <select name="jenisKelamin" value={form.jenisKelamin} onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
              <option value="">-- Pilih --</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Agama</label>
            <select name="agama" value={form.agama} onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
              <option value="">-- Pilih --</option>
              {["Islam","Kristen","Katolik","Hindu","Buddha","Konghucu"].map(a => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          {[
            { label: "Anak Ke", name: "anakKe", placeholder: "Contoh: 1" },
            { label: "Jumlah Saudara", name: "jumlahSaudara", placeholder: "Contoh: 2" },
            { label: "Berat Badan (kg)", name: "beratBadan", placeholder: "Contoh: 40" },
            { label: "Tinggi Badan (cm)", name: "tinggiBadan", placeholder: "Contoh: 150" },
            { label: "No. HP Siswa", name: "noHp", placeholder: "08xxxxxxxxxx" },
            { label: "Email", name: "email", placeholder: "email@gmail.com" },
          ].map((item) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">{item.label}</label>
              <input type="text" name={item.name} value={(form as any)[item.name]}
                onChange={handleChange} placeholder={item.placeholder}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
          ))}

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Alamat Lengkap</label>
            <textarea name="alamat" value={form.alamat} onChange={handleChange}
              placeholder="Jalan, nomor rumah, RT/RW" rows={2}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
          </div>

          {[
            { label: "Kelurahan", name: "kelurahan" },
            { label: "Kecamatan", name: "kecamatan" },
            { label: "Kota / Kabupaten", name: "kotaKabupaten" },
            { label: "Provinsi", name: "provinsi" },
          ].map((item) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">{item.label}</label>
              <input type="text" name={item.name} value={(form as any)[item.name]}
                onChange={handleChange}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* Data Orang Tua */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-blue-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
          👨‍👩‍👧 Data Orang Tua / Wali
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Nama Ayah & Ibu - input biasa */}
          {[
            { label: "Nama Ayah", name: "namaAyah" },
            { label: "NIK Ayah", name: "nikAyah" },
            { label: "Nama Ibu", name: "namaIbu" },
            { label: "NIK Ibu", name: "nikIbu" },
            { label: "No. HP Orang Tua", name: "noHpOrtu" },
          ].map((item) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">{item.label}</label>
              <input type="text" name={item.name} value={(form as any)[item.name]}
                onChange={handleChange}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
          ))}

          {/* Pendidikan & Pekerjaan - dropdown */}
          {[
            { label: "Pendidikan Ayah", name: "pendidikanAyah", options: pilihanPendidikan },
            { label: "Pekerjaan Ayah", name: "pekerjaanAyah", options: pilihanPekerjaan },
            { label: "Pendidikan Ibu", name: "pendidikanIbu", options: pilihanPendidikan },
            { label: "Pekerjaan Ibu", name: "pekerjaanIbu", options: pilihanPekerjaan },
          ].map((item) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">{item.label}</label>
              <select name={item.name} value={(form as any)[item.name]} onChange={handleChange}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
                {item.options.map((opt) => (
                  <option key={opt} value={opt === "-- Pilih --" ? "" : opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Alamat Orang Tua</label>
            <textarea name="alamatOrtu" value={form.alamatOrtu} onChange={handleChange}
              placeholder="Isi jika berbeda dengan alamat siswa" rows={2}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
          </div>
        </div>
      </div>

      {/* Tombol Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors shadow-md text-sm"
      >
        {loading ? "Menyimpan..." : "Simpan Biodata"}
      </button>
    </div>
  );
}