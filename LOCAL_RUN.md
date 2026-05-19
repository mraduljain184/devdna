Local development: run backend + frontend with Docker for DBs

Prerequisites

- Docker / Docker Compose
- pnpm (or npm/yarn if you adapt commands)

Stop any already-running app containers first

If you already have the old Docker stack running, it can keep port 8000 or 3000 occupied and prevent your local dev process from starting.

```bash
docker stop devdna-backend devdna-frontend devdna-nginx || true
```

If you want to completely remove the old containers so local `pnpm dev` can run cleanly:

```bash
docker rm devdna-backend devdna-frontend devdna-nginx || true
```

Then start the DB containers only:

```bash
docker compose up -d postgres redis
```

Option A — Run DBs in Docker, run services locally (recommended)

1. Start PostgreSQL + Redis (uses `docker-compose.yml` services)

```bash
docker compose up -d postgres redis
```

2. Create backend `.env` (example `backend/.env`)

```
DATABASE_URL=postgresql://devdna_user:devna_password@localhost:5432/devdna
PORT=8000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
FRONTEND_URL=http://localhost:3000
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

> GitHub OAuth callback URL:
> `http://localhost:3000/api/auth/callback/github`
>
> This exact URL must be registered in your GitHub OAuth app settings in order for login to work.

3. Create frontend `.env.local` (example `frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=some_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

4. Install & run backend

```bash
cd backend
pnpm install
npx prisma generate
# If you want to apply dev migrations and seed the DB interactively:
npx prisma migrate dev
# Start development server
pnpm dev
```

5. Install & run frontend

```bash
cd frontend
pnpm install --ignore-workspace
pnpm dev
```

Open the app at http://localhost:3000 — API calls go to http://localhost:8000.

Option B — Run entire stack with Docker (images will be pulled unless you build)

If you prefer running everything in Docker using the existing `docker-compose.yml` (it references published images):

```bash
docker compose up -d
```

If you want to build the images locally instead of pulling published images, update the `backend` and `frontend` services in `docker-compose.yml` to use `build:` context pointing at `./backend` and `./frontend`, then run:

```bash
docker compose build
docker compose up -d
```

Notes

- We removed the GitHub Actions workflows that deployed to AWS from the repo (CI/CD files). If you still need backups of those workflow contents, check your local history or remote repo prior to this change.
- If you need help creating `.env` values or adding a `build:` block to `docker-compose.yml`, I can update the compose file for you.
