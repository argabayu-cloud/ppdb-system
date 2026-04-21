# 📖 SETUP BACKEND - Langkah demi Langkah

Panduan lengkap untuk setup backend PPDB dari awal sampai bisa dijalankan.

---

## ✅ Prerequisites

Pastikan sudah terinstall:

1. **Node.js** (v18 atau lebih baru)
   ```bash
   node --version
   ```

2. **PostgreSQL** (v14 atau lebih baru)
   ```bash
   psql --version
   ```

3. **npm** atau **yarn**
   ```bash
   npm --version
   ```

---

## 🚀 Langkah 1: Clone/Setup Project

```bash
# Jika clone dari repository
git clone <repo-url>
cd ppdb-system/backend

# Atau jika membuat baru
mkdir ppdb-system
cd ppdb-system/backend
```

---

## 📦 Langkah 2: Install Dependencies

```bash
npm install
```

Ini akan menginstall semua package yang dibutuhkan:
- express
- prisma
- @prisma/client
- typescript
- bcrypt
- jsonwebtoken
- zod
- cors
- dotenv
- dan lain-lain

---

## 🗄️ Langkah 3: Setup Database PostgreSQL

### A. Buat Database Baru

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE ppdb_db;

# Keluar
\q
```

### B. Update File .env

Edit file `.env` dan sesuaikan dengan konfigurasi database Anda:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ppdb_db?schema=public"
JWT_SECRET="ganti-dengan-random-string-yang-aman"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
```

**⚠️ PENTING:**
- Ganti `postgres` dengan username PostgreSQL Anda
- Ganti `password` dengan password PostgreSQL Anda
- Ganti `JWT_SECRET` dengan string random yang aman (minimal 32 karakter)

---

## 🔄 Langkah 4: Generate Prisma Client

```bash
npm run prisma:generate
```

Ini akan generate TypeScript types dari schema Prisma.

---

## 🏗️ Langkah 5: Run Database Migration

```bash
npm run prisma:migrate
```

Masukkan nama migration (contoh: `init`) ketika diminta.

Ini akan:
- Membuat tabel di database sesuai schema
- Generate migration files
- Sync database dengan schema Prisma

---

## 🌱 Langkah 6: Seed Database (Optional)

Untuk memasukkan data dummy (super admin, sekolah, admin sekolah):

```bash
npx ts-node prisma/seed.ts
```

Ini akan membuat:
- 1 Super Admin
- 3 Sekolah
- 3 Admin Sekolah
- 2 Sample User

**Login Credentials:**
```
Super Admin:
  Email: superadmin@ppdb.com
  Password: admin123

Admin SMPN 1:
  Email: admin1@smpn1.sch.id
  Password: admin123

Sample User:
  Email: ahmad@email.com
  Password: admin123
```

---

## 🚀 Langkah 7: Run Development Server

```bash
npm run dev
```

Jika berhasil, Anda akan melihat:

```
==================================================
🚀 PPDB Backend Server
==================================================
📡 Server running on port 5000
🌍 Environment: development
🔗 API URL: http://localhost:5000/api
🏥 Health Check: http://localhost:5000/api/health
==================================================
```

---

## 🧪 Langkah 8: Test API

### Menggunakan cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Login super admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@ppdb.com",
    "password": "admin123"
  }'
```

### Menggunakan Postman/Thunder Client

1. Import collection (jika ada)
2. Test endpoint:
   - `GET /api/health` - Health check
   - `POST /api/auth/login` - Login
   - `GET /api/auth/profile` - Get profile (dengan token)

---

## 📊 Langkah 9: Akses Prisma Studio (Optional)

Untuk melihat data di database secara visual:

```bash
npm run prisma:studio
```

Browser akan terbuka di `http://localhost:5555`

---

## ⚙️ Troubleshooting

### Error: Cannot connect to database

**Solusi:**
1. Pastikan PostgreSQL sudah running
2. Cek kredensial di `.env`
3. Test koneksi:
   ```bash
   psql -U postgres -d ppdb_db
   ```

### Error: Prisma Client not generated

**Solusi:**
```bash
npm run prisma:generate
```

### Error: Migration failed

**Solusi:**
1. Reset database:
   ```bash
   npx prisma migrate reset
   ```
2. Run migration lagi:
   ```bash
   npm run prisma:migrate
   ```

### Port 5000 already in use

**Solusi:**
1. Ganti port di `.env`:
   ```env
   PORT=5001
   ```
2. Atau kill process yang menggunakan port 5000

---

## 📝 Next Steps

Setelah backend berjalan:

1. ✅ Test semua endpoint dengan Postman
2. ✅ Buat frontend dengan Next.js
3. ✅ Integrasikan frontend dengan backend
4. ✅ Deploy ke production

---

## 🔗 Useful Commands

```bash
# Development
npm run dev              # Run dev server
npm run build            # Build untuk production
npm start                # Run production build

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
npx prisma migrate reset # Reset database (⚠️ DANGER)

# Prisma Commands
npx prisma format        # Format schema.prisma
npx prisma validate      # Validate schema
npx prisma db pull       # Pull schema from DB
npx prisma db push       # Push schema to DB (dev only)
```

---

## 🎯 Checklist Setup

- [ ] Node.js terinstall
- [ ] PostgreSQL terinstall
- [ ] Database `ppdb_db` sudah dibuat
- [ ] File `.env` sudah dikonfigurasi
- [ ] Dependencies sudah diinstall (`npm install`)
- [ ] Prisma Client sudah digenerate
- [ ] Migration sudah dijalankan
- [ ] Seed data sudah dijalankan (optional)
- [ ] Server berjalan di `http://localhost:5000`
- [ ] Health check endpoint berfungsi
- [ ] Bisa login dengan credentials seed

---

Selamat! Backend PPDB Anda sudah siap digunakan! 🎉