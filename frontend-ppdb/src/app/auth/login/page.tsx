"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetcher } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noTlpn, setNoTlpn] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!nama || !email || !noTlpn || !password || !confirmPassword) {
      setError("Semua field wajib diisi");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    try {
      await fetcher("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          nama,
          email,
          noTlpn,
          password,
        }),
      });

      alert("Register berhasil, silakan login");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="w-[350px] p-6 border rounded-xl shadow"
      >
        <h1 className="text-xl font-bold mb-4">Register PPDB</h1>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <input
          type="text"
          placeholder="Nama"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setNama(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="No. Telepon"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setNoTlpn(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Konfirmasi Password"
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          {loading ? "Loading..." : "Register"}
        </button>

        <p className="text-sm mt-3 text-center">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}