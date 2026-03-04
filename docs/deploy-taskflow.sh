#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/ubuntu/taskFlow"
DOCKER_DIR="$APP_DIR/docker"
COMPOSE_FILE="docker-compose.prod.yml"

echo "== Deploy started: $(date -u) =="

cd "$APP_DIR"

echo "== Git update =="
git fetch --all
git reset --hard origin/main

echo "== Docker build/restart =="
cd "$DOCKER_DIR"
docker compose -f "$COMPOSE_FILE" up -d --build

echo "== DB migrations =="
docker compose -f "$COMPOSE_FILE" exec -T api alembic upgrade head

echo "== Smoke test =="
curl -fsS https://api.josiegal.co.uk/health | cat
echo
echo "== Deploy finished: $(date -u) =="