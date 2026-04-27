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
    {
      nama: "SMP Negeri 9 Bandar Lampung",
      alamat: "Jl. Amir Hamzah 1, Gotong Royong, Kec. Tj. Karang Pusat, Kota Bandar Lampung, Lampung 35214",
      latitude: -5.405696828334882,
      longitude: 105.24706814715579,
    },
    {
      nama: "SMP Negeri 10 Bandar Lampung",
      alamat: "Jl. Panglima Polim No.5, Segala Mider, Kec. Tj. Karang Bar., Kota Bandar Lampung, Lampung 35151",
      latitude: -5.378307901314892,
      longitude: 105.24706658757948,
    },
    {
      nama: "SMP Negeri 11 Bandar Lampung",
      alamat: "Jalan Sentot Alibasyah, Ketapang, Kec. Telukbetung Selatan, Kota Bandar Lampung, Lampung 35227",
      latitude: -5.435699685719011,
      longitude: 105.29571265200276,
    },
    {
      nama: "SMP Negeri 12 Bandar Lampung",
      alamat: "Jl. Tj. No.21, Rw. Laut, Kec. Tanjungkarang Timur, Kota Bandar Lampung, Lampung 35213",
      latitude: -5.421047477610245,
      longitude: 105.26633982316649,
    },
    {
      nama: "SMP Negeri 13 Bandar Lampung",
      alamat: "Jl. Marga No.57, Beringin Raya, Kec. Kemiling, Kota Bandar Lampung, Lampung 35155",
      latitude: -5.393630549290697,
      longitude: 105.20176283665782,
    },
    {
      nama: "SMP Negeri 14 Bandar Lampung",
      alamat: "Jl. Teuku Cik Ditiro No.12, Beringin Raya, Kec. Kemiling, Kota Bandar Lampung, Lampung 35155",
      latitude: -5.3989427073558165,
      longitude: 105.20684005014938,
    },
    {
      nama: "SMP Negeri 15 Bandar Lampung",
      alamat: "Jl. Banten No.18, Bakung, Kec. Tlk. Betung Bar., Kota Bandar Lampung, Lampung 35228",
      latitude: -5.451331167093481,
      longitude: 105.25029919618362,
    },
    {
      nama: "SMP Negeri 16 Bandar Lampung",
      alamat: "Jl. Dr. Cipto Mangunkusumo No.42, Sumur Batu, Kec. Tlk. Betung Utara, Kota Bandar Lampung, Lampung 35228",
      latitude: -5.434027298505159, 
      longitude: 105.26619170782202,
    },
    {
      nama: "SMP Negeri 17 Bandar Lampung",
      alamat: "Jl. Abdi Negara No.9, Gulak Galik, Kec. Tlk. Betung Utara, Kota Bandar Lampung, Lampung 35214",
      latitude: -5.435987024631986,
      longitude: 105.26058173665817,
    },
    {
      nama: "SMP Negeri 18 Bandar Lampung",
      alamat: "Jl. Rasuna Said No.29, Gulak Galik, Kec. Tlk. Betung Utara, Kota Bandar Lampung, Lampung 35212",
      latitude: -5.430801307117584,
      longitude: 105.25719528083894,
    },
    {
      nama: "SMP Negeri 19 Bandar Lampung",
      alamat: "Jl. Turi Raya No.1, Labuhan Dalam, Kec. Tj. Senang, Kota Bandar Lampung, Lampung 35141",
      latitude: -5.364811985214216, 
      longitude: 105.26743835014912,
    },
    {
      nama: "SMP Negeri 20 Bandar Lampung",
      alamat: "Sinar Semendo, Jl. R.A. Basyid, Labuhan Dalam, Kec. Tj. Senang, Kota Bandar Lampung, Lampung 35142",
      latitude: -5.352496879226971, 
      longitude: 105.26327940782126,
    },
    {
      nama: "SMP Negeri 21 Bandar Lampung",
      alamat: "Perum Kopri, Jalan Korpri Raya Blok D8, RT.21/RW.21, Harapan Jaya, Kec. Sukarame, Kota Bandar Lampung, Lampung 35131",
      latitude: -5.365912076425055, 
      longitude: 105.2999830808383, 
    },
    {
      nama: "SMP Negeri 22 Bandar Lampung",
      alamat: "Jl. ZA. Pagar Alam No.109, Gedong Meneng, Kec. Rajabasa, Kota Bandar Lampung, Lampung 35141",
      latitude: -5.372565178881544, 
      longitude: 105.23978510967444,
    },
    {
      nama: "SMP Negeri 23 Bandar Lampung",
      alamat: "Jl. Jend. Sudirman No.76, Rw. Laut, Kec. Tanjungkarang Timur, Kota Bandar Lampung, Lampung 35213",
      latitude: -5.42272003983268,  
      longitude: 105.2638379096749,
    },
    {
      nama: "SMP Negeri 24 Bandar Lampung",
      alamat: "Jl. Endro Suratmin, Sukarame, Kec. Sukarame, Kota Bandar Lampung, Lampung 35131",
      latitude: -5.377805480806785, 
      longitude: 105.31047718083843,
    },
    {
      nama: "SMP Negeri 25 Bandar Lampung",
      alamat: "Jl. Amir Hamzah No.58, Gotong Royong, Kec. Tj. Karang Pusat, Kota Bandar Lampung, Lampung 35214",
      latitude: -5.426146060165353, 
      longitude: 105.25578036549426,
    },
    {
      nama: "SMP Negeri 26 Bandar Lampung",
      alamat: "Jl. R. Imba Kusuma Gg. Siswa No.81, Kemiling Permai, Kec. Kemiling, Kota Bandar Lampung, Lampung 35151",
      latitude: -5.388555940507786, 
      longitude: 105.2180432078216,
    },
    {
      nama: "SMP Negeri 27 Bandar Lampung",
      alamat: "Jl. Raya Puri Gading No.6, Sukamaju, Kec. Telukbetung Timur, Kota Bandar Lampung, Lampung 35223",
      latitude: -5.46969369485097, 
      longitude: 105.24616289433082,
    },
    {
      nama: "SMP Negeri 28 Bandar Lampung",
      alamat: "Jl. Bukit Kemiling Permai Raya, Kemiling Permai, Kec. Kemiling, Kota Bandar Lampung, Lampung 35152",
      latitude: -5.380929487601734, 
      longitude: 105.2114381102358, 
    },
    {
      nama: "SMP Negeri 29 Bandar Lampung",
      alamat: "Jalan Soekarno Hatta By Pass, Way Dadi, Kec. Sukarame, Kota Bandar Lampung Lampung 35132, berlokasi di, Jl. Penghijauan No.50, Way Dadi, Kec. Sukarame, Kota Bandar Lampung, Lampung 35131",
      latitude: -5.380086042035336, 
      longitude: 105.28521823665768, 
    },
    {
      nama: "SMP Negeri 30 Bandar Lampung",
      alamat: "Srengsem, Kec. Panjang, Kota Bandar Lampung, Lampung",
      latitude: -5.49414742179543, 
      longitude: 105.33075951600208,
    },
    {
      nama: "SMP Negeri 31 Bandar Lampung",
      alamat: "Jl. Drs, Jl. Campang Raya No.108, Campang Raya, Kec. Sukabumi, Kota Bandar Lampung, Lampung 35122",
      latitude: -5.405131039894108, 
      longitude: 105.30142689433022, 
    },
    {
      nama: "SMP Negeri 32 Bandar Lampung",
      alamat: "Jl. Darussalam No.82, Susunan Baru, Kec. Tj. Karang Bar., Kota Bandar Lampung, Lampung 35115",
      latitude: -5.403936520770562, 
      longitude: 105.2286925943302, 
    },
    {
      nama: "SMP Negeri 33 Bandar Lampung",
      alamat: "Jl. Kamboja No.16EnggalKec, Enggal, Tanjungkarung Pusat, Bandar Lampung City, Lampung 35113",
      latitude: -5.414445922986321, 
      longitude: 105.26049323665796, 
    },
    {
      nama: "SMP Negeri 34 Bandar Lampung",
      alamat: "Jl. Lambang No.1, Labuhan Ratu, Kec. Kedaton, Kota Bandar Lampung, Lampung 35142",
      latitude: -5.3837744199974065,  
      longitude: 105.25387566364084,
    },
    {
      nama: "SMP Negeri 35 Bandar Lampung",
      alamat: "Jl. Drs. Warsito No.48, Kupang Kota, Kec. Tlk. Betung Utara, Kota Bandar Lampung, Lampung 35211",
      latitude: -5.43899800606533,  
      longitude: 105.26081827898591,
    },
    {
      nama: "SMP Negeri 36 Bandar Lampung",
      alamat: "Sukarame, Kec. Sukarame, Kota Bandar Lampung, Lampung 35131",
      latitude: -5.376427551725213, 
      longitude: 105.31045042316606,
    },
    {
      nama: "SMP Negeri 37 Bandar Lampung",
      alamat: "Jl. Ki Agus Anang, Ketapang, Kec. Telukbetung Selatan, Kota Bandar Lampung, Lampung 35227",
      latitude: -5.435999605217063,  
      longitude: 105.29596138269198,
    },
    {
      nama: "SMP Negeri 38 Bandar Lampung",
      alamat: "Jl. Ikan Sembilang No.16, Sukaraja, Kec. Bumi Waras, Kota Bandar Lampung, Lampung",
      latitude: -5.444509236832724,  
      longitude: 105.28455023890497,
    },
    {
      nama: "SMP Negeri 39 Bandar Lampung",
      alamat: "Way Laga, Kec. Panjang, Kota Bandar Lampung, Lampung 35244",
      latitude: -5.4522747309976465, 
      longitude: 105.31443358083904, 
    },
    {
      nama: "SMP Negeri 40 Bandar Lampung",
      alamat: "Jl. DR. Setia Budi, Negeri Olok Gading, Kec. Tlk. Betung Bar., Kota Bandar Lampung, Lampung 35229",
      latitude: -5.443165368153862, 
      longitude: 105.24436673851122, 
    },
    {
      nama: "SMP Negeri 41 Bandar Lampung",
      alamat: "Jalan Yos Sudarso.KM. 10, RW No.4, Karang Maritim, Kec. Panjang, Kota Bandar Lampung, Lampung 35243",
      latitude: -5.479411715728288, 
      longitude: 105.32459275362035, 
    },
    {
      nama: "SMP Negeri 42 Bandar Lampung",
      alamat: "Kota Karang, Kec. Tlk. Betung Bar., Kota Bandar Lampung, Lampung 35224",
      latitude: -5.462565153627044, 
      longitude: 105.26463219433079, 
    },
    {
      nama: "SMP Negeri 43 Bandar Lampung",
      alamat: "Jl. Dr. Sutomo No.75, Penengahan, Kec. Tj. Karang Pusat, Kota Bandar Lampung, Lampung 35112",
      latitude: -5.398688913459386,
      longitude: 105.25625043665785, 
    },
    {
      nama: "SMP Negeri 44 Bandar Lampung",
      alamat: "Jl. P. Buton Raya, Gn. Sulah, Kec. Way Halim, Kota Bandar Lampung, Lampung 35122",
      latitude: -5.395679937738174,  
      longitude: 105.27540188083856,
    },
    {
      nama: "SMP Negeri 45 Bandar Lampung",
      alamat: "Rajabasa Jaya, Kec. Rajabasa, Kota Bandar Lampung, Lampung 35141",
      latitude: -5.346067562154853, 
      longitude: 105.25086439432968, 
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
