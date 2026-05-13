const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
console.log("BASE_URL:", BASE_URL);

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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Terjadi kesalahan");
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

export async function saveBiodata(data: Record<string, string>) {
  return fetcher("/biodata", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}