# 🧬 DevDNA — Discover Your Coding Identity

**DevDNA** is a developer identity platform that analyzes your GitHub repositories and generates a unique **Coding DNA Profile** — a data-driven breakdown of your programming style, habits, strengths, and personality as a developer.

> _"Every developer writes code differently. DevDNA decodes what makes you, you."_

🔗 **Live Demo:** [http://3.7.71.55](http://3.7.71.55)

---

## 📸 Screenshots

<!-- Add your screenshots here -->
<!-- ![Dashboard](screenshots/dashboard.png) -->
<!-- ![DNA Profile](screenshots/profile.png) -->

---

## 🚀 Features

### 🔬 DNA Analysis Engine
Analyzes your GitHub repos, commits, and pull requests to calculate **8 core DNA scores:**

| Score | What It Measures |
|-------|-----------------|
| **Clarity** | Code readability and documentation quality |
| **Defensiveness** | Error handling and edge case coverage |
| **Velocity** | Coding speed and delivery pace |
| **Architecture** | Code structure and design patterns |
| **Reliability** | Test coverage and code stability |
| **Consistency** | Coding style uniformity across projects |
| **Collaboration** | PR reviews, teamwork, and communication |
| **Growth** | Learning curve and skill progression |

### 🎭 Developer Personality Types
Based on your scores, DevDNA assigns you one of **7 personality types:**

- 🏛️ **The Architect** — Designs elegant, well-structured systems
- ⚡ **The Sprinter** — Ships fast, iterates quickly
- 🎨 **The Craftsman** — Obsesses over code quality and polish
- 🤝 **The Collaborator** — Thrives in team environments
- 🔧 **The Pragmatist** — Gets things done with practical solutions
- 🧭 **The Explorer** — Always learning new technologies
- 🌐 **The Generalist** — Versatile across the full stack

### 📊 Interactive Visualizations
- **Radar Chart** — Visual DNA fingerprint of your coding style
- **Score Rings** — Individual SVG ring indicators for each trait
- **Personality Card** — Shareable card with your developer type

### 📈 Evolution Timeline
Track how your coding DNA changes over time with historical snapshots and trend analysis.

### 🏆 Benchmarking
- Compare your DNA against the **community average**
- See your **percentile ranking** for each trait
- View the **personality type distribution** across all users

### 👥 Team DNA Map
- Create or join teams with **invite codes**
- View **team radar charts** showing collective strengths
- Identify **team blind spots** and areas for improvement

### 🌍 Public Profiles & Leaderboard
- Shareable public profile at `/u/[username]`
- Community **leaderboard** ranking developers by DNA scores

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS, Recharts |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL 16 (Prisma ORM v5.22) |
| **Cache** | Redis 7 (ioredis) |
| **Auth** | GitHub OAuth + JWT |
| **Storage** | AWS S3 |
| **Proxy** | NGINX (rate limiting, gzip, security headers) |
| **Container** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions (build → push → deploy) |
| **Cloud** | AWS (EC2, RDS, S3) |
| **DB Admin** | pgAdmin 4 |

---

## 📁 Project Structure

```
devdna/
├── frontend/                # Next.js app (port 3000)
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── profile/     # DNA profile page
│   │   │   ├── evolution/   # Evolution timeline
│   │   │   ├── benchmark/   # Benchmarking page
│   │   │   ├── teams/       # Team DNA map
│   │   │   ├── leaderboard/ # Public leaderboard
│   │   │   └── u/[username] # Public profiles
│   │   └── components/      # Reusable UI components
│   │       ├── ScoreRing.tsx
│   │       ├── RadarChart.tsx
│   │       ├── PersonalityCard.tsx
│   │       └── EvolutionChart.tsx
│   └── Dockerfile
│
├── backend/                 # Express API (port 8000)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts      # GitHub OAuth routes
│   │   │   ├── dna.ts       # DNA analysis routes
│   │   │   ├── benchmark.ts # Benchmarking routes
│   │   │   ├── teams.ts     # Team management routes
│   │   │   └── public.ts    # Public profile routes
│   │   ├── services/
│   │   │   ├── github.ts    # GitHub API integration
│   │   │   └── dna-analyzer.ts # DNA calculation engine
│   │   ├── lib/
│   │   │   ├── prisma.ts    # Database client
│   │   │   └── redis.ts     # Cache client
│   │   └── index.ts         # Server entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── Dockerfile
│
├── nginx/
│   └── nginx.conf           # Reverse proxy configuration
│
├── .github/
│   └── workflows/
│       ├── ci.yml           # Build & test on every push
│       └── cd.yml           # Build, push & deploy to AWS
│
├── docker-compose.yml       # All services orchestration
└── .env                     # Environment variables
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js v24+
- pnpm v10+
- PostgreSQL 16
- Redis 7
- Docker & Docker Compose (for containerized setup)

### Option 1 — Local Development

**1. Clone the repository:**

```bash
git clone https://github.com/mraduljain184/devdna.git
cd devdna
```

**2. Set up the backend:**

```bash
cd backend
cp .env.example .env
# Edit .env with your GitHub OAuth credentials and database URL
pnpm install
npx prisma db push
pnpm dev
```

**3. Set up the frontend:**

```bash
cd frontend
cp .env.example .env
# Edit .env with your API URL
pnpm install
pnpm dev
```

**4. Open [http://localhost:3000](http://localhost:3000)**

### Option 2 — Docker (Recommended)

```bash
git clone https://github.com/mraduljain184/devdna.git
cd devdna
cp .env.example .env
# Edit .env with your credentials
docker compose up
```

All services (frontend, backend, postgres, redis, nginx, pgadmin) start automatically.

| Service | URL |
|---------|-----|
| App | [http://localhost](http://localhost) |
| API | [http://localhost/api](http://localhost/api) |
| pgAdmin | [http://localhost:5050](http://localhost:5050) |

---

## 🔐 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/devdna

# Server
PORT=8000
NODE_ENV=development

# Auth
JWT_SECRET=your_jwt_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Frontend
FRONTEND_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_API_URL=http://localhost/api

# AWS (optional, for S3 storage)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your_bucket

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/github` | Initiate GitHub OAuth |
| GET | `/api/auth/callback/github` | OAuth callback handler |
| GET | `/api/auth/me` | Get current user |

### DNA Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dna/repos` | List user's GitHub repos |
| POST | `/api/dna/analyze` | Run DNA analysis |
| GET | `/api/dna/profile` | Get DNA profile |
| GET | `/api/dna/snapshots` | Get historical snapshots |

### Benchmarking
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/benchmark` | Get benchmark comparison |

### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | List user's teams |
| POST | `/api/teams` | Create a team |
| POST | `/api/teams/join` | Join with invite code |
| GET | `/api/teams/:teamId` | Get team details & DNA map |

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/profile/:username` | Get public profile |
| GET | `/api/public/leaderboard` | Get leaderboard |

---

## 🏗️ Architecture

```
┌──────────────┐     ┌──────────┐     ┌──────────────┐
│   Browser    │────▶│  NGINX   │────▶│   Next.js    │
│              │     │ (port 80)│     │  (port 3000) │
└──────────────┘     └────┬─────┘     └──────────────┘
                          │
                          │ /api/*
                          ▼
                    ┌──────────────┐
                    │   Express    │
                    │  (port 8000) │
                    └──┬───────┬───┘
                       │       │
              ┌────────▼─┐  ┌──▼────────┐
              │PostgreSQL │  │   Redis   │
              │(port 5432)│  │(port 6379)│
              └──────────┘  └───────────┘
```

**Request Flow:**
1. User visits the app → NGINX routes to Next.js frontend
2. Frontend makes API calls → NGINX routes `/api/*` to Express backend
3. Backend authenticates via GitHub OAuth + JWT
4. Backend fetches GitHub data → runs DNA analysis → stores in PostgreSQL
5. Frequently accessed data is cached in Redis
6. Results displayed with interactive charts on the frontend

---

## 🔄 CI/CD Pipeline

Every push to `main` triggers:

1. **CI** — Builds both frontend and backend to verify no errors
2. **CD** — Builds Docker images → pushes to Docker Hub → SSHs into EC2 → pulls latest images → restarts containers

```
Push to main → Build → Test → Docker Build → Docker Push → EC2 Deploy → Live 🚀
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Mradul Jain**

- GitHub: [@mraduljain184](https://github.com/mraduljain184)

---

<p align="center">
  Built with ❤️ and a lot of ☕
  <br>
  <strong>🧬 What's your DevDNA?</strong>
</p>
