import { MetadataRoute } from 'next';
import { toolRegistry } from '@/lib/tools/registry';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://omnitools.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic category routes
  const categoryRoutes: MetadataRoute.Sitemap = toolRegistry.getCategories().map((cat) => ({
    url: `${BASE_URL}/categories/${cat.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic tool routes
  const toolRoutes: MetadataRoute.Sitemap = toolRegistry.getAllTools().map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: tool.status === 'active' ? 0.9 : 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
