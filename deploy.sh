#!/usr/bin/env bash
set -Eeuo pipefail

info() { echo "[INFO] $*"; }
error() { echo "[ERROR] $*" >&2; }

main() {
  info "Starting Docker deployment"
  docker compose up --build -d

  info "Waiting for services to warm up"
  sleep 8

  if ! ./runtime-check.sh; then
    error "Runtime check failed after deployment"
    return 1
  fi

  info "Deployment completed successfully"
  info "Web: http://localhost:3000"
  info "API: http://localhost:4000"
}

main "$@"
