'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './CategoryNav.module.css';

export const CATEGORIES = [
  { id: 'all', name: 'All Tools', href: '/tools' },
  { id: 'pdf', name: 'PDF Tools', href: '/categories/pdf' },
  { id: 'images', name: 'Image Tools', href: '/categories/images' },
  { id: 'documents', name: 'Document Tools', href: '/categories/documents' },
  { id: 'excel', name: 'Excel Tools', href: '/categories/excel' },
  { id: 'powerpoint', name: 'PowerPoint Tools', href: '/categories/powerpoint' },
  { id: 'converters', name: 'Converters', href: '/categories/converters' },
  { id: 'text', name: 'Text Tools', href: '/categories/text' },
  { id: 'developer', name: 'Developer Tools', href: '/categories/developer' },
  { id: 'utilities', name: 'Utility Tools', href: '/categories/utilities' },
];

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
