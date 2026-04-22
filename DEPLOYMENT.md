# Deployment with Docker Compose

## Application Type

This repository is a **Node.js monorepo**:
- `apps/web`: Next.js frontend
- `backend`: Express API

## Prerequisites

- Docker Engine 24+
- Docker Compose v2 (`docker compose`)

## Environment Variables

1. Copy the example file:

```bash
cp .env.example .env
```

2. Set a strong `JWT_SECRET` in `.env`.

## Build and Run

```bash
docker compose up -d --build
```

## Exposed Ports

- `3000`: Next.js web app
- `4000`: Backend API
- `80`: Nginx reverse proxy (recommended entrypoint)
- `443`: Nginx HTTPS (certificate config required)

## Health Checks

Compose health checks are enabled for:
- PostgreSQL
- Redis
- Backend (`/api/metrics`)
- Web (`/`)

Check service health:

```bash
docker compose ps
```

## Verify Runtime

```bash
curl -f http://localhost/api/health
curl -f http://localhost
curl -f http://localhost:4000/api/metrics
```

## Troubleshooting

- **`JWT_SECRET` missing**: ensure `.env` exists and contains a non-empty `JWT_SECRET`.
- **Port already in use**: free ports `80/443/3000/4000/5432/6379` or change mappings in `docker-compose.yml`.
- **Containers unhealthy**: inspect logs:

```bash
docker compose logs backend web nginx postgres redis
```
