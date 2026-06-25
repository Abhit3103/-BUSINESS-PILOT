import { cn } from '@/lib/utils';

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
