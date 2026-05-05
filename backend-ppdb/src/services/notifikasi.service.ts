import prisma from "../config/prisma";

export const createNotifikasi = async (userId: string, pesan: string) => {
    return await prisma.notifikasi.create({
        data: {
            userId,
            pesan,
        },
    });
};

export const getNotifikasiByUser = async (userId: string) => {
  return await prisma.notifikasi.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const markAsRead = async (id: string) => {
  return await prisma.notifikasi.update({
    where: { id },
    data: { isRead: true },
  });
};