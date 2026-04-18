#!/usr/bin/env bash
set -Eeuo pipefail

info() { echo "[INFO] $*"; }
error() { echo "[ERROR] $*" >&2; }

main() {
  info "Checking runtime endpoints"

  if ! curl --silent --show-error --fail "http://localhost:3000" >/dev/null; then
    error "Web service is not reachable at http://localhost:3000"
    return 1
  fi

  if ! curl --silent --show-error --fail "http://localhost:4000/api/health" >/dev/null; then
    error "Backend health endpoint is not reachable at http://localhost:4000/api/health"
    return 1
  fi

  info "Runtime check passed"
}

main "$@"
