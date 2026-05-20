import { StatusDokumen, TipeDokumen } from "@prisma/client";
import prisma from "../config/prisma";

export const getDokumenSaya = async (userId: string) => {
  const pendaftaran = await prisma.pendaftaran.findUnique({
    where: { userId },
    include: {
      dokumen: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!pendaftaran) {
    return [];
  }

  return pendaftaran.dokumen;
};

export const uploadDokumen = async (
  userId: string,
  file: Express.Multer.File,
  tipeDokumen: TipeDokumen,
) => {
  const pendaftaran = await prisma.pendaftaran.findUnique({
    where: { userId },
  });

  if (!pendaftaran) {
    throw new Error("Pendaftaran belum dibuat");
  }

  if (!Object.values(TipeDokumen).includes(tipeDokumen)) {
    throw new Error("Tipe dokumen tidak valid");
  }

  const existing = await prisma.dokumen.findFirst({
    where: {
      pendaftaranId: pendaftaran.id,
      tipeDokumen,
    },
  });

  const data = {
    namaFile: file.originalname,
    urlFile: file.path,
    tipe: file.mimetype,
    ukuran: file.size,
    tipeDokumen,
    status: StatusDokumen.MENUNGGU,
  };

  if (existing) {
    return prisma.dokumen.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.dokumen.create({
    data: {
      pendaftaranId: pendaftaran.id,
      ...data,
    },
  });
};