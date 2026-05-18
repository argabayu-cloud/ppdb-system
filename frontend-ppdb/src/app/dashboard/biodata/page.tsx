"use client";

 backend
import { useState } from "react";
import { updateBiodata } from "@/lib/api";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent } from "react";

import { getBiodata, saveBiodata } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
 frontend

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

type FormState = {
  namaLengkap: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  anakKe: string;
  jumlahSaudara: string;
  beratBadan: string;
  tinggiBadan: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kotaKabupaten: string;
  provinsi: string;
  noHp: string;
  email: string;
  namaAyah: string;
  nikAyah: string;
  pendidikanAyah: string;
  pekerjaanAyah: string;
  namaIbu: string;
  nikIbu: string;
  pendidikanIbu: string;
  pekerjaanIbu: string;
  noHpOrtu: string;
  alamatOrtu: string;
};

const initialForm: FormState = {
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
};

export default function BiodataPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);

  useEffect(() => {
    const loadBiodata = async () => {
      try {
        const res = await getBiodata();

        if (res.data) {
          setForm((prev) => ({
            ...prev,
            ...res.data,
          }));
        }
      } catch {
        // Biodata belum ada, form tetap kosong.
      } finally {
        setLoadingSkeleton(false);
      }
    };

    loadBiodata();
  }, []);

  const handleChange = (
 backend
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,

    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
 frontend
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
 backend
    try {
      setLoading(true);

      if (!navigator.geolocation) {
        alert("Geolocation tidak didukung browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            await updateBiodata({
              alamat: form.alamat,
              kelurahan: form.kelurahan,
              kecamatan: form.kecamatan,
              noTlpn: form.noHp,
              latitude,
              longitude,
            });

            setSuccess(true);
          } catch (error) {
            console.log(error);
            alert("Gagal menyimpan biodata");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.log(error);

          alert("Gagal mengambil lokasi");

          setLoading(false);
        },
      );
    } catch (error) {
      console.log(error);

      alert("Terjadi kesalahan");

    setLoading(true);

    try {
      await saveBiodata({ ...form });
      router.push("/dashboard/pendaftaran");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menyimpan biodata");
    } finally {
 frontend
      setLoading(false);
    }
  };

 backend
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
          ✅
        </div>
        <h2 className="text-xl font-bold text-slate-800">Biodata Tersimpan!</h2>
        <p className="text-slate-500 text-sm text-center max-w-sm">
          Data biodata kamu sudah tersimpan. Lanjutkan ke form pendaftaran.
        </p>
        <a
          href="/dashboard/pendaftaran"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
        >
          Isi Pendaftaran →
        </a>
      </div>
    );

  if (loadingSkeleton) {
    return <BiodataSkeleton />;
 frontend
  }

  const filledRequired = [
    form.namaLengkap,
    form.nik,
    form.tempatLahir,
    form.tanggalLahir,
    form.jenisKelamin,
    form.alamat,
  ].filter(Boolean).length;

  return (
 backend
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
            {
              label: "Nama Lengkap",
              name: "namaLengkap",
              placeholder: "Sesuai akta kelahiran",
            },
            { label: "NIK", name: "nik", placeholder: "16 digit nomor KTP/KK" },
            {
              label: "Tempat Lahir",
              name: "tempatLahir",
              placeholder: "Kota tempat lahir",
            },
          ].map((item) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                {item.label}
              </label>
              <input
                type="text"
                name={item.name}
                value={form[item.name]}
                onChange={handleChange}
                placeholder={item.placeholder}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Tanggal Lahir
            </label>
            <input
              type="date"
              name="tanggalLahir"
              value={form.tanggalLahir}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Jenis Kelamin
            </label>
            <select
              name="jenisKelamin"
              value={form.jenisKelamin}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="">-- Pilih --</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Agama</label>
            <select
              name="agama"
              value={form.agama}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="">-- Pilih --</option>
              {[
                "Islam",
                "Kristen",
                "Katolik",
                "Hindu",
                "Buddha",
                "Konghucu",
              ].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          {[
            { label: "Anak Ke", name: "anakKe", placeholder: "Contoh: 1" },
            {
              label: "Jumlah Saudara",
              name: "jumlahSaudara",
              placeholder: "Contoh: 2",
            },
            {
              label: "Berat Badan (kg)",
              name: "beratBadan",
              placeholder: "Contoh: 40",
            },
            {
              label: "Tinggi Badan (cm)",
              name: "tinggiBadan",
              placeholder: "Contoh: 150",
            },
            {
              label: "No. HP Siswa",
              name: "noHp",
              placeholder: "08xxxxxxxxxx",
            },
            { label: "Email", name: "email", placeholder: "email@gmail.com" },
          ].map((item) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                {item.label}
              </label>
              <input
                type="text"
                name={item.name}
                value={form[item.name]}
                onChange={handleChange}
                placeholder={item.placeholder}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          ))}

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Alamat Lengkap
            </label>
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              placeholder="Jalan, nomor rumah, RT/RW"
              rows={2}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />

    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.96),rgba(30,64,175,0.9),rgba(37,99,235,0.72))]" />

        <div className="relative z-10 flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center lg:p-7">
          <div>
            <span className="w-fit rounded-full border border-blue-300/40 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-100">
              Biodata Peserta PPDB
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
              Lengkapi Biodata Diri
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-50/90">
              Isi data siswa dan data orang tua sesuai dokumen resmi seperti
              KK, Akta Lahir, dan dokumen pendukung lainnya.
            </p>
          </div>

          <div className="min-w-[165px] rounded-2xl border border-white/10 bg-white/15 px-5 py-4 text-center backdrop-blur">
            <p className="text-xs text-blue-100">Kelengkapan Awal</p>
            <p className="mt-1 text-xl font-bold text-white">
              {filledRequired}/6
            </p>
            <p className="mt-1 text-xs text-blue-200">Data utama terisi</p>
 frontend
          </div>
        </div>
      </section>

 backend
          {[
            { label: "Kelurahan", name: "kelurahan" },
            { label: "Kecamatan", name: "kecamatan" },
            { label: "Kota / Kabupaten", name: "kotaKabupaten" },
            { label: "Provinsi", name: "provinsi" },
          ].map((item) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                {item.label}
              </label>
              <input
                type="text"
                name={item.name}
                value={form[item.name]}
                onChange={handleChange}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
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
          {[
            { label: "Nama Ayah", name: "namaAyah" },
            { label: "NIK Ayah", name: "nikAyah" },
            { label: "Nama Ibu", name: "namaIbu" },
            { label: "NIK Ibu", name: "nikIbu" },
            { label: "No. HP Orang Tua", name: "noHpOrtu" },
          ].map((item) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                {item.label}
              </label>
              <input
                type="text"
                name={item.name}
                value={form[item.name]}
                onChange={handleChange}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          ))}

          {[
            {
              label: "Pendidikan Ayah",
              name: "pendidikanAyah",
              options: pilihanPendidikan,
            },
            {
              label: "Pekerjaan Ayah",
              name: "pekerjaanAyah",
              options: pilihanPekerjaan,
            },
            {
              label: "Pendidikan Ibu",
              name: "pendidikanIbu",
              options: pilihanPendidikan,
            },
            {
              label: "Pekerjaan Ibu",
              name: "pekerjaanIbu",
              options: pilihanPekerjaan,
            },
          ].map((item) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                {item.label}
              </label>
              <select
                name={item.name}
                value={form[item.name]}
                onChange={handleChange}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              >
                {item.options.map((opt) => (
                  <option key={opt} value={opt === "-- Pilih --" ? "" : opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Alamat Orang Tua
            </label>
            <textarea
              name="alamatOrtu"
              value={form.alamatOrtu}
              onChange={handleChange}
              placeholder="Isi jika berbeda dengan alamat siswa"
              rows={2}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-base font-bold text-slate-800">
            Data Diri Siswa
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Pastikan data yang diisi sesuai dokumen resmi.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="Nama Lengkap" name="namaLengkap" value={form.namaLengkap} onChange={handleChange} placeholder="Sesuai akta kelahiran" />
          <InputField label="NIK" name="nik" value={form.nik} onChange={handleChange} placeholder="16 digit nomor KTP/KK" />
          <InputField label="Tempat Lahir" name="tempatLahir" value={form.tempatLahir} onChange={handleChange} placeholder="Kota tempat lahir" />
          <InputField label="Tanggal Lahir" name="tanggalLahir" type="date" value={form.tanggalLahir} onChange={handleChange} />

          <SelectField label="Jenis Kelamin" name="jenisKelamin" value={form.jenisKelamin} onChange={handleChange} options={["-- Pilih --", "Laki-laki", "Perempuan"]} />
          <SelectField label="Agama" name="agama" value={form.agama} onChange={handleChange} options={["-- Pilih --", "Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"]} />

          <InputField label="Anak Ke" name="anakKe" value={form.anakKe} onChange={handleChange} placeholder="Contoh: 1" />
          <InputField label="Jumlah Saudara" name="jumlahSaudara" value={form.jumlahSaudara} onChange={handleChange} placeholder="Contoh: 2" />
          <InputField label="Berat Badan (kg)" name="beratBadan" value={form.beratBadan} onChange={handleChange} placeholder="Contoh: 40" />
          <InputField label="Tinggi Badan (cm)" name="tinggiBadan" value={form.tinggiBadan} onChange={handleChange} placeholder="Contoh: 150" />
          <InputField label="No. HP Siswa" name="noHp" value={form.noHp} onChange={handleChange} placeholder="08xxxxxxxxxx" />
          <InputField label="Email" name="email" value={form.email} onChange={handleChange} placeholder="email@gmail.com" />

          <TextareaField label="Alamat Lengkap" name="alamat" value={form.alamat} onChange={handleChange} placeholder="Jalan, nomor rumah, RT/RW" />

          <InputField label="Kelurahan" name="kelurahan" value={form.kelurahan} onChange={handleChange} />
          <InputField label="Kecamatan" name="kecamatan" value={form.kecamatan} onChange={handleChange} />
          <InputField label="Kota / Kabupaten" name="kotaKabupaten" value={form.kotaKabupaten} onChange={handleChange} />
          <InputField label="Provinsi" name="provinsi" value={form.provinsi} onChange={handleChange} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-base font-bold text-slate-800">
            Data Orang Tua / Wali
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Lengkapi informasi orang tua atau wali peserta.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="Nama Ayah" name="namaAyah" value={form.namaAyah} onChange={handleChange} />
          <InputField label="NIK Ayah" name="nikAyah" value={form.nikAyah} onChange={handleChange} />
          <SelectField label="Pendidikan Ayah" name="pendidikanAyah" value={form.pendidikanAyah} onChange={handleChange} options={pilihanPendidikan} />
          <SelectField label="Pekerjaan Ayah" name="pekerjaanAyah" value={form.pekerjaanAyah} onChange={handleChange} options={pilihanPekerjaan} />

          <InputField label="Nama Ibu" name="namaIbu" value={form.namaIbu} onChange={handleChange} />
          <InputField label="NIK Ibu" name="nikIbu" value={form.nikIbu} onChange={handleChange} />
          <SelectField label="Pendidikan Ibu" name="pendidikanIbu" value={form.pendidikanIbu} onChange={handleChange} options={pilihanPendidikan} />
          <SelectField label="Pekerjaan Ibu" name="pekerjaanIbu" value={form.pekerjaanIbu} onChange={handleChange} options={pilihanPekerjaan} />

          <InputField label="No. HP Orang Tua" name="noHpOrtu" value={form.noHpOrtu} onChange={handleChange} />
          <TextareaField label="Alamat Orang Tua" name="alamatOrtu" value={form.alamatOrtu} onChange={handleChange} placeholder="Isi jika berbeda dengan alamat siswa" />
 frontend
        </div>
      </section>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {loading ? "Menyimpan..." : "Simpan Biodata"}
      </button>
    </div>
  );
}
 backend

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option} value={option === "-- Pilih --" ? "" : option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 sm:col-span-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={2}
        className="resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function BiodataSkeleton() {
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

      {[1, 2].map((item) => (
        <section
          key={item}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-2 h-3 w-72" />

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: item === 1 ? 16 : 10 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-11 rounded-xl" />
              </div>
            ))}
          </div>
        </section>
      ))}

      <Skeleton className="h-12 rounded-xl" />
    </div>
  );
}
frontend