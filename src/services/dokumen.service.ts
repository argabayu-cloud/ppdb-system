import prisma from "../config/prisma";

export const uploadDokumen = async (
  userId: string,
  file: Express.Multer.File,
  tipeDokumen: "KK" | "AKTA" | "RAPOR" | "PRESTASI"
) => {
  const pendaftaran = await prisma.pendaftaran.findFirst({
    where: { userId },
  });

  if (!pendaftaran) {
    throw new Error("Pendaftaran tidak ditemukan");
  }

  // 🔥 optional: cegah upload ganda per tipe
  const existing = await prisma.dokumen.findFirst({
    where: {
      pendaftaranId: pendaftaran.id,
      tipeDokumen,
    },
  });

  if (existing) {
    throw new Error(`Dokumen ${tipeDokumen} sudah diupload`);
  }

  return await prisma.dokumen.create({
    data: {
      pendaftaranId: pendaftaran.id,
      namaFile: file.originalname,
      urlFile: file.path,
      tipe: file.mimetype,
      ukuran: file.size,
      tipeDokumen,
    },
  });
};