# Nirvana Entretenimiento (Production Monorepo)

Phoenix-themed FIFA World Cup 2026 portal with a Next.js web app, Express backend, Docker deployment, and PocketClaw pairing scripts.

## Project Structure

```text
.
├── apps/
│   └── web/                    # Next.js frontend (theme/i18n/entry animation)
├── backend/                    # Node.js + Express API (JWT/sportsbook/casino)
├── infra/
│   └── nginx/                  # Nginx reverse proxy config (HTTP/HTTPS)
├── check.sh                    # Environment checks (Docker/Node/Git)
├── install.sh                  # Install dependencies + ClawPilot
├── runtime-check.sh            # Runtime readiness check (OpenClaw/Hermes)
├── pair.sh                     # Generate pairing code
├── deploy.sh                   # One-command Docker deployment
├── create-release-zip.sh       # Build runnable ZIP package
├── docker-compose.yml          # PostgreSQL + Redis + backend + web + nginx
├── Dockerfile                  # Multi-stage build
└── README.md
```

## Quick Start (Direct Run)

```bash
./check.sh
./install.sh
./pair.sh openclaw
./deploy.sh
```

Access:
- Web: http://localhost:3000
- API health: http://localhost:4000/api/health
- Nginx proxy: http://localhost (port 80)

## Web Features (`apps/web`)

- Phoenix fire theme system: colors, typography, shadows, animations
- 3.8s Nirvana entry animation (dark → flame → phoenix → burst → fade)
- i18n locales: `zh-CN`, `es-AR`, `es-CL`, `en-US`, `pt-BR`
- FIFA World Cup 2026 campaign homepage with nav, logo, promo blocks, game cards
- **Sportsbook page** (`/sportsbook`) — live events with bet placement UI
- **Casino page** (`/casino`) — game catalog with session launch
- **User profile page** (`/profile`) — auth status and navigation
- API client library (`lib/api/client.js`) for backend integration
- Next.js standalone output for production containers
- `.env.example` and `tsconfig.json` included

## Backend Features (`backend`)

- **User registration** (`POST /api/auth/register`) — bcrypt password hashing
- **User login** (`POST /api/auth/login`) — email/password authentication
- **Token refresh** (`POST /api/auth/refresh`) — rotating refresh tokens
- **Demo token** (`POST /api/auth/token`) — backward-compatible demo endpoint
- JWT middleware (`Authorization: Bearer <token>`)
- API routes:
  - `GET /api/sportsbook/events`
  - `POST /api/sportsbook/bets`
  - `GET /api/casino/games`
  - `POST /api/casino/session`
  - `GET /api/health`
  - `GET /api/metrics` — Prometheus metrics endpoint
- PostgreSQL pool configuration (`pg`) with schema migrations
- Redis client configuration (`redis`)
- **Winston** structured logging with file output in production
- **Prometheus** metrics (request duration, request count, Node.js defaults)
- Helmet/CORS/Morgan + centralized error handling
- Rate limiting on authenticated API surfaces
- Production environment variable validation (fails on missing JWT_SECRET/DATABASE_URL)

## Database

```bash
# Run migrations (requires DATABASE_URL)
npm --workspace backend run migrate

# Rollback
npm --workspace backend run migrate:down
```

Tables: `users`, `refresh_tokens`, `bets`, `game_sessions`

## Testing

```bash
# Run all tests (42 total)
npm test

# Backend tests only (19 tests — Jest + Supertest)
npm run test:backend

# Frontend tests only (23 tests — React Testing Library)
npm run test:web
```

## Environment Variables

Backend example: `backend/.env.example`

Web example: `apps/web/.env.example`

**Production requirements:**
- `JWT_SECRET` must be set to a strong random value (not the default)
- `DATABASE_URL` must point to a real PostgreSQL instance
- `REDIS_URL` should point to a Redis instance
- `NODE_ENV=production` enables file logging and env validation

## Build and Run Locally

```bash
npm ci
npm run build:web
npm run dev:web
npm run dev:backend
```

## Docker Deployment

```bash
./deploy.sh
```

Services: PostgreSQL 16, Redis 7, Backend API, Web frontend, Nginx reverse proxy.

## Nginx / SSL

The nginx config is at `infra/nginx/default.conf`. It proxies:
- `/api/*` → backend:4000
- `/*` → web:3000

To enable HTTPS, uncomment the SSL server block and mount your certificates.

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR to main:
1. **Lint** — `next lint`
2. **Test Backend** — Jest + Supertest
3. **Test Web** — React Testing Library
4. **Build** — Next.js production build (after all checks pass)

## Create Runnable ZIP

```bash
./create-release-zip.sh
```

The ZIP is generated in `release/` and includes this README and startup scripts.
