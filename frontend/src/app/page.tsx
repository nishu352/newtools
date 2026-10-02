'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllTools } from '@/lib/tool-registry/registry';
import { getWorkspaceStats } from '@/lib/workspace-registry';
import { HeroSearchBanner } from '@/components/directory/HeroSearchBanner';
import { FeatureHighlightsRow } from '@/components/directory/FeatureHighlightsRow';
import { CategoryCardsGrid } from '@/components/directory/CategoryCardsGrid';
import { PopularToolsSection } from '@/components/directory/PopularToolsSection';
import { RecentFilesAndTools } from '@/components/directory/RecentFilesAndTools';

export default function HomePage() {
  const router = useRouter();
  const allTools = React.useMemo(() => getAllTools(), []);
  const stats = React.useMemo(() => getWorkspaceStats(), []);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (q: string) => {
    if (q.trim()) {
      router.push(`/tools?q=${encodeURIComponent(q.trim())}`);
    } else {
      router.push('/tools');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Hero Search & Brand Banner */}
      <HeroSearchBanner
        totalToolsCount={allTools.length}
        totalWorkspacesCount={stats.totalWorkspaces}
        totalCapabilitiesCount={stats.totalCapabilities}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onTagClick={(tag) => handleSearchSubmit(tag)}
      />

      {/* 2. Feature Highlights (4 Badges) */}
      <FeatureHighlightsRow totalToolsCount={allTools.length} />

      {/* 3. Tool Categories Grid */}
      <CategoryCardsGrid />

      {/* 4. Popular Tools Section */}
      <PopularToolsSection />

      {/* 5. Recently Used Tools & Recent Files */}
      <RecentFilesAndTools />
    </div>
  );
}
