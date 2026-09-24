import { Metadata } from 'next';
import { CategoryView } from '@/components/tools/CategoryView';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Free PDF Tools — Merge, Split, Compress & Edit Online Privately',
  description:
    'Free online PDF utilities. Merge, split, compress, rotate, extract pages, watermark, and convert PDF documents with 100% in-browser privacy and zero data storage.',
  path: '/tools/pdf',
});

export default function PdfToolsPage() {
  return <CategoryView categorySlug="pdf" basePath="/tools" />;
}
