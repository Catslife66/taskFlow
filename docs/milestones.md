# Progress Overview (04.Mar.2026)

## Phase 1: Core app (Postgres sessions, no Redis)

✅ Done:

- FastAPI + Postgres
- Session cookie auth
- Tasks CRUD + filtering + pagination basics
- Database models + migrations (with lessons learned)

📌**Later improvements**:

- sorting
- more indexes when data grows

## Phase 2: Frontend MVP (Next.js) + Nginx routing

✅ Done:

- Next.js UI for auth + tasks CRUD
- API wrapper (api.ts)
- Nginx configuration:
  - / → frontend
  - /api → backend
  - HMR WebSocket fixed
  - Added Nginx upgrades:
    - gzip
    - security headers baseline
    - request size limit
    - better logs
    - rate limit and rate limit for login

📌 **Later improvements**:

- TanStack Query
- Better UX polish (optimistic updates everywhere)

## Phase 3: Migrate sessions to Redis

✅ Done:

- Store sessions in Redis (instead of Postgres)
- Keep Postgres for users/tasks
- Add session TTL, refresh behavior, revoke all devices

📌**Later improvements**:

- keep redis String to store session for Phase 3 and upgrade to Hash in Phase 5

## Phase 4: Production deployment + HTTPS

✅ Done:

- EC2 deploy
  - api + db + redis + nginx
- Vercel for frontend
- Nginx reverse proxy for API
- Nginx handles HTTPS (Let’s Encrypt)
- secure cookies:
  - Secure=true in prod
  - SameSite 'none'
  - httpOnly=true
  - domain='.domain.com'
- CORS production setup
  - allow_origins
  - allow_credentials
- environment split:
  - dev compose vs prod compose
- DB migraions in prod

📌**Later improvements**:

- CI/CD (GitHub Actions)

## Phase 5: Observability and reliability improvements

- Reliability basics
  - restart policies (restart: unless-stopped) for: nginx, api, db, redis
  - health checks
    - docker compose healthchecks for api/db/redis/nginx where practical
    - external uptime check for https://domain.com/health
  - timeouts and limits
    - Nginx: proxy_connect_timeout / proxy_read_timeout
    - app-level request timeout strategy (if needed)
    - request size limits (already set in nginx)
  - safer deploy habits
    - always run migrations on deploy
    - verify with smoke test

- Logging improvements
  - structured logging for API (JSON logs)
    - include request id / correlation id
    - log level control by ENV
  - Nginx access logs
    - keep custom format
    - consider adding request id forwarding (X-Request-ID)

- Security and abuse protection
  - rate limiting
    - apply Nginx limit_req to /api/auth/login and register
    - basic bot protection rules
    - HSTS
    - tighten headers where appropriate

- Metrics and monitoring
  - simplest first
    - uptime monitoring + alerting (email/slack)
    - basic resource monitoring on EC2 (CPU/RAM/disk)
  - later (optional)
    - Prometheus + Grafana
    - OpenTelemetry tracing

- Backups and disaster recovery
  - Postgres backup strategy
    - periodic snapshots or pg_dump
  - document restore steps (runbook)
