import React from 'react';
import styles from './ProcessingStates.module.css';
import { Button } from '@/components/ui/button/Button';

export interface ProcessingStateProps {
  title: string;
  description: string;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({ title, description }) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.iconWrapper} ${styles.processing}`}>
        <svg className={styles.spinner} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
        </svg>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export interface SuccessStateProps {
  title: string;
  description: string;
  onDownload?: () => void;
  onReset?: () => void;
}

export const SuccessState: React.FC<SuccessStateProps> = ({ title, description, onDownload, onReset }) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.iconWrapper} ${styles.success}`}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      
      <div className={styles.actions}>
        {onDownload && (
          <Button variant="primary" onClick={onDownload}>
            Download File
          </Button>
        )}
        {onReset && (
          <Button variant="outline" onClick={onReset}>
            Process Another
          </Button>
        )}
      </div>
    </div>
  );
};

export interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, description, onRetry }) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.iconWrapper} ${styles.error}`}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      
      {onRetry && (
        <div className={styles.actions}>
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
