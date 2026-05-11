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
    {
      urutan: 1,
      sekolah: "SMP Negeri 3 Bandar Lampung",
      status: "diterima",
    },
    {
      urutan: 2,
      sekolah: "SMP Negeri 7 Bandar Lampung",
      status: "gugur",
    },
  ],
  tanggalPengumuman: "10 Juni 2025",
  batasUlang: "11-15 Juni 2025",
};

export default function PengumumanPage() {
  const [hasil, setHasil] =
    useState<typeof simulasiHasil | null>(null);

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // TODO: ganti fetch backend
    setTimeout(() => {
      setHasil(simulasiHasil);
      setLoading(false);
    }, 2000);
  }, []);

  const handleDownloadPDF = async () => {
    if (!hasil) return;

    setDownloading(true);

    try {
      const { default: jsPDF } = await import("jspdf");

      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      const center = pageWidth / 2;

      // HEADER
      doc.setFillColor(30, 64, 175);
      doc.rect(0, 0, pageWidth, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(
        "DINAS PENDIDIKAN KOTA BANDAR LAMPUNG",
        center,
        15,
        {
          align: "center",
        }
      );

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(
        "PPDB SMP TERPADU TAHUN AJARAN 2025/2026",
        center,
        25,
        {
          align: "center",
        }
      );

      doc.setFontSize(10);
      doc.text(
        "Jl. Soekarno Hatta, Kota Bandar Lampung",
        center,
        33,
        {
          align: "center",
        }
      );

      // JUDUL
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");

      doc.text(
        "SURAT KETERANGAN HASIL SELEKSI",
        center,
        58,
        {
          align: "center",
        }
      );

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      doc.text(
        `No. Registrasi: ${hasil.noRegistrasi}`,
        center,
        66,
        {
          align: "center",
        }
      );

      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(0.8);
      doc.line(20, 70, pageWidth - 20, 70);

      // STATUS
      if (hasil.status === "diterima") {
        doc.setFillColor(220, 252, 231);

        doc.roundedRect(
          20,
          76,
          pageWidth - 40,
          20,
          3,
          3,
          "F"
        );

        doc.setTextColor(21, 128, 61);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");

        doc.text(
          "✓ DINYATAKAN DITERIMA",
          center,
          90,
          {
            align: "center",
          }
        );
      } else {
        doc.setFillColor(254, 226, 226);

        doc.roundedRect(
          20,
          76,
          pageWidth - 40,
          20,
          3,
          3,
          "F"
        );

        doc.setTextColor(185, 28, 28);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");

        doc.text(
          "✗ TIDAK DITERIMA",
          center,
          90,
          {
            align: "center",
          }
        );
      }

      // DATA PESERTA
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");

      doc.text("DATA PESERTA", 20, 108);

      doc.setLineWidth(0.3);
      doc.setDrawColor(200, 200, 200);

      doc.line(20, 111, pageWidth - 20, 111);

      const dataRows = [
        ["Nama Lengkap", hasil.nama],
        ["NISN", hasil.nisn],
        ["Jalur Pendaftaran", hasil.jalur],
        ["Tanggal Pengumuman", hasil.tanggalPengumuman],
      ];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      let y = 120;

      dataRows.forEach(([label, value]) => {
        doc.setTextColor(100, 100, 100);
        doc.text(label, 25, y);

        doc.setTextColor(0, 0, 0);
        doc.text(`: ${value}`, 90, y);

        y += 10;
      });

      // PILIHAN SEKOLAH
      y += 5;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");

      doc.text("RINCIAN PILIHAN SEKOLAH", 20, y);

      y += 4;

      doc.line(20, y, pageWidth - 20, y);

      y += 10;

      hasil.pilihan.forEach((p) => {
        if (p.status === "diterima") {
          doc.setFillColor(220, 252, 231);
          doc.setTextColor(21, 128, 61);
        } else {
          doc.setFillColor(254, 226, 226);
          doc.setTextColor(185, 28, 28);
        }

        doc.roundedRect(
          20,
          y - 6,
          pageWidth - 40,
          14,
          2,
          2,
          "F"
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);

        doc.text(
          `Pilihan ${p.urutan}: ${p.sekolah}`,
          27,
          y + 2
        );

        const statusText =
          p.status === "diterima"
            ? "DITERIMA"
            : "GUGUR";

        doc.text(
          statusText,
          pageWidth - 25,
          y + 2,
          {
            align: "right",
          }
        );

        y += 18;
      });

      // SEKOLAH DITERIMA
      if (hasil.status === "diterima") {
        y += 5;

        doc.setFillColor(30, 64, 175);

        doc.roundedRect(
          20,
          y - 6,
          pageWidth - 40,
          22,
          3,
          3,
          "F"
        );

        doc.setTextColor(255, 255, 255);

        doc.setFontSize(11);

        doc.text("Diterima di:", center, y + 3, {
          align: "center",
        });

        doc.setFontSize(13);

        doc.text(
          hasil.sekolahDiterima,
          center,
          y + 13,
          {
            align: "center",
          }
        );

        y += 32;
      }

      // INFO DAFTAR ULANG
      if (hasil.status === "diterima") {
        doc.setFillColor(255, 251, 235);

        doc.roundedRect(
          20,
          y,
          pageWidth - 40,
          22,
          3,
          3,
          "F"
        );

        doc.setTextColor(146, 64, 14);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);

        doc.text(
          "⚠ WAJIB DAFTAR ULANG",
          27,
          y + 8
        );

        doc.setFont("helvetica", "normal");

        doc.text(
          `Lakukan daftar ulang di ${hasil.sekolahDiterima}`,
          27,
          y + 15
        );

        doc.setFont("helvetica", "bold");

        doc.text(
          `Tanggal: ${hasil.batasUlang}`,
          pageWidth - 25,
          y + 15,
          {
            align: "right",
          }
        );

        y += 30;
      }

      // TTD
      y += 10;

      doc.setTextColor(0, 0, 0);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(
        `Bandar Lampung, ${hasil.tanggalPengumuman}`,
        pageWidth - 25,
        y,
        {
          align: "right",
        }
      );

      y += 7;

      doc.text(
        "Kepala Dinas Pendidikan",
        pageWidth - 25,
        y,
        {
          align: "right",
        }
      );

      y += 30;

      doc.setFont("helvetica", "bold");

      doc.text(
        "( _________________________ )",
        pageWidth - 25,
        y,
        {
          align: "right",
        }
      );

      y += 7;

      doc.setFont("helvetica", "normal");

      doc.text(
        "NIP: ...............................",
        pageWidth - 25,
        y,
        {
          align: "right",
        }
      );

      // FOOTER
      doc.setFillColor(241, 245, 249);

      doc.rect(0, 270, pageWidth, 27, "F");

      doc.setTextColor(100, 100, 100);

      doc.setFontSize(8);

      doc.text(
        "Dokumen ini diterbitkan secara digital oleh sistem PPDB.",
        center,
        278,
        {
          align: "center",
        }
      );

      doc.text(
        `Dicetak pada: ${new Date().toLocaleString(
          "id-ID"
        )}`,
        center,
        285,
        {
          align: "center",
        }
      );

      doc.save(`Hasil-PPDB-${hasil.nisn}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Gagal membuat PDF");
    }

    setDownloading(false);
  };

  // LOADING SKELETON
  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-40 rounded-xl" />
        </div>

        <Skeleton className="h-52 w-full rounded-3xl" />

        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <Skeleton className="h-5 w-40 rounded-xl" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-24 rounded-xl" />
                <Skeleton className="h-5 w-40 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <Skeleton className="h-5 w-48 rounded-xl" />

          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-24 w-full rounded-2xl"
            />
          ))}
        </div>

        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    );
  }

  // DATA KOSONG
  if (!hasil) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="text-6xl">📭</span>

        <h2 className="text-lg font-bold text-slate-800">
          Data Belum Tersedia
        </h2>

        <p className="text-sm text-slate-500 text-center max-w-sm">
          Hasil seleksi PPDB belum diumumkan atau data
          peserta tidak ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          📢 Hasil Seleksi PPDB
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Tahun Ajaran 2025/2026 · Kota Bandar Lampung
        </p>
      </div>

      {/* Status */}
      {hasil.status === "diterima" && (
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white text-center shadow-xl">
          <div className="text-6xl mb-4">🎉</div>

          <h2 className="text-3xl font-extrabold mb-2">
            SELAMAT!
          </h2>

          <p className="text-green-100 text-sm mb-5">
            Kamu dinyatakan
          </p>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl py-3 px-6 inline-block mb-5">
            <span className="font-bold text-xl">
              ✅ DITERIMA
            </span>
          </div>

          <p className="font-semibold text-xl">
            {hasil.sekolahDiterima}
          </p>
        </div>
      )}

      {/* Data Peserta */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-blue-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
          👤 Data Peserta
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              label: "Nama Lengkap",
              value: hasil.nama,
            },
            {
              label: "NISN",
              value: hasil.nisn,
            },
            {
              label: "No. Registrasi",
              value: hasil.noRegistrasi,
            },
            {
              label: "Jalur Pendaftaran",
              value: hasil.jalur,
            },
            {
              label: "Tanggal Pengumuman",
              value: hasil.tanggalPengumuman,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-slate-50 rounded-xl p-4 border border-slate-100"
            >
              <p className="text-xs text-slate-400">
                {item.label}
              </p>

              <p className="text-sm font-semibold text-slate-800 mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pilihan Sekolah */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-blue-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
          🎯 Rincian Pilihan Sekolah
        </h2>

        <div className="flex flex-col gap-3">
          {hasil.pilihan.map((p) => (
            <div
              key={p.urutan}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2
                ${
                  p.status === "diterima"
                    ? "border-green-300 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                  ${
                    p.status === "diterima"
                      ? "bg-green-500 text-white"
                      : "bg-red-400 text-white"
                  }`}
              >
                {p.urutan}
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {p.sekolah}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Pilihan ke-{p.urutan}
                </p>
              </div>

              <div
                className={`text-xs font-bold px-3 py-1 rounded-full
                  ${
                    p.status === "diterima"
                      ? "bg-green-500 text-white"
                      : "bg-red-100 text-red-600"
                  }`}
              >
                {p.status === "diterima"
                  ? "✅ Diterima"
                  : "❌ Gugur"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daftar Ulang */}
      {hasil.status === "diterima" && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">⚠️</span>

            <h2 className="font-bold text-amber-700">
              Wajib Daftar Ulang
            </h2>
          </div>

          <p className="text-sm text-amber-700 leading-relaxed">
            Lakukan daftar ulang di{" "}
            <strong>{hasil.sekolahDiterima}</strong>{" "}
            pada tanggal{" "}
            <strong>{hasil.batasUlang}</strong>.
          </p>
        </div>
      )}

      {/* Download */}
      {hasil.status === "diterima" && (
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-2xl transition-all shadow-md text-sm"
        >
          {downloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Membuat PDF...
            </>
          ) : (
            <>📄 Download Bukti Kelulusan (PDF)</>
          )}
        </button>
      )}

      {/* Footer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          📌 Simpan bukti kelulusan ini untuk proses
          daftar ulang di sekolah tujuan.
        </p>
      </div>
    </div>
  );
}