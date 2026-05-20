const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function parseResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `API tidak mengembalikan JSON. Status: ${res.status}. Cek NEXT_PUBLIC_API_URL atau route backend.`,
    );
  }

  return text ? JSON.parse(text) : null;
}

export async function fetcher(url: string, options: RequestInit = {}) {
  const rawToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const token: string | null =
    typeof rawToken === "string" &&
    rawToken.trim() !== "" &&
    rawToken !== "undefined" &&
    rawToken !== "null"
      ? rawToken.trim()
      : null;

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Terjadi kesalahan pada server");
  }

  return data;
}

export async function registerUser(data: {
  nama: string;
  email: string;
  noTlpn: string;
  password: string;
  konfirmasiPassword: string;
}) {
  return fetcher("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: { email: string; password: string }) {
  return fetcher("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type Sekolah = {
  id: string;
  nama: string;
  alamat: string | null;
  latitude: number | null;
  longitude: number | null;
  kuota: number;
  radiusZonasi: number | null;
};

export async function getSekolah() {
  return fetcher("/sekolah");
}

export async function getSekolahPublic() {
  return fetcher("/sekolah");
}

export async function createPendaftaran(data: {
  sekolah1Id: string;
  sekolah2Id?: string;
  jalur: string;
  nisn?: string;
  namaSekolahAsal?: string;
  npsn?: string;
  tahunLulus?: string;
  nilaiRataRata?: string;
  jenisPrestasi?: string;
  tingkatPrestasi?: string;
  latitude?: number | null;
  longitude?: number | null;
}) {
  return fetcher("/pendaftaran", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getDashboardPendaftaran() {
  return fetcher("/pendaftaran/me");
}

export async function submitPendaftaran() {
  return fetcher("/pendaftaran/submit", {
    method: "PATCH",
  });
}

export async function getBiodata() {
  return fetcher("/biodata");
}

export async function saveBiodata(data: Record<string, unknown>) {
  return fetcher("/biodata", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function uploadDokumen(file: File, tipeDokumen: string) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("tipeDokumen", tipeDokumen);

  const res = await fetch(`${BASE_URL}/dokumen/upload`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data?.message || "Gagal upload dokumen");
  }

  return data;
}

export async function updateBiodata(data: {
  latitude?: number;
  longitude?: number;
}) {
  return fetcher("/biodata", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getPendaftarAdmin() {
  return fetcher("/admin/pendaftar");
}

export async function seleksiPendaftar(data: {
  pilihanId: string;
  status: "DITERIMA" | "DITOLAK";
  alasan?: string;
}) {
  return fetcher("/admin/seleksi", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function validasiDokumenAdmin(data: {
  dokumenId: string;
  status: "DITERIMA" | "DITOLAK";
}) {
  return fetcher("/admin/validasi-dokumen", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getHasilSeleksiSaya() {
  return fetcher("/hasil/me");
}

export async function resetPendaftaranZonasi() {
  return fetcher("/pendaftaran/reset-zonasi", {
    method: "DELETE",
  });
}