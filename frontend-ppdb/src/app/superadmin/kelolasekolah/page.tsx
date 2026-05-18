"use client";

import { useState } from "react";

const daftarSekolah = Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    nama: `SMP Negeri ${i + 1} Bandar Lampung`,
    kepala: `Kepala Sekolah ${i + 1}`,
    email: `smpn${i + 1}@bandarlampung.sch.id`,
    telp: `0721-${100000 + i}`,
    kuota: 100 + (i % 5) * 20,
    status: i % 7 === 0 ? "nonaktif" : "aktif",
}));

export default function KelolaSekolahPage() {
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<typeof daftarSekolah[0] | null>(null);

    const filtered = daftarSekolah.filter((s) =>
        s.nama.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-bold text-slate-800">🏫 Kelola Sekolah</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Daftar seluruh SMP Negeri yang terdaftar dalam sistem PPDB.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Sekolah", value: 45, color: "bg-indigo-500" },
                    { label: "Aktif", value: daftarSekolah.filter(s => s.status === "aktif").length, color: "bg-green-500" },
                    { label: "Nonaktif", value: daftarSekolah.filter(s => s.status === "nonaktif").length, color: "bg-red-500" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-white font-bold`}>
                            {s.value}
                        </div>
                        <p className="text-sm text-slate-600 font-medium">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow p-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 Cari nama sekolah..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
            </div>

            {/* Tabel */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold">No</th>
                                <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold">Nama Sekolah</th>
                                <th className="text-left py-3 px-4 text-xs text-slate-500 font-semibold">Email</th>
                                <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">Kuota</th>
                                <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">Status</th>
                                <th className="text-center py-3 px-4 text-xs text-slate-500 font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s, i) => (
                                <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-4 text-slate-400">{i + 1}</td>
                                    <td className="py-3 px-4 font-medium text-slate-800">{s.nama}</td>
                                    <td className="py-3 px-4 text-slate-500 text-xs">{s.email}</td>
                                    <td className="py-3 px-4 text-center font-semibold text-slate-700">{s.kuota}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium
                      ${s.status === "aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                            {s.status === "aktif" ? "✅ Aktif" : "❌ Nonaktif"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => { setSelected(s); setShowModal(true); }}
                                            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                        Menampilkan {filtered.length} dari {daftarSekolah.length} sekolah
                    </p>
                </div>
            </div>

            {/* Modal Detail */}
            {showModal && selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-800">Detail Sekolah</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Nama Sekolah", value: selected.nama },
                                { label: "Kepala Sekolah", value: selected.kepala },
                                { label: "Email", value: selected.email },
                                { label: "Telepon", value: selected.telp },
                                { label: "Kuota Siswa", value: `${selected.kuota} siswa` },
                                { label: "Status", value: selected.status === "aktif" ? "✅ Aktif" : "❌ Nonaktif" },
                            ].map((item) => (
                                <div key={item.label} className="flex gap-2 text-sm">
                                    <span className="text-slate-400 w-32 flex-shrink-0">{item.label}</span>
                                    <span className="text-slate-700 font-medium">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}