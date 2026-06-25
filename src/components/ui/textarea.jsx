import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-[120px] w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100',
      'placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };
