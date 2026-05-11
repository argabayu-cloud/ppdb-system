import prisma from "../config/prisma";

type NotifInput = {
  userId: string;
  judul: string;
  pesan: string;
};

export const createNotifikasi = async (data: NotifInput) => {
  return await prisma.notifikasi.create({
    data,
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