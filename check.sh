#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

fail() {
  echo "[ERROR] $1" >&2
  exit 1
}

pass() {
  echo "[OK] $1"
}

check_cmd() {
  local cmd="$1"
  local name="$2"
  if command -v "$cmd" >/dev/null 2>&1; then
    pass "$name detected: $(command -v "$cmd")"
  else
    fail "$name is required but not installed"
  fi
}

echo "Running environment check from: $ROOT_DIR"
check_cmd git "Git"
check_cmd node "Node.js"
check_cmd npm "npm"
check_cmd docker "Docker"

if docker compose version >/dev/null 2>&1; then
  pass "Docker Compose plugin detected"
elif command -v docker-compose >/dev/null 2>&1; then
  pass "docker-compose binary detected"
else
  fail "Docker Compose is required"
fi

if docker info >/dev/null 2>&1; then
  pass "Docker daemon is running"
else
  fail "Docker daemon is not running"
fi

echo "Environment check completed successfully."
