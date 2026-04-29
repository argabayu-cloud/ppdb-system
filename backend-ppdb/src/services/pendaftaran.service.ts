import prisma from "../config/prisma";
import { haversineDistance } from "../utils/distance";

export const createPendaftaran = async (userId: string, data: any) => {
  const { sekolah1Id, sekolah2Id, jalur } = data;

  // ❗ validasi sekolah tidak boleh sama
  if (sekolah1Id === sekolah2Id) {
    throw new Error("Pilihan sekolah tidak boleh sama");
  }

  // ❗ cek sudah daftar atau belum
  const existing = await prisma.pendaftaran.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new Error("User sudah melakukan pendaftaran");
  }

  // 🔥 ambil user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  if (!user.latitude || !user.longitude) {
    throw new Error("Koordinat user belum diisi");
  }

  // 🔥 ambil sekolah
  const sekolah1 = await prisma.sekolah.findUnique({
    where: { id: sekolah1Id },
  });

  const sekolah2 = await prisma.sekolah.findUnique({
    where: { id: sekolah2Id },
  });

  if (!sekolah1 || !sekolah2) {
    throw new Error("Sekolah tidak ditemukan");
  }

  // 📍 hitung jarak
  const jarak1 = haversineDistance(
    user.latitude,
    user.longitude,
    sekolah1.latitude,
    sekolah1.longitude
  );

  const jarak2 = haversineDistance(
    user.latitude,
    user.longitude,
    sekolah2.latitude,
    sekolah2.longitude
  );

  // 🔥 TRANSACTION (AMAN)
  const result = await prisma.$transaction(async (tx: any) => {
    const pendaftaran = await tx.pendaftaran.create({
      data: {
        userId,
        jalur,
        status: "DIPROSES_1", // sementara pakai string biar tidak error
      },
    });

    await tx.pilihanSekolah.createMany({
      data: [
        {
          pendaftaranId: pendaftaran.id,
          sekolahId: sekolah1Id,
          pilihanKe: 1,
          jarak: jarak1,
        },
        {
          pendaftaranId: pendaftaran.id,
          sekolahId: sekolah2Id,
          pilihanKe: 2,
          jarak: jarak2,
        },
      ],
    });

    return pendaftaran;
  });

  return result;
};