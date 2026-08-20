import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Toast } from './Toast';

type Tone = 'neutral' | 'success' | 'danger';

type ToastItem = { id: number; message: string; tone: Tone };

type ToastApi = {
  toast: (message: string, tone?: Tone) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: Tone = 'neutral') => {
    const id = nextId++;
    setItems(prev => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setItems(prev => prev.filter(t => t.id !== id));
    }, 2800);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-8 z-[100] flex flex-col items-center gap-2">
        {items.map(t => (
          <Toast key={t.id} tone={t.tone} className="pointer-events-auto animate-[toast-in_180ms_var(--ease-out-back)]">
            {t.message}
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
