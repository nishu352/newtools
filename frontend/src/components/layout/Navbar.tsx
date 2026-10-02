'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';

const CATEGORIES = [
  { name: 'All Tools', href: '/tools' },
  { name: 'PDF', href: '/categories/pdf' },
  { name: 'Images', href: '/categories/images' },
  { name: 'Documents', href: '/categories/documents' },
  { name: 'Converters', href: '/categories/converters' },
  { name: 'Text', href: '/categories/text' },
  { name: 'Developer', href: '/categories/developer' },
  { name: 'Utilities', href: '/categories/utilities' },
];

export const Navbar = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tools?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/tools');
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            Omini<span>Tools</span>
          </Link>
          <nav className={styles.nav}>
            {CATEGORIES.map((category) => (
              <Link key={category.href} href={category.href} className={styles.navLink}>
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.right}>
          <form onSubmit={handleSearch} className={styles.searchWrapper}>
            <Input 
              placeholder="Search 140+ tools..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <Button variant="outline" size="small">Sign In</Button>
          
          <button className={styles.mobileMenuBtn} aria-label="Open mobile menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
