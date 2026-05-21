import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.adminSekolah.deleteMany();

  await prisma.sekolah.deleteMany({
    where: {
      nama: {
        notIn: [
          "SMP Negeri 1 Bandar Lampung",
          "SMP Negeri 2 Bandar Lampung",
          "SMP Negeri 3 Bandar Lampung",
        ],
      },
    },
  });

  // ========================
  // 🏫 DATA SEKOLAH
  // ========================
  const sekolahList = [
    {
      nama: "SMP Negeri 1 Bandar Lampung",
      alamat:
        "Jl. Mr. Gele Harun No.30, Rw. Laut, Enggal, Kota Bandar Lampung, Lampung 35213",
      latitude: -5.42111,
      longitude: 105.26445,
      kuota: 200,
      radiusZonasi: 3,
    },
    {
      nama: "SMP Negeri 2 Bandar Lampung",
      alamat:
        "Jl. Pramuka No.108, Rajabasa, Kec. Rajabasa, Kota Bandar Lampung, Lampung 35144",
      latitude: -5.376519020408065,
      longitude: 105.22194852883561,
      kuota: 200,
      radiusZonasi: 3,
    },
    {
      nama: "SMP Negeri 3 Bandar Lampung",
      alamat:
        "Gedong Pakuon, Kec. Telukbetung Selatan, Kota Bandar Lampung, Lampung 35211",
      latitude: -5.441270612170648,
      longitude: 105.25434388650687,
      kuota: 200,
      radiusZonasi: 3,
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
        kuota: sekolah.kuota,
      },
      create: {
        nama: sekolah.nama,
        alamat: sekolah.alamat,
        latitude: sekolah.latitude,
        longitude: sekolah.longitude,
        kuota: sekolah.kuota,
      },
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

    // ========================
    // 🔗 RELASI ADMIN - SEKOLAH
    // ========================
    const existingAdminSekolah = await prisma.adminSekolah.findFirst({
      where: {
        OR: [{ userId: adminSekolah.id }, { sekolahId: createdSekolah.id }],
      },
    });

    if (!existingAdminSekolah) {
      await prisma.adminSekolah.create({
        data: {
          userId: adminSekolah.id,
          sekolahId: createdSekolah.id,
        },
      });
    }
  }

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
