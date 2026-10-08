export const dynamic = "force-dynamic";

import { getPublicSiteOrigin } from "@/app/site-origin";

export async function GET(request: Request) {
  const origin = getPublicSiteOrigin(request);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
