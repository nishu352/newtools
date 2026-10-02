import React from 'react';
import { FileText, GripVertical, Trash2, X } from 'lucide-react';
import styles from './Shared.module.css';

export interface FileItem {
  id: string;
  file: File;
  previewUrl?: string;
}

interface PDFFileCardProps {
  file: FileItem;
  onRemove?: (id: string) => void;
  showDragHandle?: boolean;
}

export function PDFFileCard({ file, onRemove, showDragHandle = false }: PDFFileCardProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.fileCard}>
      <div className={styles.fileInfo}>
        {showDragHandle && (
          <GripVertical size={16} className="text-slate-400 cursor-grab active:cursor-grabbing" />
        )}
        <FileText size={20} className={styles.fileIcon} />
        <div className={styles.fileDetails}>
          <span className={styles.fileName}>{file.file.name}</span>
          <span className={styles.fileSize}>{formatSize(file.file.size)}</span>
        </div>
      </div>
      {onRemove && (
        <div className={styles.fileActions}>
          <button 
            type="button" 
            onClick={() => onRemove(file.id)}
            className={`${styles.iconBtn} ${styles.danger}`}
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

interface PDFFileQueueProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  onClear?: () => void;
  onReorder?: (files: FileItem[]) => void;
}

export function PDFFileQueue({ files, onRemove, onClear, onReorder }: PDFFileQueueProps) {
  const [draggedId, setDraggedId] = React.useState<string | null>(null);

  if (files.length === 0) return null;

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId || !onReorder) {
      setDraggedId(null);
      return;
    }
    
    const sourceIndex = files.findIndex(f => f.id === draggedId);
    const targetIndex = files.findIndex(f => f.id === targetId);
    
    if (sourceIndex !== -1 && targetIndex !== -1) {
      const newFiles = [...files];
      const [removed] = newFiles.splice(sourceIndex, 1);
      newFiles.splice(targetIndex, 0, removed);
      onReorder(newFiles);
    }
    
    setDraggedId(null);
  };

  return (
    <div className={styles.fileQueue}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
          {files.length} file{files.length !== 1 ? 's' : ''} selected
        </span>
        {onClear && files.length > 1 && (
          <button 
            type="button"
            onClick={onClear}
            style={{ fontSize: '0.75rem', color: 'var(--color-error)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Clear all
          </button>
        )}
      </div>
      {files.map(f => (
        <div 
          key={f.id}
          draggable={!!onReorder && files.length > 1}
          onDragStart={(e) => handleDragStart(e, f.id)}
          onDragOver={(e) => handleDragOver(e, f.id)}
          onDrop={(e) => handleDrop(e, f.id)}
          onDragEnd={() => setDraggedId(null)}
          style={{ 
            opacity: draggedId === f.id ? 0.5 : 1,
            transition: 'opacity 0.2s',
            cursor: onReorder ? 'grab' : 'default'
          }}
        >
          <PDFFileCard file={f} onRemove={onRemove} showDragHandle={!!onReorder && files.length > 1} />
        </div>
      ))}
    </div>
  );
}
