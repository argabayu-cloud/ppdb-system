"use client";

import { useState } from "react";
import {
  MapPin,
  Trophy,
  CheckCircle2,
  XCircle,
  User,
  FileText,
  Eye,
  ClipboardCheck,
} from "lucide-react";

type Berkas = {
  nama: string;
  status: "Lengkap" | "Belum Ada";
};

type Pendaftar = {
  id: number;
  nama: string;
  nisn: string;
  jalur: "Zonasi" | "Prestasi";
  jarak?: string;
  nilai?: number;
  prestasi?: string;
  status: "Menunggu" | "Diterima" | "Ditolak";
  berkas: Berkas[];
};

const dataAwal: Pendaftar[] = [
  {
    id: 1,
    nama: "Arga Bayu R",
    nisn: "1234567890",
    jalur: "Zonasi",
    jarak: "1.2 km",
    status: "Menunggu",
    berkas: [
      { nama: "Kartu Keluarga", status: "Lengkap" },
      { nama: "Akta Kelahiran", status: "Lengkap" },
      { nama: "Surat Domisili", status: "Lengkap" },
      { nama: "Pas Foto", status: "Belum Ada" },
    ],
  },
  {
    id: 2,
    nama: "Amelia Rizki Kusuma Ningrum",
    nisn: "0987654321",
    jalur: "Prestasi",
    nilai: 88,
    prestasi: "Juara 2 Olimpiade Matematika",
    status: "Menunggu",
    berkas: [
      { nama: "Kartu Keluarga", status: "Lengkap" },
      { nama: "Akta Kelahiran", status: "Lengkap" },
      { nama: "Rapor", status: "Lengkap" },
      { nama: "Sertifikat Prestasi", status: "Lengkap" },
    ],
  },
  {
    id: 3,
    nama: "Erwin Gunawa",
    nisn: "0987654322",
    jalur: "Prestasi",
    nilai: 91,
    prestasi: "Juara 1 Lomba Sains",
    status: "Menunggu",
    berkas: [
      { nama: "Kartu Keluarga", status: "Lengkap" },
      { nama: "Akta Kelahiran", status: "Lengkap" },
      { nama: "Rapor", status: "Belum Ada" },
      { nama: "Sertifikat Prestasi", status: "Lengkap" },
    ],
  },
];

export default function VerifikasiPage() {
  const [pendaftar, setPendaftar] = useState<Pendaftar[]>(dataAwal);
  const [selected, setSelected] = useState<Pendaftar | null>(null);
  const [catatan, setCatatan] = useState("");

  const handleStatus = (id: number, status: "Diterima" | "Ditolak") => {
    setPendaftar((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );

    if (selected?.id === id) {
      setSelected({ ...selected, status });
    }
  };

  const totalMenunggu = pendaftar.filter((p) => p.status === "Menunggu").length;
  const totalDiterima = pendaftar.filter((p) => p.status === "Diterima").length;
  const totalDitolak = pendaftar.filter((p) => p.status === "Ditolak").length;

  const berkasLengkap =
    selected?.berkas.every((b) => b.status === "Lengkap") ?? false;

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 p-6 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute right-20 bottom-0 h-28 w-28 rounded-full bg-white/10" />

        <div className="relative">
          <p className="text-sm text-blue-100">Verifikasi Berkas</p>
          <h1 className="mt-1 text-3xl font-bold">
            Verifikasi Zonasi & Prestasi
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
            Periksa detail pendaftar, cek kelengkapan berkas, lalu tentukan
            hasil verifikasi.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
          <FileText className="w-7 h-7 text-amber-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">{totalMenunggu}</h2>
          <p className="text-sm text-slate-500">Menunggu Verifikasi</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">{totalDiterima}</h2>
          <p className="text-sm text-slate-500">Diterima</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
          <XCircle className="w-7 h-7 text-red-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">{totalDitolak}</h2>
          <p className="text-sm text-slate-500">Ditolak</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LIST */}
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4">
            Daftar Pendaftar
          </h2>

          <div className="flex flex-col gap-3">
            {pendaftar.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelected(item);
                  setCatatan("");
                }}
                className={`text-left rounded-2xl border p-4 transition-all ${selected?.id === item.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-100 hover:bg-slate-50"
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {item.nama}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      NISN: {item.nisn}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${item.jalur === "Zonasi"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                      }`}
                  >
                    {item.jalur}
                  </span>
                </div>

                <span
                  className={`inline-block mt-3 text-xs px-3 py-1 rounded-full font-medium ${item.status === "Menunggu"
                      ? "bg-amber-100 text-amber-700"
                      : item.status === "Diterima"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {item.status}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* DETAIL */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-100 shadow-sm p-6 min-h-[520px]">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
              <User className="w-16 h-16 mb-4 text-slate-300" />
              <p>Pilih pendaftar untuk melihat detail verifikasi</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* IDENTITAS */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-blue-600 font-semibold">
                    Detail Pendaftar
                  </p>
                  <h2 className="text-2xl font-bold text-slate-800 mt-1">
                    {selected.nama}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    NISN: {selected.nisn}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-xl text-sm font-semibold ${selected.jalur === "Zonasi"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                    }`}
                >
                  Jalur {selected.jalur}
                </span>
              </div>

              {/* PENILAIAN */}
              {selected.jalur === "Zonasi" ? (
                <div className="rounded-3xl bg-blue-50 border border-blue-100 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">
                        Penilaian Jalur Zonasi
                      </h3>
                      <p className="text-sm text-slate-500">
                        Berdasarkan jarak domisili ke sekolah.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-blue-100">
                    <p className="text-xs text-slate-500">Jarak Rumah</p>
                    <p className="text-xl font-bold text-blue-700 mt-1">
                      {selected.jarak}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl bg-purple-50 border border-purple-100 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">
                        Penilaian Jalur Prestasi
                      </h3>
                      <p className="text-sm text-slate-500">
                        Berdasarkan nilai rapor dan sertifikat prestasi.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 border border-purple-100">
                      <p className="text-xs text-slate-500">Nilai Rapor</p>
                      <p className="text-xl font-bold text-purple-700 mt-1">
                        {selected.nilai}
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-purple-100">
                      <p className="text-xs text-slate-500">Prestasi</p>
                      <p className="text-sm font-semibold text-slate-700 mt-1">
                        {selected.prestasi}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* BERKAS */}
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800">
                      Checklist Berkas
                    </h3>
                    <p className="text-sm text-slate-500">
                      Periksa kelengkapan dokumen pendaftar.
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${berkasLengkap
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                      }`}
                  >
                    {berkasLengkap ? "Lengkap" : "Belum Lengkap"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selected.berkas.map((b, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <ClipboardCheck
                          className={`w-5 h-5 ${b.status === "Lengkap"
                              ? "text-emerald-600"
                              : "text-amber-600"
                            }`}
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            {b.nama}
                          </p>
                          <p
                            className={`text-xs ${b.status === "Lengkap"
                                ? "text-emerald-600"
                                : "text-amber-600"
                              }`}
                          >
                            {b.status}
                          </p>
                        </div>
                      </div>

                      <button className="text-xs bg-blue-50 text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-100 flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        Lihat
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CATATAN */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Catatan Verifikasi
                </p>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Tambahkan catatan hasil pengecekan berkas..."
                  className="w-full min-h-28 rounded-xl border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>

              {/* AKSI */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => handleStatus(selected.id, "Ditolak")}
                  className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                >
                  Tolak
                </button>

                <button
                  onClick={() => handleStatus(selected.id, "Diterima")}
                  disabled={!berkasLengkap}
                  className={`px-5 py-3 rounded-xl text-white font-semibold ${berkasLengkap
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-slate-300 cursor-not-allowed"
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