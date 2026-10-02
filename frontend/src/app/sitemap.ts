import { MetadataRoute } from 'next';
import { getAllTools } from '@/lib/tool-registry/registry';
import { CATEGORIES } from '@/lib/tool-registry/categories';
import { resourceRegistry } from '@/lib/resources/registry';
import { getBaseUrl } from '@/lib/seo/metadata';

const BASE_URL = getBaseUrl();

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
      url: `${BASE_URL}/resources`,
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

  // Dynamic category routes — canonical categories from CATEGORIES (excluding 'all' which is /tools)
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES
    .filter((cat) => cat.slug !== 'all')
    .map((cat) => ({
      url: `${BASE_URL}/categories/${cat.slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // Dynamic tool routes — canonical 168 tools
  const toolRoutes: MetadataRoute.Sitemap = getAllTools()
    .map((tool) => ({
      url: `${BASE_URL}/tools/${tool.slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: tool.status === 'active' || !tool.status ? 0.9 : 0.7,
    }));

  // Resource guide routes
  const resourceRoutes: MetadataRoute.Sitemap = resourceRegistry
    .getPublishedGuides()
    .map((guide) => ({
      url: `${BASE_URL}/resources/${guide.slug}`,
      lastModified: new Date(guide.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes, ...resourceRoutes];
}
