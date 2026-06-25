import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/50", className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-card/60 p-6 flex flex-col gap-4">
      <Skeleton className="h-4 w-1/2 rounded-full" />
      <Skeleton className="h-8 w-1/3 rounded-full" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-4 w-full">
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
