import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 bg-slate-50 min-h-screen p-6">
      
      {/* 🔷 WELCOME SKELETON */}
      <Skeleton className="h-[120px] w-full rounded-2xl" />

      {/* 🔷 PROGRESS SKELETON */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-3 w-full rounded-full" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>

      {/* 🔷 STATUS CARDS SKELETON */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* 🔷 PENGUMUMAN SKELETON */}
      <div>
        <Skeleton className="h-6 w-48 mb-3" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-5 flex flex-col gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}
