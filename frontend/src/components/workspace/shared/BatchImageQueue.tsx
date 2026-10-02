'use client';

import React from 'react';
import { ImageFileCard } from './ImageFileCard';
import { Plus, Trash2, Images } from 'lucide-react';

export interface BatchImageItem {
  id: string;
  file: File;
  previewUrl?: string;
}

export interface BatchImageQueueProps {
  items: BatchImageItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onAddMore?: () => void;
  maxFiles?: number;
}

export function BatchImageQueue({
  items,
  onRemove,
  onClear,
  onAddMore,
  maxFiles,
}: BatchImageQueueProps) {
  const totalSizeBytes = items.reduce((acc, curr) => acc + curr.file.size, 0);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header with summary and actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
            }}
          >
            <Images size={16} />
          </div>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Selected Images ({items.length}{maxFiles ? ` / ${maxFiles}` : ''})
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
            &bull; {formatSize(totalSizeBytes)} Total
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onAddMore && (
            <button
              type="button"
              onClick={onAddMore}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
            >
              <Plus size={14} />
              <span>Add More</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClear}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'var(--color-error, #dc2626)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={13} />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* List of images */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item) => (
          <ImageFileCard
            key={item.id}
            file={item.file}
            previewUrl={item.previewUrl}
            onRemove={() => onRemove(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
