import { sendEmail } from "../utils/mailer";

import {
  JenisPenolakan,
  StatusDokumen,
  StatusFinal,
  StatusPendaftaran,
  StatusPilihan,
} from "@prisma/client";

import prisma from "../config/prisma";

export const getDashboardAdmin = async (adminId: string) => {
  const admin = await prisma.adminSekolah.findUnique({
    where: { userId: adminId },
    include: {
      sekolah: true,
    },
  });

  if (!admin) throw new Error("Admin tidak ditemukan");

  const pilihan = await prisma.pilihanSekolah.findMany({
    where: {
      sekolahId: admin.sekolahId,
      pendaftaran: {
        submittedAt: {
          not: null,
        },
      },
    },
    include: {
      pendaftaran: {
        include: {
          dokumen: true,
        },
      },
    },
  });

  const total = pilihan.length;

  const menunggu = pilihan.filter(
    (item) =>
      item.status === StatusPilihan.DIPROSES ||
      item.pendaftaran.status === StatusPendaftaran.DIPROSES_1 ||
      item.pendaftaran.dokumen.some(
        (dokumen) => dokumen.status === StatusDokumen.MENUNGGU,
      ),
  ).length;

  const diterima = pilihan.filter(
    (item) =>
      item.status === StatusPilihan.DITERIMA ||
      item.pendaftaran.status === StatusPendaftaran.DITERIMA,
  ).length;

  const ditolak = pilihan.filter(
    (item) =>
      item.status === StatusPilihan.DITOLAK ||
      item.pendaftaran.status === StatusPendaftaran.DITOLAK,
  ).length;

  const zonasi = pilihan.filter(
    (item) => item.pendaftaran.jalur === "ZONASI",
  ).length;

  const prestasi = pilihan.filter(
    (item) => item.pendaftaran.jalur === "PRESTASI",
  ).length;

  const progress =
    total > 0 ? Math.round(((diterima + ditolak) / total) * 100) : 0;

  return {
    sekolah: admin.sekolah,
    stats: {
      total,
      menunggu,
      diterima,
      ditolak,
      zonasi,
      prestasi,
      progress,
    },
  };
};

export const getPendaftar = async (adminId: string) => {
  const admin = await prisma.adminSekolah.findUnique({
    where: { userId: adminId },
    include: {
      sekolah: true,
    },
  });

  if (!admin) throw new Error("Admin tidak ditemukan");

  const data = await prisma.pilihanSekolah.findMany({
    where: {
      sekolahId: admin.sekolahId,
      status: StatusPilihan.DIPROSES,
      pendaftaran: {
        submittedAt: {
          not: null,
        },
        status: StatusPendaftaran.DIPROSES_1,
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
          dokumen: {
            orderBy: {
              createdAt: "asc",
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
    orderBy: {
      updatedAt: "desc",
    },
  });

  return data;
};

export const seleksiSiswa = async (
  adminId: string,
  pilihanId: string,
  status: "DITERIMA" | "DITOLAK",
  alasan?: string,
  jenisPenolakan?: "DOKUMEN" | "ZONASI" | "LAINNYA",
) => {
  const admin = await prisma.adminSekolah.findUnique({
    where: { userId: adminId },
  });

  if (!admin) throw new Error("Admin tidak ditemukan");

  const pilihan = await prisma.pilihanSekolah.findUnique({
    where: { id: pilihanId },
    include: {
      sekolah: true,
      pendaftaran: {
        include: {
          dokumen: true,
          user: true,
        },
      },
    },
  });

  if (!pilihan) throw new Error("Data tidak ditemukan");

  if (pilihan.sekolahId !== admin.sekolahId) {
    throw new Error("Akses ditolak");
  }

  if (pilihan.isLocked) {
    throw new Error("Data sudah dikunci, tidak bisa diubah");
  }

  if (!pilihan.pendaftaran.submittedAt) {
    throw new Error("Pendaftaran belum dikirim oleh peserta");
  }

  const dokumen = pilihan.pendaftaran.dokumen;

  if (!dokumen || dokumen.length === 0) {
    throw new Error("Dokumen belum diupload");
  }

  if (status === "DITERIMA") {
    const adaDokumenDitolak = dokumen.some(
      (item) => item.status === StatusDokumen.DITOLAK,
    );

    if (adaDokumenDitolak) {
      throw new Error(
        "Masih ada dokumen yang ditolak. Peserta belum bisa diterima.",
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.dokumen.updateMany({
        where: {
          pendaftaranId: pilihan.pendaftaranId,
        },
        data: {
          status: StatusDokumen.DITERIMA,
        },
      });

      await tx.pilihanSekolah.update({
        where: { id: pilihanId },
        data: {
          status: StatusPilihan.DITERIMA,
          isLocked: true,
        },
      });

      await tx.pendaftaran.update({
        where: { id: pilihan.pendaftaranId },
        data: {
          status: StatusPendaftaran.DITERIMA,
        },
      });

      await tx.hasilSeleksi.upsert({
        where: { pendaftaranId: pilihan.pendaftaranId },
        update: {
          statusFinal: StatusFinal.DITERIMA,
          sekolahDiterimaId: pilihan.sekolahId,
          catatan: null,
          jenisPenolakan: null,
        },
        create: {
          pendaftaranId: pilihan.pendaftaranId,
          sekolahDiterimaId: pilihan.sekolahId,
          statusFinal: StatusFinal.DITERIMA,
          catatan: null,
          jenisPenolakan: null,
        },
      });

      await tx.pengumuman.create({
        data: {
          userId: pilihan.pendaftaran.userId,
          pendaftaranId: pilihan.pendaftaranId,
          judul: "Hasil Seleksi PPDB",
          pesan: `Selamat, kamu dinyatakan diterima di ${pilihan.sekolah.nama}.`,
        },
      });

      await tx.notifikasi.create({
        data: {
          userId: pilihan.pendaftaran.userId,
          judul: "Pendaftaran Diterima",
          pesan: `Selamat, pendaftaran kamu diterima di ${pilihan.sekolah.nama}. Silakan cek halaman pengumuman.`,
        },
      });
    });

    console.log("AKAN MENGIRIM EMAIL DITERIMA");
    console.log("EMAIL TUJUAN:", pilihan.pendaftaran.user.email);

    await sendEmail(
      pilihan.pendaftaran.user.email,
      "Hasil Seleksi PPDB",
      `
    <div style="font-family: Arial, sans-serif;">
      <h2>Selamat 🎉</h2>

      <p>
        Kamu dinyatakan <b>DITERIMA</b> di:
      </p>

      <h3>${pilihan.sekolah.nama}</h3>

      <p>
        Silakan login ke sistem PPDB untuk melihat detail pengumuman.
      </p>

      <br />

      <p>PPDB SMP</p>
    </div>
  `,
    );

    return {
      message: "Siswa berhasil diterima",
    };
  }

  if (!alasan || alasan.trim() === "") {
    throw new Error("Alasan penolakan wajib diisi");
  }

  if (!jenisPenolakan) {
    throw new Error("Jenis penolakan wajib diisi");
  }

  const jenisPenolakanFinal = jenisPenolakan as JenisPenolakan;

  if (jenisPenolakanFinal === JenisPenolakan.DOKUMEN) {
    const adaDokumenDitolak = dokumen.some(
      (item) => item.status === StatusDokumen.DITOLAK,
    );

    if (!adaDokumenDitolak) {
      throw new Error(
        "Penolakan dokumen hanya bisa dilakukan jika ada dokumen yang ditolak",
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.pilihanSekolah.update({
      where: { id: pilihanId },
      data: {
        status: StatusPilihan.DITOLAK,
        alasanPenolakan: alasan,
        isLocked: true,
      },
    });

    await tx.pendaftaran.update({
      where: { id: pilihan.pendaftaranId },
      data: {
        status: StatusPendaftaran.DITOLAK,
      },
    });

    await tx.hasilSeleksi.upsert({
      where: { pendaftaranId: pilihan.pendaftaranId },
      update: {
        statusFinal: StatusFinal.DITOLAK,
        sekolahDiterimaId: null,
        catatan: alasan,
        jenisPenolakan: jenisPenolakanFinal,
      },
      create: {
        pendaftaranId: pilihan.pendaftaranId,
        statusFinal: StatusFinal.DITOLAK,
        catatan: alasan,
        jenisPenolakan: jenisPenolakanFinal,
      },
    });

    await tx.pengumuman.create({
      data: {
        userId: pilihan.pendaftaran.userId,
        pendaftaranId: pilihan.pendaftaranId,
        judul: "Hasil Seleksi PPDB",
        pesan: `Mohon maaf, pendaftaran kamu di ${pilihan.sekolah.nama} belum diterima. Alasan: ${alasan}`,
      },
    });

    await tx.notifikasi.create({
      data: {
        userId: pilihan.pendaftaran.userId,
        judul: "Pendaftaran Ditolak",
        pesan: `Pendaftaran kamu di ${pilihan.sekolah.nama} ditolak. Silakan cek halaman pengumuman untuk melihat alasan penolakan.`,
      },
    });
  });

  console.log("AKAN MENGIRIM EMAIL DITOLAK");
  console.log("EMAIL TUJUAN:", pilihan.pendaftaran.user.email);

  await sendEmail(
    pilihan.pendaftaran.user.email,
    "Hasil Seleksi PPDB",
    `
    <div style="font-family: Arial, sans-serif;">
      <h2>Informasi Hasil Seleksi</h2>

      <p>
        Mohon maaf, kamu belum diterima di:
      </p>

      <h3>${pilihan.sekolah.nama}</h3>

      <p>
        <b>Alasan:</b> ${alasan}
      </p>

      <p>
        Silakan login ke sistem PPDB untuk informasi lebih lanjut.
      </p>

      <br />

      <p>PPDB SMP</p>
    </div>
  `,
  );

  return {
    message: "Siswa berhasil ditolak",
  };
};

export const validasiDokumen = async (
  adminId: string,
  dokumenId: string,
  status: "DITERIMA" | "DITOLAK",
) => {
  const admin = await prisma.adminSekolah.findUnique({
    where: { userId: adminId },
  });

  if (!admin) throw new Error("Admin tidak ditemukan");

  const dokumen = await prisma.dokumen.findUnique({
    where: { id: dokumenId },
    include: {
      pendaftaran: {
        include: {
          pilihan: true,
        },
      },
    },
  });

  if (!dokumen) throw new Error("Dokumen tidak ditemukan");

  const punyaAkses = dokumen.pendaftaran.pilihan.some(
    (pilihan) => pilihan.sekolahId === admin.sekolahId,
  );

  if (!punyaAkses) {
    throw new Error("Akses ditolak");
  }

  if (dokumen.status !== StatusDokumen.MENUNGGU) {
    throw new Error("Dokumen sudah divalidasi sebelumnya");
  }

  const updated = await prisma.dokumen.update({
    where: { id: dokumenId },
    data: {
      status:
        status === "DITERIMA" ? StatusDokumen.DITERIMA : StatusDokumen.DITOLAK,
    },
  });

  return updated;
};
