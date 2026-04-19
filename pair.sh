#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUNTIME="${1:-openclaw}"
RUNTIME_LC="$(echo "$RUNTIME" | tr '[:upper:]' '[:lower:]')"

"$ROOT_DIR/runtime-check.sh" "$RUNTIME_LC"

PAIR_DIR="$ROOT_DIR/.pairing"
mkdir -p "$PAIR_DIR"
PAIR_CODE="$(node -e "const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let o='';for(let i=0;i<10;i++){o+=c[Math.floor(Math.random()*c.length)]}process.stdout.write(o)")"
PAIR_FILE="$PAIR_DIR/pair-${RUNTIME_LC}.txt"

if command -v clawpilot >/dev/null 2>&1; then
  if clawpilot --help 2>/dev/null | grep -qi "pair"; then
    if clawpilot pair --runtime "$RUNTIME_LC" --code "$PAIR_CODE" >/dev/null 2>&1; then
      echo "[INFO] ClawPilot pairing command executed successfully."
    else
      echo "[WARN] ClawPilot pair command failed; using generated fallback code." >&2
    fi
  fi
fi

echo "$PAIR_CODE" > "$PAIR_FILE"
echo "[OK] Pairing code for $RUNTIME_LC: $PAIR_CODE"
echo "[OK] Saved to $PAIR_FILE"
