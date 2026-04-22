import prisma from "../config/prisma";

export const getPendaftar = async (adminId: string) => {
  // cari sekolah dari admin
  const admin = await prisma.adminSekolah.findUnique({
    where: { userId: adminId },
  });

  if (!admin) throw new Error("Admin tidak ditemukan");

  // ambil semua pendaftar yg memilih sekolah ini
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
      sekolah: true, // 🔥 tambahin ini
    },
  });

  return data;
};

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

  // Validasi akses
  if (pilihan.sekolahId !== admin.sekolahId) {
    throw new Error("Akses ditolak");
  }

  // 🔥 UPDATE PILIHAN
  await prisma.pilihanSekolah.update({
    where: { id: pilihanId },
    data: { status, alasanPenolakan: alasan },
  });

  // 🔁 LOGIC UTAMA
  if (status === "DITERIMA") {
    // langsung selesai
    await prisma.pendaftaran.update({
      where: { id: pilihan.pendaftaranId },
      data: {
        status: "DITERIMA",
      },
    });

    await prisma.hasilSeleksi.create({
      data: {
        pendaftaranId: pilihan.pendaftaranId,
        sekolahDiterimaId: pilihan.sekolahId,
        statusFinal: "DITERIMA",
      },
    });
  } else {
    // ❌ DITOLAK
    if (pilihan.pilihanKe === 1) {
      // lanjut ke pilihan 2
      await prisma.pendaftaran.update({
        where: { id: pilihan.pendaftaranId },
        data: {
          status: "DIPROSES_2",
        },
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
      // ❌ ditolak juga di pilihan 2 → gagal total
      await prisma.pendaftaran.update({
        where: { id: pilihan.pendaftaranId },
        data: {
          status: "DITOLAK",
        },
      });

      await prisma.hasilSeleksi.upsert({
        where: {
          pendaftaranId: pilihan.pendaftaranId,
        },
        update: {},
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
