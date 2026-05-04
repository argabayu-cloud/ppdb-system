import prisma from "../config/prisma";

// 🔥 GET PENDAFTAR (WAJIB TAMBAH INI)
export const getPendaftar = async (adminId: string) => {
  const admin = await prisma.adminSekolah.findUnique({
    where: { userId: adminId },
  });

  if (!admin) throw new Error("Admin tidak ditemukan");

  const data = await prisma.pilihanSekolah.findMany({
    where: {
      sekolahId: admin.sekolahId,
    },
    include: {
      pendaftaran: {
        include: {
          user: true,
        },
      },
      sekolah: true,
    },
  });

  return data;
};

// 🔥 SELEKSI SISWA (punya kamu, sudah oke)
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

  // 🔥 validasi akses sekolah
  if (pilihan.sekolahId !== admin.sekolahId) {
    throw new Error("Akses ditolak");
  }

  // 🔒 VALIDASI LOCK
  if (pilihan.isLocked) {
    throw new Error("Data sudah dikunci, tidak bisa diubah");
  }

  // 🔁 LOGIC UTAMA
  if (status === "DITERIMA") {

    // 🔥 lock semua pilihan (1 & 2)
    await prisma.pilihanSekolah.updateMany({
      where: {
        pendaftaranId: pilihan.pendaftaranId,
      },
      data: {
        status: "DITERIMA",
        isLocked: true,
      },
    });

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
    // ❌ DITOLAK
    await prisma.pilihanSekolah.update({
      where: { id: pilihanId },
      data: {
        status: "DITOLAK",
        alasanPenolakan: alasan || null,
      },
    });

    if (pilihan.pilihanKe === 1) {
      // 👉 lanjut ke pilihan 2
      await prisma.pendaftaran.update({
        where: { id: pilihan.pendaftaranId },
        data: { status: "DITOLAK_1" },
      });

      await prisma.pilihanSekolah.updateMany({
        where: {
          pendaftaranId: pilihan.pendaftaranId,
          pilihanKe: 2,
        },
        data: {
          status: "DIPROSES",
        },
      });

    } else {
      // ❌ ditolak final
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