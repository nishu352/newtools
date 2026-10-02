import React from 'react';
import { AlertCircle, CheckCircle, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './Shared.module.css';

interface ProcessingStateProps {
  title?: string;
  description?: string;
}

export function ProcessingState({
  title = 'Processing...',
  description = 'Please wait while we process your document.',
}: ProcessingStateProps) {
  return (
    <div className={styles.processingContainer}>
      <div className={styles.spinner} />
      <h3 className={styles.processingTitle}>{title}</h3>
      <p className={styles.processingDesc}>{description}</p>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We encountered an error while processing your file.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={styles.errorContainer}>
      <AlertCircle size={48} className={styles.errorIcon} />
      <h3 className={styles.errorTitle}>{title}</h3>
      <p className={styles.errorDesc}>{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger">
          Try Again
        </Button>
      )}
    </div>
  );
}

interface PDFResultPanelProps {
  title?: string;
  description?: string;
  fileName?: string;
  fileSize?: string;
  onDownload: () => void;
  onReset?: () => void;
  resetLabel?: string;
}

export function PDFResultPanel({
  title = 'Success!',
  description = 'Your document has been processed successfully.',
  fileName = 'document.pdf',
  fileSize = '1.2 MB',
  onDownload,
  onReset,
  resetLabel = 'Process Another File',
}: PDFResultPanelProps) {
  return (
    <div className={styles.resultContainer}>
      <CheckCircle size={56} className={styles.resultIcon} />
      <h3 className={styles.resultTitle}>{title}</h3>
      <p className={styles.resultDesc}>{description}</p>
      
      <div className={styles.fileCard} style={{ width: '100%', maxWidth: '400px', marginBottom: '24px' }}>
        <div className={styles.fileInfo}>
          <FileText size={24} className={styles.fileIcon} />
          <div className={styles.fileDetails}>
            <span className={styles.fileName}>{fileName}</span>
            <span className={styles.fileSize}>{fileSize}</span>
          </div>
        </div>
      </div>

      <div className={styles.resultActions}>
        <Button onClick={onDownload} variant="primary" size="lg">
          <Download size={18} />
          Download
        </Button>
        {onReset && (
          <Button onClick={onReset} variant="outline" size="lg">
            {resetLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
