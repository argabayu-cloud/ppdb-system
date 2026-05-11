"use client";

import { useEffect, useState } from "react";

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
    // TODO: ganti dengan fetch API backend
    setTimeout(() => {
      setHasil(simulasiHasil);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDownloadPDF = async () => {
    if (!hasil) return;
    setDownloading(true);

    try {
      // Import jsPDF secara dynamic
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      const center = pageWidth / 2;

      // === HEADER ===
      doc.setFillColor(30, 64, 175); // biru
      doc.rect(0, 0, pageWidth, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("DINAS PENDIDIKAN KOTA BANDAR LAMPUNG", center, 15, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("PPDB SMP TERPADU TAHUN AJARAN 2025/2026", center, 25, { align: "center" });

      doc.setFontSize(10);
      doc.text("Jl. Soekarno Hatta, Kota Bandar Lampung, Lampung", center, 33, { align: "center" });

      // === JUDUL DOKUMEN ===
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("SURAT KETERANGAN HASIL SELEKSI", center, 58, { align: "center" });

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`No. Registrasi: ${hasil.noRegistrasi}`, center, 66, { align: "center" });

      // Garis bawah judul
      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(0.8);
      doc.line(20, 70, pageWidth - 20, 70);

      // === STATUS ===
      if (hasil.status === "diterima") {
        doc.setFillColor(220, 252, 231); // hijau muda
        doc.roundedRect(20, 76, pageWidth - 40, 20, 3, 3, "F");
        doc.setTextColor(21, 128, 61);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("✓  DINYATAKAN DITERIMA", center, 90, { align: "center" });
      } else {
        doc.setFillColor(254, 226, 226);
        doc.roundedRect(20, 76, pageWidth - 40, 20, 3, 3, "F");
        doc.setTextColor(185, 28, 28);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("✗  TIDAK DITERIMA", center, 90, { align: "center" });
      }

      // === DATA PESERTA ===
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

      // === PILIHAN SEKOLAH ===
      y += 5;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("RINCIAN PILIHAN SEKOLAH", 20, y);
      y += 4;
      doc.setLineWidth(0.3);
      doc.setDrawColor(200, 200, 200);
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
        doc.roundedRect(20, y - 6, pageWidth - 40, 14, 2, 2, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`Pilihan ${p.urutan}: ${p.sekolah}`, 27, y + 2);

        doc.setFont("helvetica", "bold");
        const statusText = p.status === "diterima" ? "DITERIMA" : "GUGUR";
        doc.text(statusText, pageWidth - 25, y + 2, { align: "right" });

        y += 18;
      });

      // === SEKOLAH DITERIMA ===
      if (hasil.status === "diterima") {
        y += 5;
        doc.setFillColor(30, 64, 175);
        doc.roundedRect(20, y - 6, pageWidth - 40, 22, 3, 3, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Diterima di:", center, y + 3, { align: "center" });
        doc.setFontSize(13);
        doc.text(hasil.sekolahDiterima, center, y + 13, { align: "center" });
        y += 32;
      }

      // === INFO DAFTAR ULANG ===
      if (hasil.status === "diterima") {
        doc.setFillColor(255, 251, 235);
        doc.setDrawColor(251, 191, 36);
        doc.setLineWidth(0.5);
        doc.roundedRect(20, y, pageWidth - 40, 22, 3, 3, "FD");
        doc.setTextColor(146, 64, 14);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("⚠ WAJIB DAFTAR ULANG", 27, y + 8);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Lakukan daftar ulang di ${hasil.sekolahDiterima}`,
          27, y + 15
        );
        doc.setFont("helvetica", "bold");
        doc.text(`Tanggal: ${hasil.batasUlang}`, pageWidth - 25, y + 15, { align: "right" });
        y += 30;
      }

      // === TANDA TANGAN ===
      y += 10;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Bandar Lampung, ${hasil.tanggalPengumuman}`, pageWidth - 25, y, { align: "right" });
      y += 7;
      doc.text("Kepala Dinas Pendidikan", pageWidth - 25, y, { align: "right" });
      y += 30;
      doc.setFont("helvetica", "bold");
      doc.text("( _________________________ )", pageWidth - 25, y, { align: "right" });
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.text("NIP: ...............................", pageWidth - 25, y, { align: "right" });

      // === FOOTER ===
      doc.setFillColor(241, 245, 249);
      doc.rect(0, 270, pageWidth, 27, "F");
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text(
        "Dokumen ini diterbitkan secara digital oleh sistem PPDB SMP Terpadu Kota Bandar Lampung.",
        center, 278, { align: "center" }
      );
      doc.text(
        "Untuk verifikasi keaslian dokumen, hubungi Dinas Pendidikan Kota Bandar Lampung.",
        center, 285, { align: "center" }
      );
      doc.text(`Dicetak pada: ${new Date().toLocaleString("id-ID")}`, center, 292, { align: "center" });

      // Simpan PDF
      doc.save(`Hasil-PPDB-${hasil.nisn}.pdf`);
    } catch (error) {
      alert("Gagal membuat PDF. Pastikan koneksi internet aktif.");
      console.error(error);
    }

    setDownloading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Mengambil data hasil seleksi...</p>
      </div>
    );
  }

  if (!hasil) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <span className="text-5xl">📭</span>
        <p className="text-slate-500 text-sm">Data hasil seleksi belum tersedia.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">📢 Hasil Seleksi PPDB</h1>
        <p className="text-slate-500 text-sm mt-1">
          Tahun Ajaran 2025/2026 · Kota Bandar Lampung
        </p>
      </div>

      {/* Status Utama */}
      {hasil.status === "diterima" && (
        <div className="bg-green-500 rounded-2xl p-6 text-white text-center shadow-lg">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold mb-1">SELAMAT!</h2>
          <p className="text-green-100 text-sm mb-3">Kamu dinyatakan</p>
          <div className="bg-white/20 rounded-xl py-2 px-4 inline-block mb-3">
            <span className="font-bold text-lg">✅ DITERIMA</span>
          </div>
          <p className="font-semibold text-lg">{hasil.sekolahDiterima}</p>
        </div>
      )}

      {hasil.status === "menunggu" && (
        <div className="bg-amber-500 rounded-2xl p-6 text-white text-center shadow-lg">
          <div className="text-5xl mb-3">⏳</div>
          <h2 className="text-2xl font-bold mb-1">MENUNGGU</h2>
          <p className="text-amber-100 text-sm">Hasil seleksi sedang diproses.</p>
        </div>
      )}

      {hasil.status === "tidak_diterima" && (
        <div className="bg-red-500 rounded-2xl p-6 text-white text-center shadow-lg">
          <div className="text-5xl mb-3">😔</div>
          <h2 className="text-2xl font-bold mb-1">TIDAK DITERIMA</h2>
          <p className="text-red-100 text-sm">
            Mohon maaf, kamu belum berhasil diterima.
          </p>
        </div>
      )}

      {/* Data Peserta */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-blue-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
          👤 Data Peserta
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Nama Lengkap", value: hasil.nama },
            { label: "NISN", value: hasil.nisn },
            { label: "No. Registrasi", value: hasil.noRegistrasi },
            { label: "Jalur Pendaftaran", value: hasil.jalur },
            { label: "Tanggal Pengumuman", value: hasil.tanggalPengumuman },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-0.5">
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="text-sm font-semibold text-slate-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rincian Pilihan */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-blue-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
          🎯 Rincian Pilihan Sekolah
        </h2>
        <div className="flex flex-col gap-3">
          {hasil.pilihan.map((p) => (
            <div key={p.urutan}
              className={`flex items-center gap-4 p-4 rounded-xl border-2
                ${p.status === "diterima" ? "border-green-300 bg-green-50" : "border-red-200 bg-red-50"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                ${p.status === "diterima" ? "bg-green-500 text-white" : "bg-slate-300 text-white"}`}>
                {p.urutan}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{p.sekolah}</p>
                <p className="text-xs text-slate-400 mt-0.5">Pilihan ke-{p.urutan}</p>
              </div>
              <div className={`text-xs font-bold px-3 py-1 rounded-full shrink-0
                ${p.status === "diterima" ? "bg-green-500 text-white" : "bg-red-100 text-red-600"}`}>
                {p.status === "diterima" ? "✅ Diterima" : "❌ Gugur"}
              </div>
            </div>
          ))}
        </div>

        {hasil.status === "diterima" && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs text-blue-600 leading-relaxed">
              ℹ️ Karena kamu diterima di <strong>{hasil.sekolahDiterima}</strong>,
              kamu otomatis tidak dapat diterima di pilihan sekolah lainnya.
            </p>
          </div>
        )}
      </div>

      {/* Info Daftar Ulang */}
      {hasil.status === "diterima" && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <h2 className="font-bold text-amber-700">Wajib Daftar Ulang!</h2>
          </div>
          <p className="text-sm text-amber-700">
            Lakukan daftar ulang di <strong>{hasil.sekolahDiterima}</strong> pada tanggal{" "}
            <strong>{hasil.batasUlang}</strong>. Bawa dokumen asli dan fotokopi.
          </p>
        </div>
      )}

      {/* Tombol Download PDF */}
      {hasil.status === "diterima" && (
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors shadow-md text-sm"
        >
          {downloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Membuat PDF...
            </>
          ) : (
            <>
              📄 Download Bukti Kelulusan (PDF)
            </>
          )}
        </button>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <p className="text-xs text-slate-500 text-center">
          📌 Simpan bukti kelulusan ini untuk keperluan daftar ulang di sekolah.
          Untuk pertanyaan hubungi Dinas Pendidikan Kota Bandar Lampung.
        </p>
      </div>
    </div>
  );
}