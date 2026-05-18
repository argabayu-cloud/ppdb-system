"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const simulasiHasil = {
  nama: "Arga Bayu R",
  nisn: "1234567890",
  jalur: "Zonasi",
  noRegistrasi: "PPDB-2025-00123",
  status: "diterima",
  sekolahDiterima: "SMP Negeri 3 Bandar Lampung",
  pilihan: [
    { urutan: 1, sekolah: "SMP Negeri 3 Bandar Lampung", status: "diterima" },
    { urutan: 2, sekolah: "SMP Negeri 7 Bandar Lampung", status: "gugur" },
  ],
  tanggalPengumuman: "10 Juni 2025",
  batasUlang: "11-15 Juni 2025",
};

export default function PengumumanPage() {
  const [hasil, setHasil] = useState<typeof simulasiHasil | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasil(simulasiHasil);
      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  const handleDownloadPDF = async () => {
    if (!hasil || downloading) return;

    setDownloading(true);

    try {
      const { default: jsPDF } = await import("jspdf");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const center = pageWidth / 2;
      const isAccepted = hasil.status === "diterima";

      doc.setFillColor(30, 64, 175);
      doc.rect(0, 0, pageWidth, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("DINAS PENDIDIKAN KOTA BANDAR LAMPUNG", center, 15, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("PPDB SMP TERPADU TAHUN AJARAN 2025/2026", center, 25, {
        align: "center",
      });

      doc.setFontSize(10);
      doc.text("Jl. Soekarno Hatta, Kota Bandar Lampung", center, 33, {
        align: "center",
      });

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("SURAT KETERANGAN HASIL SELEKSI", center, 58, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`No. Registrasi: ${hasil.noRegistrasi}`, center, 66, {
        align: "center",
      });

      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(0.8);
      doc.line(20, 70, pageWidth - 20, 70);

      if (isAccepted) {
        doc.setFillColor(220, 252, 231);
        doc.setTextColor(21, 128, 61);
      } else {
        doc.setFillColor(254, 226, 226);
        doc.setTextColor(190, 18, 60);
      }

      doc.roundedRect(20, 76, pageWidth - 40, 20, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(
        isAccepted ? "DINYATAKAN DITERIMA" : "DINYATAKAN TIDAK DITERIMA",
        center,
        90,
        { align: "center" },
      );

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("DATA PESERTA", 20, 108);

      doc.setDrawColor(226, 232, 240);
      doc.line(20, 112, pageWidth - 20, 112);

      const rows = [
        ["Nama Lengkap", hasil.nama],
        ["NISN", hasil.nisn],
        ["No. Registrasi", hasil.noRegistrasi],
        ["Jalur Pendaftaran", hasil.jalur],
        ["Tanggal Pengumuman", hasil.tanggalPengumuman],
        ["Status", isAccepted ? "Diterima" : "Tidak Diterima"],
      ];

      let y = 122;

      rows.forEach(([label, value]) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(100, 116, 139);
        doc.text(label, 25, y);

        doc.setTextColor(15, 23, 42);
        doc.text(`: ${value}`, 85, y);

        y += 9;
      });

      y += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("RINCIAN PILIHAN SEKOLAH", 20, y);

      y += 5;
      doc.setDrawColor(226, 232, 240);
      doc.line(20, y, pageWidth - 20, y);

      y += 10;

      hasil.pilihan.forEach((p) => {
        const accepted = p.status === "diterima";

        if (accepted) {
          doc.setFillColor(220, 252, 231);
          doc.setTextColor(21, 128, 61);
        } else {
          doc.setFillColor(255, 241, 242);
          doc.setTextColor(190, 18, 60);
        }

        doc.roundedRect(20, y - 6, pageWidth - 40, 14, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`Pilihan ${p.urutan}: ${p.sekolah}`, 27, y + 2);
        doc.text(accepted ? "DITERIMA" : "GUGUR", pageWidth - 25, y + 2, {
          align: "right",
        });

        y += 18;
      });

      if (isAccepted) {
        y += 4;

        doc.setFillColor(30, 64, 175);
        doc.roundedRect(20, y - 6, pageWidth - 40, 22, 3, 3, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text("Diterima di:", center, y + 3, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(hasil.sekolahDiterima, center, y + 13, {
          align: "center",
        });

        y += 32;

        doc.setFillColor(255, 251, 235);
        doc.roundedRect(20, y, pageWidth - 40, 22, 3, 3, "F");

        doc.setTextColor(146, 64, 14);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("WAJIB DAFTAR ULANG", 27, y + 8);

        doc.setFont("helvetica", "normal");
        doc.text(`Tanggal: ${hasil.batasUlang}`, 27, y + 15);

        y += 34;
      }

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(
        `Bandar Lampung, ${hasil.tanggalPengumuman}`,
        pageWidth - 25,
        y,
        { align: "right" },
      );

      y += 7;
      doc.text("Kepala Dinas Pendidikan", pageWidth - 25, y, {
        align: "right",
      });

      y += 30;
      doc.setFont("helvetica", "bold");
      doc.text("( _________________________ )", pageWidth - 25, y, {
        align: "right",
      });

      doc.setFillColor(241, 245, 249);
      doc.rect(0, 270, pageWidth, 27, "F");

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(
        "Dokumen ini diterbitkan secara digital oleh sistem PPDB.",
        center,
        278,
        { align: "center" },
      );
      doc.text(
        `Dicetak pada: ${new Date().toLocaleString("id-ID")}`,
        center,
        285,
        { align: "center" },
      );

      doc.save(`Hasil-PPDB-${hasil.nisn}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Gagal membuat PDF. Pastikan package jspdf sudah terinstall.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <PengumumanSkeleton />;
  }

  if (!hasil) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-3xl">
            📭
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Data Belum Tersedia
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Hasil seleksi PPDB belum diumumkan atau data peserta tidak
            ditemukan.
          </p>
        </div>
      </div>
    );
  }

  const isAccepted = hasil.status === "diterima";

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.96),rgba(30,64,175,0.9),rgba(37,99,235,0.72))]" />

        <div className="relative z-10 flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center lg:p-7">
          <div>
            <span className="w-fit rounded-full border border-blue-300/40 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-100">
              Pengumuman Hasil Seleksi
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
              Hasil Seleksi PPDB
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-50/90">
              Tahun Ajaran 2025/2026 · Kota Bandar Lampung. Simpan bukti hasil
              seleksi untuk proses daftar ulang di sekolah tujuan.
            </p>
          </div>

          <div className="min-w-[165px] rounded-2xl border border-white/10 bg-white/15 px-5 py-4 text-center backdrop-blur">
            <p className="text-xs text-blue-100">Status Seleksi</p>
            <p className="mt-1 text-lg font-bold text-white">
              {isAccepted ? "Diterima" : "Tidak Diterima"}
            </p>
            <p className="mt-1 text-xs text-blue-200">
              {hasil.tanggalPengumuman}
            </p>
          </div>
        </div>
      </section>

      {isAccepted && (
        <section className="relative overflow-hidden rounded-[2rem] bg-emerald-950 p-8 text-center text-white shadow-xl">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,44,34,0.98),rgba(4,120,87,0.9),rgba(16,185,129,0.72))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(110,231,183,0.28),transparent_34%)]" />

          <div className="relative z-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/15 text-3xl backdrop-blur">
              🎉
            </div>

            <h2 className="mt-5 text-3xl font-extrabold">Selamat!</h2>

            <p className="mt-2 text-sm text-emerald-50">
              Kamu dinyatakan diterima di
            </p>

            <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-white/10 bg-white/15 px-6 py-4 backdrop-blur">
              <p className="text-xl font-bold text-white">
                {hasil.sekolahDiterima}
              </p>
            </div>
          </div>
        </section>
      )}

      {!isAccepted && (
        <section className="relative overflow-hidden rounded-[2rem] bg-rose-950 p-8 text-center text-white shadow-xl">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(76,5,25,0.98),rgba(159,18,57,0.9),rgba(225,29,72,0.72))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,113,133,0.28),transparent_34%)]" />

          <div className="relative z-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/15 text-3xl backdrop-blur">
              📌
            </div>

            <h2 className="mt-5 text-3xl font-extrabold">Tetap Semangat</h2>

            <p className="mt-2 text-sm text-rose-50">
              Kamu belum diterima pada seleksi PPDB kali ini.
            </p>

            <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-white/10 bg-white/15 px-6 py-4 backdrop-blur">
              <p className="text-sm font-semibold text-rose-50">
                Silakan pantau informasi resmi PPDB untuk tahapan berikutnya
                atau hubungi panitia sekolah tujuan.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-base font-bold text-slate-800">Data Peserta</h2>
          <p className="mt-1 text-xs text-slate-500">
            Ringkasan identitas peserta dan informasi pengumuman.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: "Nama Lengkap", value: hasil.nama },
            { label: "NISN", value: hasil.nisn },
            { label: "No. Registrasi", value: hasil.noRegistrasi },
            { label: "Jalur Pendaftaran", value: hasil.jalur },
            { label: "Tanggal Pengumuman", value: hasil.tanggalPengumuman },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-xs font-semibold text-slate-400">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-base font-bold text-slate-800">
            Rincian Pilihan Sekolah
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Status hasil seleksi berdasarkan urutan pilihan sekolah.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {hasil.pilihan.map((p) => {
            const accepted = p.status === "diterima";

            return (
              <div
                key={p.urutan}
                className={`rounded-2xl border p-4 ${
                  accepted
                    ? "border-emerald-100 bg-emerald-50"
                    : "border-rose-100 bg-rose-50"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${
                      accepted ? "bg-emerald-600" : "bg-rose-600"
                    }`}
                  >
                    {p.urutan}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">
                      {p.sekolah}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Pilihan ke-{p.urutan}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                      accepted
                        ? "bg-emerald-600 text-white"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {accepted ? "Diterima" : "Gugur"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {isAccepted && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-base font-bold text-amber-700">
            Wajib Daftar Ulang
          </h2>

          <p className="mt-2 text-sm leading-6 text-amber-700">
            Lakukan daftar ulang di <strong>{hasil.sekolahDiterima}</strong>{" "}
            pada tanggal <strong>{hasil.batasUlang}</strong>.
          </p>
        </section>
      )}

      <button
        onClick={handleDownloadPDF}
        disabled={downloading}
        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {downloading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Membuat PDF...
          </>
        ) : (
          "Download Bukti Hasil Seleksi PDF"
        )}
      </button>

      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <p className="text-center text-xs leading-6 text-slate-500">
          Simpan bukti hasil seleksi ini untuk arsip dan proses lanjutan PPDB.
        </p>
      </section>
    </div>
  );
}

function PengumumanSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[2rem] bg-slate-950 p-6 shadow-xl lg:p-7">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Skeleton className="h-6 w-52 bg-white/20" />
            <Skeleton className="mt-5 h-10 w-72 bg-white/20" />
            <Skeleton className="mt-4 h-4 w-full max-w-lg bg-white/20" />
            <Skeleton className="mt-2 h-4 w-80 bg-white/20" />
          </div>

          <Skeleton className="h-24 w-full rounded-2xl bg-white/20 sm:w-[165px]" />
        </div>
      </section>

      <Skeleton className="h-52 rounded-[2rem]" />

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-3 w-72" />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-2 h-3 w-72" />

        <div className="mt-5 flex flex-col gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </section>

      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-12 rounded-xl" />
    </div>
  );
}