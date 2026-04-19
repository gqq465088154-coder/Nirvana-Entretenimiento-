#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  echo "[ERROR] Docker Compose is required." >&2
  exit 1
fi

echo "[INFO] Building and deploying services with: $COMPOSE_CMD"
$COMPOSE_CMD up -d --build

echo "[OK] Deployment finished."
echo "Web: http://localhost:3000"
echo "API: http://localhost:4000/api/health"
