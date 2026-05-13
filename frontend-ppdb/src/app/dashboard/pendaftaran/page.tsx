"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { createPendaftaran, uploadDokumen } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const daftarSekolah = Array.from(
  { length: 45 },
  (_, i) => `SMP Negeri ${i + 1} Bandar Lampung`,
);

const jalurPendaftaran = [
  {
    id: "zonasi",
    label: "Zonasi",
    icon: "📍",
    desc: "Berdasarkan jarak tempat tinggal ke sekolah",
  },
  {
    id: "prestasi",
    label: "Prestasi",
    icon: "🏆",
    desc: "Berdasarkan nilai rapor atau prestasi lomba",
  },
];

type FormState = {
  nisn: string;
  namaSekolahAsal: string;
  npsn: string;
  tahunLulus: string;
  nilaiRataRata: string;
  jenisPrestasi: string;
  tingkatPrestasi: string;
};

export default function PendaftaranPage() {
  const [jalur, setJalur] = useState("");
  const [form, setForm] = useState<FormState>({
    nisn: "",
    namaSekolahAsal: "",
    npsn: "",
    tahunLulus: "",
    nilaiRataRata: "",
    jenisPrestasi: "",
    tingkatPrestasi: "",
  });

  const [pilihan1, setPilihan1] = useState("");
  const [pilihan2, setPilihan2] = useState("");
  const [fileRaporPrestasi, setFileRaporPrestasi] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingSkeleton(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleJenisPrestasiChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      jenisPrestasi: value,
      tingkatPrestasi: "",
    }));

    if (value !== "Nilai Rapor") {
      setFileRaporPrestasi(null);
    }
  };

  const handleFileRaporPrestasi = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("File rapor wajib dalam format PDF");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      e.target.value = "";
      return;
    }

    setFileRaporPrestasi(file);
  };

  const handleSubmit = async () => {
    if (!jalur) {
      alert("Pilih jalur pendaftaran terlebih dahulu!");
      return;
    }

    if (!form.nisn) {
      alert("NISN wajib diisi!");
      return;
    }

    if (!pilihan1) {
      alert("Pilihan sekolah pertama wajib diisi!");
      return;
    }

    if (jalur === "prestasi") {
      if (!form.jenisPrestasi) {
        alert("Jenis prestasi wajib dipilih!");
        return;
      }

      if (form.jenisPrestasi === "Nilai Rapor" && !fileRaporPrestasi) {
        alert("Upload file PDF rapor wajib diisi!");
        return;
      }

      if (form.jenisPrestasi !== "Nilai Rapor" && !form.tingkatPrestasi) {
        alert("Tingkat prestasi wajib dipilih!");
        return;
      }
    }

    try {
      setLoading(true);

      const sekolah1Id = "35ca2c3e-3c86-4c79-aff7-3d8d88e85413";
      const sekolah2Id = "2e9ef8c7-fbe5-43ce-b7de-d42d8378d146";

      await createPendaftaran({
        sekolah1Id,
        sekolah2Id,
        jalur: jalur.toUpperCase(),
      });

      if (
        jalur === "prestasi" &&
        form.jenisPrestasi === "Nilai Rapor" &&
        fileRaporPrestasi
      ) {
        await uploadDokumen(fileRaporPrestasi, "RAPOR");
      }

      setSuccess(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingSkeleton) {
    return <PendaftaranSkeleton />;
  }

  if (success) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl">
            ✅
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Pendaftaran Tersimpan!
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Jalur{" "}
            <strong>
              {jalurPendaftaran.find((item) => item.id === jalur)?.label}
            </strong>{" "}
            berhasil didaftarkan. Selanjutnya upload berkas persyaratan.
          </p>

          <Link
            href="/dashboard/upload"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            Upload Berkas →
          </Link>
        </div>
      </div>
    );
  }

  const selectedJalur = jalurPendaftaran.find((item) => item.id === jalur);

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.96),rgba(30,64,175,0.9),rgba(37,99,235,0.72))]" />

        <div className="relative z-10 flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center lg:p-7">
          <div>
            <span className="w-fit rounded-full border border-blue-300/40 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-100">
              Form Pendaftaran Peserta
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
              Pendaftaran PPDB
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-50/90">
              Pilih jalur pendaftaran, lengkapi data akademik, lalu tentukan
              sekolah tujuan sesuai pilihan kamu.
            </p>
          </div>

          <div className="min-w-[165px] rounded-2xl border border-white/10 bg-white/15 px-5 py-4 text-center backdrop-blur">
            <p className="text-xs text-blue-100">Jalur Dipilih</p>
            <p className="mt-1 text-lg font-bold text-white">
              {selectedJalur?.label || "-"}
            </p>
            <p className="mt-1 text-xs text-blue-200">
              {jalur ? "Siap dilengkapi" : "Belum dipilih"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-800">
            Jalur Pendaftaran
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Pilih salah satu jalur yang sesuai dengan kondisi pendaftaran.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {jalurPendaftaran.map((item) => {
            const active = jalur === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setJalur(item.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-blue-700 bg-[#244aad] text-white shadow-md shadow-blue-100"
                    : "border-slate-100 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
                      active ? "bg-white/15" : "bg-white"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <div>
                    <p className="text-sm font-bold">{item.label}</p>
                    <p
                      className={`mt-1 text-xs leading-5 ${
                        active ? "text-blue-100" : "text-slate-500"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {jalur && (
        <>
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-800">
                Data Akademik
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Isi data sekolah asal dan informasi akademik peserta.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  label: "NISN",
                  name: "nisn",
                  placeholder: "Nomor Induk Siswa Nasional",
                  required: true,
                },
                {
                  label: "Nama Sekolah Asal",
                  name: "namaSekolahAsal",
                  placeholder: "SD/MI asal",
                },
                {
                  label: "NPSN Sekolah Asal",
                  name: "npsn",
                  placeholder: "Nomor Pokok Sekolah Nasional",
                },
                {
                  label: "Tahun Lulus",
                  name: "tahunLulus",
                  placeholder: "Contoh: 2025",
                },
                {
                  label: "Nilai Rata-rata Rapor",
                  name: "nilaiRataRata",
                  placeholder: "Contoh: 85.5",
                },
              ].map((item) => (
                <div key={item.name} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    {item.label}{" "}
                    {item.required && <span className="text-red-500">*</span>}
                  </label>

                  <input
                    type="text"
                    name={item.name}
                    value={form[item.name as keyof FormState]}
                    onChange={handleChange}
                    placeholder={item.placeholder}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              ))}
            </div>
          </section>

          {jalur === "prestasi" && (
            <section className="rounded-2xl border border-purple-100 bg-purple-50 p-6">
              <h2 className="text-base font-bold text-purple-700">
                Data Prestasi
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Jenis Prestasi
                  </label>
                  <select
                    name="jenisPrestasi"
                    value={form.jenisPrestasi}
                    onChange={handleJenisPrestasiChange}
                    className="rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="">-- Pilih --</option>
                    <option>Nilai Rapor</option>
                    <option>Olimpiade / Lomba Akademik</option>
                    <option>Prestasi Olahraga</option>
                    <option>Prestasi Seni & Budaya</option>
                    <option>Hafiz Quran</option>
                  </select>
                </div>

                {form.jenisPrestasi === "Nilai Rapor" ? (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      File Rapor SD
                    </label>

                    <label className="flex min-h-[42px] cursor-pointer items-center justify-between gap-3 rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm transition-all hover:border-purple-400">
                      <span className="truncate text-slate-500">
                        {fileRaporPrestasi
                          ? fileRaporPrestasi.name
                          : "Upload 1 file PDF rapor kelas 1-6 semester 1"}
                      </span>

                      <span className="shrink-0 rounded-lg bg-purple-600 px-3 py-1 text-xs font-bold text-white">
                        Pilih PDF
                      </span>

                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={handleFileRaporPrestasi}
                        className="hidden"
                      />
                    </label>

                    <p className="text-xs leading-5 text-purple-700">
                      Gabungkan rapor SD kelas 1 sampai kelas 6 semester
                      ganjil/semester 1 menjadi satu file PDF. Maksimal 5MB.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Tingkat Prestasi
                    </label>
                    <select
                      name="tingkatPrestasi"
                      value={form.tingkatPrestasi}
                      onChange={handleChange}
                      disabled={!form.jenisPrestasi}
                      className="rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">-- Pilih --</option>
                      <option>Tingkat Kecamatan</option>
                      <option>Tingkat Kota / Kabupaten</option>
                      <option>Tingkat Provinsi</option>
                      <option>Tingkat Nasional</option>
                      <option>Tingkat Internasional</option>
                    </select>
                  </div>
                )}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-800">
                Pilihan Sekolah Tujuan
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Tentukan sekolah tujuan pertama dan kedua.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <SchoolSelect
                nomor="1"
                label="Pilihan Pertama"
                required
                value={pilihan1}
                onChange={setPilihan1}
                options={daftarSekolah}
              />

              <SchoolSelect
                nomor="2"
                label="Pilihan Kedua"
                value={pilihan2}
                onChange={setPilihan2}
                options={daftarSekolah.filter((s) => s !== pilihan1)}
              />

              {(pilihan1 || pilihan2) && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                    Ringkasan Pilihan
                  </p>

                  {pilihan1 && (
                    <p className="mt-2 text-sm text-slate-700">
                      <span className="font-bold">1.</span> {pilihan1}
                    </p>
                  )}

                  {pilihan2 && (
                    <p className="mt-1 text-sm text-slate-700">
                      <span className="font-bold">2.</span> {pilihan2}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? "Menyimpan..." : "Simpan Pendaftaran"}
          </button>
        </>
      )}
    </div>
  );
}

function SchoolSelect({
  nomor,
  label,
  required,
  value,
  onChange,
  options,
}: {
  nomor: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white ${
            nomor === "1" ? "bg-blue-600" : "bg-slate-400"
          }`}
        >
          {nomor}
        </div>

        <label className="text-sm font-bold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
          {!required && (
            <span className="ml-1 text-xs font-normal text-slate-400">
              (opsional)
            </span>
          )}
        </label>
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">-- Pilih Sekolah Tujuan --</option>
        {options.map((school) => (
          <option key={school} value={school}>
            {school}
          </option>
        ))}
      </select>

      {value && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5">
          <span className="text-blue-600">✓</span>
          <span className="text-sm font-semibold text-blue-700">{value}</span>
        </div>
      )}
    </div>
  );
}

function PendaftaranSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[2rem] bg-slate-950 p-6 shadow-xl lg:p-7">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Skeleton className="h-6 w-48 bg-white/20" />
            <Skeleton className="mt-5 h-10 w-72 bg-white/20" />
            <Skeleton className="mt-4 h-4 w-full max-w-lg bg-white/20" />
            <Skeleton className="mt-2 h-4 w-80 bg-white/20" />
          </div>

          <Skeleton className="h-24 w-full rounded-2xl bg-white/20 sm:w-[165px]" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="mt-2 h-3 w-72" />

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-3 w-64" />

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-11 rounded-xl" />
            </div>
          ))}
        </div>
      </section>

      <Skeleton className="h-12 rounded-xl" />
    </div>
  );
}