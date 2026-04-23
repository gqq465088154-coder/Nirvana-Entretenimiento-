#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_NAME="Nirvana-Entretenimiento"
PROJECT_VERSION="$(grep -m1 '"version"' package.json | sed -E 's/.*"version": "([^"]+)".*/\1/')"
BRANCH_NAME="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'detached-head')"
BRANCH_SLUG="$(echo "$BRANCH_NAME" | tr '[:upper:]' '[:lower:]' | sed -E 's#[^a-z0-9]+#-#g; s#(^-+|-+$)##g')"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
OUTPUT_DIR="release"
OUTPUT_FILE="${OUTPUT_DIR}/${PROJECT_NAME}-v${PROJECT_VERSION}-${BRANCH_SLUG}-${TIMESTAMP}.zip"

info() { echo "[INFO] $*"; }
error() { echo "[ERROR] $*" >&2; }

main() {
  if ! command -v zip >/dev/null 2>&1; then
    error "zip command not found. Please install zip package first."
    return 1
  fi

  mkdir -p "$OUTPUT_DIR"

  info "Creating release archive: $OUTPUT_FILE"
  zip -r "$OUTPUT_FILE" . \
    -x "*.git*" \
    -x "node_modules/*" \
    -x "apps/web/.next/*" \
    -x "release/*" \
    -x "850组建 2/*" \
    -x "850缁勫缓 2/*" \
    -x "__MACOSX/*" \
    -x "*.DS_Store" \
    -x "docker.env" \
    -x "**/.env" \
    -x "*.pem" \
    -x "*.key" \
    -x "npm-install.log"

  info "Release package created successfully"
  info "Output: $OUTPUT_FILE"
}

main "$@"
