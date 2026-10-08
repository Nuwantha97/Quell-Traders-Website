# Quell Traders

Quell Traders’ single-page company website for TIJ printing solutions and industrial compressor spares.

## Run & Operate

- `pnpm --filter @workspace/quell-traders run dev` — run the Next.js site
- `pnpm --filter @workspace/quell-traders run typecheck` — typecheck the site
- `pnpm --filter @workspace/quell-traders run build` — build the site for production
- `pnpm --filter @workspace/quell-traders run start` — run the production build
- `pnpm --filter @workspace/api-server run dev` — run the shared API service, whose only public site path is its health endpoint

The quote form requires `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, and `CONTACT_TO_EMAIL`; `SMTP_PORT` defaults to 587. Set `NEXT_PUBLIC_SITE_URL` to the published HTTPS URL for canonical metadata and the sitemap.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Quell Traders web: Next.js App Router, React, Tailwind CSS, Framer Motion, lucide-react
- Contact API: Next.js route handler, Zod validation, Nodemailer
- Shared API service: Express 5

## Where things live

- Site company data: `artifacts/quell-traders/src/config/site.ts`
- Page content: `artifacts/quell-traders/src/data/`
- App Router pages and handlers: `artifacts/quell-traders/src/app/`
- Setup and asset replacement instructions: `artifacts/quell-traders/README.md`

## Architecture decisions

- The Quell Traders website is a Next.js App Router application, not a Vite app.
- The company site is a single page. The Next.js handlers expose quote contact, sitemap, and robots routes.
- The shared API service is routed only at `/api/healthz` so it does not shadow the website’s `/api/contact` handler.
- The contact form reports a clear delivery error until SMTP is configured; it must not claim an email was sent when delivery failed.

## User preferences

- Keep the Quell Traders website light-theme only; do not add a dark mode.

## Gotchas

- Replace the temporary logo, printer illustration, and video placeholders when the final assets are available; see the site README.
- Set `NEXT_PUBLIC_SITE_URL` to the real public URL after a domain is selected. Do not guess a production domain.

## Pointers

- See `.local/skills/pnpm-workspace/SKILL.md` for workspace and package details.
