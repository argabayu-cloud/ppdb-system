"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import { MapPin, Trophy } from "lucide-react";

import {
  createPendaftaran,
  getDashboardPendaftaran,
  getSekolah,
  uploadDokumen,
  type Sekolah,
} from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

type GeoStatus =
  | "idle"
  | "checking"
  | "granted"
  | "denied"
  | "unsupported"
  | "error";

const ZonasiMap = dynamic(() => import("@/components/zonasiMap"), {
  ssr: false,
});

const jalurPendaftaran: JalurOption[] = [
  {
    id: "zonasi",
    label: "Zonasi",
    icon: <MapPin className="h-5 w-5" />,
    desc: "Berdasarkan jarak tempat tinggal ke sekolah",
  },
  {
    id: "prestasi",
    label: "Prestasi",
    icon: <Trophy className="h-5 w-5" />,
    desc: "Berdasarkan nilai rapor atau prestasi lomba",
  },
];

type JalurOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
  desc: string;
};

type FormState = {
  nisn: string;
  namaSekolahAsal: string;
  npsn: string;
  tahunLulus: string;
  nilaiRataRata: string;
  jenisPrestasi: string;
  tingkatPrestasi: string;
};

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function mergePendaftaranData(container: any) {
  if (!container || typeof container !== "object" || Array.isArray(container)) {
    return null;
  }

  if (
    container.pendaftaran &&
    typeof container.pendaftaran === "object" &&
    !Array.isArray(container.pendaftaran)
  ) {
    return {
      ...container.pendaftaran,
      pilihanSekolah:
        container.pilihanSekolah ||
        container.pilihan ||
        container.pilihans ||
        container.PilihanSekolah ||
        container.pendaftaran.pilihanSekolah ||
        container.pendaftaran.pilihan ||
        container.pendaftaran.pilihans ||
        container.pendaftaran.PilihanSekolah,
    };
  }

  return container;
}

function getSavedPendaftaran(res: any) {
  const candidates = [
    mergePendaftaranData(res?.data),
    mergePendaftaranData(res?.data?.data),
    mergePendaftaranData(res),
    mergePendaftaranData(res?.pendaftaran),
  ];

  const data = candidates.find(
    (item) => item && typeof item === "object" && !Array.isArray(item)
  );

  if (!data) return null;

  const hasUsefulData =
    data.id ||
    data.jalur ||
    data.nisn ||
    data.sekolah1Id ||
    data.sekolahId ||
    data.pilihanSekolah ||
    data.pilihan ||
    data.pilihans ||
    data.PilihanSekolah;

  return hasUsefulData ? data : null;
}

function toNumberOrNull(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const numberValue = Number(value);

  return Number.isNaN(numberValue) ? null : numberValue;
}

function toStringValue(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function normalizeJalur(value: unknown) {
  const jalur = String(value || "").toLowerCase();

  if (jalur === "zonasi") return "zonasi";
  if (jalur === "prestasi") return "prestasi";

  return "";
}

function getSavedNilaiRataRata(saved: any) {
  return toStringValue(
    saved.nilaiRataRata ??
      saved.nilaiRataRataRapor ??
      saved.nilaiRapor ??
      saved.rataRataRapor ??
      saved.rataRata ??
      saved.rataRataNilai ??
      saved.nilaiAkademik ??
      saved.dataAkademik?.nilaiRataRata ??
      saved.biodata?.nilaiRataRata
  );
}

function getPilihanArray(saved: any) {
  const pilihan =
    saved.pilihanSekolah ||
    saved.pilihan ||
    saved.pilihans ||
    saved.PilihanSekolah ||
    saved.pilihanSekolahList ||
    [];

  return Array.isArray(pilihan) ? pilihan : [];
}

function getSavedSekolahName(saved: any) {
  return (
    saved.sekolah1?.nama ||
    saved.sekolah?.nama ||
    saved.pilihan1?.nama ||
    saved.pilihan1?.sekolah?.nama ||
    saved.pilihanSekolah1?.sekolah?.nama ||
    saved.namaSekolahTujuan ||
    saved.sekolahTujuan ||
    ""
  );
}

function getSavedSekolahId(saved: any, sekolahOptions: Sekolah[]) {
  const pilihanArray = getPilihanArray(saved);

  if (pilihanArray.length > 0) {
    const pilihanPertama =
      pilihanArray.find(
        (item: any) =>
          item.urutan === 1 ||
          item.pilihanKe === 1 ||
          item.prioritas === 1 ||
          item.nomorPilihan === 1
      ) || pilihanArray[0];

    const id =
      pilihanPertama.sekolahId ||
      pilihanPertama.sekolah?.id ||
      pilihanPertama.idSekolah ||
      pilihanPertama.Sekolah?.id ||
      pilihanPertama.schoolId ||
      pilihanPertama.sekolah1Id ||
      "";

    if (id) return String(id);
  }

  const directId =
    saved.sekolah1Id ||
    saved.sekolahId ||
    saved.idSekolah ||
    saved.pilihan1Id ||
    saved.schoolId ||
    saved.sekolah1?.id ||
    saved.sekolah?.id ||
    saved.pilihan1?.id ||
    saved.pilihan1?.sekolah?.id ||
    saved.pilihanSekolah1?.sekolahId ||
    saved.pilihanSekolah1?.sekolah?.id ||
    "";

  if (directId) return String(directId);

  const savedSchoolName = getSavedSekolahName(saved);

  if (savedSchoolName) {
    const matchedSchool = sekolahOptions.find(
      (school) =>
        school.nama.toLowerCase().trim() ===
        String(savedSchoolName).toLowerCase().trim()
    );

    if (matchedSchool) return String(matchedSchool.id);
  }

  return "";
}

export default function PendaftaranPage() {
  const router = useRouter();

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

  const [sekolahList, setSekolahList] = useState<Sekolah[]>([]);
  const [pilihan1, setPilihan1] = useState("");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [geoMessage, setGeoMessage] = useState("");

  const [fileRaporPrestasi, setFileRaporPrestasi] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [sekolahRes, pendaftaranRes] = await Promise.all([
          getSekolah(),
          getDashboardPendaftaran().catch(() => null),
        ]);

        const sekolahData = Array.isArray(sekolahRes?.data)
          ? sekolahRes.data
          : [];

        setSekolahList(sekolahData);

        const saved = getSavedPendaftaran(pendaftaranRes);

        if (saved) {
          console.log("DATA PENDAFTARAN TERSIMPAN:", saved);

          const savedJalur = normalizeJalur(saved.jalur);
          const savedSekolahId = getSavedSekolahId(saved, sekolahData);

          if (savedJalur) {
            setJalur(savedJalur);
          }

          setForm((prev) => ({
            ...prev,
            nisn: toStringValue(saved.nisn ?? saved.biodata?.nisn),
            namaSekolahAsal: toStringValue(
              saved.namaSekolahAsal ?? saved.biodata?.namaSekolahAsal
            ),
            npsn: toStringValue(saved.npsn ?? saved.biodata?.npsn),
            tahunLulus: toStringValue(
              saved.tahunLulus ?? saved.biodata?.tahunLulus
            ),
            nilaiRataRata: getSavedNilaiRataRata(saved),
            jenisPrestasi: toStringValue(saved.jenisPrestasi),
            tingkatPrestasi: toStringValue(saved.tingkatPrestasi),
          }));

          if (savedSekolahId) {
            setPilihan1(savedSekolahId);
          }

          const savedLatitude = toNumberOrNull(
            saved.latitude ?? saved.biodata?.latitude
          );

          const savedLongitude = toNumberOrNull(
            saved.longitude ?? saved.biodata?.longitude
          );

          if (savedLatitude !== null) {
            setLatitude(savedLatitude);
          }

          if (savedLongitude !== null) {
            setLongitude(savedLongitude);
          }

          if (savedLatitude !== null && savedLongitude !== null) {
            setGeoStatus("granted");
            setGeoMessage("Lokasi tersimpan dari data pendaftaran.");
          }
        }
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil data pendaftaran");
      } finally {
        setLoadingSkeleton(false);
      }
    };

    loadInitialData();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJalurChange = (selectedJalur: string) => {
    setJalur(selectedJalur);

    setForm((prev) => ({
      ...prev,
      jenisPrestasi: "",
      tingkatPrestasi: "",
    }));

    setLatitude(null);
    setLongitude(null);
    setFileRaporPrestasi(null);

    setGeoStatus("idle");
    setGeoMessage("");
  };

  const handleJenisPrestasiChange = (e: ChangeEvent<HTMLSelectElement>) => {
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

  const handleFileRaporPrestasi = (e: ChangeEvent<HTMLInputElement>) => {
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

  if (loadingSkeleton) {
    return <PendaftaranSkeleton />;
  }

  const selectedJalur = jalurPendaftaran.find((item) => item.id === jalur);

  const selectedPilihan1 = sekolahList.find(
    (school) => String(school.id) === String(pilihan1)
  );

  const latitudeValue = latitude !== null ? latitude.toFixed(6) : "";
  const longitudeValue = longitude !== null ? longitude.toFixed(6) : "";

  const distance =
    latitude !== null &&
    longitude !== null &&
    selectedPilihan1?.latitude !== undefined &&
    selectedPilihan1?.latitude !== null &&
    selectedPilihan1?.longitude !== undefined &&
    selectedPilihan1?.longitude !== null
      ? calculateDistance(
          latitude,
          longitude,
          selectedPilihan1.latitude,
          selectedPilihan1.longitude
        )
      : null;

  const radiusZonasi =
    selectedPilihan1?.radiusZonasi !== undefined &&
    selectedPilihan1?.radiusZonasi !== null &&
    selectedPilihan1.radiusZonasi > 0
      ? selectedPilihan1.radiusZonasi
      : null;

  const isInsideRadius =
    distance !== null && radiusZonasi !== null
      ? distance <= radiusZonasi
      : false;

  const isSubmitDisabled =
    loading || (jalur === "zonasi" && geoStatus !== "granted");

  const submitButtonText = loading
    ? "Menyimpan..."
    : jalur === "zonasi" && geoStatus === "checking"
      ? "Mengecek Lokasi..."
      : jalur === "zonasi" && geoStatus !== "granted"
        ? "Aktifkan Lokasi untuk Melanjutkan"
        : "Simpan Pendaftaran";

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
      alert("Pilihan sekolah wajib diisi!");
      return;
    }

    if (jalur === "zonasi") {
      if (geoStatus !== "granted") {
        alert("Aktifkan izin lokasi terlebih dahulu sebelum menyimpan pendaftaran!");
        return;
      }

      if (latitude === null || longitude === null) {
        alert("Lokasi rumah belum terdeteksi. Aktifkan lokasi atau refresh halaman.");
        return;
      }

      if (radiusZonasi === null) {
        alert("Radius zonasi sekolah belum diatur. Hubungi admin terlebih dahulu.");
        return;
      }

      if (!isInsideRadius) {
        alert("Lokasi rumah berada di luar radius zonasi sekolah!");
        return;
      }
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

      await createPendaftaran({
        sekolah1Id: pilihan1,
        jalur: jalur.toUpperCase(),
        nisn: form.nisn,
        namaSekolahAsal: form.namaSekolahAsal,
        npsn: form.npsn,
        tahunLulus: form.tahunLulus,
        nilaiRataRata: form.nilaiRataRata,
        jenisPrestasi: form.jenisPrestasi,
        tingkatPrestasi: form.tingkatPrestasi,
        latitude,
        longitude,
      });

      if (
        jalur === "prestasi" &&
        form.jenisPrestasi === "Nilai Rapor" &&
        fileRaporPrestasi
      ) {
        await uploadDokumen(fileRaporPrestasi, "PRESTASI");
      }

      alert("Pendaftaran berhasil disimpan!");
      router.push("/dashboard/upload");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat menyimpan pendaftaran");
      }
    } finally {
      setLoading(false);
    }
  };

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
              sekolah tujuan utama kamu.
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
                type="button"
                onClick={() => handleJalurChange(item.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-blue-700 bg-[#244aad] text-white shadow-md shadow-blue-100"
                    : "border-slate-100 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      active
                        ? "border-white/20 bg-white/15 text-white"
                        : item.id === "prestasi"
                          ? "border-purple-100 bg-white text-purple-600"
                          : "border-blue-100 bg-white text-blue-600"
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

          {jalur === "zonasi" && (
            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <div className="mb-4">
                <h2 className="text-base font-bold text-blue-700">
                  Peta Zonasi Sekolah
                </h2>
                <p className="mt-1 text-xs text-blue-700/80">
                  Aktifkan izin lokasi browser agar sistem bisa mendeteksi
                  koordinat rumah peserta secara otomatis.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white">
                <ZonasiMap
                  latitude={latitude}
                  longitude={longitude}
                  setLatitude={setLatitude}
                  setLongitude={setLongitude}
                  onGeolocationStatusChange={(status, message) => {
                    setGeoStatus(status);
                    setGeoMessage(message || "");
                  }}
                />
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-blue-700">
                    Latitude
                  </label>

                  <input
                    type="text"
                    readOnly
                    value={latitudeValue}
                    placeholder="Contoh: -5.442261"
                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-blue-700">
                    Longitude
                  </label>

                  <input
                    type="text"
                    readOnly
                    value={longitudeValue}
                    placeholder="Contoh: 105.272784"
                    className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {geoStatus !== "idle" && geoStatus !== "granted" && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <p className="font-bold">Geolocation belum aktif</p>
                  <p className="mt-1 text-xs leading-5">
                    {geoMessage ||
                      "Silakan aktifkan izin lokasi browser agar bisa melanjutkan pendaftaran jalur zonasi."}
                  </p>
                </div>
              )}

              {geoStatus === "checking" && (
                <div className="mt-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                  <p className="font-bold">Mengecek lokasi...</p>
                  <p className="mt-1 text-xs leading-5">
                    Mohon izinkan akses lokasi saat browser menampilkan popup
                    perizinan.
                  </p>
                </div>
              )}

              {geoStatus === "granted" &&
                latitude !== null &&
                longitude !== null && (
                  <div className="mt-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-700">
                    Lokasi berhasil terdeteksi: {latitude.toFixed(6)},{" "}
                    {longitude.toFixed(6)}
                  </div>
                )}
            </section>
          )}

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
                Tentukan satu sekolah tujuan utama.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <SchoolSelect
                nomor="1"
                label="Pilihan Sekolah"
                required
                value={pilihan1}
                onChange={setPilihan1}
                options={sekolahList}
              />

              {selectedPilihan1 && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                    Ringkasan Pilihan
                  </p>

                  <div className="mt-2 text-sm text-slate-700">
                    {jalur === "zonasi" && distance !== null && (
                      <div className="mb-3 rounded-xl bg-white p-3 text-sm">
                        <p>
                          <span className="font-bold">Jarak Rumah:</span>{" "}
                          {distance.toFixed(2)} KM
                        </p>

                        <p>
                          <span className="font-bold">Radius Zonasi:</span>{" "}
                          {radiusZonasi !== null
                            ? `${radiusZonasi} KM`
                            : "Belum diatur"}
                        </p>

                        <p
                          className={`mt-2 font-bold ${
                            isInsideRadius ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {radiusZonasi === null
                            ? "Radius zonasi belum diatur"
                            : isInsideRadius
                              ? "Masuk radius zonasi"
                              : "Di luar radius zonasi"}
                        </p>
                      </div>
                    )}

                    <p>
                      <span className="font-bold">Sekolah tujuan:</span>{" "}
                      {selectedPilihan1.nama}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            {submitButtonText}
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
  options: Sekolah[];
}) {
  const selectedSchool = options.find(
    (school) => String(school.id) === String(value)
  );

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
        </label>
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">-- Pilih Sekolah Tujuan --</option>
        {options.map((school) => (
          <option key={school.id} value={String(school.id)}>
            {school.nama}
          </option>
        ))}
      </select>

      {selectedSchool && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5">
          <span className="text-blue-600">✓</span>
          <span className="text-sm font-semibold text-blue-700">
            {selectedSchool.nama}
          </span>
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