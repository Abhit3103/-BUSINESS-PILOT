import { cn } from '@/lib/utils';

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-zinc-800/80', className)} />;
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-8 w-32" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((__, j) => (
            <Skeleton key={j} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
