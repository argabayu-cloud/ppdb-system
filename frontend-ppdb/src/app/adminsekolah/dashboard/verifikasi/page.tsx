"use client";

import { useState } from "react";

const dataPendaftar = [
  {
    id: 1,
    nama: "Arga Bayu R",
    nisn: "1234567890",
    jalur: "Zonasi",
    tanggal: "04 Mei 2025",
    status: "menunggu",
    alamat: "Jl. Soekarno Hatta No. 10, Tanjung Karang, Bandar Lampung",
    sekolahAsal: "SDN 1 Bandar Lampung",
    pilihan1: "SMP Negeri 3 Bandar Lampung",
    pilihan2: "SMP Negeri 7 Bandar Lampung",
    berkas: [
      { nama: "Akta Kelahiran", status: "ada", tipe: "pdf", url: null },
      { nama: "Kartu Keluarga", status: "ada", tipe: "image", url: null },
      { nama: "Ijazah SD", status: "ada", tipe: "pdf", url: null },
      { nama: "Rapor Kelas 4-6", status: "ada", tipe: "pdf", url: null },
      { nama: "Pas Foto 3x4", status: "ada", tipe: "image", url: null },
      { nama: "SKHU", status: "tidak_ada", tipe: null, url: null },
    ],
  },
  {
    id: 2,
    nama: "Amelia Rizki Kusuma Ningrum",
    nisn: "0987654321",
    jalur: "Prestasi",
    tanggal: "04 Mei 2025",
    status: "menunggu",
    alamat: "Jl. Ahmad Yani No. 5, Kedaton, Bandar Lampung",
    sekolahAsal: "SDN 2 Bandar Lampung",
    pilihan1: "SMP Negeri 3 Bandar Lampung",
    pilihan2: "SMP Negeri 5 Bandar Lampung",
    berkas: [
      { nama: "Akta Kelahiran", status: "ada", tipe: "pdf", url: null },
      { nama: "Kartu Keluarga", status: "ada", tipe: "image", url: null },
      { nama: "Ijazah SD", status: "ada", tipe: "pdf", url: null },
      { nama: "Rapor Kelas 4-6", status: "ada", tipe: "pdf", url: null },
      { nama: "Pas Foto 3x4", status: "ada", tipe: "image", url: null },
      { nama: "SKHU", status: "ada", tipe: "pdf", url: null },
      { nama: "Sertifikat Prestasi", status: "ada", tipe: "image", url: null },
    ],
  },
   {
    id: 2,
    nama: "Erwin Gunawa",
    nisn: "0987654321",
    jalur: "Prestasi",
    tanggal: "04 Mei 2025",
    status: "menunggu",
    alamat: "Jl. Ahmad Yani No. 5, Kedaton, Bandar Lampung",
    sekolahAsal: "SDN 2 Bandar Lampung",
    pilihan1: "SMP Negeri 3 Bandar Lampung",
    pilihan2: "SMP Negeri 5 Bandar Lampung",
    berkas: [
      { nama: "Akta Kelahiran", status: "ada", tipe: "pdf", url: null },
      { nama: "Kartu Keluarga", status: "ada", tipe: "image", url: null },
      { nama: "Ijazah SD", status: "ada", tipe: "pdf", url: null },
      { nama: "Rapor Kelas 4-6", status: "ada", tipe: "pdf", url: null },
      { nama: "Pas Foto 3x4", status: "ada", tipe: "image", url: null },
      { nama: "SKHU", status: "ada", tipe: "pdf", url: null },
      { nama: "Sertifikat Prestasi", status: "ada", tipe: "image", url: null },
    ],
  },
];

type Berkas = {
  nama: string;
  status: string;
  tipe: string | null;
  url: string | null;
};

type Pendaftar = typeof dataPendaftar[0];

const jalurWarna: Record<string, string> = {
  Zonasi: "bg-blue-100 text-blue-700",
  Prestasi: "bg-purple-100 text-purple-700",
  Afirmasi: "bg-green-100 text-green-700",
  Domisili: "bg-orange-100 text-orange-700",
};

const statusWarna: Record<string, string> = {
  menunggu: "bg-amber-100 text-amber-700",
  diterima: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-600",
  ditunda: "bg-slate-100 text-slate-600",
};

const statusLabel: Record<string, string> = {
  menunggu: "Menunggu",
  diterima: "Diterima",
  ditolak: "Ditolak",
  ditunda: "Ditunda",
};

export default function VerifikasiPage() {
  const [list, setList] = useState(dataPendaftar);
  const [selected, setSelected] = useState<Pendaftar | null>(null);
  const [catatan, setCatatan] = useState("");
  const [konfirmasi, setKonfirmasi] = useState<{ aksi: string; id: number } | null>(null);
  const [previewBerkas, setPreviewBerkas] = useState<Berkas | null>(null);

  const handleAksi = (id: number, aksi: string) => {
    setKonfirmasi({ aksi, id });
  };

  const konfirmasiAksi = () => {
    if (!konfirmasi) return;
    setList((prev) =>
      prev.map((p) =>
        p.id === konfirmasi.id ? { ...p, status: konfirmasi.aksi } : p
      )
    );
    if (selected?.id === konfirmasi.id) {
      setSelected((prev) => prev ? { ...prev, status: konfirmasi.aksi } : null);
    }
    setKonfirmasi(null);
    setCatatan("");
  };

  const menunggu = list.filter((p) => p.status === "menunggu").length;
  const diterima = list.filter((p) => p.status === "diterima").length;
  const ditolak = list.filter((p) => p.status === "ditolak").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">✅ Verifikasi Berkas</h1>
        <p className="text-slate-500 text-sm mt-1">
          Periksa dan verifikasi berkas pendaftar ke sekolah kamu.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Menunggu", value: menunggu, color: "bg-amber-500" },
          { label: "Diterima", value: diterima, color: "bg-green-500" },
          { label: "Ditolak", value: ditolak, color: "bg-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-white font-bold text-lg`}>
              {s.value}
            </div>
            <p className="text-sm text-slate-600 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Daftar Pendaftar */}
        <div className="w-full lg:w-72 bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
          <h2 className="font-semibold text-slate-700 text-sm mb-2">Daftar Pendaftar</h2>
          {list.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all
                ${selected?.id === p.id ? "border-blue-400 bg-blue-50" : "border-transparent hover:bg-slate-50"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{p.nama}</p>
                  <p className="text-xs text-slate-400 mt-0.5">NISN: {p.nisn}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${jalurWarna[p.jalur]}`}>
                    {p.jalur}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusWarna[p.status]}`}>
                    {statusLabel[p.status]}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-slate-800 text-lg">{selected.nama}</h2>
                <p className="text-xs text-slate-400">NISN: {selected.nisn} · {selected.tanggal}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusWarna[selected.status]}`}>
                {statusLabel[selected.status]}
              </span>
            </div>

            {/* Data siswa */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Data Siswa</h3>
              {[
                { label: "Jalur", value: selected.jalur },
                { label: "Sekolah Asal", value: selected.sekolahAsal },
                { label: "Alamat", value: selected.alamat },
                { label: "Pilihan 1", value: selected.pilihan1 },
                { label: "Pilihan 2", value: selected.pilihan2 || "-" },
              ].map((item) => (
                <div key={item.label} className="flex gap-2 text-sm">
                  <span className="text-slate-400 w-24 flex-shrink-0">{item.label}</span>
                  <span className="text-slate-700 font-medium">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Berkas */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                Kelengkapan Berkas
              </h3>
              <div className="flex flex-col gap-2">
                {selected.berkas.map((b) => (
                  <div
                    key={b.nama}
                    className="flex items-center justify-between py-2 px-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {b.tipe === "pdf" ? "📄" : b.tipe === "image" ? "🖼️" : "📎"}
                      </span>
                      <span className="text-sm text-slate-700">{b.nama}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                        ${b.status === "ada" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {b.status === "ada" ? "✓ Ada" : "✗ Tidak Ada"}
                      </span>

                      {/* Tombol Lihat */}
                      {b.status === "ada" && (
                        <button
                          onClick={() => setPreviewBerkas(b)}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
                        >
                          👁️ Lihat
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Catatan */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                Catatan (opsional)
              </label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Tulis catatan verifikasi..."
                rows={2}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />
            </div>

            {/* Tombol Aksi */}
            {selected.status === "menunggu" && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleAksi(selected.id, "diterima")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  ✅ Terima
                </button>
                <button
                  onClick={() => handleAksi(selected.id, "ditunda")}
                  className="flex-1 bg-slate-400 hover:bg-slate-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  ⏳ Tunda
                </button>
                <button
                  onClick={() => handleAksi(selected.id, "ditolak")}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  ❌ Tolak
                </button>
              </div>
            )}

            {selected.status !== "menunggu" && (
              <div className={`rounded-xl p-3 text-center text-sm font-semibold
                ${selected.status === "diterima" ? "bg-green-100 text-green-700" :
                  selected.status === "ditolak" ? "bg-red-100 text-red-600" :
                  "bg-slate-100 text-slate-600"}`}>
                {selected.status === "diterima" ? "✅ Berkas sudah diterima" :
                  selected.status === "ditolak" ? "❌ Berkas sudah ditolak" :
                  "⏳ Verifikasi ditunda"}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-2xl shadow p-6 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <p className="text-4xl mb-3">👈</p>
              <p className="text-sm">Pilih pendaftar untuk melihat detail berkas</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal Preview Berkas */}
      {previewBerkas && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col gap-4 overflow-hidden">
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 pt-5">
              <div>
                <h3 className="font-bold text-slate-800">{previewBerkas.nama}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {previewBerkas.tipe === "pdf" ? "📄 Dokumen PDF" : "🖼️ File Gambar"}
                </p>
              </div>
              <button
                onClick={() => setPreviewBerkas(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Preview Area */}
            <div className="mx-6 mb-6 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center min-h-[300px]">
              {previewBerkas.url ? (
                previewBerkas.tipe === "image" ? (
                  // Tampilkan gambar
                  <img
                    src={previewBerkas.url}
                    alt={previewBerkas.nama}
                    className="w-full h-auto object-contain max-h-[400px]"
                  />
                ) : (
                  // Tampilkan PDF
                  <iframe
                    src={previewBerkas.url}
                    className="w-full h-[400px]"
                    title={previewBerkas.nama}
                  />
                )
              ) : (
                // Placeholder kalau URL belum ada (belum connect ke backend)
                <div className="text-center text-slate-400 p-8">
                  <p className="text-5xl mb-4">
                    {previewBerkas.tipe === "pdf" ? "📄" : "🖼️"}
                  </p>
                  <p className="font-semibold text-slate-600 text-sm">{previewBerkas.nama}</p>
                  <p className="text-xs mt-2">
                    Preview akan tersedia setelah tersambung ke backend.
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    File URL akan diambil dari API server.
                  </p>
                </div>
              )}
            </div>

            {/* Footer modal */}
            <div className="px-6 pb-5 flex gap-3">
              {previewBerkas.url && (
                <a
                  href={previewBerkas.url}
                  download
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl text-center transition-colors"
                >
                  ⬇️ Download
                </a>
              )}
              <button
                onClick={() => setPreviewBerkas(null)}
                className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi */}
      {konfirmasi && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full flex flex-col gap-4">
            <h3 className="font-bold text-slate-800 text-lg">Konfirmasi Aksi</h3>
            <p className="text-sm text-slate-600">
              Apakah kamu yakin ingin{" "}
              <strong className={
                konfirmasi.aksi === "diterima" ? "text-green-600" :
                konfirmasi.aksi === "ditolak" ? "text-red-600" : "text-slate-600"
              }>
                {konfirmasi.aksi === "diterima" ? "MENERIMA" :
                  konfirmasi.aksi === "ditolak" ? "MENOLAK" : "MENUNDA"}
              </strong>{" "}
              berkas pendaftar ini?
            </p>
            {catatan && (
              <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600">
                <span className="font-medium">Catatan:</span> {catatan}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setKonfirmasi(null)}
                className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={konfirmasiAksi}
                className={`flex-1 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors
                  ${konfirmasi.aksi === "diterima" ? "bg-green-600 hover:bg-green-700" :
                    konfirmasi.aksi === "ditolak" ? "bg-red-600 hover:bg-red-700" :
                    "bg-slate-500 hover:bg-slate-600"}`}
              >
                Ya, Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}