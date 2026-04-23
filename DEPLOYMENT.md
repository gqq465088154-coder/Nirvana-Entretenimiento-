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

2. **⚠️ Critical**: Set a strong `JWT_SECRET` in `.env`. Replace the placeholder with a random string:

   ```bash
   # Linux / macOS
   openssl rand -base64 32 | tr -d '=' > /tmp/jwt_secret.txt
   export JWT_SECRET=$(cat /tmp/jwt_secret.txt)
   sed -i.bak "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
   
   # Or manually edit .env and use a long random string (32+ chars)
   ```

3. Also update `docker.env` with strong passwords for PostgreSQL and any auth credentials.

## Build and Run

```bash
docker compose up -d --build
```

## Exposed Ports

默认端口如下，可在 `.env` 中覆盖：

- `WEB_HOST_PORT=3000`: Next.js web app
- `API_HOST_PORT=4000`: Backend API
- `HTTP_PORT=80`: Nginx reverse proxy (recommended entrypoint)
- `HTTPS_PORT=443`: Nginx HTTPS (requires TLS cert config in `infra/nginx/default.conf`)
- `POSTGRES_HOST_PORT=5432`: PostgreSQL
- `REDIS_HOST_PORT=6379`: Redis

## Health Checks

Compose health checks are enabled for:
- PostgreSQL
- Redis
- Backend (`/api/health`)
- Web (`/`)
- Nginx (`/api/health` via reverse proxy)

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
- **Port already in use**: free ports `80/443/3000/4000/5432/6379` or override `HTTP_PORT` `HTTPS_PORT` `WEB_HOST_PORT` `API_HOST_PORT` `POSTGRES_HOST_PORT` `REDIS_HOST_PORT` in `.env`.
- **Containers unhealthy**: inspect logs:

```bash
docker compose logs backend web nginx postgres redis
```

## HTTPS / Let's Encrypt

### Prerequisites

- A public domain with a DNS **A record** pointing to your server's IP
- Ports **80** and **443** open in your firewall / cloud security group

### First-time setup

```bash
# Set your domain and email, then run the init script
DOMAIN=example.com EMAIL=admin@example.com bash init-letsencrypt.sh
```

The script:
1. Patches `infra/nginx/default.conf` with your domain
2. Creates a temporary self-signed cert so nginx can start
3. Starts nginx to serve the ACME webroot challenge
4. Obtains a real certificate from Let's Encrypt
5. Reloads nginx with the real cert

Use `STAGING=1` during testing to avoid Let's Encrypt rate limits:

```bash
STAGING=1 DOMAIN=example.com EMAIL=admin@example.com bash init-letsencrypt.sh
```

### Automatic renewal

The `certbot` service in docker-compose checks for renewal every 12 hours.  
No additional cron job needed — just keep `docker compose up -d` running.

### After first-time setup, start everything

```bash
docker compose up -d
```

Traffic flow: browser → nginx :443 (TLS) → web :3000 / backend :4000

