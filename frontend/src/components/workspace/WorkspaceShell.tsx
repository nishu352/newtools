import React from 'react';
import styles from './WorkspaceShell.module.css';
import { Breadcrumbs, BreadcrumbItem } from '@/components/navigation/Breadcrumbs';

export interface WorkspaceShellProps {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  title,
  description,
  breadcrumbs,
  children,
}) => {
  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <Breadcrumbs items={breadcrumbs} />
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.main}>
        {children}
      </div>
    </div>
  );
};
