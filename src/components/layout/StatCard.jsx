import { cn } from '@/lib/utils';

export function StatCard({ title, value, icon: Icon, trend, className }) {
  return (
    <div className={cn('glass-card border-none p-6 group hover:scale-[1.02] transition-all duration-300', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
        </div>
        {Icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:scale-110 transition-transform">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}
