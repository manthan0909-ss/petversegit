type HeadOptions = {
  /** Route path used for canonical + og:url, e.g. "/health". */
  path?: string;
  /** Private/app screens that should not be indexed. */
  noindex?: boolean;
  /** og:type override (default "website"). */
  type?: string;
  /** Optional JSON-LD structured data for rich results. */
  jsonLd?: unknown;
};

/**
 * Public base URL of the deployment. Set VITE_SITE_URL in the environment
 * (e.g. https://petverse.lovable.app) so canonical/OG URLs are absolute.
 */
export const SITE_URL = (
  (import.meta.env["VITE_SITE_URL"] as string | undefined) ?? "https://petverse-ecosystem.lovable.app"
).replace(/\/$/, "");

/** Base URL for backend/API calls; falls back to same-origin `/api`. */
export const API_BASE_URL = (
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "/api"
).replace(/\/$/, "");

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export function pvHead(title: string, description: string, options: HeadOptions = {}) {
  const { path, noindex, type = "website", jsonLd } = options;
  const fullTitle = `${title} — PetVerse`;
  const url = path ? absoluteUrl(path) : undefined;
  return () => ({
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:site_name", content: "PetVerse" },
      ...(url ? [{ property: "og:url", content: url }] : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      ...(noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
    ],
    ...(url && !noindex ? { links: [{ rel: "canonical", href: url }] } : {}),
    ...(jsonLd
      ? { scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }] }
      : {}),
  });
}
