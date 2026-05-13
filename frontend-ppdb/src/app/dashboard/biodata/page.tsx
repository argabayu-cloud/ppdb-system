"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent } from "react";

import { getBiodata, saveBiodata, updateBiodata } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error("Gagal mengambil lokasi:", error);
      },
    );
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await updateBiodata({
        alamat: form.alamat,
        kelurahan: form.kelurahan,
        kecamatan: form.kecamatan,
        noTlpn: form.noHp,
        latitude,
        longitude,
      });

      await saveBiodata({ ...form });

      router.push("/dashboard/pendaftaran");
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Gagal menyimpan biodata");
    } finally {
      setLoading(false);
    }
  };

  if (loadingSkeleton) {
    return <BiodataSkeleton />;
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
              Isi data siswa dan data orang tua sesuai dokumen resmi seperti KK,
              Akta Lahir, dan dokumen pendukung lainnya.
            </p>
          </div>

          <div className="min-w-[165px] rounded-2xl border border-white/10 bg-white/15 px-5 py-4 text-center backdrop-blur">
            <p className="text-xs text-blue-100">Kelengkapan Awal</p>
            <p className="mt-1 text-xl font-bold text-white">
              {filledRequired}/6
            </p>
            <p className="mt-1 text-xs text-blue-200">Data utama terisi</p>
          </div>
        </div>
      </section>

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
          <InputField
            label="Nama Lengkap"
            name="namaLengkap"
            value={form.namaLengkap}
            onChange={handleChange}
            placeholder="Sesuai akta kelahiran"
          />
          <InputField
            label="NIK"
            name="nik"
            value={form.nik}
            onChange={handleChange}
            placeholder="16 digit nomor KTP/KK"
          />
          <InputField
            label="Tempat Lahir"
            name="tempatLahir"
            value={form.tempatLahir}
            onChange={handleChange}
            placeholder="Kota tempat lahir"
          />
          <InputField
            label="Tanggal Lahir"
            name="tanggalLahir"
            type="date"
            value={form.tanggalLahir}
            onChange={handleChange}
          />
          <SelectField
            label="Jenis Kelamin"
            name="jenisKelamin"
            value={form.jenisKelamin}
            onChange={handleChange}
            options={["-- Pilih --", "Laki-laki", "Perempuan"]}
          />
          <SelectField
            label="Agama"
            name="agama"
            value={form.agama}
            onChange={handleChange}
            options={[
              "-- Pilih --",
              "Islam",
              "Kristen",
              "Katolik",
              "Hindu",
              "Buddha",
              "Konghucu",
            ]}
          />
          <InputField
            label="Anak Ke"
            name="anakKe"
            value={form.anakKe}
            onChange={handleChange}
            placeholder="Contoh: 1"
          />
          <InputField
            label="Jumlah Saudara"
            name="jumlahSaudara"
            value={form.jumlahSaudara}
            onChange={handleChange}
            placeholder="Contoh: 2"
          />
          <InputField
            label="Berat Badan (kg)"
            name="beratBadan"
            value={form.beratBadan}
            onChange={handleChange}
            placeholder="Contoh: 40"
          />
          <InputField
            label="Tinggi Badan (cm)"
            name="tinggiBadan"
            value={form.tinggiBadan}
            onChange={handleChange}
            placeholder="Contoh: 150"
          />
          <InputField
            label="No. HP Siswa"
            name="noHp"
            value={form.noHp}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
          />
          <InputField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@gmail.com"
          />
          <TextareaField
            label="Alamat Lengkap"
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            placeholder="Jalan, nomor rumah, RT/RW"
          />
          <InputField
            label="Kelurahan"
            name="kelurahan"
            value={form.kelurahan}
            onChange={handleChange}
          />
          <InputField
            label="Kecamatan"
            name="kecamatan"
            value={form.kecamatan}
            onChange={handleChange}
          />
          <InputField
            label="Kota / Kabupaten"
            name="kotaKabupaten"
            value={form.kotaKabupaten}
            onChange={handleChange}
          />
          <InputField
            label="Provinsi"
            name="provinsi"
            value={form.provinsi}
            onChange={handleChange}
          />
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
          <InputField
            label="Nama Ayah"
            name="namaAyah"
            value={form.namaAyah}
            onChange={handleChange}
          />
          <InputField
            label="NIK Ayah"
            name="nikAyah"
            value={form.nikAyah}
            onChange={handleChange}
          />
          <SelectField
            label="Pendidikan Ayah"
            name="pendidikanAyah"
            value={form.pendidikanAyah}
            onChange={handleChange}
            options={pilihanPendidikan}
          />
          <SelectField
            label="Pekerjaan Ayah"
            name="pekerjaanAyah"
            value={form.pekerjaanAyah}
            onChange={handleChange}
            options={pilihanPekerjaan}
          />
          <InputField
            label="Nama Ibu"
            name="namaIbu"
            value={form.namaIbu}
            onChange={handleChange}
          />
          <InputField
            label="NIK Ibu"
            name="nikIbu"
            value={form.nikIbu}
            onChange={handleChange}
          />
          <SelectField
            label="Pendidikan Ibu"
            name="pendidikanIbu"
            value={form.pendidikanIbu}
            onChange={handleChange}
            options={pilihanPendidikan}
          />
          <SelectField
            label="Pekerjaan Ibu"
            name="pekerjaanIbu"
            value={form.pekerjaanIbu}
            onChange={handleChange}
            options={pilihanPekerjaan}
          />
          <InputField
            label="No. HP Orang Tua"
            name="noHpOrtu"
            value={form.noHpOrtu}
            onChange={handleChange}
          />
          <TextareaField
            label="Alamat Orang Tua"
            name="alamatOrtu"
            value={form.alamatOrtu}
            onChange={handleChange}
            placeholder="Isi jika berbeda dengan alamat siswa"
          />
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
