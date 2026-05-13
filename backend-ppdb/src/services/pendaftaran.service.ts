import prisma from "../config/prisma";
import { haversineDistance } from "../utils/distance";

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
    throw new Error("User tidak ditemukan. Silakan login ulang.");
  }

  const sekolah1 = await prisma.sekolah.findUnique({
    where: { id: sekolah1Id },
  });

  const sekolah2 = sekolah2Id
    ? await prisma.sekolah.findUnique({
        where: { id: sekolah2Id },
      })
    : null;

  if (!sekolah1) {
    throw new Error("Sekolah pilihan pertama tidak ditemukan");
  }

  if (sekolah2Id && !sekolah2) {
    throw new Error("Sekolah pilihan kedua tidak ditemukan");
  }

  const canCalculateDistance =
    user.latitude !== null &&
    user.latitude !== undefined &&
    user.longitude !== null &&
    user.longitude !== undefined;

  const jarak1 = canCalculateDistance
    ? haversineDistance(
        user.latitude!,
        user.longitude!,
        sekolah1.latitude,
        sekolah1.longitude,
      )
    : null;

  const jarak2 =
    canCalculateDistance && sekolah2
      ? haversineDistance(
          user.latitude!,
          user.longitude!,
          sekolah2.latitude,
          sekolah2.longitude,
        )
      : null;

  const parsedNilaiRapor = nilaiRataRata
    ? Number.parseFloat(String(nilaiRataRata))
    : null;

  const result = await prisma.$transaction(async (tx) => {
    const pendaftaran = await tx.pendaftaran.create({
      data: {
        userId,
        jalur,
        status: "DIPROSES_1",
        nisn,
        namaSekolahAsal,
        npsn,
        tahunLulus,
        nilaiRapor: Number.isNaN(parsedNilaiRapor) ? null : parsedNilaiRapor,
        jenisPrestasi: jalur === "PRESTASI" ? jenisPrestasi || null : null,
        tingkatPrestasi:
          jalur === "PRESTASI" && jenisPrestasi !== "Nilai Rapor"
            ? tingkatPrestasi || null
            : null,
      },
    });

    await tx.pilihanSekolah.create({
      data: {
        pendaftaranId: pendaftaran.id,
        sekolahId: sekolah1Id,
        pilihanKe: 1,
        jarak: jarak1,
      },
    });

    if (sekolah2Id) {
      await tx.pilihanSekolah.create({
        data: {
          pendaftaranId: pendaftaran.id,
          sekolahId: sekolah2Id,
          pilihanKe: 2,
          jarak: jarak2,
        },
      });
    }

    return pendaftaran;
  });

  return result;
};