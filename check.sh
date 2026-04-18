#!/usr/bin/env bash
set -Eeuo pipefail

info() { echo "[INFO] $*"; }
error() { echo "[ERROR] $*" >&2; }

check_command() {
  local command_name="$1"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    error "Missing required command: $command_name"
    return 1
  fi
  info "$command_name detected: $(command -v "$command_name")"
}

main() {
  info "Running system checks for Nirvana deployment"
  check_command docker
  check_command node
  check_command npm
  check_command git

  if ! docker compose version >/dev/null 2>&1; then
    error "docker compose plugin is required"
    return 1
  fi

  info "Node.js version: $(node --version)"
  info "npm version: $(npm --version)"
  info "Docker version: $(docker --version)"
  info "Docker Compose version: $(docker compose version)"
  info "System checks passed"
}

main "$@"
