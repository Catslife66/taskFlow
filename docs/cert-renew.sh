#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/home/ubuntu/taskFlow/docker"
COMPOSE="docker compose -f docker-compose.prod.yml"

cd "$PROJECT_DIR"

echo "[$(date -u)] Starting certbot renew..."
$COMPOSE run --rm certbot renew

echo "[$(date -u)] Reloading nginx..."
$COMPOSE exec -T nginx nginx -s reload

echo "[$(date -u)] Done."