import prisma from "../config/prisma";

export const getBiodataByUserId = async (userId: string) => {
  return prisma.biodata.findUnique({ where: { userId } });
};

export const upsertBiodata = async (userId: string, data: any) => {
  const biodata = await prisma.biodata.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      nama: data.namaLengkap || undefined,
      noTlpn: data.noHp || undefined,
      alamat: data.alamat || undefined,
      kelurahan: data.kelurahan || undefined,
      kecamatan: data.kecamatan || undefined,
    },
  });

  return biodata;
};