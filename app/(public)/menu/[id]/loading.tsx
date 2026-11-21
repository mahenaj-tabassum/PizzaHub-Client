export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading item"
      className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8"
    >
      <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="aspect-4/3 animate-pulse rounded-2xl bg-muted" />
          <div className="mt-3 grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="aspect-4/3 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />
          <div className="h-12 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-8 w-28 animate-pulse rounded bg-muted" />
          <div className="h-20 animate-pulse rounded bg-muted" />
          <div className="h-20 animate-pulse rounded-xl bg-muted" />
          <div className="h-44 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
