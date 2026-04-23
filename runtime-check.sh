#!/usr/bin/env bash
set -Eeuo pipefail

info()  { echo "[INFO]  $*"; }
warn()  { echo "[WARN]  $*"; }
error() { echo "[ERROR] $*" >&2; }

if [[ -f .env ]]; then
  # shellcheck disable=SC1091
  source .env
fi

MAX_RETRIES="${RUNTIME_CHECK_RETRIES:-5}"
RETRY_DELAY="${RUNTIME_CHECK_DELAY:-4}"
WEB_HOST_PORT="${WEB_HOST_PORT:-3000}"
API_HOST_PORT="${API_HOST_PORT:-4000}"

# Probe a URL up to MAX_RETRIES times with a delay between attempts.
check_endpoint() {
  local url="$1"
  local label="${2:-$1}"
  local attempt=1

  while (( attempt <= MAX_RETRIES )); do
    if curl --silent --fail --max-time 5 "$url" >/dev/null 2>&1; then
      info "$label is reachable ✓"
      return 0
    fi
    warn "Attempt ${attempt}/${MAX_RETRIES}: $label not yet reachable, retrying in ${RETRY_DELAY}s …"
    sleep "$RETRY_DELAY"
    attempt=$(( attempt + 1 ))
  done

  error "$label is not reachable after ${MAX_RETRIES} attempts"
  return 1
}

main() {
  info "Running runtime endpoint checks"
  check_endpoint "http://localhost:${WEB_HOST_PORT}" "Web  (http://localhost:${WEB_HOST_PORT})"
  check_endpoint "http://localhost:${API_HOST_PORT}/api/health" "API  (http://localhost:${API_HOST_PORT}/api/health)"
  info "All runtime checks passed ✓"
}

main "$@"
