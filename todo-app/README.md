# Pomodoro Todo App

A productivity application for task management with Pomodoro-style time tracking, custom labels, calendar streaks, and analytics.

## Features

- 📝 **Task Management** - Daily task lists with Notion-style inline editing and drag-and-drop reordering
- ⏱️ **Time Tracking** - Pomodoro-style stopwatch with lap recording and label assignment
- 🏷️ **Custom Labels** - Categorize tasks with colored labels and filter by label
- 📅 **Calendar View** - Visual calendar with streak tracking and goal setting
- 📊 **Analytics Dashboard** - Weekly/monthly insights, time breakdown charts, and GitHub-style contribution graph
- 🔥 **Streak Tracking** - Track your productivity streaks and stay motivated
- 🎯 **Goals** - Set weekly and monthly task completion goals
- 🌙 **Dark Mode** - Beautiful dark theme throughout the app
- 📱 **Mobile Responsive** - Fully responsive design with mobile navigation

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: TanStack Query (React Query)
- **Database**: PostgreSQL
- **ORM**: Prisma 5
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or remote)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository** (if not already done)

2. **Install dependencies**
   ```bash
   cd todo-app
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   ```

4. **Configure your database URL**
   
   Edit `.env` and set your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/pomodoro_todo?schema=public"
   ```

   Replace:
   - `username` - your PostgreSQL username
   - `password` - your PostgreSQL password
   - `localhost:5432` - your database host and port
   - `pomodoro_todo` - your database name

### Database Setup

#### Option 1: Local PostgreSQL

1. **Install PostgreSQL** on your machine if not already installed

2. **Create the database**
   ```bash
   # Using psql
   psql -U postgres
   CREATE DATABASE pomodoro_todo;
   \q
   ```

   Or using createdb:
   ```bash
   createdb -U postgres pomodoro_todo
   ```

3. **Update your `.env`** with the connection string

#### Option 2: Docker (Recommended)

Docker is the easiest way to get PostgreSQL running without installing it directly on your machine. The steps below use a **named volume** so your data persists across container restarts and removals.

##### Step 1: Create a Docker volume

A named volume ensures your database files survive even if you delete and recreate the container.

```bash
docker volume create pomodoro-pgdata
```

You can verify the volume was created:

```bash
docker volume ls
# Should show: local   pomodoro-pgdata
```

##### Step 2: Run the PostgreSQL container

```bash
docker run --name pomodoro-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=pomodoro_todo \
  -v pomodoro-pgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  -d postgres:15
```

Flag breakdown:
| Flag | Purpose |
|------|---------|
| `--name pomodoro-postgres` | Names the container for easy reference |
| `-e POSTGRES_USER=postgres` | Sets the database superuser username |
| `-e POSTGRES_PASSWORD=postgres` | Sets the superuser password |
| `-e POSTGRES_DB=pomodoro_todo` | Creates this database on first run |
| `-v pomodoro-pgdata:/var/lib/postgresql/data` | Mounts the named volume for persistent storage |
| `-p 5432:5432` | Maps container port 5432 to host port 5432 |
| `-d postgres:15` | Runs PostgreSQL 15 in detached (background) mode |

##### Step 3: Set your `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pomodoro_todo?schema=public"
```

##### Managing the Docker container

```bash
# Check if the container is running
docker ps

# Stop the container (data is preserved in volume)
docker stop pomodoro-postgres

# Start it again later
docker start pomodoro-postgres

# View container logs
docker logs pomodoro-postgres

# Connect to the database via psql inside the container
docker exec -it pomodoro-postgres psql -U postgres -d pomodoro_todo

# Remove the container (volume and data are preserved)
docker rm -f pomodoro-postgres

# Recreate the container using the same volume (data intact)
docker run --name pomodoro-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=pomodoro_todo \
  -v pomodoro-pgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  -d postgres:15
```

##### Volume management

```bash
# Inspect volume details (see mount point, size, etc.)
docker volume inspect pomodoro-pgdata

# Back up the database to a SQL file
docker exec pomodoro-postgres pg_dump -U postgres pomodoro_todo > backup.sql

# Restore from a backup
docker exec -i pomodoro-postgres psql -U postgres pomodoro_todo < backup.sql

# Delete the volume (WARNING: permanently deletes all database data)
docker volume rm pomodoro-pgdata
```

> **Note:** As long as you use the same volume name (`pomodoro-pgdata`), your data will persist even if you delete and recreate the container. Only `docker volume rm` will delete the actual data.

### Running Migrations

After setting up your database, run Prisma migrations to create the tables:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (creates tables in your database)
npx prisma migrate dev --name init
```

For production deployments:
```bash
npx prisma migrate deploy
```

### Start Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma migrate dev` | Run migrations in development |
| `npx prisma migrate deploy` | Run migrations in production |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Push schema changes without migration |

## Project Structure

```
todo-app/
├── app/                       # Next.js App Router
│   ├── api/                   # API routes
│   │   ├── analytics/         # Analytics endpoints
│   │   ├── goals/             # Goals endpoints
│   │   ├── labels/            # Labels CRUD
│   │   ├── stopwatches/       # Stopwatch endpoints
│   │   ├── streaks/           # Streak calculation
│   │   ├── tasklists/         # Task lists CRUD
│   │   ├── tasks/             # Tasks CRUD
│   │   └── user/              # User endpoints
│   ├── analytics/             # Analytics page
│   ├── calendar/              # Calendar page
│   ├── day/[date]/            # Daily task list page
│   ├── labels/                # Labels management page
│   ├── settings/              # Settings page
│   ├── error.tsx              # Global error page
│   ├── not-found.tsx          # 404 page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Dashboard home page
│   └── globals.css            # Global styles
├── components/
│   ├── analytics/             # Analytics charts & stats
│   ├── calendar/              # Calendar components
│   ├── dashboard/             # Dashboard components
│   ├── goals/                 # Goal dialog & progress
│   ├── labels/                # Label components
│   ├── layout/                # Layout components (sidebar, nav)
│   ├── onboarding/            # User onboarding
│   ├── providers/             # Context providers
│   ├── settings/              # Settings components
│   ├── stopwatch/             # Stopwatch components
│   ├── tasks/                 # Task list & items
│   └── ui/                    # Shadcn UI components
├── lib/
│   ├── context/               # React contexts
│   ├── hooks/                 # Custom React hooks
│   ├── providers/             # Query provider
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utility functions
│   ├── prisma.ts              # Prisma client singleton
│   └── utils.ts               # General utilities
├── prisma/
│   ├── migrations/            # Database migrations
│   └── schema.prisma          # Database schema
├── .env.example               # Environment variables template
└── package.json
```

## Database Schema

The app uses the following data models:

- **User** - Simple username-based identification
- **TaskList** - Daily task lists with weekly/monthly goals
- **Task** - Individual tasks with order and completion status
- **Label** - Custom colored labels for categorization
- **TaskLabel** - Many-to-many relationship between tasks and labels
- **Stopwatch** - Time tracking sessions
- **StopwatchLap** - Individual laps within a session

## Development Phases

This project was built in phases:

- [x] **Phase 1**: Core Setup - Project setup, database, user system
- [x] **Phase 2**: Task Management - CRUD, drag-and-drop, inline editing
- [x] **Phase 3**: Calendar & Navigation - Calendar view, streaks, goals
- [x] **Phase 4**: Time Tracking - Stopwatch, laps, persistence
- [x] **Phase 5**: Labels & Organization - Labels CRUD, task filtering
- [x] **Phase 6**: Analytics - Charts, stats, contribution graph
- [x] **Phase 7**: Polish & Optimization - Settings, toasts, performance

## Screenshots

### Dashboard
The home page shows today's tasks and quick stats.

### Calendar
View your productivity over time with streak tracking.

### Analytics
Detailed insights with charts and GitHub-style contribution graph.

### Task Management
Create, complete, and organize tasks with labels and time tracking.

## Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL is running (`docker ps` if using Docker)
2. Verify your `DATABASE_URL` is correct in `.env`
3. Check that the database exists
4. Try connecting with psql to test credentials:
   ```bash
   # Direct connection
   psql -U postgres -h localhost -d pomodoro_todo
   
   # Or via Docker
   docker exec -it pomodoro-postgres psql -U postgres -d pomodoro_todo
   ```

### Docker Issues

```bash
# Container won't start? Check if port 5432 is already in use
docker logs pomodoro-postgres

# Port conflict - stop other PostgreSQL instances
# Windows
netstat -ano | findstr :5432

# Mac/Linux
lsof -ti:5432

# Verify volume exists
docker volume ls | grep pomodoro

# Full reset (recreate container, keep data)
docker rm -f pomodoro-postgres
docker run --name pomodoro-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=pomodoro_todo \
  -v pomodoro-pgdata:/var/lib/postgresql/data \
  -p 5432:5432 \
  -d postgres:15
```

### Prisma Issues

```bash
# Reset Prisma client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Port Already in Use

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

### Hydration Errors

If you see hydration errors, make sure:
1. Server and client render the same initial content
2. Use `useEffect` with a mounted state for client-only data
3. Check for date/time formatting differences

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
