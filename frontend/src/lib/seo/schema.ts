import { ToolDefinition, ToolFaqItem } from '../tools/types';
import { getBaseUrl } from './metadata';

const BASE_URL = getBaseUrl();

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OmniTools',
    url: BASE_URL,
    description: 'Fast, privacy-first online tools platform with zero server retention.',
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OmniTools',
    url: BASE_URL,
    description: 'Fast, free, and private online tools for developers, writers, and everyday calculations.',
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

/**
 * Generate FAQPage JSON-LD from an array of FAQ items.
 * Only call this when FAQ content is genuinely visible on the page.
 */
export function generateFaqSchema(faqs: ToolFaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

