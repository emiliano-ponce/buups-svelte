# buups-svelte

A Star Trek–themed (LCARS) site where Emiliano and Jars review Star Trek episodes and movies. Built with SvelteKit (Svelte 5), `@sveltejs/adapter-node`, Tailwind, and Drizzle ORM on libSQL/Turso. It also syncs reviews with Google Sheets and pulls series data from TMDB.

## Local development

```bash
cp .env.example .env      # fill in values; DATABASE_URL=file:local.db works locally
npm ci
npm run db:migrate        # apply drizzle/ migrations to DATABASE_URL
npm run dev
```

Checks: `npm run check`, `npm run lint`, `npx vitest run`, `npm run build`.

## Configuration

| Variable                                      | Notes                                                                                                                             |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `ORIGIN`                                      | Public URL, e.g. `https://buups.yourdomain.com`. **Required**: without it, SvelteKit rejects form posts (login) behind the proxy. |
| `PUBLIC_SITE_URL`                             | Used in password-reset email links. Usually the same as `ORIGIN`.                                                                 |
| `DATABASE_URL`, `DATABASE_AUTH_TOKEN`         | Turso (`libsql://…`) URL and token.                                                                                               |
| `TMDB_API_KEY`, `TMDB_REFRESH_TTL_HOURS`      | TMDB v3 key, and how often stored series stats are refreshed (default 24).                                                        |
| `GOOGLE_SHEETS_CREDENTIALS`, `SPREADSHEET_ID` | Service-account JSON (on one line) and sheet id for the review ↔ Sheets sync.                                                     |
| `GOOGLE_SHEETS_KEY`                           | Only for the `db:seed` / `db:sync` CLI scripts.                                                                                   |
| `EMAIL_API_KEY`                               | Resend key for password-reset emails. Read at runtime only.                                                                       |
| `BODY_SIZE_LIMIT`                             | Optional. The default of 512K is enough.                                                                                          |

All secrets are read at runtime through `$env/dynamic/private`. The image build doesn't need any of them, and none end up in image layers.

## Database migrations

Migrations do **not** run automatically when the container starts. Run them against the target database before the first start and after any schema change:

```bash
DATABASE_URL=libsql://… DATABASE_AUTH_TOKEN=… npm run db:migrate
```

## Docker

```bash
cp deploy/.env.example deploy/.env   # then fill in real values
docker network create edge 2>/dev/null || true   # compose expects an external `edge` network
cd deploy && docker compose up -d --build
```

Live review updates use Server-Sent Events (`/api/reviews/stream`); any reverse proxy in front of the app should not buffer them. The app sends a heartbeat every 30s.

**Google Sheets sync** runs inside the app: when a review is saved, and on demand from the Account page. `npm run db:sync` is a manual CLI script.

## Deployment

Pushes to `main` are deployed automatically by GitHub Actions once CI passes.
