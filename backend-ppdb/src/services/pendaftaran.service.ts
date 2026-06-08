import {
  Jalur,
  JenisPenolakan,
  StatusDokumen,
  StatusPendaftaran,
  StatusPilihan,
  TipeDokumen,
} from "@prisma/client";

import prisma from "../config/prisma";
import { haversineDistance } from "../utils/distance";

const requiredDokumen: TipeDokumen[] = [
  TipeDokumen.AKTA,
  TipeDokumen.KK,
  TipeDokumen.IJAZAH,
  TipeDokumen.RAPOR,
  TipeDokumen.FOTO,
];

export const createPendaftaran = async (userId: string, data: any) => {
  const {
    sekolah1Id,
    sekolah2Id,
    jalur,
    nisn,
    namaSekolahAsal,
    npsn,
    tahunLulus,
    nilaiRataRata,
    jenisPrestasi,
    tingkatPrestasi,
    latitude,
    longitude,
  } = data;

  if (!sekolah1Id) {
    throw new Error("Pilihan sekolah pertama wajib diisi");
  }

  if (!jalur) {
    throw new Error("Jalur pendaftaran wajib diisi");
  }

  if (sekolah2Id && sekolah1Id === sekolah2Id) {
    throw new Error("Pilihan sekolah tidak boleh sama");
  }

  const existing = await prisma.pendaftaran.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new Error("User sudah melakukan pendaftaran");
  }

  if (nisn) {
    const existingNisn = await prisma.pendaftaran.findFirst({
      where: {
        nisn,
        NOT: {
          userId,
        },
      },
    });

    if (existingNisn) {
      throw new Error("NISN sudah digunakan");
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const sekolah1 = await prisma.sekolah.findUnique({
    where: { id: sekolah1Id },
  });

  if (!sekolah1) {
    throw new Error("Sekolah pilihan pertama tidak ditemukan");
  }

  const sekolah2 = sekolah2Id
    ? await prisma.sekolah.findUnique({
        where: { id: sekolah2Id },
      })
    : null;

  if (sekolah2Id && !sekolah2) {
    throw new Error("Sekolah pilihan kedua tidak ditemukan");
  }

  const bisaHitungJarak =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    typeof sekolah1.latitude === "number" &&
    typeof sekolah1.longitude === "number";

  const jarak1 = bisaHitungJarak
    ? haversineDistance(
        latitude,
        longitude,
        sekolah1.latitude as number,
        sekolah1.longitude as number,
      )
    : null;

  const nilaiRapor =
    nilaiRataRata && !Number.isNaN(Number(nilaiRataRata))
      ? Number(nilaiRataRata)
      : null;

  const result = await prisma.$transaction(async (tx) => {
    const pendaftaran = await tx.pendaftaran.create({
      data: {
        userId,
        jalur,
        status: StatusPendaftaran.MENUNGGU,

        nisn: nisn || null,
        namaSekolahAsal: namaSekolahAsal || null,
        npsn: npsn || null,
        tahunLulus: tahunLulus || null,

        nilaiRapor,
        jenisPrestasi: jenisPrestasi || null,
        tingkatPrestasi: tingkatPrestasi || null,

        latitude,
        longitude,
      },
    });

    await tx.pilihanSekolah.create({
      data: {
        pendaftaranId: pendaftaran.id,
        sekolahId: sekolah1Id,
        pilihanKe: 1,
        status: StatusPilihan.MENUNGGU,
        jarak: jarak1,
      },
    });

    return pendaftaran;
  });

  return result;
};

export const submitPendaftaran = async (userId: string) => {
  const pendaftaran = await prisma.pendaftaran.findUnique({
    where: { userId },
    include: {
      dokumen: true,
      hasil: true,
      pilihan: {
        include: { sekolah: true },
        orderBy: { pilihanKe: "asc" },
      },
      user: true,
    },
  });

  if (!pendaftaran) {
    throw new Error("Pendaftaran belum dibuat");
  }

  const adaDokumenMenunggu = pendaftaran.dokumen.some(
    (dokumen) => dokumen.status === StatusDokumen.MENUNGGU,
  );

  const pernahDitolak =
    pendaftaran.hasil?.statusFinal === "DITOLAK" ||
    pendaftaran.status === StatusPendaftaran.DITOLAK;

  const bolehSubmitUlang =
    pernahDitolak &&
    (pendaftaran.hasil?.jenisPenolakan === JenisPenolakan.DOKUMEN ||
      adaDokumenMenunggu);

  if (
    pendaftaran.submittedAt &&
    pendaftaran.noPendaftaran &&
    !bolehSubmitUlang
  ) {
    return pendaftaran;
  }

  const uploadedTypes = new Set(
    pendaftaran.dokumen.map((dokumen) => dokumen.tipeDokumen).filter(Boolean),
  );

  // Cek jika pendaftaran berada di Jalur PRESTASI dengan jenis prestasi "Nilai Rapor"
  const isJalurPrestasiRapor =
    pendaftaran.jalur === Jalur.PRESTASI &&
    pendaftaran.jenisPrestasi === "Nilai Rapor";

  // Jika ya, gantikan kewajiban dokumen RAPOR dengan PRESTASI
  const currentRequiredDokumen = isJalurPrestasiRapor
    ? requiredDokumen
        .filter((tipe) => tipe !== TipeDokumen.RAPOR)
        .concat(TipeDokumen.PRESTASI)
    : requiredDokumen;

  const missing = currentRequiredDokumen.filter(
    (tipe) => !uploadedTypes.has(tipe),
  );

  if (missing.length > 0) {
    throw new Error(`Berkas wajib belum lengkap: ${missing.join(", ")}`);
  }

  const masihAdaDitolak = pendaftaran.dokumen.some(
    (dokumen) => dokumen.status === StatusDokumen.DITOLAK,
  );

  if (masihAdaDitolak) {
    throw new Error(
      "Masih ada dokumen yang ditolak. Upload ulang dokumen tersebut.",
    );
  }

  const pilihanPertama = pendaftaran.pilihan.find(
    (pilihan) => pilihan.pilihanKe === 1,
  );

  if (!pilihanPertama) {
    throw new Error("Pilihan sekolah pertama tidak ditemukan");
  }

  return prisma.$transaction(async (tx) => {
    let noPendaftaran = pendaftaran.noPendaftaran;

    if (!noPendaftaran) {
      const totalSebelumnya = await tx.pilihanSekolah.count({
        where: {
          sekolahId: pilihanPertama.sekolahId,
          pilihanKe: 1,
          pendaftaran: {
            submittedAt: {
              not: null,
            },
          },
        },
      });

      noPendaftaran = String(totalSebelumnya + 1).padStart(2, "0");
    }

    const updated = await tx.pendaftaran.update({
      where: { id: pendaftaran.id },
      data: {
        noPendaftaran,
        submittedAt: new Date(),
        status: StatusPendaftaran.DIPROSES_1,
      },
      include: {
        pilihan: {
          include: { sekolah: true },
          orderBy: { pilihanKe: "asc" },
        },
        dokumen: true,
      },
    });

    await tx.pilihanSekolah.updateMany({
      where: {
        pendaftaranId: pendaftaran.id,
      },
      data: {
        status: StatusPilihan.DIPROSES,
        isLocked: false,
        alasanPenolakan: null,
      },
    });

    if (bolehSubmitUlang) {
      await tx.hasilSeleksi.deleteMany({
        where: {
          pendaftaranId: pendaftaran.id,
        },
      });
    }

    await tx.notifikasi.create({
      data: {
        userId,
        judul: bolehSubmitUlang
          ? "Berkas berhasil dikirim ulang"
          : "Pendaftaran berhasil dikirim",
        pesan: bolehSubmitUlang
          ? `Berkas perbaikan kamu sudah dikirim ulang dan sedang menunggu verifikasi dari ${pilihanPertama.sekolah.nama}.`
          : `Terima kasih sudah mendaftar di PPDB SMP Terpadu. Nomor pendaftaran kamu adalah ${noPendaftaran}. Berkas kamu sedang menunggu verifikasi dari ${pilihanPertama.sekolah.nama}.`,
      },
    });

    return updated;
  });
};

export const resetPendaftaranZonasi = async (userId: string) => {
  const pendaftaran = await prisma.pendaftaran.findUnique({
    where: { userId },
    include: {
      hasil: true,
    },
  });

  if (!pendaftaran) {
    throw new Error("Pendaftaran tidak ditemukan");
  }

  if (
    pendaftaran.hasil?.statusFinal !== "DITOLAK" ||
    pendaftaran.hasil?.jenisPenolakan !== JenisPenolakan.ZONASI
  ) {
    throw new Error("Daftar ulang hanya tersedia untuk penolakan zonasi");
  }

  await prisma.$transaction(async (tx) => {
    await tx.pengumuman.deleteMany({
      where: { pendaftaranId: pendaftaran.id },
    });

    await tx.hasilSeleksi.deleteMany({
      where: { pendaftaranId: pendaftaran.id },
    });

    await tx.dokumen.deleteMany({
      where: { pendaftaranId: pendaftaran.id },
    });

    await tx.pilihanSekolah.deleteMany({
      where: { pendaftaranId: pendaftaran.id },
    });

    await tx.verifikasiLog.deleteMany({
      where: { pendaftaranId: pendaftaran.id },
    });

    await tx.pendaftaran.delete({
      where: { id: pendaftaran.id },
    });

    await tx.notifikasi.create({
      data: {
        userId,
        judul: "Daftar ulang dibuka",
        pesan:
          "Pendaftaran lama karena zonasi sudah direset. Silakan isi pendaftaran ulang.",
      },
    });
  });

  return {
    message: "Pendaftaran berhasil direset. Silakan daftar ulang.",
  };
};

export const getDashboardPendaftaran = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      biodata: true,
      pendaftaran: {
        include: {
          hasil: true,
          dokumen: true,
          pilihan: {
            include: { sekolah: true },
            orderBy: { pilihanKe: "asc" },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const pendaftaran = user.pendaftaran;
  const hasBiodata = Boolean(user.biodata);
  const hasPendaftaran = Boolean(pendaftaran);

  const uploadedTypes = new Set(
    pendaftaran?.dokumen.map((d) => d.tipeDokumen).filter(Boolean) || [],
  );

  // Cek jika pendaftaran berada di Jalur PRESTASI dengan jenis prestasi "Nilai Rapor"
  const isJalurPrestasiRapor =
    pendaftaran?.jalur === Jalur.PRESTASI &&
    pendaftaran?.jenisPrestasi === "Nilai Rapor";

  // Jika ya, gantikan kewajiban dokumen RAPOR dengan PRESTASI
  const currentRequiredDokumen = isJalurPrestasiRapor
    ? requiredDokumen
        .filter((tipe) => tipe !== TipeDokumen.RAPOR)
        .concat(TipeDokumen.PRESTASI)
    : requiredDokumen;

  const requiredUploaded = currentRequiredDokumen.every((tipe) =>
    uploadedTypes.has(tipe),
  );

  const isSubmitted = Boolean(pendaftaran?.submittedAt);

  const progressPercent = isSubmitted
    ? 100
    : Math.round(
        ([true, hasBiodata, hasPendaftaran, requiredUploaded].filter(Boolean)
          .length /
          4) *
          100,
      );

  return {
    user: {
      nama: user.nama,
      email: user.email,
    },
    pendaftaran,
    progressPercent,
    noPendaftaran: pendaftaran?.noPendaftaran || "-",
    statusLabel: isSubmitted ? "TERDAFTAR" : "BELUM TERDAFTAR",
    steps: [
      { label: "Buat Akun", done: true },
      { label: "Isi Biodata", done: hasBiodata },
      { label: "Pendaftaran", done: hasPendaftaran },
      { label: "Upload Berkas", done: requiredUploaded },
      { label: "Selesai", done: isSubmitted },
    ],
  };
};
