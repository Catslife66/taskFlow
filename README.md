# TaskFlow — System Design Specification

TaskFlow is a task management web application built to practice industry-standard development, including authentication, containerization, system design thinking, and Linux-based deployment.

## MVP (Functional Requirements)

- Register/login/logout
- Create task
- List tasks (only the logged-in user’s)
- Update task
- Delete task

## Non-functional Requirements

- Security
  ** Users must be authenticated to create, read, update, or delete tasks
  ** Users can only access their own tasks
  \*\* Session cookie must be HttpOnly & Secure & SameSite

- Reliability
  ** Application should continue working after container restarts
  ** Database data must persist using volumes

- Observability
  ** Backend logs requests and errors
  ** Logs are accessible via Docker logs

- Maintainability
  ** Clear separation between frontend, backend, and infrastructure
  ** Environment variables control configuration
  \*\* Ability to swap session storage implementation (Postgres → Redis)

- Portability
  ** Same app runs locally (Docker Compose) and in production (EC2)
  ** Minimal environment-specific code changes

## Data Model

- User
  ** id (UUID, primary key)
  ** email (unique)
  ** password_hash
  ** created_at

- Tasks
  ** id (UUID, primary key)
  ** user_id (fk)
  ** title
  ** status (todo / done)
  ** priority (high / medium / low)
  ** due_datetime (nullable)
  ** created_at
  ** updated_at

- Sessions (Phase 1: Postgres)
  ** id (UUID, primary key)
  ** user_id (fk)
  ** created_at
  ** expires_at
  \*\* revoked_at (nullable)

## API Design

- Auth
  ** POST /auth/register
  ** POST /auth/login
  ** POST /auth/logout
  ** GET /auth/me

- Tasks
  ** GET /tasks
  ** POST /tasks
  ** PATCH /tasks/{id}
  ** DELETE /tasks/{id}

## Architecture

1. User accesses the web application via browser
2. Requests are handled by the frontend (Next.js)
3. API requests are forwarded to the backend (FastAPI)
4. Backend:
   ** authenticates user via session cookie
   ** reads/writes task data in Postgres
5. Backend returns JSON responses
6. Frontend renders data to the user

## Environment Plan

- Development
  **All services run via Docker Compose:
  frontend
  backend API
  Postgres
  Redis (included early for learning, optional initially)
  Nginx
  **Volumes for:
  Postgres
  Redis
  \*\*Typical ports:
  API: 8000
  Frontend: 3000
  Postgres: 5432
  Redis: 6379
  Nginx: 80

- Production
  **Deployed to a Linux EC2 instance
  **Services run via Docker Compose (prod configuration)
  **Nginx acts as:
  reverse proxy
  single entry point
  **HTTPS added in later phase
  \*\*Secure cookies enabled

## Planned Milestones (Evolution)

- Phase 1: Core app (Postgres sessions, no Redis dependency)
- Phase 2: Frontend MVP (Next.js) & Add Nginx routing
- Phase 3: Migrate session storage to Redis
- Phase 4: Production deployment + HTTPS
- Phase 5: Observability and reliability improvements
