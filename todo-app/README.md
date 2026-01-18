# Pomodoro Todo App

A productivity application for task management with Pomodoro-style time tracking, custom labels, calendar streaks, and analytics.

## Features

- 📝 **Task Management** - Daily task lists with Notion-style inline editing
- ⏱️ **Time Tracking** - Pomodoro-style stopwatch with lap recording
- 🏷️ **Custom Labels** - Categorize tasks with colored labels
- 📅 **Calendar View** - Visual calendar with streak tracking
- 📊 **Analytics** - Weekly/monthly insights and time breakdown
- 🌙 **Dark Mode** - Beautiful dark theme by default

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: TanStack Query (React Query)
- **Database**: PostgreSQL
- **ORM**: Prisma

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or remote)
- npm or yarn

### Installation

1. **Clone the repository** (if not already done)

2. **Install dependencies**
   ```bash
   cd todo-app
   npm install
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

#### Option 2: Docker

```bash
docker run --name pomodoro-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=pomodoro_todo \
  -p 5432:5432 \
  -d postgres:15
```

Then set your `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pomodoro_todo?schema=public"
```

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
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── user/          # User API endpoints
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Shadcn UI components
│   └── onboarding/        # Onboarding components
├── lib/
│   ├── hooks/             # Custom React hooks
│   ├── providers/         # Context providers
│   ├── types/             # TypeScript types
│   ├── prisma.ts          # Prisma client singleton
│   └── utils.ts           # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
├── .env.example           # Environment variables template
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

This project is being built in phases:

- [x] **Phase 1**: Core Setup (Current)
- [ ] **Phase 2**: Task Management
- [ ] **Phase 3**: Calendar & Navigation
- [ ] **Phase 4**: Time Tracking
- [ ] **Phase 5**: Labels & Organization
- [ ] **Phase 6**: Analytics
- [ ] **Phase 7**: Polish & Optimization

## Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL is running
2. Verify your DATABASE_URL is correct
3. Check that the database exists
4. Try connecting with psql to test credentials

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

## License

MIT
