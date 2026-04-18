#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAWPILOT_VERSION="1.2.0"

echo "[INFO] Installing workspace dependencies..."
cd "$ROOT_DIR"
npm ci

echo "[INFO] Installing ClawPilot @rethinkingstudio/clawpilot@$CLAWPILOT_VERSION ..."
if npm install -g "@rethinkingstudio/clawpilot@$CLAWPILOT_VERSION"; then
  echo "[OK] ClawPilot installed successfully."
else
  echo "[WARN] ClawPilot global install failed. You can still run local project deployment." >&2
fi

echo "[DONE] Installation completed."
