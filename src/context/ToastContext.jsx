import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { cn } from '@/lib/utils';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((message, variant = 'default') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => dismiss(id), 4500);
    return id;
  }, [dismiss]);

  const toast = useMemo(() => ({
    success: (message) => push(message, 'success'),
    error: (message) => push(message, 'error'),
    info: (message) => push(message, 'info'),
  }), [push]);

  return (
    <ToastContext.Provider value={toast}>
      <Toast.Provider swipeDirection="right">
        {children}
        {toasts.map((t) => (
          <Toast.Root
            key={t.id}
            open
            onOpenChange={(open) => !open && dismiss(t.id)}
            className={cn(
              'rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              t.variant === 'success' && 'border-emerald-500/40 bg-emerald-950/90 text-emerald-100',
              t.variant === 'error' && 'border-red-500/40 bg-red-950/90 text-red-100',
              t.variant === 'info' && 'border-orange-500/40 bg-zinc-900/95 text-zinc-100',
              t.variant === 'default' && 'border-zinc-700 bg-zinc-900/95 text-zinc-100',
            )}
          >
            <Toast.Description className="text-sm font-medium">{t.message}</Toast.Description>
          </Toast.Root>
        ))}
        <Toast.Viewport className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 outline-none" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
