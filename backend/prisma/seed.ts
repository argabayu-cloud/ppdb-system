// Data Dummy (sementara untuk testing)

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (optional - hati-hati di production!)
  // await prisma.hasilSeleksi.deleteMany();
  // await prisma.dokumen.deleteMany();
  // await prisma.pilihanSekolah.deleteMany();
  // await prisma.pendaftaran.deleteMany();
  // await prisma.adminSekolah.deleteMany();
  // await prisma.sekolah.deleteMany();
  // await prisma.user.deleteMany();

  // 1. Create Super Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const superAdmin = await prisma.user.create({
    data: {
      nama: 'Super Admin',
      email: 'superadmin@ppdb.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Super Admin created:', superAdmin.email);

  // 2. Create Sekolah
  const sekolah1 = await prisma.sekolah.create({
    data: {
      namaSekolah: 'SMP Negeri 1 Jakarta',
      alamat: 'Jl. Sudirman No. 1, Jakarta Pusat',
      latitude: -6.2088,
      longitude: 106.8456,
      kuota: 100,
    },
  });

  const sekolah2 = await prisma.sekolah.create({
    data: {
      namaSekolah: 'SMP Negeri 2 Jakarta',
      alamat: 'Jl. Thamrin No. 2, Jakarta Pusat',
      latitude: -6.1944,
      longitude: 106.8229,
      kuota: 80,
    },
  });

  const sekolah3 = await prisma.sekolah.create({
    data: {
      namaSekolah: 'SMP Swasta Al-Azhar',
      alamat: 'Jl. Kebayoran Lama, Jakarta Selatan',
      latitude: -6.2425,
      longitude: 106.7831,
      kuota: 60,
    },
  });

  console.log('✅ Sekolah created:', [sekolah1.namaSekolah, sekolah2.namaSekolah, sekolah3.namaSekolah]);

  // 3. Create Admin Sekolah
  const admin1 = await prisma.user.create({
    data: {
      nama: 'Admin SMPN 1',
      email: 'admin1@smpn1.sch.id',
      password: hashedPassword,
      role: 'ADMIN',
      adminSekolah: {
        create: {
          sekolahId: sekolah1.id,
        },
      },
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      nama: 'Admin SMPN 2',
      email: 'admin2@smpn2.sch.id',
      password: hashedPassword,
      role: 'ADMIN',
      adminSekolah: {
        create: {
          sekolahId: sekolah2.id,
        },
      },
    },
  });

  const admin3 = await prisma.user.create({
    data: {
      nama: 'Admin Al-Azhar',
      email: 'admin@alazhar.sch.id',
      password: hashedPassword,
      role: 'ADMIN',
      adminSekolah: {
        create: {
          sekolahId: sekolah3.id,
        },
      },
    },
  });

  console.log('✅ Admin Sekolah created:', [admin1.email, admin2.email, admin3.email]);

  // 4. Create Sample Users (Calon Siswa)
  const user1 = await prisma.user.create({
    data: {
      nama: 'Ahmad Maulana',
      email: 'ahmad@email.com',
      password: hashedPassword,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      nama: 'Siti Nurhaliza',
      email: 'siti@email.com',
      password: hashedPassword,
      role: 'USER',
    },
  });

  console.log('✅ Sample Users created:', [user1.email, user2.email]);

  console.log('');
  console.log('='.repeat(50));
  console.log('🎉 Seed completed successfully!');
  console.log('='.repeat(50));
  console.log('');
  console.log('📝 Login Credentials:');
  console.log('');
  console.log('Super Admin:');
  console.log('  Email: superadmin@ppdb.com');
  console.log('  Password: admin123');
  console.log('');
  console.log('Admin SMPN 1:');
  console.log('  Email: admin1@smpn1.sch.id');
  console.log('  Password: admin123');
  console.log('');
  console.log('Admin SMPN 2:');
  console.log('  Email: admin2@smpn2.sch.id');
  console.log('  Password: admin123');
  console.log('');
  console.log('Sample User:');
  console.log('  Email: ahmad@email.com');
  console.log('  Password: admin123');
  console.log('='.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });