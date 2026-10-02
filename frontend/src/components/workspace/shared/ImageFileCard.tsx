'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, RefreshCw, X } from 'lucide-react';

export interface ImageFileCardProps {
  file: File;
  previewUrl?: string;
  onRemove?: () => void;
  onReplace?: () => void;
  className?: string;
}

export function ImageFileCard({
  file,
  previewUrl: externalPreviewUrl,
  onRemove,
  onReplace,
  className = '',
}: ImageFileCardProps) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [createdUrl, setCreatedUrl] = useState<string>('');

  useEffect(() => {
    if (externalPreviewUrl) {
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
      };
      img.src = externalPreviewUrl;
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
      setCreatedUrl(url);
    };
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, externalPreviewUrl]);

  const displayUrl = externalPreviewUrl || createdUrl;

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFormat = (filename: string): string => {
    const ext = filename.split('.').pop()?.toUpperCase();
    return ext || 'IMAGE';
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xs)',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        {/* Thumbnail Preview */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface-secondary)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {displayUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayUrl}
              alt={file.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <ImageIcon size={24} style={{ color: 'var(--color-text-tertiary)' }} />
          )}
        </div>

        {/* File Information */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'var(--color-text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: '4px',
            }}
            title={file.name}
          >
            {file.name}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              color: 'var(--color-text-secondary)',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-surface-secondary)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
              }}
            >
              {getFormat(file.name)}
            </span>

            <span>{formatSize(file.size)}</span>

            {dimensions && (
              <>
                <span>&bull;</span>
                <span>
                  {dimensions.width} &times; {dimensions.height} px
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {onReplace && (
          <button
            type="button"
            onClick={onReplace}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-surface-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Replace with another image"
            aria-label="Replace image"
          >
            <RefreshCw size={13} />
            <span>Replace</span>
          </button>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              color: 'var(--color-text-tertiary)',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Remove image"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
