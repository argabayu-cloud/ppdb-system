# 🎓 PPDB Backend API

Backend API untuk Sistem Penerimaan Peserta Didik Baru (PPDB) SMP Terpadu menggunakan **Express.js**, **TypeScript**, **Prisma**, dan **PostgreSQL**.

---

## 📋 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Password Hashing**: bcrypt

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env` dan sesuaikan dengan konfigurasi Anda:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/ppdb_db"
JWT_SECRET="your-secret-key"
PORT=5000
```

### 3. Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 4. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

---

## 📁 Struktur Folder

```
backend/
├── src/
│   ├── config/           # Database & app config
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Auth, validation, error
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   ├── validators/       # Zod schemas
│   ├── types/            # TypeScript types
│   └── index.ts          # Entry point
├── prisma/
│   └── schema.prisma     # Database schema
└── uploads/              # File uploads
```

---

## 🔐 API Endpoints

### Authentication

| Method | Endpoint            | Akses  | Deskripsi           |
|--------|---------------------|--------|---------------------|
| POST   | `/api/auth/register`| Public | Register user baru  |
| POST   | `/api/auth/login`   | Public | Login user          |
| GET    | `/api/auth/profile` | Private| Get user profile    |

### Pendaftaran (USER)

| Method | Endpoint                  | Akses        | Deskripsi              |
|--------|---------------------------|--------------|------------------------|
| POST   | `/api/pendaftaran`        | USER         | Submit pendaftaran     |
| GET    | `/api/pendaftaran/my`     | USER         | Get pendaftaran saya   |
| GET    | `/api/pendaftaran/status` | USER         | Cek status pendaftaran |

### Admin Sekolah

| Method | Endpoint                    | Akses | Deskripsi                  |
|--------|-----------------------------|-------|----------------------------|
| GET    | `/api/admin/dashboard`      | ADMIN | Statistik dashboard        |
| GET    | `/api/admin/pendaftar`      | ADMIN | List pendaftar             |
| GET    | `/api/admin/pendaftar/:id`  | ADMIN | Detail pendaftar           |
| PATCH  | `/api/admin/seleksi/:id`    | ADMIN | Terima/tolak pendaftar     |

### Super Admin (Dinas Pendidikan)

| Method | Endpoint                          | Akses       | Deskripsi                 |
|--------|-----------------------------------|-------------|---------------------------|
| GET    | `/api/superadmin/dashboard`       | SUPER_ADMIN | Statistik keseluruhan     |
| GET    | `/api/superadmin/pendaftaran`     | SUPER_ADMIN | List semua pendaftaran    |
| GET    | `/api/superadmin/pendaftaran/:id` | SUPER_ADMIN | Detail pendaftaran        |
| PATCH  | `/api/superadmin/validasi/:id`    | SUPER_ADMIN | Validasi hasil akhir      |
| GET    | `/api/superadmin/sekolah`         | SUPER_ADMIN | List semua sekolah        |
| POST   | `/api/superadmin/sekolah`         | SUPER_ADMIN | Buat sekolah baru         |
| POST   | `/api/superadmin/admin`           | SUPER_ADMIN | Buat admin sekolah        |
| GET    | `/api/superadmin/laporan/:id`     | SUPER_ADMIN | Laporan per sekolah       |

---

## 🔄 Alur Sistem

### 1. USER (Calon Siswa)

```
1. Register → Login
2. Submit pendaftaran (dengan 2 pilihan sekolah)
3. Sistem otomatis hitung jarak zonasi (Haversine)
4. Cek status pendaftaran
```

### 2. ADMIN Sekolah (Pilihan 1)

```
1. Login
2. Lihat daftar pendaftar
3. Proses seleksi:
   - DITERIMA → Status final DITERIMA
   - DITOLAK → Siswa masuk ke pilihan 2
```

### 3. ADMIN Sekolah (Pilihan 2)

```
1. Lihat daftar pendaftar (yang ditolak pilihan 1)
2. Proses seleksi:
   - DITERIMA → Status final DITERIMA
   - DITOLAK → Status final DITOLAK
```

### 4. SUPER ADMIN (Dinas Pendidikan)

```
1. Lihat semua pendaftaran
2. Validasi hasil akhir
3. Publish hasil ke siswa
```

---

## 🧪 Testing dengan Postman/Thunder Client

### 1. Register User

```json
POST /api/auth/register
{
  "nama": "Ahmad Maulana",
  "email": "ahmad@email.com",
  "password": "password123"
}
```

### 2. Login

```json
POST /api/auth/login
{
  "email": "ahmad@email.com",
  "password": "password123"
}
```

Response akan mengembalikan `token` yang digunakan untuk request selanjutnya.

### 3. Submit Pendaftaran

```json
POST /api/pendaftaran
Headers: Authorization: Bearer <token>

{
  "nisn": "1234567890",
  "nik": "1234567890123456",
  "namaLengkap": "Ahmad Maulana",
  "tempatLahir": "Jakarta",
  "tanggalLahir": "2010-05-15",
  "jenisKelamin": "Laki-laki",
  "agama": "Islam",
  "alamatLengkap": "Jl. Sudirman No. 123",
  "latitude": -6.2088,
  "longitude": 106.8456,
  "nomorTelepon": "081234567890",
  "namaAyah": "Budi Santoso",
  "namaIbu": "Siti Aminah",
  "pekerjaanAyah": "Wiraswasta",
  "pekerjaanIbu": "Ibu Rumah Tangga",
  "nomorTeleponOrtu": "081234567891",
  "pilihan1SekolahId": "uuid-sekolah-1",
  "pilihan2SekolahId": "uuid-sekolah-2"
}
```

---

## 📍 Fitur Zonasi (Haversine)

Sistem otomatis menghitung jarak antara rumah siswa dan sekolah menggunakan **rumus Haversine**.

**Formula:**
```
a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
c = 2 ⋅ atan2(√a, √(1−a))
d = R ⋅ c
```

Dimana:
- φ = latitude (dalam radian)
- λ = longitude (dalam radian)
- R = radius bumi (6371 km)

---

## 🛡️ Security

- ✅ Password di-hash dengan **bcrypt** (salt rounds: 10)
- ✅ JWT untuk authentication
- ✅ Role-based access control (RBAC)
- ✅ Input validation dengan **Zod**
- ✅ Error handling middleware

---

## 📝 Available Scripts

```bash
npm run dev          # Run development server
npm run build        # Build for production
npm start            # Run production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
```

---

## 🔗 Related

- Frontend: Next.js App Router (coming soon)
- Database: PostgreSQL

---

## 📄 License

MIT