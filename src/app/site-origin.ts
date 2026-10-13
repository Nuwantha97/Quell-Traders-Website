const allowedProtocol = (value: string | null | undefined) =>
  value === "https" || value === "http" ? value : null;

const NEXT_PUBLIC_SITE_URL = "https://quell-traders-website.vercel.app/";

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

export function getPublicSiteOrigin(request: Request) {
  const configuredUrl = NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredUrl) {
    try {
      const configured = new URL(configuredUrl);
      if (configured.protocol === "https:" || configured.protocol === "http:") {
        return configured.origin;
      }
    } catch {
      console.error("NEXT_PUBLIC_SITE_URL must be a valid public HTTP(S) URL.");
    }
  }

  const forwardedHost = firstHeaderValue(request.headers.get("x-forwarded-host"));
  const host = forwardedHost ?? firstHeaderValue(request.headers.get("host"));
  const protocol =
    allowedProtocol(firstHeaderValue(request.headers.get("x-forwarded-proto"))) ??
    new URL(request.url).protocol.replace(":", "");

  if (host && /^[a-z\d.-]+(?::\d{1,5})?$/i.test(host)) {
    return `${protocol}://${host}`;
  }

  return new URL(request.url).origin;
}
