"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FileText,
  MapPin,
  Trophy,
  User,
  XCircle,
} from "lucide-react";

type Dokumen = {
  id: string;
  namaFile: string;
  urlFile: string;
  tipeDokumen?: string;
  status?: string;
};

type Pendaftaran = {
  id: string;
  jalur: "ZONASI" | "PRESTASI";
  status: string;
  nilaiRapor?: number;
  nilaiPrestasi?: number;
  user?: {
    nama?: string;
    email?: string;
  };
  pilihan?: {
    jarak?: number;
    sekolah?: {
      nama?: string;
    };
  }[];
  dokumen?: Dokumen[];
};

export default function VerifikasiPage() {
  const [data, setData] = useState<Pendaftaran[]>([]);
  const [selected, setSelected] = useState<Pendaftaran | null>(null);
  const [loading, setLoading] = useState(true);
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const { fetcher } = await import("@/lib/api");
        const result = await fetcher("/pendaftaran");
        const list: Pendaftaran[] = result.data || result || [];

        const khususDuaJalur = list.filter(
          (item) => item.jalur === "ZONASI" || item.jalur === "PRESTASI"
        );

        setData(khususDuaJalur);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const menunggu = data.filter(
    (item) =>
      item.status === "MENUNGGU" ||
      item.status === "DIPROSES_1" ||
      item.status === "DIPROSES_2"
  ).length;

  const diterima = data.filter((item) => item.status === "DITERIMA").length;

  const ditolak = data.filter(
    (item) => item.status === "DITOLAK" || item.status === "DITOLAK_1"
  ).length;

  const dokumen = selected?.dokumen || [];

  const berkasLengkap =
    dokumen.length > 0 &&
    dokumen.every((item) => item.status === "DITERIMA");

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 p-8 text-white shadow-sm">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute right-24 bottom-0 h-28 w-28 rounded-full bg-white/10" />

        <div className="relative">
          <p className="text-sm font-semibold text-blue-100">
            Verifikasi Pendaftar
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Verifikasi Zonasi & Prestasi
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
            Periksa detail pendaftar, cek kelengkapan berkas, lalu tentukan
            hasil verifikasi.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatCard
          title="Menunggu"
          value={loading ? "..." : menunggu}
          icon={<FileText className="h-6 w-6" />}
          color="text-amber-600"
          bg="bg-amber-50"
        />

        <StatCard
          title="Diterima"
          value={loading ? "..." : diterima}
          icon={<CheckCircle2 className="h-6 w-6" />}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />

        <StatCard
          title="Ditolak"
          value={loading ? "..." : ditolak}
          icon={<XCircle className="h-6 w-6" />}
          color="text-red-600"
          bg="bg-red-50"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-800">Daftar Pendaftar</h2>
          <p className="mt-1 text-sm text-slate-500">
            Khusus jalur Zonasi dan Prestasi.
          </p>

          <div className="mt-5 flex flex-col gap-3">
            {loading ? (
              <p className="text-sm text-slate-400">Memuat data...</p>
            ) : data.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center">
                <User className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                <p className="font-semibold text-slate-700">
                  Belum ada pendaftar
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Data akan muncul setelah siswa mendaftar.
                </p>
              </div>
            ) : (
              data.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelected(item);
                    setCatatan("");
                  }}
                  className={`rounded-2xl border p-4 text-left transition ${selected?.id === item.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.user?.nama || "Nama belum tersedia"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Status: {item.status}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${item.jalur === "ZONASI"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                        }`}
                    >
                      {item.jalur}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          {!selected ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <User className="mb-4 h-16 w-16 text-slate-300" />
              <p className="font-semibold text-slate-700">
                Pilih pendaftar dulu
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Detail dan checklist berkas akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-600">
                    Detail Pendaftar
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {selected.user?.nama || "Nama belum tersedia"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {selected.user?.email || "Email belum tersedia"}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-xl px-4 py-2 text-sm font-semibold ${selected.jalur === "ZONASI"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                    }`}
                >
                  Jalur {selected.jalur}
                </span>
              </div>

              {selected.jalur === "ZONASI" ? (
                <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                      <MapPin className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800">
                        Penilaian Zonasi
                      </h3>
                      <p className="text-sm text-slate-500">
                        Berdasarkan jarak domisili ke sekolah.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white p-4">
                    <p className="text-xs text-slate-500">Jarak</p>
                    <p className="mt-1 text-2xl font-bold text-blue-700">
                      {selected.pilihan?.[0]?.jarak
                        ? `${selected.pilihan[0].jarak} km`
                        : "Belum tersedia"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-purple-100 bg-purple-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white">
                      <Trophy className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800">
                        Penilaian Prestasi
                      </h3>
                      <p className="text-sm text-slate-500">
                        Berdasarkan nilai rapor dan nilai prestasi.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs text-slate-500">Nilai Rapor</p>
                      <p className="mt-1 text-2xl font-bold text-purple-700">
                        {selected.nilaiRapor || 0}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs text-slate-500">Nilai Prestasi</p>
                      <p className="mt-1 text-2xl font-bold text-purple-700">
                        {selected.nilaiPrestasi || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-800">
                      Checklist Berkas
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Cek dokumen yang sudah diunggah siswa.
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${berkasLengkap
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                      }`}
                  >
                    {berkasLengkap ? "Lengkap" : "Belum Lengkap"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {dokumen.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center md:col-span-2">
                      <p className="font-semibold text-slate-700">
                        Belum ada berkas
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Berkas akan muncul setelah siswa mengunggah dokumen.
                      </p>
                    </div>
                  ) : (
                    dokumen.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex items-center gap-3">
                          <ClipboardCheck className="h-5 w-5 text-blue-600" />

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {item.tipeDokumen || item.namaFile}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.status || "MENUNGGU"}
                            </p>
                          </div>
                        </div>

                        <a
                          href={item.urlFile}
                          target="_blank"
                          className="flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                        >
                          <Eye className="h-4 w-4" />
                          Lihat
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Catatan Verifikasi
                </p>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Tulis catatan hasil pengecekan..."
                  className="min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700">
                  Tolak
                </button>

                <button
                  disabled={!berkasLengkap}
                  className={`rounded-xl px-5 py-3 font-semibold text-white ${berkasLengkap
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "cursor-not-allowed bg-slate-300"
                    }`}
                >
                  Terima / Verifikasi
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  bg,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ${color}`}>
        {icon}
      </div>

      <h2 className="text-4xl font-bold text-slate-900">{value}</h2>
      <p className="mt-1 text-sm text-slate-500">{title}</p>
    </div>
  );
}