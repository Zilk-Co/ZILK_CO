import { useEffect } from 'react';

const SITE_NAME = 'Zilk Co.';
export const BASE_TITLE = `${SITE_NAME} — Engineering Digital Businesses`;
const BASE_DESCRIPTION =
  'Zilk Co. is a premium software engineering agency that builds digital businesses — web apps, mobile apps, enterprise software, and SaaS products crafted to the highest standard.';

function setMeta(selector: string, content: string) {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
}

interface SEOOptions {
  title: string;
  description?: string;
}

/**
 * Lightweight per-page SEO — updates <title> and key meta tags in the DOM.
 * Restores baseline values on unmount (single-page app route transitions).
 */
export function useSEO({ title, description }: SEOOptions) {
  useEffect(() => {
    const fullTitle =
      title === BASE_TITLE ? BASE_TITLE : `${title} — ${SITE_NAME}`;
    const desc = description ?? BASE_DESCRIPTION;

    document.title = fullTitle;
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', desc);

    return () => {
      document.title = BASE_TITLE;
      setMeta('meta[name="description"]', BASE_DESCRIPTION);
      setMeta('meta[property="og:title"]', BASE_TITLE);
      setMeta('meta[property="og:description"]', BASE_DESCRIPTION);
      setMeta('meta[name="twitter:title"]', BASE_TITLE);
      setMeta('meta[name="twitter:description"]', BASE_DESCRIPTION);
    };
  }, [title, description]);
}
