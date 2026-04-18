#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RELEASE_DIR="$ROOT_DIR/release"
PROJECT_NAME="Nirvana-Entretenimiento"
VERSION_TAG="$(date +%Y%m%d-%H%M%S)"
PACKAGE_DIR="$RELEASE_DIR/$PROJECT_NAME"
ZIP_FILE="$RELEASE_DIR/${PROJECT_NAME}-${VERSION_TAG}.zip"

mkdir -p "$PACKAGE_DIR"
rm -rf "$PACKAGE_DIR"/*

rsync -a \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude 'release' \
  --exclude '*.zip' \
  "$ROOT_DIR/" "$PACKAGE_DIR/"

(
  cd "$RELEASE_DIR"
  zip -rq "$(basename "$ZIP_FILE")" "$PROJECT_NAME"
)

echo "[OK] Release zip created: $ZIP_FILE"
