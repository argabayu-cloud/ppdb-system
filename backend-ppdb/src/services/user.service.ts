import prisma from "../config/prisma";

export const getPengumumanByUser = async (userId: string) => {
  return await prisma.pengumuman.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};