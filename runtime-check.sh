#!/usr/bin/env bash
set -euo pipefail

RUNTIME="${1:-openclaw}"
RUNTIME_LC="$(echo "$RUNTIME" | tr '[:upper:]' '[:lower:]')"

if [[ "$RUNTIME_LC" != "openclaw" && "$RUNTIME_LC" != "hermes" ]]; then
  echo "[ERROR] Unsupported runtime '$RUNTIME'. Use openclaw or hermes." >&2
  exit 1
fi

echo "[INFO] Runtime selected: $RUNTIME_LC"

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js is required" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "[ERROR] Docker is required" >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "[ERROR] Docker daemon is not running" >&2
  exit 1
fi

echo "[OK] Runtime environment is ready for $RUNTIME_LC."
