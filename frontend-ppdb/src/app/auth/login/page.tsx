"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetcher("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // ✅ simpan token ke localStorage
      localStorage.setItem("token", res.data.token);

      alert("Login berhasil");

      // redirect (bebas mau ke dashboard / homepage)
      router.push("/dashboard");
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
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-[350px] p-6 border rounded-xl shadow bg-white"
      >
        <h1 className="text-xl font-bold mb-4 text-center">
          Login PPDB
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-sm mt-3 text-center">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}