export default function FormPengumuman() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Hasil Seleksi PPDB 2025/2026
        </h1>

        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Nama</span>
            <span>Arga bayu R</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">NISN</span>
            <span>1234567890</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Jalur</span>
            <span>Zonasi</span>
          </div>
        </div>

        <div className="bg-green-100 text-green-700 rounded-xl p-4 text-center mt-6">
          <h2 className="text-2xl font-bold">✅ DITERIMA</h2>
          <p className="mt-1 font-medium">SMP Negeri 3 Bandar Lampung</p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between bg-gray-100 p-3 rounded-xl">
            <span>Pilihan 1: SMPN 3</span>
            <span className="text-green-600 font-semibold">
              ✅ Diterima
            </span>
          </div>

          <div className="flex justify-between bg-gray-100 p-3 rounded-xl">
            <span>Pilihan 2: SMPN 7</span>
            <span className="text-red-600 font-semibold">❌ Gugur</span>
          </div>
        </div>
        </div>
      </div>
  );
}
