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
    include: {
      pendaftaran: {
        include: {
          dokumen: true,
        },
      },
    },
  });

  if (!pilihan) throw new Error("Data tidak ditemukan");

  // Validasi Dokumen Sebelum Seleksi
  const dokumen = pilihan.pendaftaran.dokumen;

  if (!dokumen || dokumen.length === 0) {
    throw new Error("Dokumen belum diupload");
  }

  // Jika ada dokumen belum diterima
  const adaYangBelumValid = dokumen.some((d) => d.status !== "DITERIMA");

  if (adaYangBelumValid) {
    throw new Error("Semua dokumen harus divalidasi terlebih dahulu");
  }

  if (status === "DITOLAK") {
    await prisma.dokumen.updateMany({
      where: { pendaftaranId: pilihan.pendaftaranId },
      data: { status: "DITOLAK" },
    });
  }

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

// 🔥 VALIDASI DOKUMEN ADMIN
export const validasiDokumen = async (
  adminId: string,
  dokumenId: string,
  status: "DITERIMA" | "DITOLAK",
) => {
  // 🔍 cek admin
  const admin = await prisma.adminSekolah.findUnique({
    where: { userId: adminId },
  });

  if (!admin) throw new Error("Admin tidak ditemukan");

  // 🔍 ambil dokumen + relasi pendaftaran + pilihan
  const dokumen = await prisma.dokumen.findUnique({
    where: { id: dokumenId },
    include: {
      pendaftaran: {
        include: {
          pilihan: true,
        },
      },
    },
  });

  if (!dokumen) throw new Error("Dokumen tidak ditemukan");

  // 🔐 VALIDASI AKSES SEKOLAH
  const punyaAkses = dokumen.pendaftaran.pilihan.some(
    (p) => p.sekolahId === admin.sekolahId,
  );

  if (!punyaAkses) {
    throw new Error("Akses ditolak");
  }

  // 🔒 CEK SUDAH DIVALIDASI ATAU BELUM
  if (dokumen.status !== "MENUNGGU") {
    throw new Error("Dokumen sudah divalidasi sebelumnya");
  }

  // 🔥 UPDATE STATUS DOKUMEN
  const updated = await prisma.dokumen.update({
    where: { id: dokumenId },
    data: {
      status,
    },
  });

  return updated;
};
