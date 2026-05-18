import {
  StatusPendaftaran,
  StatusPilihan,
  TipeDokumen,
} from "@prisma/client";

import prisma from "../config/prisma";
import { haversineDistance } from "../utils/distance";

const requiredDokumen = [
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
    typeof user.latitude === "number" && typeof user.longitude === "number";

  const jarak1 = bisaHitungJarak
    ? haversineDistance(
        user.latitude as number,
        user.longitude as number,
        sekolah1.latitude,
        sekolah1.longitude,
      )
    : null;

  const jarak2 =
    bisaHitungJarak && sekolah2
      ? haversineDistance(
          user.latitude as number,
          user.longitude as number,
          sekolah2.latitude,
          sekolah2.longitude,
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

    if (sekolah2Id) {
      await tx.pilihanSekolah.create({
        data: {
          pendaftaranId: pendaftaran.id,
          sekolahId: sekolah2Id,
          pilihanKe: 2,
          status: StatusPilihan.MENUNGGU,
          jarak: jarak2,
        },
      });
    }

    return pendaftaran;
  });

  return result;
};

export const submitPendaftaran = async (userId: string) => {
  const pendaftaran = await prisma.pendaftaran.findUnique({
    where: { userId },
    include: {
      dokumen: true,
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

  if (pendaftaran.submittedAt && pendaftaran.noPendaftaran) {
    return pendaftaran;
  }

  const uploadedTypes = new Set(
    pendaftaran.dokumen.map((d) => d.tipeDokumen).filter(Boolean),
  );

  const missing = requiredDokumen.filter((tipe) => !uploadedTypes.has(tipe));

  if (missing.length > 0) {
    throw new Error(`Berkas wajib belum lengkap: ${missing.join(", ")}`);
  }

  const pilihanPertama = pendaftaran.pilihan.find((p) => p.pilihanKe === 1);

  if (!pilihanPertama) {
    throw new Error("Pilihan sekolah pertama tidak ditemukan");
  }

  return prisma.$transaction(async (tx) => {
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

    const noPendaftaran = String(totalSebelumnya + 1).padStart(2, "0");

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

    await tx.pilihanSekolah.update({
      where: {
        pendaftaranId_pilihanKe: {
          pendaftaranId: pendaftaran.id,
          pilihanKe: 1,
        },
      },
      data: {
        status: StatusPilihan.DIPROSES,
      },
    });

    await tx.notifikasi.create({
      data: {
        userId,
        judul: "Pendaftaran berhasil dikirim",
        pesan: `Terima kasih sudah mendaftar di PPDB SMP Terpadu. Nomor pendaftaran kamu adalah ${noPendaftaran}. Berkas kamu sedang menunggu verifikasi dari ${pilihanPertama.sekolah.nama}.`,
      },
    });

    return updated;
  });
};

export const getDashboardPendaftaran = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      biodata: true,
      pendaftaran: {
        include: {
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

  const requiredUploaded = requiredDokumen.every((tipe) =>
    uploadedTypes.has(tipe),
  );

  const isSubmitted = Boolean(pendaftaran?.submittedAt);

  const progressPercent = isSubmitted
    ? 100
    : Math.round(
        ([
          true,
          hasBiodata,
          hasPendaftaran,
          requiredUploaded,
        ].filter(Boolean).length /
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