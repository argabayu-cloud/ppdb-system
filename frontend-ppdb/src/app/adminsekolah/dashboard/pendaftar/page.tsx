"use client";

import { useEffect, useState } from "react";
import {
  getPendaftarAdmin,
  seleksiPendaftar,
  validasiDokumenAdmin,
} from "@/lib/api";

type Dokumen = {
  id: string;
  namaFile: string;
  urlFile: string;
  tipeDokumen: string | null;
  status: "MENUNGGU" | "DITERIMA" | "DITOLAK";
};

type Biodata = {
  namaLengkap?: string | null;
  nik?: string | null;
  tempatLahir?: string | null;
  tanggalLahir?: string | null;
  jenisKelamin?: string | null;
  alamat?: string | null;
  noHp?: string | null;
  namaAyah?: string | null;
  namaIbu?: string | null;
};

type Pendaftar = {
  id: string;
  status: "MENUNGGU" | "DIPROSES" | "DITERIMA" | "DITOLAK";
  alasanPenolakan?: string | null;
  sekolah: {
    nama: string;
  };
  pendaftaran: {
    id: string;
    nisn?: string | null;
    jalur: string;
    status: string;
    noPendaftaran?: string | null;
    submittedAt?: string | null;
    user: {
      id: string;
      nama: string;
      email: string;
      noTlpn?: string | null;
      biodata?: Biodata | null;
    };
    dokumen: Dokumen[];
  };
};

export default function AdminPendaftarPage() {
  const [pendaftar, setPendaftar] = useState<Pendaftar[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [alasan, setAlasan] = useState<Record<string, string>>({});

  const loadPendaftar = async () => {
    try {
      setLoading(true);
      const res = await getPendaftarAdmin();
      setPendaftar(res.data || []);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data pendaftar",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendaftar();
  }, []);

  const handleValidasiDokumen = async (
    dokumenId: string,
    status: "DITERIMA" | "DITOLAK",
  ) => {
    try {
      setProcessingId(dokumenId);

      await validasiDokumenAdmin({
        dokumenId,
        status,
      });

      await loadPendaftar();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Gagal validasi dokumen",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleSeleksi = async (
    pilihanId: string,
    status: "DITERIMA" | "DITOLAK",
  ) => {
    try {
      if (status === "DITOLAK" && !alasan[pilihanId]?.trim()) {
        alert("Alasan penolakan wajib diisi");
        return;
      }

      setProcessingId(pilihanId);

      await seleksiPendaftar({
        pilihanId,
        status,
        alasan: status === "DITOLAK" ? alasan[pilihanId] : undefined,
      });

      await loadPendaftar();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal melakukan seleksi");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-32 rounded-2xl bg-slate-100" />
        <div className="h-52 rounded-2xl bg-slate-100" />
        <div className="h-52 rounded-2xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.96),rgba(30,64,175,0.9),rgba(37,99,235,0.72))]" />

        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="rounded-full border border-blue-300/40 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-100">
              Admin Sekolah
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight">
              Data Pendaftar
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-50/90">
              Daftar peserta yang memilih sekolah ini sebagai tujuan
              pendaftaran.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/15 px-5 py-4 text-center backdrop-blur">
            <p className="text-xs text-blue-100">Total Pendaftar</p>
            <p className="mt-1 text-2xl font-bold">{pendaftar.length}</p>
          </div>
        </div>
      </section>

      {pendaftar.length === 0 ? (
        <section className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">
            Belum ada pendaftar
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Data peserta akan muncul setelah siswa menyelesaikan pendaftaran dan
            mengirim berkas.
          </p>
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          {pendaftar.map((item) => {
            const biodata = item.pendaftaran.user.biodata;
            const dokumen = item.pendaftaran.dokumen;
            const semuaDokumenDiterima =
              dokumen.length > 0 &&
              dokumen.every((doc) => doc.status === "DITERIMA");

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                      {item.pendaftaran.noPendaftaran || "Belum ada nomor"}
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-slate-800">
                      {biodata?.namaLengkap || item.pendaftaran.user.nama}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      NISN: {item.pendaftaran.nisn || "-"} · Jalur:{" "}
                      {item.pendaftaran.jalur}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Sekolah tujuan: {item.sekolah.nama}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {item.status}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="text-sm font-bold text-slate-800">
                      Biodata Peserta
                    </h3>

                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <p>NIK: {biodata?.nik || "-"}</p>
                      <p>No. HP: {biodata?.noHp || item.pendaftaran.user.noTlpn || "-"}</p>
                      <p>Tempat Lahir: {biodata?.tempatLahir || "-"}</p>
                      <p>Tanggal Lahir: {biodata?.tanggalLahir || "-"}</p>
                      <p className="sm:col-span-2">
                        Alamat: {biodata?.alamat || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="text-sm font-bold text-slate-800">
                      Data Orang Tua
                    </h3>

                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <p>Ayah: {biodata?.namaAyah || "-"}</p>
                      <p>Ibu: {biodata?.namaIbu || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-100 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-slate-800">
                      Dokumen Peserta
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        semuaDokumenDiterima
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {semuaDokumenDiterima
                        ? "Dokumen valid"
                        : "Perlu validasi"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {dokumen.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        Belum ada dokumen.
                      </p>
                    ) : (
                      dokumen.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:flex-row sm:items-center"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {doc.tipeDokumen || "Dokumen"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {doc.namaFile}
                            </p>

                            <a
                              href={doc.urlFile}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 inline-block text-xs font-bold text-blue-600 hover:underline"
                            >
                              Lihat dokumen
                            </a>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                doc.status === "DITERIMA"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : doc.status === "DITOLAK"
                                    ? "bg-red-50 text-red-600"
                                    : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {doc.status}
                            </span>

                            {doc.status === "MENUNGGU" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleValidasiDokumen(doc.id, "DITERIMA")
                                  }
                                  disabled={processingId === doc.id}
                                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:bg-slate-300"
                                >
                                  Terima
                                </button>

                                <button
                                  onClick={() =>
                                    handleValidasiDokumen(doc.id, "DITOLAK")
                                  }
                                  disabled={processingId === doc.id}
                                  className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:bg-slate-300"
                                >
                                  Tolak
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <h3 className="text-sm font-bold text-slate-800">
                    Keputusan Seleksi
                  </h3>

                  <textarea
                    value={alasan[item.id] || ""}
                    onChange={(e) =>
                      setAlasan((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    placeholder="Isi alasan jika peserta ditolak"
                    rows={3}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleSeleksi(item.id, "DITERIMA")}
                      disabled={processingId === item.id}
                      className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:bg-slate-300"
                    >
                      Terima Siswa
                    </button>

                    <button
                      onClick={() => handleSeleksi(item.id, "DITOLAK")}
                      disabled={processingId === item.id}
                      className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:bg-slate-300"
                    >
                      Tolak Siswa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}