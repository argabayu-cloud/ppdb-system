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
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(data?.message || "Terjadi kesalahan");
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

export async function createPendaftaran(data: {
  sekolah1Id: string;
  sekolah2Id?: string;
  jalur: string;
}) {
  return fetcher("/pendaftaran", {
    method: "POST",
    body: JSON.stringify(data),
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
  const token = localStorage.getItem("token");

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
