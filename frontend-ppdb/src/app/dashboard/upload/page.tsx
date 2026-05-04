"use client";

import { useState } from "react";

const daftarBerkas = [
  {
    id: "akta",
    label: "Akta Kelahiran",
    desc: "Format PDF/JPG, maks 2MB",
    required: true,
  },
  {
    id: "kk",
    label: "Kartu Keluarga (KK)",
    desc: "Format PDF/JPG, maks 2MB",
    required: true,
  },
  {
    id: "ijazah",
    label: "Ijazah / STTB SD",
    desc: "Format PDF/JPG, maks 2MB",
    required: true,
  },
  {
    id: "rapor",
    label: "Rapor Kelas 4, 5, 6",
    desc: "Format PDF/JPG, maks 5MB",
    required: true,
  },
  {
    id: "foto",
    label: "Pas Foto 3x4",
    desc: "Format JPG/PNG, maks 1MB, background merah",
    required: true,
  },
  {
    id: "skhu",
    label: "SKHU (Surat Keterangan Hasil Ujian)",
    desc: "Format PDF/JPG, maks 2MB",
    required: false,
  },
  {
    id: "prestasi",
    label: "Sertifikat Prestasi (jika ada)",
    desc: "Format PDF/JPG, maks 2MB",
    required: false,
  },
];

type FileStatus = {
  file: File | null;
  preview: string | null;
  status: "idle" | "uploaded" | "error";
};

export default function UploadBerkasPage() {
  const [files, setFiles] = useState<Record<string, FileStatus>>(
    Object.fromEntries(
      daftarBerkas.map((b) => [b.id, { file: null, preview: null, status: "idle" }])
    )
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Cek ukuran file max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFiles((prev) => ({
        ...prev,
        [id]: { file: null, preview: null, status: "error" },
      }));
      return;
    }

    const preview = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;

    setFiles((prev) => ({
      ...prev,
      [id]: { file, preview, status: "uploaded" },
    }));
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => ({
      ...prev,
      [id]: { file: null, preview: null, status: "idle" },
    }));
  };

  const uploadedCount = Object.values(files).filter((f) => f.status === "uploaded").length;
  const requiredCount = daftarBerkas.filter((b) => b.required).length;
  const requiredUploaded = daftarBerkas
    .filter((b) => b.required)
    .filter((b) => files[b.id]?.status === "uploaded").length;

  const handleSubmit = () => {
    if (requiredUploaded < requiredCount) {
      alert(`Masih ada ${requiredCount - requiredUploaded} berkas wajib yang belum diupload!`);
      return;
    }
    setLoading(true);
    // TODO: sambungkan ke API backend
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">✅</div>
        <h2 className="text-xl font-bold text-slate-800">Berkas Berhasil Dikirim!</h2>
        <p className="text-slate-500 text-sm text-center max-w-sm">
          Semua berkas sudah terkirim. Tunggu verifikasi dari panitia PPDB.
        </p>
        <a href="/dashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
          Kembali ke Dashboard →
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">📁 Upload Berkas</h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload semua dokumen persyaratan PPDB. Berkas bertanda{" "}
          <span className="text-red-500 font-semibold">*</span> wajib diupload.
        </p>
      </div>

      {/* Progress Upload */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">Progress Upload</span>
          <span className="text-sm font-bold text-blue-600">
            {uploadedCount} / {daftarBerkas.length} berkas
          </span>
        </div>
        <div className="bg-slate-100 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(uploadedCount / daftarBerkas.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Wajib: {requiredUploaded}/{requiredCount} · Opsional: {uploadedCount - requiredUploaded}/{daftarBerkas.length - requiredCount}
        </p>
      </div>

      {/* Daftar Berkas */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-blue-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
          📄 Daftar Berkas
        </h2>

        <div className="flex flex-col gap-4">
          {daftarBerkas.map((berkas) => {
            const fileData = files[berkas.id];
            const isUploaded = fileData.status === "uploaded";
            const isError = fileData.status === "error";

            return (
              <div
                key={berkas.id}
                className={`border rounded-xl p-4 flex items-center gap-4 transition-all
                  ${isUploaded ? "border-green-300 bg-green-50" : isError ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50"}`}
              >
                {/* Icon Status */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0
                  ${isUploaded ? "bg-green-100" : isError ? "bg-red-100" : "bg-white border border-slate-200"}`}>
                  {isUploaded ? "✅" : isError ? "❌" : "📄"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-slate-800">{berkas.label}</p>
                    {berkas.required && <span className="text-red-500 text-xs">*</span>}
                    {!berkas.required && (
                      <span className="text-xs bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full ml-1">
                        Opsional
                      </span>
                    )}
                  </div>
                  {isUploaded ? (
                    <p className="text-xs text-green-600 mt-0.5 truncate">
                      ✓ {fileData.file?.name}
                    </p>
                  ) : isError ? (
                    <p className="text-xs text-red-500 mt-0.5">File terlalu besar! Maks 5MB</p>
                  ) : (
                    <p className="text-xs text-slate-400 mt-0.5">{berkas.desc}</p>
                  )}
                </div>

                {/* Preview gambar */}
                {isUploaded && fileData.preview && (
                  <img
                    src={fileData.preview}
                    alt="preview"
                    className="w-12 h-12 object-cover rounded-lg border border-green-200 flex-shrink-0"
                  />
                )}

                {/* Tombol aksi */}
                <div className="flex-shrink-0">
                  {isUploaded ? (
                    <button
                      onClick={() => handleRemove(berkas.id)}
                      className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  ) : (
                    <label className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                      Pilih File
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(berkas.id, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tombol Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors shadow-md text-sm"
      >
        {loading ? "Mengirim Berkas..." : "Kirim Semua Berkas"}
      </button>
    </div>
  );
}
