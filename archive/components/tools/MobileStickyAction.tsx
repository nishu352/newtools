'use client';

import * as React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface MobileStickyActionProps {
  show: boolean;
  label?: string;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function MobileStickyAction({
  show,
  label = 'Download Result',
  onClick,
  icon = <Download className="w-4 h-4 mr-2" />,
  className,
}: MobileStickyActionProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        'sm:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] shadow-xl animate-slide-down pb-[max(1rem,env(safe-area-inset-bottom))]',
        className
      )}
    >
      <Button
        variant="primary"
        size="lg"
        onClick={onClick}
        className="w-full justify-center shadow-md font-semibold text-base h-12"
      >
        {icon}
        {label}
      </Button>
    </div>
  );
}
