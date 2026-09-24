import { Metadata } from 'next';
import { CategoryView } from '@/components/tools/CategoryView';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Free Image Tools — Convert, Compress, Resize, Crop & Pick Colors',
  description:
    'Complete in-browser image utility suite. Convert JPG, PNG, WebP, SVG, and ICO, compress images, resize dimensions, rotate, flip, pick colors, extract palettes, and strip EXIF metadata.',
  path: '/tools/image',
});

export default function ImageToolsPage() {
  return <CategoryView categorySlug="image" basePath="/tools" />;
}
