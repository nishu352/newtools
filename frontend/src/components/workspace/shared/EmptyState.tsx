import React from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './Shared.module.css';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title = 'Upload a file to get started', 
  description = 'Drag and drop your file here, or click to browse',
  onAction,
  actionLabel = 'Select File',
  icon = <UploadCloud size={48} className={styles.emptyIcon} />
}: EmptyStateProps) {
  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyStateContent}>
        {icon}
        <h3 className={styles.emptyStateTitle}>{title}</h3>
        <p className={styles.emptyStateDescription}>{description}</p>
        {onAction && (
          <Button onClick={onAction} variant="primary" className={styles.emptyStateAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
