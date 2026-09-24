import * as React from 'react';
import { Metadata } from 'next';
import { toolRegistry } from '@/lib/tools/registry';
import { HomepageClient } from '@/components/tools/HomepageClient';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'OMNITOOLS — Simple tools. Done right.',
  description:
    'Everyday tools, all in one place. Convert, compress, edit and inspect your files with fast browser utilities.',
  path: '/',
});

export default function HomePage() {
  const allTools = toolRegistry.getActiveTools();

  return <HomepageClient allTools={allTools} />;
}
