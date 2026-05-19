import prisma from "../config/prisma";

const allowedFields = [
  "namaLengkap",
  "nik",
  "tempatLahir",
  "tanggalLahir",
  "jenisKelamin",
  "agama",
  "anakKe",
  "jumlahSaudara",
  "beratBadan",
  "tinggiBadan",
  "alamat",
  "kelurahan",
  "kecamatan",
  "kotaKabupaten",
  "provinsi",
  "noHp",
  "email",
  "namaAyah",
  "nikAyah",
  "pendidikanAyah",
  "pekerjaanAyah",
  "namaIbu",
  "nikIbu",
  "pendidikanIbu",
  "pekerjaanIbu",
  "noHpOrtu",
  "alamatOrtu",
];

function cleanBiodata(data: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key)),
  );
}

export const getBiodataByUserId = async (userId: string) => {
  return prisma.biodata.findUnique({
    where: { userId },
  });
};

export const upsertBiodata = async (userId: string, data: any) => {
  const cleanData = cleanBiodata(data);

  const biodata = await prisma.biodata.upsert({
    where: { userId },
    update: cleanData,
    create: {
      userId,
      ...cleanData,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      nama: typeof data.namaLengkap === "string" ? data.namaLengkap : undefined,

      noTlpn: typeof data.noHp === "string" ? data.noHp : undefined,

      alamat: typeof data.alamat === "string" ? data.alamat : undefined,

      kelurahan:
        typeof data.kelurahan === "string" ? data.kelurahan : undefined,

      kecamatan:
        typeof data.kecamatan === "string" ? data.kecamatan : undefined,

      latitude: typeof data.latitude === "number" ? data.latitude : undefined,

      longitude:
        typeof data.longitude === "number" ? data.longitude : undefined,
    },
  });

  return biodata;
};
