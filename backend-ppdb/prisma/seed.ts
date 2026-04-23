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
      alamat: "Jl. Mr. Gele Harun No.30, Rw. Laut, Enggal, Kota Bandar Lampung, Lampung 35213",
      latitude: -5.42111,
      longitude: 105.26445,
    },
    {
      nama: "SMP Negeri 2 Bandar Lampung",
      alamat: "Jl. Pramuka No.108, Rajabasa, Kec. Rajabasa, Kota Bandar Lampung, Lampung 35144",
      latitude: -5.376519020408065,
      longitude: 105.22194852883561,
    },
    {
      nama: "SMP Negeri 3 Bandar Lampung",
      alamat: "Gedong Pakuon, Kec. Telukbetung Selatan, Kota Bandar Lampung, Lampung 35211",
      latitude: -5.441270612170648,
      longitude: 105.25434388650687,
    },
    {
      nama: "SMP Negeri 4 Bandar Lampung",
      alamat: "Jl. Hos Cokroaminoto No.93, Rw. Laut, Engal, Kota Bandar Lampung, Lampung 35213",
      latitude: -5.423076133804631,
      longitude: 105.26311576357352,
    },
    {
      nama: "SMP Negeri 5 Bandar Lampung",
      alamat: "Jl. Beo No.134, Tj. Agung Raya, Kec. Kedamaian, Kota Bandar Lampung, Lampung 35218",
      latitude: -5.412306165965404,
      longitude: 105.26978591534248,
    },
    {
      nama: "SMP Negeri 6 Bandar Lampung",
      alamat: "Jl. Laksamana Malahayati No.14A, Pesawahan, Kec. Telukbetung Selatan, Kota Bandar Lampung, Lampung 35221",
      latitude: -5.448882317869798,
      longitude: 105.2582441153425,
    },
    {
      nama: "SMP Negeri 7 Bandar Lampung",
      alamat: "Jalan Sultan Badaruddin No.4, Gunung Agung, Kec. Langkapura, Kota Bandar Lampung, Lampung 35117",
      latitude: -5.4026734389025695,
      longitude: 105.2387717,
    },
    {
      nama: "SMP Negeri 8 Bandar Lampung",
      alamat: "Jl. Bumi Manti II No.16, Kp. Baru, Kec. Kedaton, Kota Bandar Lampung, Lampung 35141",
      latitude: -5.3726045156362705,
      longitude: 105.25010704996247,
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
