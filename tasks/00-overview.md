# Pomodoro Todo App - Development Plan Overview

## Project Summary
A Pomodoro-style todo application with task management, time tracking, custom labels, calendar streaks, and analytics dashboard.

## Tech Stack
- **Framework**: Next.js 14+ with TypeScript (App Router)
- **Styling**: Shadcn UI + Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Theme**: Dark mode default

## Development Phases

| Phase | Focus Area | Estimated Commits |
|-------|-----------|-------------------|
| 1 | Core Setup | 8 commits |
| 2 | Task Management | 10 commits |
| 3 | Calendar & Navigation | 8 commits |
| 4 | Time Tracking | 9 commits |
| 5 | Labels & Organization | 7 commits |
| 6 | Analytics | 8 commits |
| 7 | Polish & Optimization | 6 commits |

**Total: ~56 commits**

## File Structure Overview

```
app/
├── (root)/
│   ├── page.tsx                 # Dashboard/home
│   ├── calendar/page.tsx        # Full calendar view
│   ├── day/[date]/page.tsx      # Daily task list
│   ├── analytics/page.tsx       # Analytics dashboard
│   ├── labels/page.tsx          # Label management
│   └── settings/page.tsx        # User settings
├── api/
│   ├── user/
│   ├── tasklists/
│   ├── tasks/
│   ├── labels/
│   ├── stopwatches/
│   └── analytics/
├── layout.tsx
└── globals.css

components/
├── ui/                          # Shadcn components
├── calendar/
├── tasks/
├── stopwatch/
├── labels/
├── analytics/
└── layout/

lib/
├── prisma.ts
├── utils.ts
├── hooks/
└── types/

prisma/
├── schema.prisma
└── migrations/
```

## Planning Documents

1. **[01-phase-1-core-setup.md](./01-phase-1-core-setup.md)** - Project initialization, Prisma, auth
2. **[02-phase-2-task-management.md](./02-phase-2-task-management.md)** - Tasks CRUD, Notion-style UI
3. **[03-phase-3-calendar-navigation.md](./03-phase-3-calendar-navigation.md)** - Calendar, streaks, goals
4. **[04-phase-4-time-tracking.md](./04-phase-4-time-tracking.md)** - Stopwatch, laps, persistence
5. **[05-phase-5-labels-organization.md](./05-phase-5-labels-organization.md)** - Labels system
6. **[06-phase-6-analytics.md](./06-phase-6-analytics.md)** - Charts, insights
7. **[07-phase-7-polish-optimization.md](./07-phase-7-polish-optimization.md)** - Performance, mobile, UX

## Branching Strategy

```
main
├── feature/phase-1-core-setup
│   ├── commit: init-nextjs-project
│   ├── commit: setup-shadcn-tailwind
│   └── ...
├── feature/phase-2-task-management
│   ├── commit: task-api-routes
│   └── ...
└── ...
```

## Getting Started

1. Read through each phase document in order
2. Each commit is designed to be self-contained and testable
3. Commits build upon each other - maintain order within phases
4. Test after each commit before proceeding
