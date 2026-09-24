import { Metadata } from 'next';
import { CategoryView } from '@/components/tools/CategoryView';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'PowerPoint & Presentation Tools — PPTX Slide Counter & Extractor',
  description:
    'Free Microsoft PowerPoint (PPTX) tools. Count slides, extract text outlines, preview slides, sanitize metadata, and generate PPTX presentations directly in your browser.',
  path: '/tools/powerpoint',
});

export default function PowerPointToolsPage() {
  return <CategoryView categorySlug="powerpoint" basePath="/tools" />;
}
