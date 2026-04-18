#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_NAME="Nirvana-Entretenimiento"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
OUTPUT_DIR="release"
OUTPUT_FILE="${OUTPUT_DIR}/${PROJECT_NAME}-${TIMESTAMP}.zip"

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
    -x "*.DS_Store"

  info "Release package created successfully"
  info "Output: $OUTPUT_FILE"
}

main "$@"
