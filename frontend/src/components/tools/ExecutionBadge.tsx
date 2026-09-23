import * as React from 'react';
import { ExecutionMode } from '@/lib/tools/types';
import { Badge } from '@/components/ui/Badge';
import { Cpu, Server, Layers } from 'lucide-react';

interface ExecutionBadgeProps {
  mode: ExecutionMode;
  className?: string;
  showIcon?: boolean;
}

export function ExecutionBadge({ mode, className, showIcon = true }: ExecutionBadgeProps) {
  if (mode === 'client') {
    return (
      <Badge variant="success" className={className} title="Executes entirely inside your web browser. Zero server upload.">
        {showIcon && <Cpu className="w-3 h-3 text-emerald-500" />}
        <span>In-Browser</span>
      </Badge>
    );
  }

  if (mode === 'server') {
    return (
      <Badge variant="secondary" className={className} title="Processed on server and purged immediately upon completion.">
        {showIcon && <Server className="w-3 h-3 text-blue-500" />}
        <span>Server</span>
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={className} title="Uses client processing with optional server acceleration.">
      {showIcon && <Layers className="w-3 h-3 text-amber-500" />}
      <span>Hybrid</span>
    </Badge>
  );
}
