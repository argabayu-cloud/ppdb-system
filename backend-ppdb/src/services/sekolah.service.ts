import prisma from "../config/prisma"

type SekolahInput = {
    nama: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota: number;
}

export const createSekolah = async (data: SekolahInput) => {
    return await prisma.sekolah.create({ data });
}

export const getAllSekolah = async () => {
    return await prisma.sekolah.findMany({
        orderBy: { createdAt: "desc"},
    });
};

export const getSekolahById = async (id: string) => {
    return await prisma.sekolah.findUnique({ 
        where: {id},
    });
};

export const updateSekolah = async (id: string, data: SekolahInput) => {
    return await prisma.sekolah.update({
        where: {id}, 
        data,
    });
};

export const deleteSekolah = async (id: string) => {
    return await prisma.sekolah.delete({
        where: {id},
    });
};
