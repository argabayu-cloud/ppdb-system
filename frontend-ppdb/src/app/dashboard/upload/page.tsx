"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getDokumenSaya, getDashboardPendaftaran, submitPendaftaran, uploadDokumen } from "@/lib/api";

const daftarBerkas = [
  {
    id: "akta",
    tipeDokumen: "AKTA",
    label: "Akta Kelahiran",
    desc: "Format PDF/JPG, maks 2MB",
    required: true,
    maxSizeMb: 2,
    accept: ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png",
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
  {
    id: "kk",
    tipeDokumen: "KK",
    label: "Kartu Keluarga (KK)",
    desc: "Format PDF/JPG, maks 2MB",
    required: true,
    maxSizeMb: 2,
    accept: ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png",
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
  {
    id: "ijazah",
    tipeDokumen: "IJAZAH",
    label: "Ijazah / STTB SD",
    desc: "Format PDF/JPG, maks 2MB",
    required: true,
    maxSizeMb: 2,
    accept: ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png",
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
  {
    id: "rapor",
    tipeDokumen: "RAPOR",
    label: "Rapor Kelas 4, 5, 6",
    desc: "Format PDF/JPG, maks 5MB",
    required: true,
    maxSizeMb: 5,
    accept: ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png",
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
  {
    id: "foto",
    tipeDokumen: "FOTO",
    label: "Pas Foto 3x4",
    desc: "Format JPG/PNG, maks 1MB, background merah",
    required: true,
    maxSizeMb: 1,
    accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
    allowedTypes: ["image/jpeg", "image/png"],
  },
  {
    id: "skhu",
    tipeDokumen: "SKHU",
    label: "SKHU (Surat Keterangan Hasil Ujian)",
    desc: "Format PDF/JPG, maks 2MB",
    required: false,
    maxSizeMb: 2,
    accept: ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png",
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
  {
    id: "prestasi",
    tipeDokumen: "PRESTASI",
    label: "Sertifikat Prestasi (jika ada)",
    desc: "Format PDF/JPG, maks 2MB",
    required: false,
    maxSizeMb: 2,
    accept: ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png",
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
  {
    id: "kip",
    tipeDokumen: "KIP",
    label: "Kartu Indonesia Pintar (KIP)",
    desc: "Format PDF/JPG, maks 2MB",
    required: false,
    maxSizeMb: 2,
    accept: ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png",
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
];

type ExistingDokumen = {
  id: string;
  namaFile: string;
  urlFile: string;
  tipeDokumen: string | null;
  status: "MENUNGGU" | "DITERIMA" | "DITOLAK";
};

type FileStatus = {
  file: File | null;
  preview: string | null;
  status: "idle" | "uploaded" | "error";
  errorMessage?: string;
};

const initialFiles = Object.fromEntries(
  daftarBerkas.map((b) => [
    b.id,
    { file: null, preview: null, status: "idle" },
  ]),
) as Record<string, FileStatus>;

export default function UploadBerkasPage() {
  const router = useRouter();
  const previewsRef = useRef<string[]>([]);

  const [files, setFiles] = useState<Record<string, FileStatus>>(initialFiles);
  const [existingDocs, setExistingDocs] = useState<
    Record<string, ExistingDokumen>
  >({});
  const [loading, setLoading] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [isPrestasiRapor, setIsPrestasiRapor] = useState(false);

  const activeDaftarBerkas = useMemo(() => {
    if (isPrestasiRapor) {
      return daftarBerkas
        .filter((b) => b.id !== "rapor")
        .map((b) => {
          if (b.id === "prestasi") {
            return {
              ...b,
              label: "Rapor Kelas 4, 5, 6 (Jalur Prestasi)",
              desc: "Format PDF, maks 5MB (Diunggah saat pendaftaran)",
              required: true,
              maxSizeMb: 5,
              accept: ".pdf,application/pdf",
              allowedTypes: ["application/pdf"],
            };
          }
          return b;
        });
    }
    return daftarBerkas;
  }, [isPrestasiRapor]);

  const loadDokumen = async () => {
    try {
      const [docsRes, pendaftaranRes] = await Promise.all([
        getDokumenSaya(),
        getDashboardPendaftaran().catch(() => null),
      ]);
      const docs: ExistingDokumen[] = docsRes?.data || [];

      const mapped = Object.fromEntries(
        docs
          .filter((doc) => doc.tipeDokumen)
          .map((doc) => [doc.tipeDokumen as string, doc]),
      ) as Record<string, ExistingDokumen>;

      setExistingDocs(mapped);

      const saved =
        pendaftaranRes?.data?.pendaftaran ||
        pendaftaranRes?.pendaftaran ||
        pendaftaranRes?.data;
      if (saved) {
        const isPrestasi = String(saved.jalur).toUpperCase() === "PRESTASI";
        const isRapor = String(saved.jenisPrestasi) === "Nilai Rapor";
        if (isPrestasi && isRapor) {
          setIsPrestasiRapor(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSkeleton(false);
    }
  };

  useEffect(() => {
    loadDokumen();

    return () => {
      previewsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const handleFileChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const berkasConfig = activeDaftarBerkas.find((b) => b.id === id);

    if (!file || !berkasConfig) return;

    if (!berkasConfig.allowedTypes.includes(file.type)) {
      setFiles((prev) => ({
        ...prev,
        [id]: {
          file: null,
          preview: null,
          status: "error",
          errorMessage:
            "Format file tidak didukung. Gunakan format sesuai ketentuan.",
        },
      }));

      e.target.value = "";
      return;
    }

    if (file.size > berkasConfig.maxSizeMb * 1024 * 1024) {
      setFiles((prev) => ({
        ...prev,
        [id]: {
          file: null,
          preview: null,
          status: "error",
          errorMessage: `File terlalu besar. Maksimal ${berkasConfig.maxSizeMb}MB.`,
        },
      }));

      e.target.value = "";
      return;
    }

    const preview = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;

    if (preview) {
      previewsRef.current.push(preview);
    }

    setFiles((prev) => {
      const oldPreview = prev[id]?.preview;

      if (oldPreview) {
        URL.revokeObjectURL(oldPreview);
        previewsRef.current = previewsRef.current.filter(
          (item) => item !== oldPreview,
        );
      }

      return {
        ...prev,
        [id]: { file, preview, status: "uploaded" },
      };
    });
  };

  const handleRemove = (id: string) => {
    const currentPreview = files[id]?.preview;

    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
      previewsRef.current = previewsRef.current.filter(
        (item) => item !== currentPreview,
      );
    }

    setFiles((prev) => ({
      ...prev,
      [id]: { file: null, preview: null, status: "idle" },
    }));
  };

  const uploadedCount = useMemo(() => {
    return activeDaftarBerkas.filter((berkas) => {
      const existing = existingDocs[berkas.tipeDokumen];
      const selected = files[berkas.id];

      return Boolean(existing) || selected?.status === "uploaded";
    }).length;
  }, [activeDaftarBerkas, existingDocs, files]);

  const requiredCount = activeDaftarBerkas.filter((b) => b.required).length;

  const requiredUploaded = useMemo(() => {
    return activeDaftarBerkas
      .filter((b) => b.required)
      .filter((berkas) => {
        const existing = existingDocs[berkas.tipeDokumen];
        const selected = files[berkas.id];

        return Boolean(existing) || selected?.status === "uploaded";
      }).length;
  }, [activeDaftarBerkas, existingDocs, files]);

  const rejectedDocs = Object.values(existingDocs).filter(
    (doc) => doc.status === "DITOLAK",
  );

  const hasRejectedDocs = rejectedDocs.length > 0;

  const progressPercent = Math.round(
    (uploadedCount / activeDaftarBerkas.length) * 100,
  );

  const handleSubmit = async () => {
    if (requiredUploaded < requiredCount) {
      alert(
        `Masih ada ${
          requiredCount - requiredUploaded
        } berkas wajib yang belum diupload!`,
      );
      return;
    }

    const selectedFiles = activeDaftarBerkas.filter(
      (berkas) => files[berkas.id]?.file,
    );

    if (hasRejectedDocs) {
      const rejectedTypes = new Set(
        rejectedDocs.map((doc) => doc.tipeDokumen).filter(Boolean),
      );

      const fixedRejected = selectedFiles.filter((berkas) =>
        rejectedTypes.has(berkas.tipeDokumen),
      );

      if (fixedRejected.length < rejectedTypes.size) {
        alert("Upload ulang semua berkas yang ditolak terlebih dahulu.");
        return;
      }
    }

    try {
      setLoading(true);

      for (const berkas of selectedFiles) {
        const fileData = files[berkas.id];

        if (!fileData?.file) continue;

        await uploadDokumen(fileData.file, berkas.tipeDokumen);
      }

      await submitPendaftaran();

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Gagal mengirim berkas");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingSkeleton) {
    return <UploadSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.96),rgba(30,64,175,0.9),rgba(37,99,235,0.72))]" />

        <div className="relative z-10 flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center lg:p-7">
          <div>
            <span className="w-fit rounded-full border border-blue-300/40 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-100">
              Dokumen Persyaratan PPDB
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
              Upload Berkas
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-50/90">
              Unggah dokumen persyaratan sesuai format yang diminta. Jika ada
              berkas yang ditolak, cukup upload ulang berkas tersebut.
            </p>
          </div>

          <div className="min-w-[165px] rounded-2xl border border-white/10 bg-white/15 px-5 py-4 text-center backdrop-blur">
            <p className="text-xs text-blue-100">Progress Upload</p>
            <p className="mt-1 text-xl font-bold text-white">
              {uploadedCount}/{activeDaftarBerkas.length}
            </p>
            <p className="mt-1 text-xs text-blue-200">
              {progressPercent}% selesai
            </p>
          </div>
        </div>
      </section>

      {hasRejectedDocs && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-base font-bold text-amber-700">
            Ada Berkas yang Perlu Diperbaiki
          </h2>
          <p className="mt-2 text-sm leading-6 text-amber-700">
            Upload ulang berkas yang berstatus ditolak. Berkas lain yang sudah
            diterima atau menunggu verifikasi tidak perlu diupload ulang.
          </p>
        </section>
      )}

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Progress Upload
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Wajib: {requiredUploaded}/{requiredCount} · Opsional:{" "}
              {uploadedCount - requiredUploaded}/
              {activeDaftarBerkas.length - requiredCount}
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
            {progressPercent}%
          </span>
        </div>

        <div className="h-3 rounded-full bg-slate-100">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-800">Daftar Berkas</h2>
          <p className="mt-1 text-xs text-slate-500">
            Pilih file dokumen sesuai format yang tersedia di file manager.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {activeDaftarBerkas.map((berkas) => {
            const fileData = files[berkas.id];
            const existing = existingDocs[berkas.tipeDokumen];

            const isUploaded = fileData?.status === "uploaded";
            const isError = fileData?.status === "error";
            const isExisting = Boolean(existing);
            const isRejected = existing?.status === "DITOLAK";
            const isAccepted = existing?.status === "DITERIMA";
            const isWaiting = existing?.status === "MENUNGGU";

            return (
              <div
                key={berkas.id}
                className={`rounded-2xl border p-4 transition ${
                  isUploaded
                    ? "border-green-100 bg-green-50"
                    : isRejected
                      ? "border-amber-200 bg-amber-50"
                      : isAccepted
                        ? "border-emerald-100 bg-emerald-50"
                        : isWaiting
                          ? "border-blue-100 bg-blue-50"
                          : isError
                            ? "border-red-100 bg-red-50"
                            : "border-slate-100 bg-slate-50"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl ${
                      isUploaded
                        ? "bg-green-100"
                        : isRejected
                          ? "bg-amber-100"
                          : isAccepted
                            ? "bg-emerald-100"
                            : isWaiting
                              ? "bg-blue-100"
                              : isError
                                ? "bg-red-100"
                                : "bg-white"
                    }`}
                  >
                    {isUploaded
                      ? "✅"
                      : isRejected
                        ? "⚠️"
                        : isAccepted
                          ? "✅"
                          : isWaiting
                            ? "⏳"
                            : isError
                              ? "❌"
                              : "📄"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-slate-800">
                        {berkas.label}
                      </p>

                      {berkas.required ? (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-500">
                          Wajib
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                          Opsional
                        </span>
                      )}

                      {isExisting && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            isRejected
                              ? "bg-amber-100 text-amber-700"
                              : isAccepted
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {existing?.status}
                        </span>
                      )}
                    </div>

                    {isUploaded ? (
                      <p className="mt-1 truncate text-xs font-semibold text-green-600">
                        File baru dipilih: {fileData.file?.name}
                      </p>
                    ) : isExisting ? (
                      <div className="mt-1">
                        <p className="truncate text-xs font-semibold text-slate-600">
                          File tersimpan: {existing?.namaFile}
                        </p>
                        <a
                          href={existing?.urlFile}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-xs font-bold text-blue-600 hover:underline"
                        >
                          Lihat berkas
                        </a>
                      </div>
                    ) : isError ? (
                      <p className="mt-1 text-xs font-semibold text-red-500">
                        {fileData.errorMessage ||
                          `File terlalu besar. Maksimal ${berkas.maxSizeMb}MB.`}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-slate-500">
                        {berkas.desc}
                      </p>
                    )}
                  </div>

                  {isUploaded && fileData.preview && (
                    <img
                      src={fileData.preview}
                      alt="Preview berkas"
                      className="h-14 w-14 flex-shrink-0 rounded-xl border border-green-200 object-cover"
                    />
                  )}

                  <div className="flex-shrink-0">
                    {isUploaded ? (
                      <button
                        onClick={() => handleRemove(berkas.id)}
                        className="rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-500 transition hover:border-red-300 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    ) : (
                      <label
                        className={`inline-flex cursor-pointer rounded-xl px-4 py-2 text-xs font-bold text-white transition ${
                          isRejected
                            ? "bg-amber-600 hover:bg-amber-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isRejected
                          ? "Upload Ulang"
                          : isExisting
                            ? "Ganti File"
                            : "Pilih File"}
                        <input
                          type="file"
                          accept={berkas.accept}
                          onChange={(e) => handleFileChange(berkas.id, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {loading ? "Mengirim Berkas..." : "Kirim Semua Berkas"}
      </button>
    </div>
  );
}

function UploadSkeleton() {
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

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-2 h-3 w-64" />
          </div>

          <Skeleton className="h-7 w-14 rounded-full" />
        </div>

        <Skeleton className="mt-4 h-3 w-full rounded-full" />
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="mt-2 h-3 w-72" />

        <div className="mt-4 flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </section>

      <Skeleton className="h-12 rounded-xl" />
    </div>
  );
}