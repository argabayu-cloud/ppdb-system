"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getPendaftarAdmin,
  seleksiPendaftar,
  validasiDokumenAdmin,
} from "@/lib/api";

type StatusPenolakan = "DOKUMEN" | "ZONASI" | "LAINNYA";

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

type StatusFilter = "SEMUA" | Pendaftar["status"];

const jenisPenolakanOptions: {
  value: StatusPenolakan;
  label: string;
  desc: string;
}[] = [
  {
    value: "DOKUMEN",
    label: "Dokumen",
    desc: "Berkas peserta salah atau tidak sesuai.",
  },
  {
    value: "ZONASI",
    label: "Zonasi",
    desc: "Lokasi peserta tidak masuk radius zonasi.",
  },
  {
    value: "LAINNYA",
    label: "Lainnya",
    desc: "Alasan lain di luar dokumen dan zonasi.",
  },
];

const formatTanggal = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "DITERIMA":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    case "DITOLAK":
      return "bg-red-50 text-red-700 ring-red-100";
    case "DIPROSES":
      return "bg-blue-50 text-blue-700 ring-blue-100";
    default:
      return "bg-amber-50 text-amber-700 ring-amber-100";
  }
};

const getDokumenInfo = (dokumen: Dokumen[]) => {
  const dokumenLengkap = dokumen.length > 0;
  const adaDokumenDitolak = dokumen.some((doc) => doc.status === "DITOLAK");
  const adaDokumenMenunggu = dokumen.some((doc) => doc.status === "MENUNGGU");
  const semuaDokumenDiterima =
    dokumenLengkap && dokumen.every((doc) => doc.status === "DITERIMA");

  const bisaDiterima = dokumenLengkap && !adaDokumenDitolak;

  let label = "Dokumen belum lengkap";
  let className = "bg-slate-100 text-slate-600";

  if (semuaDokumenDiterima) {
    label = "Dokumen valid";
    className = "bg-emerald-50 text-emerald-600";
  } else if (adaDokumenDitolak) {
    label = "Ada dokumen ditolak";
    className = "bg-red-50 text-red-600";
  } else if (adaDokumenMenunggu) {
    label = "Menunggu validasi";
    className = "bg-amber-50 text-amber-600";
  }

  return {
    dokumenLengkap,
    adaDokumenDitolak,
    adaDokumenMenunggu,
    semuaDokumenDiterima,
    bisaDiterima,
    label,
    className,
  };
};

export default function AdminPendaftarPage() {
  const [pendaftar, setPendaftar] = useState<Pendaftar[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("SEMUA");

  const [alasan, setAlasan] = useState<Record<string, string>>({});
  const [jenisPenolakan, setJenisPenolakan] = useState<
    Record<string, StatusPenolakan>
  >({});

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

  const selectedPendaftar = useMemo(() => {
    return pendaftar.find((item) => item.id === selectedId) || null;
  }, [pendaftar, selectedId]);

  const filteredPendaftar = useMemo(() => {
    const search = keyword.toLowerCase().trim();

    return pendaftar.filter((item) => {
      const biodata = item.pendaftaran.user.biodata;
      const nama = biodata?.namaLengkap || item.pendaftaran.user.nama;
      const nisn = item.pendaftaran.nisn || "";
      const noDaftar = item.pendaftaran.noPendaftaran || "";
      const jalur = item.pendaftaran.jalur || "";

      const cocokKeyword =
        !search ||
        nama.toLowerCase().includes(search) ||
        nisn.toLowerCase().includes(search) ||
        noDaftar.toLowerCase().includes(search) ||
        jalur.toLowerCase().includes(search);

      const cocokStatus =
        statusFilter === "SEMUA" || item.status === statusFilter;

      return cocokKeyword && cocokStatus;
    });
  }, [pendaftar, keyword, statusFilter]);

  const totalDiproses = pendaftar.filter(
    (item) => item.status === "MENUNGGU" || item.status === "DIPROSES",
  ).length;

  const totalDiterima = pendaftar.filter(
    (item) => item.status === "DITERIMA",
  ).length;

  const totalDitolak = pendaftar.filter(
    (item) => item.status === "DITOLAK",
  ).length;

  const handleTolakDokumen = async (dokumenId: string) => {
    try {
      setProcessingId(dokumenId);

      await validasiDokumenAdmin({
        dokumenId,
        status: "DITOLAK",
      });

      await loadPendaftar();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menolak dokumen");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSeleksi = async (
    pilihanId: string,
    status: "DITERIMA" | "DITOLAK",
    bisaDiterima: boolean,
  ) => {
    try {
      if (status === "DITERIMA" && !bisaDiterima) {
        alert(
          "Peserta belum bisa diterima karena dokumen belum lengkap atau masih ada dokumen yang ditolak.",
        );
        return;
      }

      if (status === "DITOLAK") {
        if (!alasan[pilihanId]?.trim()) {
          alert("Alasan penolakan wajib diisi.");
          return;
        }

        if (!jenisPenolakan[pilihanId]) {
          alert("Jenis penolakan wajib dipilih.");
          return;
        }
      }

      setProcessingId(pilihanId);

      await seleksiPendaftar({
        pilihanId,
        status,
        alasan: status === "DITOLAK" ? alasan[pilihanId] : undefined,
        jenisPenolakan:
          status === "DITOLAK" ? jenisPenolakan[pilihanId] : undefined,
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
        <div className="h-20 rounded-2xl bg-slate-100" />
        <div className="h-72 rounded-2xl bg-slate-100" />
      </div>
    );
  }

  const renderDetailPendaftar = (item: Pendaftar) => {
    const biodata = item.pendaftaran.user.biodata;
    const dokumen = item.pendaftaran.dokumen;
    const dokumenInfo = getDokumenInfo(dokumen);

    return (
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedId(null)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            ← Kembali ke daftar
          </button>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${getStatusBadgeClass(
              item.status,
            )}`}
          >
            {item.status}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                {item.pendaftaran.noPendaftaran || "Belum ada nomor"}
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-800">
                {biodata?.namaLengkap || item.pendaftaran.user.nama}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                NISN: {item.pendaftaran.nisn || "-"} - Jalur:{" "}
                {item.pendaftaran.jalur}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Sekolah tujuan: {item.sekolah.nama}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <h3 className="text-sm font-bold text-slate-800">
                Biodata Peserta
              </h3>

              <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <p>NIK: {biodata?.nik || "-"}</p>
                <p>
                  No. HP:{" "}
                  {biodata?.noHp || item.pendaftaran.user.noTlpn || "-"}
                </p>
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
                className={`rounded-full px-3 py-1 text-xs font-bold ${dokumenInfo.className}`}
              >
                {dokumenInfo.label}
              </span>
            </div>

            <p className="mb-4 text-xs leading-5 text-slate-500">
              Jika ada berkas yang salah, klik Tolak Berkas pada dokumen
              tersebut. Jika semua berkas sudah sesuai, langsung klik Terima
              Siswa di bagian bawah.
            </p>

            <div className="flex flex-col gap-3">
              {dokumen.length === 0 ? (
                <p className="text-sm text-slate-500">Belum ada dokumen.</p>
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
                        <button
                          onClick={() => handleTolakDokumen(doc.id)}
                          disabled={processingId === doc.id}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:bg-slate-300"
                        >
                          Tolak Berkas
                        </button>
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

            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-slate-600">
                  Jenis Penolakan
                </label>

                <select
                  value={jenisPenolakan[item.id] || ""}
                  onChange={(e) =>
                    setJenisPenolakan((prev) => ({
                      ...prev,
                      [item.id]: e.target.value as StatusPenolakan,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">-- Pilih jika menolak --</option>
                  {jenisPenolakanOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs font-bold text-slate-600">
                  Status Dokumen
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {dokumenInfo.adaDokumenDitolak
                    ? "Ada dokumen yang ditolak."
                    : dokumenInfo.dokumenLengkap
                      ? "Tidak ada dokumen yang ditolak."
                      : "Dokumen belum lengkap."}
                </p>
              </div>
            </div>

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
                onClick={() =>
                  handleSeleksi(item.id, "DITERIMA", dokumenInfo.bisaDiterima)
                }
                disabled={processingId === item.id || !dokumenInfo.bisaDiterima}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Terima Siswa
              </button>

              <button
                onClick={() =>
                  handleSeleksi(item.id, "DITOLAK", dokumenInfo.bisaDiterima)
                }
                disabled={processingId === item.id}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Tolak Siswa
              </button>
            </div>

            {!dokumenInfo.bisaDiterima && (
              <p className="mt-3 text-xs font-semibold text-amber-600">
                Peserta hanya bisa diterima jika dokumen sudah lengkap dan tidak
                ada dokumen yang ditolak.
              </p>
            )}

            {jenisPenolakan[item.id] && (
              <p className="mt-2 text-xs text-slate-500">
                {
                  jenisPenolakanOptions.find(
                    (option) => option.value === jenisPenolakan[item.id],
                  )?.desc
                }
              </p>
            )}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 p-8 text-white shadow-sm">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="absolute bottom-0 right-24 h-28 w-28 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              Admin Sekolah
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight">
              Data Pendaftar
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
              Kelola data peserta dalam bentuk tabel agar proses seleksi lebih
              cepat dan rapi.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/15 px-5 py-4 text-center backdrop-blur">
            <p className="text-xs text-blue-100">Total Pendaftar</p>
            <p className="mt-1 text-2xl font-bold">{pendaftar.length}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-400">
            Diproses
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-700">
            {totalDiproses}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-400">
            Diterima
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {totalDiterima}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-400">
            Ditolak
          </p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {totalDitolak}
          </p>
        </div>
      </section>

      {selectedPendaftar ? (
        renderDetailPendaftar(selectedPendaftar)
      ) : pendaftar.length === 0 ? (
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
        <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Daftar Pendaftar
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Klik Detail untuk melihat biodata, dokumen, dan melakukan
                seleksi peserta.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari nama, NISN, no daftar..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="SEMUA">Semua Status</option>
                <option value="MENUNGGU">Menunggu</option>
                <option value="DIPROSES">Diproses</option>
                <option value="DITERIMA">Diterima</option>
                <option value="DITOLAK">Ditolak</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-bold">No</th>
                  <th className="px-5 py-4 font-bold">Pendaftar</th>
                  <th className="px-5 py-4 font-bold">NISN</th>
                  <th className="px-5 py-4 font-bold">Jalur</th>
                  <th className="px-5 py-4 font-bold">Dokumen</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 font-bold">Tanggal</th>
                  <th className="px-5 py-4 text-right font-bold">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPendaftar.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      Tidak ada data yang sesuai dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredPendaftar.map((item, index) => {
                    const biodata = item.pendaftaran.user.biodata;
                    const nama =
                      biodata?.namaLengkap || item.pendaftaran.user.nama;
                    const dokumenInfo = getDokumenInfo(
                      item.pendaftaran.dokumen,
                    );

                    return (
                      <tr
                        key={item.id}
                        className="bg-white transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-semibold text-slate-500">
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-800">{nama}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.pendaftaran.noPendaftaran ||
                              "Belum ada nomor"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {item.pendaftaran.nisn || "-"}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                            {item.pendaftaran.jalur}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-600">
                              {item.pendaftaran.dokumen.length} berkas
                            </span>
                            <span
                              className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${dokumenInfo.className}`}
                            >
                              {dokumenInfo.label}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${getStatusBadgeClass(
                              item.status,
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {formatTanggal(item.pendaftaran.submittedAt)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => setSelectedId(item.id)}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}