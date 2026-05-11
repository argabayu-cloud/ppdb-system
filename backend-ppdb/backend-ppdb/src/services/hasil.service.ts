import prisma from "../config/prisma";

export const getHasilUser = async (userId: string) => {
  const pendaftaran = await prisma.pendaftaran.findUnique({
    where: { userId },
    include: {
      hasil: {
        include: {
          sekolah: true,
        },
      },
      pilihan: {
        include: {
          sekolah: true,
        },
      },
    },
  });

  if (!pendaftaran) {
    throw new Error("Data pendaftaran tidak ditemukan");
  }

  return pendaftaran;
};