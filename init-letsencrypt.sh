#!/usr/bin/env bash
# init-letsencrypt.sh — first-time Let's Encrypt certificate acquisition
#
# Usage:
#   DOMAIN=example.com EMAIL=admin@example.com ./init-letsencrypt.sh
#
# Prerequisites:
#   - DNS A record for $DOMAIN pointing to this server's public IP
#   - Ports 80 and 443 open in firewall / security group
#   - Docker and Docker Compose installed
#   - JWT_SECRET set in .env (see .env.example)
#
# What this script does:
#   1. Creates a temporary self-signed certificate so nginx can start
#   2. Starts nginx (port 80 only) to serve the ACME webroot challenge
#   3. Obtains a real certificate from Let's Encrypt via certbot
#   4. Reloads nginx to pick up the real certificate
#   5. Patches nginx config with the actual domain name
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

DOMAIN="${DOMAIN:?DOMAIN env var is required (e.g. DOMAIN=example.com)}"
EMAIL="${EMAIL:?EMAIL env var is required for Let's Encrypt notices}"
STAGING="${STAGING:-0}"   # set STAGING=1 to use Let's Encrypt staging CA (no rate limits)

CONF_PATH="./infra/nginx/default.conf"
CERTBOT_CONF="./data/certbot/conf"
CERTBOT_WWW="./data/certbot/www"

# ── helpers ───────────────────────────────────────────────────────────────────
info()  { echo "[INFO]  $*"; }
warn()  { echo "[WARN]  $*"; }
die()   { echo "[ERROR] $*" >&2; exit 1; }

command -v docker >/dev/null 2>&1 || die "docker is required"
command -v openssl >/dev/null 2>&1 || die "openssl is required"

# ── 1. replace placeholder domain in nginx config ────────────────────────────
info "Patching nginx config: replacing DOMAIN with $DOMAIN"
if grep -q "DOMAIN" "$CONF_PATH"; then
  sed -i "s/DOMAIN/$DOMAIN/g" "$CONF_PATH"
else
  warn "DOMAIN placeholder not found in $CONF_PATH — skipping patch"
fi

# ── 2. create dummy self-signed cert so nginx starts ─────────────────────────
LIVE_DIR="$CERTBOT_CONF/live/$DOMAIN"
if [ ! -f "$LIVE_DIR/fullchain.pem" ]; then
  info "Creating temporary self-signed certificate for $DOMAIN"
  mkdir -p "$LIVE_DIR"
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout "$LIVE_DIR/privkey.pem" \
    -out    "$LIVE_DIR/fullchain.pem" \
    -subj   "/CN=$DOMAIN"
fi

# Create the options-ssl-nginx.conf and ssl-dhparams.pem that nginx includes
OPTIONS="$CERTBOT_CONF/options-ssl-nginx.conf"
DHPARAMS="$CERTBOT_CONF/ssl-dhparams.pem"

if [ ! -f "$OPTIONS" ]; then
  info "Generating options-ssl-nginx.conf"
  cat > "$OPTIONS" << 'EOF'
ssl_session_cache   shared:le_nginx_SSL:10m;
ssl_session_timeout 1440m;
ssl_session_tickets off;
ssl_protocols       TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_ciphers "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256";
EOF
fi

if [ ! -f "$DHPARAMS" ]; then
  info "Generating DH parameters (this may take a moment)"
  openssl dhparam -out "$DHPARAMS" 2048
fi

# Mount the local data dirs (used in dev without named volumes)
export CERTBOT_CONF_PATH="$CERTBOT_CONF"
export CERTBOT_WWW_PATH="$CERTBOT_WWW"
mkdir -p "$CERTBOT_WWW"

# ── 3. start nginx only ───────────────────────────────────────────────────────
info "Starting nginx to serve ACME challenge"
docker compose up -d nginx

# Wait for nginx to be healthy
RETRIES=10
until docker compose exec nginx wget -qO- http://127.0.0.1/healthz >/dev/null 2>&1 || [ "$RETRIES" -eq 0 ]; do
  info "Waiting for nginx… ($RETRIES retries left)"
  RETRIES=$((RETRIES - 1))
  sleep 3
done
[ "$RETRIES" -eq 0 ] && die "nginx did not become healthy in time"

# ── 4. obtain real certificate via certbot ────────────────────────────────────
info "Requesting Let's Encrypt certificate for $DOMAIN"
STAGING_FLAG=""
[ "$STAGING" = "1" ] && STAGING_FLAG="--staging" && warn "Using Let's Encrypt STAGING CA"

docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  $STAGING_FLAG \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --force-renewal \
  -d "$DOMAIN"

# ── 5. reload nginx with real certificate ────────────────────────────────────
info "Reloading nginx with the real certificate"
docker compose exec nginx nginx -s reload

info "Done! HTTPS is now active for https://$DOMAIN"
info "Certificate will be renewed automatically by the certbot container."
info ""
info "To start the full stack:"
info "  docker compose up -d"
