import { ToolDefinition } from '../tools/types';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://omnitools.dev';

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OmniTools',
    url: BASE_URL,
    description: 'Fast, privacy-first online tools platform with zero server retention.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/tools?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateToolSoftwareSchema(tool: ToolDefinition) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any (Web Browser)',
    browserRequirements: 'Requires JavaScript',
    url: `${BASE_URL}/tools/${tool.slug}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: tool.features?.join(', ') || tool.shortDescription,
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}
