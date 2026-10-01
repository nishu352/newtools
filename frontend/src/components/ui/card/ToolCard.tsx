import React from 'react';
import Link from 'next/link';
import styles from './ToolCard.module.css';

export interface ToolCardProps {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon?: React.ReactNode;
  formatInfo?: string;
  isPopular?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  slug,
  name,
  description,
  category,
  icon,
  formatInfo,
  isPopular
}) => {
  return (
    <Link href={`/tools/${slug}`} className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          {icon || <div className={styles.fallbackIcon} />}
        </div>
        {isPopular && <span className={styles.badge}>Popular</span>}
      </div>
      <h3 className={styles.title}>{name}</h3>
      <p className={styles.description}>{description}</p>
      
      <div className={styles.footer}>
        <span>{category}</span>
        {formatInfo && <span>{formatInfo}</span>}
      </div>
    </Link>
  );
};
