import React from 'react';
import styles from './FileQueue.module.css';

export type FileStatus = 'waiting' | 'uploading' | 'processing' | 'completed' | 'failed';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  status: FileStatus;
  progress: number;
}

export interface FileQueueProps {
  files: FileItem[];
  onRemove: (id: string) => void;
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const FileQueue: React.FC<FileQueueProps> = ({ files, onRemove }) => {
  if (files.length === 0) return null;

  return (
    <div className={styles.queue}>
      {files.map((file) => (
        <div key={file.id} className={styles.item}>
          <div className={styles.itemContent}>
            <div className={styles.header}>
              <span className={styles.name}>{file.name}</span>
              <span className={`${styles.status} ${styles[`status-${file.status}`]}`}>
                {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
              </span>
            </div>
            <span className={styles.size}>{formatSize(file.size)}</span>
            
            {file.status !== 'waiting' && (
              <div className={styles.progressBar}>
                <div 
                  className={`${styles.progressFill} ${file.status === 'completed' ? styles.completed : ''} ${file.status === 'failed' ? styles.failed : ''}`}
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            )}
          </div>
          
          <div className={styles.actions}>
            <button 
              className={styles.removeBtn} 
              onClick={() => onRemove(file.id)}
              aria-label="Remove file"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
