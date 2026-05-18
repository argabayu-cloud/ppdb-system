import { TipeDokumen } from "@prisma/client";
import prisma from "../config/prisma";

export const uploadDokumen = async (
  userId: string,
  file: Express.Multer.File,
  tipeDokumen: TipeDokumen,
) => {
  if (!Object.values(TipeDokumen).includes(tipeDokumen)) {
    throw new Error("Tipe dokumen tidak valid");
  }

  const pendaftaran = await prisma.pendaftaran.findUnique({
    where: { userId },
  });

  if (!pendaftaran) {
    throw new Error("Pendaftaran tidak ditemukan");
  }

  if (pendaftaran.submittedAt) {
    throw new Error("Berkas tidak bisa diubah karena pendaftaran sudah dikirim");
  }

  const existing = await prisma.dokumen.findFirst({
    where: {
      pendaftaranId: pendaftaran.id,
      tipeDokumen,
    },
  });

  if (existing) {
    return prisma.dokumen.update({
      where: { id: existing.id },
      data: {
        namaFile: file.originalname,
        urlFile: file.path,
        tipe: file.mimetype,
        ukuran: file.size,
        status: "MENUNGGU",
      },
    });
  }

  return prisma.dokumen.create({
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