import { Skeleton } from "@/components/ui/skeleton";

export default function ConsultStatusLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* header skeleton */}
      <div className="border-b border-border bg-background/80 h-16 flex items-center px-6">
        <Skeleton className="h-8 w-28" />
      </div>

      {/* hero skeleton */}
      <div className="bg-sidebar px-6 py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="h-9 w-64 bg-white/10" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-7 w-24 rounded-full bg-white/10" />
            <Skeleton className="h-7 w-24 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* main column */}
          <div className="space-y-8">
            {/* status card skeleton */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <Skeleton className="h-5 w-40" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
            </div>

            {/* researcher info skeleton */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <Skeleton className="h-5 w-48" />
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            </div>

            {/* samples skeleton */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <Skeleton className="h-5 w-36" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <div className="grid grid-cols-2 gap-3">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="flex gap-2">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <Skeleton key={j} className="h-5 w-14 rounded-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* sidebar skeleton */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <Skeleton className="h-5 w-44" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-9 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
