'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './CategoryNav.module.css';
import { CATEGORIES } from '@/lib/tool-registry/categories';

export { CATEGORIES };

export const CategoryNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <nav className={styles.nav} aria-label="Tool Categories">
        {CATEGORIES.map((category) => {
          const isActive = pathname === category.href || 
            (pathname?.startsWith(category.href) && category.href !== '/tools');
            
          return (
            <Link 
              key={category.id} 
              href={category.href}
              className={`${styles.link} ${isActive ? styles.active : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {category.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
