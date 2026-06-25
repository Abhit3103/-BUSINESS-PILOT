import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className 
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-white/5 bg-card/30 backdrop-blur-sm", className)}>
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6 ring-8 ring-primary/5">
          <Icon className="h-8 w-8 text-primary" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-foreground mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
