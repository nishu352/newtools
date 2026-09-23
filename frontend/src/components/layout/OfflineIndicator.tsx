'use client';

import * as React from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = React.useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return !navigator.onLine;
    }
    return false;
  });
  const [showRestored, setShowRestored] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setShowRestored(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !showRestored) {
    return null;
  }

  return (
    <aside aria-label="Network status" className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {isOffline ? (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/90 dark:bg-slate-800/95 text-slate-100 border border-slate-700/60 shadow-xl backdrop-blur-md text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span>You&apos;re offline. Cached tools are still available.</span>
        </div>
      ) : showRestored ? (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary)]/20 shadow-xl backdrop-blur-md text-xs font-medium">
          <Wifi className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>Connection restored. Back online.</span>
        </div>
      ) : null}
    </aside>
  );
}
