/**
 * OmniTools - Pure Web, URL & Query Parameter Engine
 * URL decomposition, query parameter table manipulation, and UTM builder.
 */

export interface ParsedUrlDetails {
  valid: boolean;
  href?: string;
  protocol?: string;
  host?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  search?: string;
  hash?: string;
  origin?: string;
  params: { key: string; value: string }[];
  error?: string;
}

export function parseUrlComponents(urlString: string): ParsedUrlDetails {
  if (!urlString.trim()) return { valid: false, params: [], error: 'URL string is empty.' };

  try {
    let target = urlString.trim();
    if (!/^https?:\/\//i.test(target) && !target.startsWith('//')) {
      target = `https://${target}`;
    }

    const u = new URL(target);
    const params: { key: string; value: string }[] = [];
    u.searchParams.forEach((val, key) => {
      params.push({ key, value: val });
    });

    return {
      valid: true,
      href: u.href,
      protocol: u.protocol,
      host: u.host,
      hostname: u.hostname,
      port: u.port || (u.protocol === 'https:' ? '443' : '80'),
      pathname: u.pathname,
      search: u.search,
      hash: u.hash,
      origin: u.origin,
      params,
    };
  } catch (err: unknown) {
    return {
      valid: false,
      params: [],
      error: err instanceof Error ? err.message : 'Invalid URL structure.',
    };
  }
}

export interface UtmCampaignParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export function buildUtmUrl(baseUrl: string, utm: UtmCampaignParams): string {
  if (!baseUrl.trim()) return '';
  let urlStr = baseUrl.trim();
  if (!/^https?:\/\//i.test(urlStr) && !urlStr.startsWith('//')) {
    urlStr = `https://${urlStr}`;
  }

  try {
    const u = new URL(urlStr);
    if (utm.source?.trim()) u.searchParams.set('utm_source', utm.source.trim());
    if (utm.medium?.trim()) u.searchParams.set('utm_medium', utm.medium.trim());
    if (utm.campaign?.trim()) u.searchParams.set('utm_campaign', utm.campaign.trim());
    if (utm.term?.trim()) u.searchParams.set('utm_term', utm.term.trim());
    if (utm.content?.trim()) u.searchParams.set('utm_content', utm.content.trim());
    return u.toString();
  } catch {
    return baseUrl;
  }
}
