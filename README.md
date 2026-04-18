# Nirvana Entretenimiento (Production Monorepo)

Phoenix-themed FIFA World Cup 2026 portal with a Next.js web app, Express backend, Docker deployment, and PocketClaw pairing scripts.

## Project Structure

```text
.
├── apps/
│   └── web/                    # Next.js frontend (theme/i18n/entry animation)
├── backend/                    # Node.js + Express API (JWT/sportsbook/casino)
├── check.sh                    # Environment checks (Docker/Node/Git)
├── install.sh                  # Install dependencies + ClawPilot
├── runtime-check.sh            # Runtime readiness check (OpenClaw/Hermes)
├── pair.sh                     # Generate pairing code
├── deploy.sh                   # One-command Docker deployment
├── create-release-zip.sh       # Build runnable ZIP package
├── docker-compose.yml          # PostgreSQL + Redis + backend + web
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

## Web Features (`apps/web`)

- Phoenix fire theme system: colors, typography, shadows, animations
- 3.8s Nirvana entry animation (dark → flame → phoenix → burst → fade)
- i18n locales: `zh-CN`, `es-AR`, `es-CL`, `en-US`, `pt-BR`
- FIFA World Cup 2026 campaign homepage with nav, logo, promo blocks, game cards
- Next.js standalone output for production containers
- `.env.example` and `tsconfig.json` included

## Backend Features (`backend`)

- JWT middleware (`Authorization: Bearer <token>`)
- API routes:
  - `POST /api/auth/token`
  - `GET /api/sportsbook/events`
  - `POST /api/sportsbook/bets`
  - `GET /api/casino/games`
  - `POST /api/casino/session`
  - `GET /api/health`
- PostgreSQL pool configuration (`pg`)
- Redis client configuration (`redis`)
- Helmet/CORS/Morgan + centralized error handling/logging

## Environment Variables

Backend example: `backend/.env.example`

Web example: `apps/web/.env.example`

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

Services: PostgreSQL 16, Redis 7, Backend API, Web frontend.

## Create Runnable ZIP

```bash
./create-release-zip.sh
```

The ZIP is generated in `release/` and includes this README and startup scripts.
