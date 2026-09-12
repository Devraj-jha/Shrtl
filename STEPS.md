# STEPS.md — Waypoint build tracker

Single source of truth for this build. Resume from the first unchecked task on any interruption.
Commit a toggle in these checkboxes alongside the code that completed each task. Do not batch-check.

---

## Phase 1: Scaffold
- [x] Init Next.js 15 + TypeScript project
- [x] Configure Tailwind with custom design tokens from Section 3
- [x] Set up ESLint / Prettier
- [x] Init local Postgres (dev) + get DATABASE_URL wired into `.env` / Prisma

## Phase 2: Database (Prisma)
- [x] Prisma schema per Section 4
- [x] Run first migration against local Postgres
- [x] Seed script with demo waypoints + user
- [x] Prisma client singleton; committed

## Phase 3: Auth (Auth.js v5)
- [x] Install NextAuth, Prisma adapter, email + GitHub providers
- [x] Auth config with env placeholders (GITHUB_CLIENT_ID/SECRET, AUTH_SECRET)
- [x] `/login` page
- [x] Protect `/dashboard/*` behind auth
- [ ] Register session user + sign-out in the dashboard shell (Phase 4)

## Phase 4: Core CRUD
- [x] Zod schemas for create/list/edit/delete
- [x] `POST /api/links` with plan-limit enforcement
- [x] `GET /api/links`
- [x] `PATCH /api/links/[id]` (edit title / archive)
- [x] `DELETE /api/links/[id]`
- [x] Dashboard page: the "chart" layout (Section 3)
- [x] Create waypoint form with copy button + live click count

## Phase 5: Redirect service
- [x] `GET /r/[slug]` route — Redis-cached slug lookup
- [x] Click logging (referrer, geo from IP, device from UA)
- [x] Upstash rate limit on `/r/[slug]` and `POST /api/links`

## Phase 6: Analytics
- [ ] `GET /api/links/[id]/analytics` (clicks over time + breakdowns)
- [ ] Route view page with Recharts (line chart, referrers, countries, devices)
- [ ] CSV export for Pro plan

## Phase 7: Billing (Stripe)
- [ ] Stripe env placeholders + client
- [ ] `POST /api/stripe/checkout` — Checkout session (Free/Pro)
- [ ] `POST /api/stripe/webhook` — subscription lifecycle → `User.plan`
- [ ] Customer Portal link in `/dashboard/settings`
- [ ] Plan gating in UI + API

## Phase 8: Marketing pages
- [ ] Landing page with Section 3 design direction + one animated hero moment
- [ ] `/pricing` two-tier comparison
- [ ] Footer

## Phase 9: Polish & self-critique
- [ ] Responsive down to 375px
- [ ] Keyboard focus states on all interactive elements
- [ ] Respect `prefers-reduced-motion`
- [ ] No secrets in client code
- [ ] Final pass: cut generic-default tells (Section 3 self-critique)
- [ ] Final push

---

### Env placeholders (fill `.env.local` as you test)
- `DATABASE_URL` — local Postgres now; swap to Neon/Supabase later (one-line change)
- `AUTH_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_SECRET`
- `AUTH_EMAIL_SERVER` (SMTP for magic link; `AUTH_EMAIL_FROM`)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `APP_URL` (base URL for redirects / emails)