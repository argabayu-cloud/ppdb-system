import prisma from '../config/database';
import { StatusFinal, StatusPilihan } from '@prisma/client';
import bcrypt from 'bcrypt';

export class SuperAdminService {
  /**
   * Get semua pendaftaran (overview)
   */
  async getAllPendaftaran() {
    const pendaftaran = await prisma.pendaftaran.findMany({
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
          },
        },
        pilihanSekolah: {
          include: {
            sekolah: true,
          },
          orderBy: {
            pilihanKe: 'asc',
          },
        },
        hasilSeleksi: {
          include: {
            sekolahDiterima: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return pendaftaran;
  }

  /**
   * Get detail pendaftaran by ID
   */
  async getPendaftaranDetail(id: string) {
    const pendaftaran = await prisma.pendaftaran.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
          },
        },
        pilihanSekolah: {
          include: {
            sekolah: true,
          },
          orderBy: {
            pilihanKe: 'asc',
          },
        },
        dokumen: true,
        hasilSeleksi: {
          include: {
            sekolahDiterima: true,
          },
        },
      },
    });

    if (!pendaftaran) {
      throw new Error('Pendaftaran tidak ditemukan');
    }

    return pendaftaran;
  }

  /**
   * Validasi dan publish hasil akhir
   */
  async validasiHasil(
    pendaftaranId: string,
    statusFinal: StatusFinal,
    catatan?: string
  ) {
    const pendaftaran = await prisma.pendaftaran.findUnique({
      where: { id: pendaftaranId },
      include: {
        pilihanSekolah: {
          where: {
            status: {
              in: [StatusPilihan.DITERIMA, StatusPilihan.DITOLAK],
            },
          },
          include: {
            sekolah: true,
          },
        },
        hasilSeleksi: true,
      },
    });

    if (!pendaftaran) {
      throw new Error('Pendaftaran tidak ditemukan');
    }

    // Cek apakah sudah ada hasil seleksi
    if (pendaftaran.hasilSeleksi) {
      // Update hasil yang sudah ada
      const hasil = await prisma.hasilSeleksi.update({
        where: { id: pendaftaran.hasilSeleksi.id },
        data: {
          statusFinal,
          catatan,
          sekolahDiterimaId:
            statusFinal === StatusFinal.DITERIMA
              ? pendaftaran.pilihanSekolah[0]?.sekolahId || null
              : null,
        },
        include: {
          sekolahDiterima: true,
        },
      });

      return hasil;
    } else {
      // Create hasil seleksi baru
      const hasil = await prisma.hasilSeleksi.create({
        data: {
          pendaftaranId,
          statusFinal,
          catatan,
          sekolahDiterimaId:
            statusFinal === StatusFinal.DITERIMA
              ? pendaftaran.pilihanSekolah[0]?.sekolahId || null
              : null,
        },
        include: {
          sekolahDiterima: true,
        },
      });

      return hasil;
    }
  }

  /**
   * Get statistik keseluruhan
   */
  async getStatistikKeseluruhan() {
    const totalPendaftaran = await prisma.pendaftaran.count();
    const totalSekolah = await prisma.sekolah.count();
    const totalAdmin = await prisma.user.count({
      where: { role: 'ADMIN' },
    });

    const menunggu = await prisma.pendaftaran.count({
      where: { status: 'MENUNGGU' },
    });

    const diproses1 = await prisma.pendaftaran.count({
      where: { status: 'DIPROSES_1' },
    });

    const ditolak1 = await prisma.pendaftaran.count({
      where: { status: 'DITOLAK_1' },
    });

    const diproses2 = await prisma.pendaftaran.count({
      where: { status: 'DIPROSES_2' },
    });

    const diterima = await prisma.pendaftaran.count({
      where: { status: 'DITERIMA' },
    });

    const ditolak = await prisma.pendaftaran.count({
      where: { status: 'DITOLAK' },
    });

    const hasilFinalDiterima = await prisma.hasilSeleksi.count({
      where: { statusFinal: StatusFinal.DITERIMA },
    });

    const hasilFinalDitolak = await prisma.hasilSeleksi.count({
      where: { statusFinal: StatusFinal.DITOLAK },
    });

    return {
      totalPendaftaran,
      totalSekolah,
      totalAdmin,
      statusPendaftaran: {
        menunggu,
        diproses1,
        ditolak1,
        diproses2,
        diterima,
        ditolak,
      },
      hasilFinal: {
        diterima: hasilFinalDiterima,
        ditolak: hasilFinalDitolak,
        belumDivalidasi: totalPendaftaran - hasilFinalDiterima - hasilFinalDitolak,
      },
    };
  }

  /**
   * Get semua sekolah
   */
  async getAllSekolah() {
    const sekolah = await prisma.sekolah.findMany({
      include: {
        adminSekolah: {
          include: {
            user: {
              select: {
                nama: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            pilihanSekolah: true,
            hasilSeleksi: true,
          },
        },
      },
      orderBy: {
        namaSekolah: 'asc',
      },
    });

    return sekolah;
  }

  /**
   * Create sekolah baru
   */
  async createSekolah(data: {
    namaSekolah: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota: number;
  }) {
    const sekolah = await prisma.sekolah.create({
      data,
    });

    return sekolah;
  }

  /**
   * Create admin sekolah
   */
  async createAdminSekolah(data: {
    nama: string;
    email: string;
    password: string;
    sekolahId: string;
  }) {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email sudah terdaftar');
    }

    // Check if sekolah exists
    const sekolah = await prisma.sekolah.findUnique({
      where: { id: data.sekolahId },
    });

    if (!sekolah) {
      throw new Error('Sekolah tidak ditemukan');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user with role ADMIN
    const user = await prisma.user.create({
      data: {
        nama: data.nama,
        email: data.email,
        password: hashedPassword,
        role: 'ADMIN',
        adminSekolah: {
          create: {
            sekolahId: data.sekolahId,
          },
        },
      },
      include: {
        adminSekolah: {
          include: {
            sekolah: true,
          },
        },
      },
    });

    return user;
  }

  /**
   * Get laporan per sekolah
   */
  async getLaporanSekolah(sekolahId: string) {
    const sekolah = await prisma.sekolah.findUnique({
      where: { id: sekolahId },
      include: {
        pilihanSekolah: {
          include: {
            pendaftaran: {
              include: {
                user: {
                  select: {
                    nama: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: {
            jarak: 'asc',
          },
        },
        hasilSeleksi: {
          include: {
            pendaftaran: {
              include: {
                user: {
                  select: {
                    nama: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!sekolah) {
      throw new Error('Sekolah tidak ditemukan');
    }

    return sekolah;
  }
}