import prisma from '../config/database';
import { SeleksiDTO } from '../types';
import { StatusPendaftaran, StatusPilihan } from '@prisma/client';

export class AdminService {
  /**
   * Get sekolah yang dikelola oleh admin
   */
  async getSekolahByAdminId(userId: string) {
    const adminSekolah = await prisma.adminSekolah.findUnique({
      where: { userId },
      include: {
        sekolah: true,
      },
    });

    if (!adminSekolah) {
      throw new Error('Anda tidak terdaftar sebagai admin sekolah');
    }

    return adminSekolah.sekolah;
  }

  /**
   * Get semua pendaftar yang memilih sekolah ini
   */
  async getPendaftarBySekolah(userId: string) {
    // Get sekolah yang dikelola admin ini
    const adminSekolah = await prisma.adminSekolah.findUnique({
      where: { userId },
      include: { sekolah: true },
    });

    if (!adminSekolah) {
      throw new Error('Anda tidak terdaftar sebagai admin sekolah');
    }

    // Get semua pendaftar yang memilih sekolah ini (pilihan 1 atau 2)
    const pendaftar = await prisma.pilihanSekolah.findMany({
      where: {
        sekolahId: adminSekolah.sekolahId,
      },
      include: {
        pendaftaran: {
          include: {
            user: {
              select: {
                nama: true,
                email: true,
              },
            },
            dokumen: true,
          },
        },
        sekolah: true,
      },
      orderBy: [
        { jarak: 'asc' }, // Urutkan berdasarkan jarak terdekat (zonasi)
        { createdAt: 'asc' },
      ],
    });

    return pendaftar;
  }

  /**
   * Get detail pendaftar by ID
   */
  async getPendaftarDetail(userId: string, pendaftaranId: string) {
    const adminSekolah = await prisma.adminSekolah.findUnique({
      where: { userId },
    });

    if (!adminSekolah) {
      throw new Error('Anda tidak terdaftar sebagai admin sekolah');
    }

    const pendaftaran = await prisma.pendaftaran.findUnique({
      where: { id: pendaftaranId },
      include: {
        user: {
          select: {
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
      },
    });

    if (!pendaftaran) {
      throw new Error('Pendaftaran tidak ditemukan');
    }

    // Cek apakah siswa ini memilih sekolah yang dikelola admin ini
    const isPilihanSekolah = pendaftaran.pilihanSekolah.some(
      (pilihan) => pilihan.sekolahId === adminSekolah.sekolahId
    );

    if (!isPilihanSekolah) {
      throw new Error('Pendaftar ini tidak memilih sekolah Anda');
    }

    return pendaftaran;
  }

  /**
   * Proses seleksi siswa (TERIMA atau TOLAK)
   */
  async prosesSeleksi(
    userId: string,
    pendaftaranId: string,
    data: SeleksiDTO
  ) {
    // Get sekolah yang dikelola admin
    const adminSekolah = await prisma.adminSekolah.findUnique({
      where: { userId },
    });

    if (!adminSekolah) {
      throw new Error('Anda tidak terdaftar sebagai admin sekolah');
    }

    // Get pendaftaran
    const pendaftaran = await prisma.pendaftaran.findUnique({
      where: { id: pendaftaranId },
      include: {
        pilihanSekolah: {
          orderBy: {
            pilihanKe: 'asc',
          },
        },
      },
    });

    if (!pendaftaran) {
      throw new Error('Pendaftaran tidak ditemukan');
    }

    // Cek pilihan mana yang sedang diproses
    const pilihanSekolah = pendaftaran.pilihanSekolah.find(
      (pilihan) => pilihan.sekolahId === adminSekolah.sekolahId
    );

    if (!pilihanSekolah) {
      throw new Error('Pendaftar tidak memilih sekolah Anda');
    }

    const pilihanKe = pilihanSekolah.pilihanKe;

    // Validasi: hanya bisa proses jika status sesuai
    if (pilihanKe === 1 && pendaftaran.status !== StatusPendaftaran.MENUNGGU) {
      throw new Error('Pendaftaran sudah diproses sebelumnya');
    }

    if (pilihanKe === 2 && pendaftaran.status !== StatusPendaftaran.DITOLAK_1) {
      throw new Error('Pendaftaran belum ditolak di pilihan 1');
    }

    // Proses seleksi
    if (data.status === 'DITERIMA') {
      // Update pilihan sekolah
      await prisma.pilihanSekolah.update({
        where: { id: pilihanSekolah.id },
        data: {
          status: StatusPilihan.DITERIMA,
        },
      });

      // Update status pendaftaran
      await prisma.pendaftaran.update({
        where: { id: pendaftaranId },
        data: {
          status: StatusPendaftaran.DITERIMA,
        },
      });

      // Jika pilihan 1 diterima, set pilihan 2 menjadi tidak diproses
      if (pilihanKe === 1) {
        const pilihan2 = pendaftaran.pilihanSekolah.find(
          (p) => p.pilihanKe === 2
        );
        if (pilihan2) {
          await prisma.pilihanSekolah.update({
            where: { id: pilihan2.id },
            data: { status: StatusPilihan.DITOLAK },
          });
        }
      }

      return {
        success: true,
        message: `Siswa diterima di ${
          pilihanKe === 1 ? 'pilihan pertama' : 'pilihan kedua'
        }`,
      };
    } else {
      // DITOLAK
      await prisma.pilihanSekolah.update({
        where: { id: pilihanSekolah.id },
        data: {
          status: StatusPilihan.DITOLAK,
          alasanPenolakan: data.alasanPenolakan,
        },
      });

      // Update status pendaftaran
      if (pilihanKe === 1) {
        // Ditolak di pilihan 1 → lanjut ke pilihan 2
        await prisma.pendaftaran.update({
          where: { id: pendaftaranId },
          data: {
            status: StatusPendaftaran.DITOLAK_1,
          },
        });

        // Update pilihan 2 status ke DIPROSES
        const pilihan2 = pendaftaran.pilihanSekolah.find(
          (p) => p.pilihanKe === 2
        );
        if (pilihan2) {
          await prisma.pilihanSekolah.update({
            where: { id: pilihan2.id },
            data: { status: StatusPilihan.MENUNGGU },
          });
        }

        return {
          success: true,
          message:
            'Siswa ditolak di pilihan 1, otomatis diteruskan ke pilihan 2',
        };
      } else {
        // Ditolak di pilihan 2 → status final DITOLAK
        await prisma.pendaftaran.update({
          where: { id: pendaftaranId },
          data: {
            status: StatusPendaftaran.DITOLAK,
          },
        });

        return {
          success: true,
          message: 'Siswa ditolak di pilihan 2 (final)',
        };
      }
    }
  }

  /**
   * Get statistik sekolah
   */
  async getStatistik(userId: string) {
    const adminSekolah = await prisma.adminSekolah.findUnique({
      where: { userId },
    });

    if (!adminSekolah) {
      throw new Error('Anda tidak terdaftar sebagai admin sekolah');
    }

    // Hitung jumlah pendaftar
    const totalPendaftar = await prisma.pilihanSekolah.count({
      where: {
        sekolahId: adminSekolah.sekolahId,
      },
    });

    const menunggu = await prisma.pilihanSekolah.count({
      where: {
        sekolahId: adminSekolah.sekolahId,
        status: StatusPilihan.MENUNGGU,
      },
    });

    const diterima = await prisma.pilihanSekolah.count({
      where: {
        sekolahId: adminSekolah.sekolahId,
        status: StatusPilihan.DITERIMA,
      },
    });

    const ditolak = await prisma.pilihanSekolah.count({
      where: {
        sekolahId: adminSekolah.sekolahId,
        status: StatusPilihan.DITOLAK,
      },
    });

    // Get sekolah info
    const sekolah = await prisma.sekolah.findUnique({
      where: { id: adminSekolah.sekolahId },
    });

    return {
      sekolah,
      statistik: {
        totalPendaftar,
        menunggu,
        diterima,
        ditolak,
        kuotaTersisa: (sekolah?.kuota || 0) - diterima,
      },
    };
  }
}