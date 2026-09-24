import { Metadata } from 'next';
import { CategoryView } from '@/components/tools/CategoryView';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Excel & Spreadsheet Tools — Viewer, CSV & JSON Converters',
  description:
    'Free spreadsheet utilities. View Excel XLSX workbooks, convert CSV to Excel, convert spreadsheets to JSON, remove duplicates, transpose, and calculate column statistics.',
  path: '/tools/excel',
});

export default function ExcelToolsPage() {
  return <CategoryView categorySlug="excel" basePath="/tools" />;
}
