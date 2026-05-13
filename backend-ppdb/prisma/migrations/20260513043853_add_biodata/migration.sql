-- CreateTable
CREATE TABLE "Biodata" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "namaLengkap" TEXT,
    "nik" TEXT,
    "tempatLahir" TEXT,
    "tanggalLahir" TEXT,
    "jenisKelamin" TEXT,
    "agama" TEXT,
    "anakKe" TEXT,
    "jumlahSaudara" TEXT,
    "beratBadan" TEXT,
    "tinggiBadan" TEXT,
    "alamat" TEXT,
    "kelurahan" TEXT,
    "kecamatan" TEXT,
    "kotaKabupaten" TEXT,
    "provinsi" TEXT,
    "noHp" TEXT,
    "email" TEXT,
    "namaAyah" TEXT,
    "nikAyah" TEXT,
    "pendidikanAyah" TEXT,
    "pekerjaanAyah" TEXT,
    "namaIbu" TEXT,
    "nikIbu" TEXT,
    "pendidikanIbu" TEXT,
    "pekerjaanIbu" TEXT,
    "noHpOrtu" TEXT,
    "alamatOrtu" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Biodata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Biodata_userId_key" ON "Biodata"("userId");

-- AddForeignKey
ALTER TABLE "Biodata" ADD CONSTRAINT "Biodata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
