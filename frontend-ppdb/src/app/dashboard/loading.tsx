import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">

      {/* Step Progress */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <div className="flex justify-between">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-16 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>

      {/* Pengumuman */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-3">
        <Skeleton className="h-6 w-1/4 mb-2" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>

    </div>
  );
}