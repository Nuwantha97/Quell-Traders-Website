# Quell Traders

A responsive, single-page company website for Quell Traders, built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and lucide-react.

## Run locally

```bash
pnpm install
pnpm --filter @workspace/quell-traders run dev
```

The development command uses `PORT` when provided and otherwise starts on port 3000.

## Quote form email

The contact API route is `POST /api/contact`. Add the following variables to the Replit Secrets / environment settings for the app before enabling email delivery:

| Variable | Required | Description |
| --- | --- | --- |
| `SMTP_HOST` | Yes | SMTP server hostname |
| `SMTP_USER` | Yes | SMTP login / sender address |
| `SMTP_PASS` | Yes | SMTP password |
| `CONTACT_TO_EMAIL` | Yes | Inbox that receives quote requests |
| `SMTP_PORT` | No | SMTP port; defaults to `587`. Port `465` uses TLS. |
| `NEXT_PUBLIC_SITE_URL` | No | Public `https://` site URL for canonical metadata, `robots.txt`, and the sitemap. Set this after configuring the production domain. |

The API validates every request on the server. If a required setting is missing or email delivery fails, it returns an inline form error; missing settings and delivery failures are logged by the server. Phone and WhatsApp contact links remain available.

## Replace the placeholders

- **Logo:** add the Quell Traders logo at `public/logo.png`. The current branded mark is used until this file exists.
- **TIJ printer photo:** add a product photo at `public/images/tij-printer.jpg`. Until then, the page uses an illustrated CSS placeholder.
- **Video poster:** add `public/images/video-poster.jpg`.
- **Intro video:** add `public/videos/intro.mp4` to use the local player. With no file present, the site shows “Intro video coming soon.”
- **YouTube:** edit `VIDEO_SOURCE` in `src/config/site.ts` to `{ type: "youtube", url: "https://www.youtube.com/watch?v=…" }`.

Company copy and editable site data live in `src/config/site.ts` and `src/data/`.

## Check and build

```bash
pnpm --filter @workspace/quell-traders run typecheck
pnpm --filter @workspace/quell-traders run build
pnpm --filter @workspace/quell-traders run start
```

Use the Replit Publish action to publish the site. For a custom domain, configure it in the deployment settings after publishing.
