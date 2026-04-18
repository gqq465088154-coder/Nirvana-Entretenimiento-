#!/usr/bin/env bash
set -Eeuo pipefail

info() { echo "[INFO] $*"; }
warn() { echo "[WARN] $*"; }
error() { echo "[ERROR] $*" >&2; }

CLAWPILOT_VERSION="${CLAWPILOT_VERSION:-1.0.0}"

main() {
  info "Installing project dependencies"
  npm ci

  info "Installing ClawPilot @rethinkingstudio/clawpilot@${CLAWPILOT_VERSION}"
  if ! npm install -g "@rethinkingstudio/clawpilot@${CLAWPILOT_VERSION}"; then
    warn "ClawPilot installation failed. You can retry with a valid CLAWPILOT_VERSION env var."
    warn "Example: CLAWPILOT_VERSION=1.2.3 ./install.sh"
  fi

  info "Installation step completed"
}

main "$@"
