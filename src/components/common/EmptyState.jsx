import { cn } from '@/lib/utils';

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-14 text-center', className)}>
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-zinc-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
