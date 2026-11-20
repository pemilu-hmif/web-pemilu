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
2. Copy `.env.example` to `.env`. The values in it work for local development as they are.
   Google login only works with the real Google OAuth values; ask the PM for them if you need it.
   Admin login works without them. Never commit `.env`.
3. Start the local database, create the tables, and fill them with test data.
   `start-database.sh` asks whether to generate a random password; answer `y`.
   ```bash
   ./start-database.sh
   npm run db:push
   npm run db:seed
   ```
   The seed adds fake candidates, a timeline, open voting, and a dev admin account.
   Voting opens 1 day before the moment you run it, closes 2 days after, and results show
   5 days after. Run `npm run db:seed` again any time to reset the countdown from that moment.
   You can also change the times on the admin page.
   Log in at http://localhost:3000/admin-login with `SEED_ADMIN_ID` and `SEED_ADMIN_PASSWORD`
   from your `.env`. It only runs against a database on `localhost`.
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

## Team

- Nathanael Rachmat, PM, @nanaatan
- Rionaldo Casey Pandhitha, Frontend and Backend, @aseyy
- Muhammad Nur Fikri Hariyawan, Frontend and Operator, @hehey304
