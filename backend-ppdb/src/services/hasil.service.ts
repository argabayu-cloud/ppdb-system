import prisma from "../config/prisma";

export const getHasilUser = async (userId: string) => {
  const hasil = await prisma.hasilSeleksi.findFirst({
    where: {
      pendaftaran: {
        userId,
      },
    },
    include: {
      sekolah: true,
      pendaftaran: {
        include: {
          user: {
            select: {
              id: true,
              nama: true,
              email: true,
              noTlpn: true,
              biodata: true,
            },
          },
          pilihan: {
            include: {
              sekolah: true,
            },
            orderBy: {
              pilihanKe: "asc",
            },
          },
        },
      },
    },
  });

  return hasil;
};