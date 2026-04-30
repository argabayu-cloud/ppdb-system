import prisma from "../config/prisma";

// ===============================
// 🔥 SELEKSI ZONASI (PILIHAN 1)
// ===============================
export const seleksiZonasi = async () => {
  const sekolahList = await prisma.sekolah.findMany({
    include: {
      pilihan: {
        where: { pilihanKe: 1 },
        include: {
          pendaftaran: true,
        },
      },
    },
  });

  for (const sekolah of sekolahList) {
    const kuota = sekolah.kuota;

    // urutkan berdasarkan jarak
    const sorted = sekolah.pilihan.sort(
      (a: any, b: any) => (a.jarak || 0) - (b.jarak || 0)
    );

    const diterima = sorted.slice(0, kuota);
    const ditolak = sorted.slice(kuota);

    // ===============================
    // ✅ YANG DITERIMA (FINAL)
    // ===============================
    for (const item of diterima) {
      await prisma.pilihanSekolah.update({
        where: { id: item.id },
        data: { status: "DITERIMA" },
      });

      await prisma.pendaftaran.update({
        where: { id: item.pendaftaranId },
        data: { status: "DITERIMA" },
      });

      // 🔥 SIMPAN HASIL FINAL
      await prisma.hasilSeleksi.upsert({
        where: { pendaftaranId: item.pendaftaranId },
        update: {
          statusFinal: "DITERIMA",
          sekolahDiterimaId: sekolah.id,
        },
        create: {
          pendaftaranId: item.pendaftaranId,
          statusFinal: "DITERIMA",
          sekolahDiterimaId: sekolah.id,
        },
      });
    }

    // ===============================
    // ❌ YANG DITOLAK → KE PILIHAN 2
    // ===============================
    for (const item of ditolak) {
      await prisma.pilihanSekolah.update({
        where: { id: item.id },
        data: { status: "DITOLAK" },
      });

      await prisma.pendaftaran.update({
        where: { id: item.pendaftaranId },
        data: { status: "DITOLAK_1" },
      });
    }
  }

  return { message: "Seleksi zonasi selesai" };
};

// ===============================
// 🔥 SELEKSI CASCADING (PILIHAN 2)
// ===============================
export const seleksiCascading = async () => {
  const sekolahList = await prisma.sekolah.findMany({
    include: {
      pilihan: {
        where: { pilihanKe: 2 },
        include: {
          pendaftaran: true,
        },
      },
    },
  });

  for (const sekolah of sekolahList) {
    // 🔥 HITUNG SISA KUOTA (FIX PENTING)
    const sudahDiterima = await prisma.pilihanSekolah.count({
      where: {
        sekolahId: sekolah.id,
        status: "DITERIMA",
      },
    });

    const sisaKuota = sekolah.kuota - sudahDiterima;

    if (sisaKuota <= 0) continue;

    // hanya kandidat yang gagal di pilihan 1
    const kandidat = sekolah.pilihan.filter(
      (p: any) => p.pendaftaran.status === "DITOLAK_1"
    );

    const sorted = kandidat.sort(
      (a: any, b: any) => (a.jarak || 0) - (b.jarak || 0)
    );

    const diterima = sorted.slice(0, sisaKuota);
    const ditolak = sorted.slice(sisaKuota);

    // ===============================
    // ✅ DITERIMA FINAL
    // ===============================
    for (const item of diterima) {
      await prisma.pilihanSekolah.update({
        where: { id: item.id },
        data: { status: "DITERIMA" },
      });

      await prisma.pendaftaran.update({
        where: { id: item.pendaftaranId },
        data: { status: "DITERIMA" },
      });

      await prisma.hasilSeleksi.upsert({
        where: { pendaftaranId: item.pendaftaranId },
        update: {
          statusFinal: "DITERIMA",
          sekolahDiterimaId: sekolah.id,
        },
        create: {
          pendaftaranId: item.pendaftaranId,
          statusFinal: "DITERIMA",
          sekolahDiterimaId: sekolah.id,
        },
      });
    }

    // ===============================
    // ❌ DITOLAK FINAL
    // ===============================
    for (const item of ditolak) {
      await prisma.pilihanSekolah.update({
        where: { id: item.id },
        data: { status: "DITOLAK" },
      });

      await prisma.pendaftaran.update({
        where: { id: item.pendaftaranId },
        data: { status: "DITOLAK" },
      });

      await prisma.hasilSeleksi.upsert({
        where: { pendaftaranId: item.pendaftaranId },
        update: {
          statusFinal: "DITOLAK",
        },
        create: {
          pendaftaranId: item.pendaftaranId,
          statusFinal: "DITOLAK",
        },
      });
    }
  }

  return { message: "Cascading seleksi selesai" };
};