#!/usr/bin/env bash
set -Eeuo pipefail

info()  { echo "[INFO]  $*"; }
warn()  { echo "[WARN]  $*"; }
error() { echo "[ERROR] $*" >&2; }

# Per-service wait timeouts (seconds)
readonly TIMEOUT_POSTGRES=90
readonly TIMEOUT_REDIS=60
readonly TIMEOUT_BACKEND=120
readonly TIMEOUT_WEB=120

# Wait until a docker-compose service reaches the "healthy" state (or timeout).
wait_healthy() {
  local service="$1"
  local max_wait="$2"
  local elapsed=0
  info "Waiting for service '$service' to become healthy (max ${max_wait}s) …"
  while true; do
    # docker inspect --format is reliable and needs no parser
    local container_id
    container_id=$(docker compose ps -q "$service" 2>/dev/null || true)
    local status="unknown"
    if [[ -n "$container_id" ]]; then
      status=$(docker inspect --format='{{.State.Health.Status}}' "$container_id" 2>/dev/null || echo "unknown")
    fi

    if [[ "$status" == "healthy" ]]; then
      info "Service '$service' is healthy."
      return 0
    fi

    if (( elapsed >= max_wait )); then
      error "Timed out waiting for '$service' (last status: $status)"
      return 1
    fi

    sleep 5
    elapsed=$(( elapsed + 5 ))
    info "  … still waiting for '$service' (${elapsed}s, status=${status})"
  done
}

main() {
  info "Building and starting all services"
  docker compose up --build -d

  # Wait for each service in dependency order
  wait_healthy postgres "$TIMEOUT_POSTGRES"
  wait_healthy redis    "$TIMEOUT_REDIS"
  wait_healthy backend  "$TIMEOUT_BACKEND"
  wait_healthy web      "$TIMEOUT_WEB"

  info "Running runtime endpoint check"
  ./runtime-check.sh

  info "========================================"
  info "Deployment completed successfully 🚀"
  info "  Web frontend : http://localhost:3000"
  info "  Backend API  : http://localhost:4000"
  info "  Health check : http://localhost:4000/api/health"
  info "========================================"
}

main "$@"
