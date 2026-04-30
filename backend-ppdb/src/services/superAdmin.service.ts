import prisma from "../config/prisma";

export const getAllPendaftaran = async () => {
  return await prisma.pendaftaran.findMany({
    include: {
      user: true,
      pilihan: {
        include: {
          sekolah: true,
        },
      },
      hasil: {
        include: {
          sekolah: true,
        },
      },
    },
  });
};

export const getHasilSeleksi = async () => {
  return await prisma.hasilSeleksi.findMany({
    include: {
      pendaftaran: {
        include: {
          user: true,
        },
      },
      sekolah: true,
    },
  });
};

export const validasiFinal = async (
  pendaftaranId: string,
  status: "DITERIMA" | "DITOLAK"
) => {
  const data = await prisma.pendaftaran.findUnique({
    where: { id: pendaftaranId },
    include: {
      user: true,
      hasil: {
        include: {
          sekolah: true,
        },
      },
    },
  });

  if (!data) throw new Error("Pendaftaran tidak ditemukan");

  // 🔥 aman pakai upsert
  await prisma.hasilSeleksi.upsert({
    where: { pendaftaranId },
    update: {
      statusFinal: status,
    },
    create: {
      pendaftaranId,
      statusFinal: status,
    },
  });

  let judul = "";
  let pesan = "";

  if (status === "DITERIMA") {
    judul = "Selamat! Anda Diterima 🎉";
    pesan = `Anda diterima di ${
      data.hasil?.sekolah?.nama || "sekolah pilihan"
    }`;
  } else {
    judul = "Mohon Maaf";
    pesan = "Anda belum diterima di sekolah pilihan manapun";
  }

  await prisma.pengumuman.create({
    data: {
      userId: data.userId,
      pendaftaranId: data.id,
      judul,
      pesan,
    },
  });

  return { message: "Validasi berhasil & pengumuman dikirim" };
};