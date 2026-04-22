#!/usr/bin/env bash
set -Eeuo pipefail

info() { echo "[INFO] $*"; }
warn() { echo "[WARN] $*"; }
error() { echo "[ERROR] $*" >&2; }

CLAWPILOT_VERSION="${CLAWPILOT_VERSION:-1.0.0}"

main() {
  info "Installing project dependencies"
  npm ci

  # Create docker.env from example if it doesn't exist yet.
  if [[ ! -f docker.env ]]; then
    if [[ -f docker.env.example ]]; then
      cp docker.env.example docker.env
      warn "docker.env created from docker.env.example."
      warn "IMPORTANT: Edit docker.env and replace all placeholder secrets before deploying."
    else
      warn "docker.env.example not found – skipping docker.env creation."
    fi
  else
    info "docker.env already exists – skipping creation."
  fi

  info "Installing ClawPilot @rethinkingstudio/clawpilot@${CLAWPILOT_VERSION}"
  if ! npm install -g "@rethinkingstudio/clawpilot@${CLAWPILOT_VERSION}"; then
    warn "ClawPilot installation failed. You can retry with a valid CLAWPILOT_VERSION env var."
    warn "Example: CLAWPILOT_VERSION=1.2.3 ./install.sh"
  fi

  info "Installation step completed"
}

main "$@"
