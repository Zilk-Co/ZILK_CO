# Deploying Zilk Co.

This repo is a pnpm workspace:

| Package | Purpose |
| --- | --- |
| `artifacts/zilk-co` | The Zilk Co. portfolio SPA (Vite + React + Tailwind + Framer Motion) |
| `artifacts/api-server` | Express 5 API server (serves the SPA **and** the `/api/*` endpoints) |
| `lib/db` | Drizzle + `pg` schema, and the Neon DB seed script |
| `lib/api-spec`, `lib/api-zod`, `lib/api-client-react` | API spec + generated types/clients |

All site content (projects, blog posts) is seeded into a **Neon Postgres** database and exposed by the API server.

## Environment variables

Create a copy of `artifacts/zilk-co/.env.example` as `artifacts/zilk-co/.env` locally and fill it in. `.env` files are git-ignored — never commit them.

| Variable | Where | Required |
| --- | --- | --- |
| `DATABASE_URL` | Render / server process | Yes — Neon Postgres connection string |
| `VITE_SANITY_PROJECT_ID` | Build env (Vercel/Render) | No (defaults to `rlnj2yx2`) |
| `VITE_SANITY_DATASET` | Build env | No (defaults to `production`) |
| `VITE_SANITY_TOKEN` | Build env | Only if you edit content via Sanity |
| `VITE_GA_ID` | Build env | No (defaults to `G-GF9ZMFDFQQ`) |
| `VITE_SITE_URL` | Build env | No (defaults to `https://zilkco.vercel.app`) |
| `VITE_API_URL` | Build env | No — defaults to `/api` (same origin). Point it at your Render URL to make a Vercel static build read Neon too |

## 1) Seed the Neon database (one-time)

```bash
# from the repo root
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
pnpm --filter @workspace/db seed
```

This creates the `projects` and `posts` tables (if missing) and upserts all 5 projects + 3 blog posts. Re-run it anytime after editing data in `lib/db/src/seed/data.ts`.

## 2) Option A — Render (recommended, full-stack)

`render.yaml` is a Render Blueprint — one click does everything.

1. Push this repo to GitHub.
2. In Render, go to **New → Blueprint**, connect your GitHub repo, and select the `render.yaml` file.
3. Render asks you to fill `DATABASE_URL` — paste your Neon connection string there.
4. Deploy. The service builds the SPA + API server and serves everything from one URL (e.g. `https://zilk-co.onrender.com`).
5. Health check is `/api/healthz`; the blog reads from Neon via `/api/blog`.

## 3) Option B — Vercel (static SPA)

`vercel.json` at the repo root makes Vercel build the SPA.

1. In Vercel, **Add New Project** → import this GitHub repo. Framework preset = **Vite** (read from `vercel.json`).
2. Add the `VITE_*` environment variables you want (project settings → Environment Variables). At minimum set `VITE_API_URL` to your Render API URL if you want the blog to read Neon, otherwise it falls back to Sanity/bundled content.
3. Deploy. `outputDirectory` is `artifacts/zilk-co/dist/public`, with an SPA rewrite for `/blog` and `/work/*`.

## 4) Post-launch checklist

- **EmailJS**: disable reCAPTCHA in EmailJS dashboard → Settings → Security, or contact submissions fail with `g-recaptcha-response parameter not found`.
- **Cloudflare Turnstile**: the site key in `Contact.tsx` is a test key — replace it with your real key after launch.
- **Sitemap/SEO**: `public/sitemap.xml` and `robots.txt` already point at `https://zilkco.vercel.app` — update them to your final domain.

## Local dev

```bash
pnpm install
pnpm --filter @workspace/zilk-co dev        # SPA on :5173 (Vite)
pnpm --filter @workspace/api-server dev     # API on $PORT (needs DATABASE_URL)
```
