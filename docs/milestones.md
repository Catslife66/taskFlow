# Progress Overview (24.02.2026)

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

- EC2 deploy
- Nginx handles HTTPS (Let’s Encrypt)
- secure cookies:
  - Secure=true in prod
  - SameSite tuned
- environment split:
  - dev compose vs prod compose

## Phase 5: Observability and reliability improvements

- structured logging (JSON logs)
- metrics (Prometheus/Grafana or simpler)
- tracing (OpenTelemetry) optional
- health checks + restart policies
- rate limiting in Nginx for login
- timeouts at Nginx + app level
- alerting (even simple)
