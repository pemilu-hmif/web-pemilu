# Web Pemilu HMIF

Election website for HMIF ITB: voters log in with their ITB Google account, see the candidates, and vote.
Admins manage election data and see the results when the schedule allows.

Production: https://pemilu.hmif.dev/

## Stack

| Part | Uses |
|---|---|
| Language | TypeScript |
| Framework | Next.js 16, React 18 |
| Styling | Tailwind CSS 3 |
| API | tRPC |
| Login | NextAuth, Google |
| Database | PostgreSQL on Neon, through Prisma 5 |
| Deploy | Vercel, automatic from `main` |

## Run locally

### Prerequisites

| Tool | Version | Check | Get it |
|---|---|---|---|
| Git | any recent | `git --version` | https://git-scm.com/downloads |
| Node.js | 20.9 or newer | `node --version` | https://nodejs.org, pick LTS |
| npm | comes with Node.js | `npm --version` | |
| Docker | any recent | `docker --version` | https://docs.docker.com/get-docker |

Docker runs the local PostgreSQL database. On Windows, install WSL first and run every command
below inside the WSL terminal: https://learn.microsoft.com/windows/wsl/install

### Steps

1. Clone and install:
   ```bash
   git clone https://github.com/pemilu-hmif/web-pemilu.git
   cd web-pemilu
   npm install
   ```
2. Copy `.env.example` to `.env` and fill it in. Ask the PM for the Google OAuth values.
   Never commit `.env`.
3. Start the local database and create the tables:
   ```bash
   ./start-database.sh
   npm run db:push
   ```
4. Start the website:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Folders

| Folder | Contents |
|---|---|
| `src/app` | Pages, one folder per route |
| `src/components` | React components |
| `src/server` | tRPC routers, auth, database connection |
| `src/data` | Voting guide and rules content |
| `prisma` | Database schema and migrations |
| `public` | Images and static assets |

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before your first branch.
