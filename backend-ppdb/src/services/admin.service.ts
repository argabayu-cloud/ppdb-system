import prisma from "../config/prisma";

export const seleksiSiswa = async (
  adminId: string,
  pilihanId: string,
  status: "DITERIMA" | "DITOLAK",
  alasan?: string,
) => {
  const admin = await prisma.adminSekolah.findUnique({
    where: { userId: adminId },
  });

  if (!admin) throw new Error("Admin tidak ditemukan");

  const pilihan = await prisma.pilihanSekolah.findUnique({
    where: { id: pilihanId },
  });

  if (!pilihan) throw new Error("Data tidak ditemukan");

  // 🔥 validasi akses
  if (pilihan.sekolahId !== admin.sekolahId) {
    throw new Error("Akses ditolak");
  }

  // 🔥 update pilihan
  await prisma.pilihanSekolah.update({
    where: { id: pilihanId },
    data: {
      status,
      alasanPenolakan: status === "DITOLAK" ? alasan : null,
    },
  });

  // 🔁 logic utama
  if (status === "DITERIMA") {
    await prisma.pendaftaran.update({
      where: { id: pilihan.pendaftaranId },
      data: { status: "DITERIMA" },
    });

    await prisma.hasilSeleksi.upsert({
      where: { pendaftaranId: pilihan.pendaftaranId },
      update: {
        statusFinal: "DITERIMA",
        sekolahDiterimaId: pilihan.sekolahId,
      },
      create: {
        pendaftaranId: pilihan.pendaftaranId,
        sekolahDiterimaId: pilihan.sekolahId,
        statusFinal: "DITERIMA",
      },
    });

  } else {
    if (pilihan.pilihanKe === 1) {
      await prisma.pendaftaran.update({
        where: { id: pilihan.pendaftaranId },
        data: { status: "DITOLAK_1" },
      });

      await prisma.pilihanSekolah.updateMany({
        where: {
          pendaftaranId: pilihan.pendaftaranId,
          pilihanKe: 2,
        },
        data: { status: "DIPROSES" },
      });

    } else {
      await prisma.pendaftaran.update({
        where: { id: pilihan.pendaftaranId },
        data: { status: "DITOLAK" },
      });

      await prisma.hasilSeleksi.upsert({
        where: { pendaftaranId: pilihan.pendaftaranId },
        update: {
          statusFinal: "DITOLAK",
          catatan: alasan,
        },
        create: {
          pendaftaranId: pilihan.pendaftaranId,
          statusFinal: "DITOLAK",
          catatan: alasan,
        },
      });
    }
  }

  return {
    message: "Seleksi berhasil",
  };
};