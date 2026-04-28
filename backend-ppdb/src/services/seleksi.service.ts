import prisma from "../config/prisma";

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

    // 🔥 urutkan berdasarkan jarak
    const sorted = sekolah.pilihan.sort(
      (a: any, b: any) => (a.jarak || 0) - (b.jarak || 0)
    );

    const diterima = sorted.slice(0, kuota);
    const ditolak = sorted.slice(kuota);

    // ✅ update yang diterima
    for (const item of diterima) {
      await prisma.pilihanSekolah.update({
        where: { id: item.id },
        data: {
          status: "DITERIMA",
        },
      });

      await prisma.pendaftaran.update({
        where: { id: item.pendaftaranId },
        data: {
          status: "DITERIMA",
        },
      });
    }

    // ❌ update yang ditolak → lanjut ke pilihan 2
    for (const item of ditolak) {
      await prisma.pilihanSekolah.update({
        where: { id: item.id },
        data: {
          status: "DITOLAK",
        },
      });

      await prisma.pendaftaran.update({
        where: { id: item.pendaftaranId },
        data: {
          status: "DITOLAK_1",
        },
      });
    }
  }

  return { message: "Seleksi zonasi selesai" };
};