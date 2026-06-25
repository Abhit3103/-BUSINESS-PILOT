import { cn } from '@/lib/utils';

export function Switch({ checked, onCheckedChange, label, id }) {
  const switchId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <label htmlFor={switchId} className="flex cursor-pointer items-center justify-between gap-3">
      {label && <span className="text-sm text-zinc-300">{label}</span>}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors',
          checked ? 'bg-orange-500' : 'bg-zinc-700',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
    </label>
  );
}
