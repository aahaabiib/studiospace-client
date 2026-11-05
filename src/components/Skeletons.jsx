export function CardSkeleton() {
  return (
    <div className="h-full animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="flex items-center justify-between pt-4">
          <div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="aspect-[16/9] rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-32 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}