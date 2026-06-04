import { StatusDokumen, TipeDokumen } from "@prisma/client";
import prisma from "../config/prisma";
import { supabase } from "../config/supabase";

const bucket = process.env.SUPABASE_BUCKET || "ppdb-dokumen";

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

  const ext = file.originalname.split(".").pop();
  const safeName = file.originalname
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase();

  const fileName = `${userId}/${pendaftaran.id}/${tipeDokumen}-${safeName}-${Date.now()}.${ext}`;

  let uploadResult;
  try {
    uploadResult = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });
  } catch (fetchErr: any) {
    console.error("Supabase storage fetch error:", fetchErr);
    throw new Error(
      `Gagal terhubung ke storage: ${fetchErr?.message || "fetch failed"}. ` +
      `Pastikan SUPABASE_URL dan bucket '${bucket}' sudah benar dan aktif.`
    );
  }

  if (uploadResult.error) {
    console.error("Supabase upload error:", uploadResult.error);
    throw new Error(
      `Upload gagal: ${uploadResult.error.message} (bucket: ${bucket})`
    );
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  const existing = await prisma.dokumen.findFirst({
    where: {
      pendaftaranId: pendaftaran.id,
      tipeDokumen,
    },
  });

  const data = {
    namaFile: file.originalname,
    urlFile: publicUrlData.publicUrl,
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