# 🔄 Flow Sistem PPDB

1. User register & login
2. User melakukan pendaftaran
3. User upload dokumen
4. Admin memvalidasi dokumen
5. Admin melakukan seleksi
6. Super Admin melakukan validasi final
7. User melihat hasil seleksi

# 📘 API Documentation - PPDB System

## Base URL

http://localhost:5000/api

---

## Authentication

Gunakan token JWT pada endpoint yang membutuhkan autentikasi.

Format header:

Authorization: Bearer TOKEN

---

## Role

- USER
- ADMIN
- SUPER_ADMIN

# 🔐 AUTH

## Register User

### Endpoint

POST /auth/register

### Body Request

```json
{
  "nama": "Erwin",
  "email": "erwin@mail.com",
  "password": "12345",
  "konfirmasiPassword": "12345",
  "noTlpn": "08123456789"
}
```

### Response Success

```json
{
  "message": "Register berhasil"
}
```

---

## Login User

### Method

POST

### Endpoint

/auth/login

### Body Request

```json
{
  "email": "erwin@gmail.com",
  "password": "12345"
}
```

### Response Success

```json
{
  "message": "Login berhasil",
  "data": {
    "token": "JWT_TOKEN"
  }
}
```

# 📝 PENDAFTARAN

## Buat Pendaftaran

### Role

USER

### Method

POST

### Endpoint

/pendaftaran

### Headers

Authorization: Bearer TOKEN

### Body Request

```json
{
  "sekolah1Id": "ID_SEKOLAH_1",
  "sekolah2Id": "ID_SEKOLAH_2",
  "jalur": "ZONASI"
}
```

### Keterangan Jalur

| Jalur    | Deskripsi                     |
| -------- | ----------------------------- |
| ZONASI   | Berdasarkan jarak rumah       |
| PRESTASI | Berdasarkan nilai/prestasi    |
| AFIRMASI | Jalur khusus bantuan sosial   |
| DOMISILI | Berdasarkan domisili tertentu |

### Contoh Value Jalur

```text
ZONASI
PRESTASI
AFIRMASI
DOMISILI
```

### Response Success

```json
{
  "message": "Pendaftaran berhasil"
}
```

# 📄 DOKUMEN

## Upload Dokumen

### Endpoint

POST /dokumen/upload

### Headers

Authorization: Bearer TOKEN

### Body Form-Data

| Key         | Type |
| ----------- | ---- |
| file        | File |
| tipeDokumen | Text |

### Response Success

```json
{
  "message": "Upload berhasil"
}
```

# 🏫 ADMIN

## Seleksi Siswa

Digunakan oleh admin sekolah untuk menerima atau menolak siswa berdasarkan hasil seleksi.

### Role

ADMIN

### Method

POST

### Endpoint

/admin/seleksi

### Headers

Authorization: Bearer TOKEN_ADMIN

### Body Request

```json
{
  "pilihanId": "ID_PILIHAN",
  "status": "DITERIMA"
}
```

### Keterangan Status

| Status   | Deskripsi      |
| -------- | -------------- |
| DITERIMA | Siswa diterima |
| DITOLAK  | Siswa ditolak  |

### Response Success

```json
{
  "message": "Seleksi berhasil"
}
```

### Response Error

```json
{
  "message": "Semua dokumen harus divalidasi terlebih dahulu"
}
```

```json
{
  "message": "Akses ditolak"
}
```

## Validasi Dokumen

### Role

ADMIN

### Method

POST

### Endpoint

/admin/validasi-dokumen

### Headers

Authorization: Bearer TOKEN_ADMIN

### Body Request

```json
{
  "dokumenId": "ID_DOKUMEN",
  "status": "DITERIMA"
}
```

### Response Success

```json
{
  "message": "Dokumen berhasil divalidasi"
}
```

## Lihat Pendaftar

### Role

ADMIN

### Method

GET

### Endpoint

/admin/pendaftar

### Headers

Authorization: Bearer TOKEN_ADMIN

### Response Success

```json
{
  "message": "Berhasil mengambil data pendaftar"
}
```

# 🏛 SUPER ADMIN

## Validasi Final

Digunakan oleh super admin untuk melakukan validasi akhir hasil seleksi siswa.

### Role

SUPER_ADMIN

### Method

POST

### Endpoint

/superadmin/validasi

### Headers

Authorization: Bearer TOKEN_SUPER_ADMIN

### Body Request

```json
{
  "pendaftaranId": "ID_PENDAFTARAN",
  "status": "DITERIMA"
}
```

### Keterangan Status

| Status   | Deskripsi            |
| -------- | -------------------- |
| DITERIMA | Siswa diterima final |
| DITOLAK  | Siswa ditolak final  |

### Response Success

```json
{
  "message": "Validasi berhasil & pengumuman dikirim"
}
```

### Response Error

```json
{
  "message": "Siswa belum diseleksi oleh admin sekolah"
}
```

```json
{
  "message": "Pendaftaran tidak ditemukan"
}
```

## Lihat Semua Pendaftaran

### Role

SUPER_ADMIN

### Method

GET

### Endpoint

/superadmin/pendaftaran

### Headers

Authorization: Bearer TOKEN_SUPER_ADMIN

### Response Success

```json
{
  "message": "Berhasil mengambil semua pendaftaran"
}
```
