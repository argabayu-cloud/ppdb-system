import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  // ========================
  // 🏫 SEKOLAH (ANTI DUPLIKAT)
  // ========================
  const sekolah1 = await prisma.sekolah.upsert({
    where: { nama: "SMP Negeri 1 Bandar Lampung" },
    update: {},
    create: {
      nama: "SMP Negeri 1 Bandar Lampung",
      alamat: "Jl. Ahmad Yani No.1",
      latitude: -5.4292,
      longitude: 105.261,
    },
  });

  const sekolah2 = await prisma.sekolah.upsert({
    where: { nama: "SMP Negeri 2 Bandar Lampung" },
    update: {},
    create: {
      nama: "SMP Negeri 2 Bandar Lampung",
      alamat: "Jl. Kartini No.10",
      latitude: -5.435,
      longitude: 105.2665,
    },
  });

  const sekolah3 = await prisma.sekolah.upsert({
    where: { nama: "SMP Swasta Al-Azhar" },
    update: {},
    create: {
      nama: "SMP Swasta Al-Azhar",
      alamat: "Jl. Teuku Umar",
      latitude: -5.42,
      longitude: 105.25,
    },
  });

  // ========================
  // 👤 ADMIN SMP 1
  // ========================
  const admin1 = await prisma.user.upsert({
    where: { email: "admin1@smp.com" },
    update: {},
    create: {
      nama: "Admin SMPN 1",
      email: "admin1@smp.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.adminSekolah.upsert({
    where: { userId: admin1.id },
    update: {},
    create: {
      userId: admin1.id,
      sekolahId: sekolah1.id,
    },
  });

  // ========================
  // 👤 ADMIN SMP 2
  // ========================
  const admin2 = await prisma.user.upsert({
    where: { email: "admin2@smp.com" },
    update: {},
    create: {
      nama: "Admin SMPN 2",
      email: "admin2@smp.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.adminSekolah.upsert({
    where: { userId: admin2.id },
    update: {},
    create: {
      userId: admin2.id,
      sekolahId: sekolah2.id,
    },
  });

  // ========================
  // 👤 ADMIN AL-AZHAR
  // ========================
  const admin3 = await prisma.user.upsert({
    where: { email: "admin3@smp.com" },
    update: {},
    create: {
      nama: "Admin Al-Azhar",
      email: "admin3@smp.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.adminSekolah.upsert({
    where: { userId: admin3.id },
    update: {},
    create: {
      userId: admin3.id,
      sekolahId: sekolah3.id,
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