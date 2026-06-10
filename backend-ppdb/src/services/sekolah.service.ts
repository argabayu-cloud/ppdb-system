import prisma from "../config/prisma";

type SekolahInput = {
  nama: string;
  alamat?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  kuota?: number | string;
  radiusZonasi?: number | string;
};

const toNumberOrNull = (value: unknown) => {
  if (value === undefined || value === null || value === "") return null;

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return null;

  return numberValue;
};

const toNumberOrDefault = (value: unknown, defaultValue: number) => {
  if (value === undefined || value === null || value === "")
    return defaultValue;

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return defaultValue;

  return numberValue;
};

export const createSekolah = async (data: SekolahInput) => {
  return await prisma.sekolah.create({
    data: {
      nama: data.nama,
      alamat: data.alamat,
      latitude: toNumberOrNull(data.latitude),
      longitude: toNumberOrNull(data.longitude),
      kuota: toNumberOrDefault(data.kuota, 0),
      radiusZonasi: toNumberOrDefault(data.radiusZonasi, 3),
    },
    select: {
      id: true,
      nama: true,
      alamat: true,
      latitude: true,
      longitude: true,
      kuota: true,
      radiusZonasi: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const getAllSekolah = async () => {
  const data = await prisma.sekolah.findMany({
    select: {
      id: true,
      nama: true,
      alamat: true,
      latitude: true,
      longitude: true,
      kuota: true,
      radiusZonasi: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return data.sort((a, b) => {
    const numA = parseInt(a.nama.match(/\d+/)?.[0] ?? "0");
    const numB = parseInt(b.nama.match(/\d+/)?.[0] ?? "0");
    return numA - numB;
  });
};

export const getSekolahById = async (id: string) => {
  return await prisma.sekolah.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      nama: true,
      alamat: true,
      latitude: true,
      longitude: true,
      kuota: true,
      radiusZonasi: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateSekolah = async (
  id: string,
  data: Partial<SekolahInput>,
) => {
  return await prisma.sekolah.update({
    where: {
      id,
    },
    data: {
      ...(data.nama !== undefined && { nama: data.nama }),
      ...(data.alamat !== undefined && { alamat: data.alamat }),
      ...(data.latitude !== undefined && {
        latitude: toNumberOrNull(data.latitude),
      }),
      ...(data.longitude !== undefined && {
        longitude: toNumberOrNull(data.longitude),
      }),
      ...(data.kuota !== undefined && {
        kuota: toNumberOrDefault(data.kuota, 0),
      }),
      ...(data.radiusZonasi !== undefined && {
        radiusZonasi: toNumberOrDefault(data.radiusZonasi, 3),
      }),
    },
    select: {
      id: true,
      nama: true,
      alamat: true,
      latitude: true,
      longitude: true,
      kuota: true,
      radiusZonasi: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteSekolah = async (id: string) => {
  return await prisma.sekolah.delete({
    where: {
      id,
    },
  });
};
