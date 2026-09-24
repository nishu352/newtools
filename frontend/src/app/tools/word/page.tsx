import { Metadata } from 'next';
import { CategoryView } from '@/components/tools/CategoryView';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Word & Document Tools — DOCX Extractor, Counter & Converter',
  description:
    'Free Microsoft Word (DOCX) utilities. Extract text, count words, inspect statistics, sanitize metadata, and convert DOCX to Markdown and HTML in your browser.',
  path: '/tools/word',
});

export default function WordToolsPage() {
  return <CategoryView categorySlug="word" basePath="/tools" />;
}
