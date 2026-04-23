import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  // ========================
  // 🏫 DATA SEKOLAH
  // ========================
  const sekolahList = [
    {
      nama: "SMP Negeri 1 Bandar Lampung",
      alamat: "Jl. Ahmad Yani No.1",
      latitude: -5.4292,
      longitude: 105.261,
    },
    {
      nama: "SMP Negeri 2 Bandar Lampung",
      alamat: "Jl. Kartini No.10",
      latitude: -5.435,
      longitude: 105.2665,
    },
    {
      nama: "SMP Negeri 3 Bandar Lampung",
      alamat: "Jl. Yos Sudarso, Teluk Betung Selatan",
      latitude: -5.42,
      longitude: 105.25,
    },
    {
      nama: "SMP Negeri 4 Bandar Lampung",
      alamat: "Jl. Teuku Umar, Kedaton",
      latitude: -5.385,
      longitude: 105.26,
    },
    {
      nama: "SMP Negeri 5 Bandar Lampung",
      alamat: "Jl. Urip Sumoharjo No. 23, Way Halim",
      latitude: -5.37,
      longitude: 105.3,
    },
  ];

  for (let i = 0; i < sekolahList.length; i++) {
    const sekolah = sekolahList[i];

    const createdSekolah = await prisma.sekolah.upsert({
      where: { nama: sekolah.nama },
      update: {
        alamat: sekolah.alamat,
        latitude: sekolah.latitude,
        longitude: sekolah.longitude,
      },
      create: sekolah,
    });

    // ========================
    // 👤 ADMIN SEKOLAH
    // ========================
    const adminSekolah = await prisma.user.upsert({
      where: { email: `admin${i + 1}@ppdb-bdl.sch.id` },
      update: {},
      create: {
        nama: `Admin SMPN ${i + 1}`,
        email: `admin${i + 1}@ppdb-bdl.sch.id`,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    await prisma.adminSekolah.upsert({
      where: { userId: adminSekolah.id },
      update: {},
      create: {
        userId: adminSekolah.id,
        sekolahId: createdSekolah.id,
      },
    });

    // ========================
    // 👑 SUPER ADMIN
    // ========================
    await prisma.user.upsert({
      where: { email: "superadmin@smp.com" },
      update: {},
      create: {
        nama: "Super Admin Dinas",
        email: "superadmin@smp.com",
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
      },
    });

    console.log("Seed selesai 🚀");
  }

  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
