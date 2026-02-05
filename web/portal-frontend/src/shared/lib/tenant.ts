export type TenantInfo = {
  slug: string;
  host: string;
};

const isLocalhostLike = (host: string) => host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local');

export const getTenantFromHost = (host: string, fallbackSlug?: string | null): TenantInfo | null => {
  const hostname = host.split(':')[0].toLowerCase();

  // aef.updspace.local -> aef
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    const subdomain = parts[0];
    if (subdomain && subdomain !== 'www') {
      return { slug: subdomain, host: hostname };
    }
  }

  // aef.localhost -> aef
  if (hostname.endsWith('.localhost')) {
    const subdomain = hostname.slice(0, -'.localhost'.length);
    if (subdomain) return { slug: subdomain, host: hostname };
  }

  // plain localhost: use hint
  if (isLocalhostLike(hostname) && fallbackSlug) {
    return { slug: fallbackSlug, host: hostname };
  }

  return null;
};
