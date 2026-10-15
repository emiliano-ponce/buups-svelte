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

## Self-hosting (Docker + Caddy + Cloudflare Tunnel)

This uses the same setup as `rcv-app/deploy`:

- a shared external Docker network called `edge`
- a separate `reverse-proxy` compose project running Caddy and `cloudflared`
- an app container that publishes no ports

### 1. Configure

```bash
cp deploy/.env.example deploy/.env   # then fill in real values
```

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

### 2. Run database migrations (once, and after any schema change)

Migrations do **not** run automatically when the container starts. Run them from a checkout against Turso before the first start:

```bash
npm ci
DATABASE_URL=libsql://… DATABASE_AUTH_TOKEN=… npm run db:migrate
```

### 3. Build and start the app

```bash
docker network create edge 2>/dev/null || true   # once per machine
cd deploy
docker compose up -d --build
docker compose logs -f buups-svelte
```

### 4. Route traffic through Caddy

Add this block to `reverse-proxy/Caddyfile`, then run `docker compose restart caddy` in the reverse-proxy folder:

```caddy
buups.yourdomain.com:80 {
	reverse_proxy buups-svelte:3000 {
		# Live review updates use Server-Sent Events (/api/reviews/stream):
		# flush immediately instead of buffering.
		flush_interval -1
	}
}
```

Caddy already flushes `text/event-stream` responses right away. `flush_interval -1` just makes that explicit. Cloudflare Tunnel passes SSE through, and the app sends a heartbeat every 30s, so idle connections stay open.

### 5. Add the tunnel route

In Cloudflare Zero Trust, go to **Networks → Tunnels → your tunnel → Public Hostname** and add:

- **Hostname:** `buups.yourdomain.com`
- **Service:** `HTTP` → `caddy:80`

### Moving off Render

1. Deploy on a **new hostname** first, for example `buups-new.yourdomain.com`, using steps 1–5 with `ORIGIN` set to that hostname. Use the same Turso database, so the data is shared.
2. Test it: log in, open `/series`, check that live review updates arrive, and send a password-reset email.
3. Switch over:
    - Add the real hostname as a tunnel public hostname and to the Caddyfile.
    - Set `ORIGIN` and `PUBLIC_SITE_URL` to the real hostname, then run `docker compose up -d`.
    - Remove the DNS record that points the real hostname at Render. The tunnel creates its own CNAME.
4. Once traffic is flowing, suspend or delete the Render service.

### Notes

- **Google Sheets sync** runs inside the app: it happens when a review is saved, and on demand from the Account page. There's no scheduled job to replicate. `npm run db:sync` is a manual CLI script.
- **Updating:** `git pull && cd deploy && docker compose up -d --build`. Run `npm run db:migrate` first if `drizzle/` changed.
