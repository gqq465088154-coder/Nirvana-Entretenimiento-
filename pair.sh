#!/usr/bin/env bash
set -Eeuo pipefail

info() { echo "[INFO] $*"; }
error() { echo "[ERROR] $*" >&2; }

RUNTIME="${PAIR_RUNTIME:-OpenClaw}"

main() {
  if ! command -v clawpilot >/dev/null 2>&1; then
    error "clawpilot command is missing. Run ./install.sh first."
    return 1
  fi

  case "$RUNTIME" in
    OpenClaw|Hermes) ;;
    *)
      error "PAIR_RUNTIME must be OpenClaw or Hermes"
      return 1
      ;;
  esac

  info "Running pre-pair runtime check"
  ./runtime-check.sh || info "Runtime check failed before pairing; continuing because pairing can run pre-deploy"

  info "Generating pairing code for runtime: $RUNTIME"
  clawpilot pair --runtime "$RUNTIME"
}

main "$@"
