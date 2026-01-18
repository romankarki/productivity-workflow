# Commit Reference Guide

## Quick Reference: All Commits

A complete list of all commits organized by phase for easy tracking.

---

## Phase 1: Core Setup (8 commits)

| # | Commit ID | Description | Key Files |
|---|-----------|-------------|-----------|
| 1.1 | `init-nextjs` | Initialize Next.js with TypeScript | `package.json`, `tsconfig.json` |
| 1.2 | `setup-shadcn` | Configure Shadcn UI | `components.json`, `lib/utils.ts` |
| 1.3 | `add-ui-components` | Install Shadcn components | `components/ui/*` |
| 1.4 | `init-prisma` | Setup Prisma ORM | `prisma/schema.prisma`, `.env` |
| 1.5 | `create-schema` | Define all database models | `prisma/schema.prisma` |
| 1.6 | `prisma-singleton` | Create Prisma client singleton | `lib/prisma.ts` |
| 1.7 | `setup-react-query` | Configure TanStack Query | `lib/providers/query-provider.tsx` |
| 1.8 | `user-onboarding` | Username entry flow | `app/api/user/*`, `components/onboarding/*` |

---

## Phase 2: Task Management (10 commits)

| # | Commit ID | Description | Key Files |
|---|-----------|-------------|-----------|
| 2.1 | `tasklist-api` | TaskList API routes | `app/api/tasklists/*` |
| 2.2 | `task-api` | Task CRUD API routes | `app/api/tasks/*` |
| 2.3 | `task-hooks` | React Query hooks for tasks | `lib/hooks/use-tasks.ts` |
| 2.4 | `day-page-layout` | Day view page structure | `app/day/[date]/page.tsx` |
| 2.5 | `task-item` | Task item component | `components/tasks/task-item.tsx` |
| 2.6 | `task-list` | Task list container | `components/tasks/task-list.tsx` |
| 2.7 | `task-input` | Notion-style input | `components/tasks/task-input.tsx` |
| 2.8 | `day-page-integration` | Wire up day page | `app/day/[date]/page.tsx` |
| 2.9 | `drag-drop` | Task reordering | `components/tasks/task-list.tsx` |
| 2.10 | `dashboard-home` | Home page dashboard | `app/page.tsx` |

---

## Phase 3: Calendar & Navigation (8 commits)

| # | Commit ID | Description | Key Files |
|---|-----------|-------------|-----------|
| 3.1 | `main-nav` | Navigation sidebar/header | `components/layout/sidebar.tsx` |
| 3.2 | `calendar-page` | Calendar page layout | `app/calendar/page.tsx` |
| 3.3 | `calendar-grid` | Month calendar grid | `components/calendar/calendar-grid.tsx` |
| 3.4 | `task-indicators` | Task dots on calendar | `components/calendar/calendar-day.tsx` |
| 3.5 | `streak-logic` | Streak calculation | `lib/utils/streak.ts`, `app/api/streaks/*` |
| 3.6 | `streak-visuals` | Streak display UI | `components/calendar/streak-badge.tsx` |
| 3.7 | `goals-ui` | Weekly/monthly goals | `components/goals/*` |
| 3.8 | `calendar-polish` | Interactions & mobile | `components/calendar/*` |

---

## Phase 4: Time Tracking (9 commits)

| # | Commit ID | Description | Key Files |
|---|-----------|-------------|-----------|
| 4.1 | `stopwatch-api` | Stopwatch API routes | `app/api/stopwatches/*` |
| 4.2 | `stopwatch-hook` | Stopwatch state hook | `lib/hooks/use-stopwatch.ts` |
| 4.3 | `stopwatch-display` | Timer display component | `components/stopwatch/stopwatch-display.tsx` |
| 4.4 | `lap-recording` | Lap management UI | `components/stopwatch/lap-*` |
| 4.5 | `task-stopwatch` | Integrate with task item | `components/tasks/task-item.tsx` |
| 4.6 | `stopwatch-modal` | Full stopwatch modal | `components/stopwatch/stopwatch-modal.tsx` |
| 4.7 | `stopwatch-persist` | Persistence & context | `lib/context/stopwatch-context.tsx` |
| 4.8 | `stopwatch-history` | Session history view | `components/stopwatch/stopwatch-history.tsx` |
| 4.9 | `stopwatch-polish` | UX polish | `components/stopwatch/*` |

---

## Phase 5: Labels & Organization (7 commits)

| # | Commit ID | Description | Key Files |
|---|-----------|-------------|-----------|
| 5.1 | `labels-api` | Labels API routes | `app/api/labels/*` |
| 5.2 | `labels-hooks` | React Query hooks | `lib/hooks/use-labels.ts` |
| 5.3 | `labels-page` | Labels management page | `app/labels/page.tsx` |
| 5.4 | `label-dialog` | Create/edit dialog | `components/labels/label-dialog.tsx` |
| 5.5 | `label-badge` | Label badge component | `components/labels/label-badge.tsx` |
| 5.6 | `task-labels` | Labels on task items | `components/labels/label-selector.tsx` |
| 5.7 | `label-filter` | Task filtering by label | `components/tasks/task-filters.tsx` |

---

## Phase 6: Analytics (8 commits)

| # | Commit ID | Description | Key Files |
|---|-----------|-------------|-----------|
| 6.1 | `analytics-api` | Analytics API & Recharts | `app/api/analytics/*` |
| 6.2 | `analytics-page` | Analytics page layout | `app/analytics/page.tsx` |
| 6.3 | `analytics-hooks` | React Query hooks | `lib/hooks/use-analytics.ts` |
| 6.4 | `weekly-chart` | Weekly time chart | `components/analytics/weekly-chart.tsx` |
| 6.5 | `stats-cards` | Summary stat cards | `components/analytics/stats-card.tsx` |
| 6.6 | `label-pie-chart` | Label breakdown chart | `components/analytics/label-pie-chart.tsx` |
| 6.7 | `label-insights` | Detailed label stats | `components/analytics/label-insights.tsx` |
| 6.8 | `analytics-polish` | Empty states & polish | `components/analytics/*` |

---

## Phase 7: Polish & Optimization (6 commits)

| # | Commit ID | Description | Key Files |
|---|-----------|-------------|-----------|
| 7.1 | `settings-page` | User settings | `app/settings/page.tsx` |
| 7.2 | `toast-notifications` | Toast system | `lib/hooks/use-toast-actions.ts` |
| 7.3 | `loading-error-states` | Loading & errors | `components/ui/error-boundary.tsx` |
| 7.4 | `mobile-polish` | Mobile responsiveness | Various components |
| 7.5 | `performance-opt` | Performance tuning | `next.config.js` |
| 7.6 | `documentation` | README & docs | `README.md`, `.env.example` |

---

## Git Commit Template

Use this template for consistent commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `style`: UI/styling changes
- `refactor`: Code refactoring
- `docs`: Documentation
- `chore`: Maintenance tasks

### Examples

```
feat(tasks): add Notion-style inline task creation

- Always-visible input at bottom of task list
- Enter key creates task and maintains focus
- Escape clears input without creating

Closes #12
```

```
feat(calendar): implement streak tracking

- Calculate consecutive days with completed tasks
- Display current and longest streak
- Visual highlighting for streak days

Closes #23
```

```
fix(stopwatch): handle browser tab switching

- Recover timer state when tab becomes active
- Recalculate elapsed time from startTime
- Prevent duplicate intervals

Fixes #45
```

---

## Branch Naming

```
feature/phase-<N>-<description>
fix/<issue-description>
refactor/<scope>
```

### Examples
- `feature/phase-1-core-setup`
- `feature/phase-2-task-management`
- `fix/stopwatch-persistence`
- `refactor/calendar-components`

---

## Development Workflow

1. **Start phase branch**
   ```bash
   git checkout -b feature/phase-1-core-setup
   ```

2. **Make commits for each item**
   ```bash
   git add .
   git commit -m "feat(setup): initialize Next.js with TypeScript"
   ```

3. **Complete phase, merge to main**
   ```bash
   git checkout main
   git merge feature/phase-1-core-setup
   ```

4. **Tag phase completion**
   ```bash
   git tag -a v0.1.0 -m "Phase 1: Core Setup Complete"
   ```

5. **Start next phase**
   ```bash
   git checkout -b feature/phase-2-task-management
   ```

---

## Version Tags

| Tag | Phase | Description |
|-----|-------|-------------|
| `v0.1.0` | Phase 1 | Core setup complete |
| `v0.2.0` | Phase 2 | Task management |
| `v0.3.0` | Phase 3 | Calendar & navigation |
| `v0.4.0` | Phase 4 | Time tracking |
| `v0.5.0` | Phase 5 | Labels |
| `v0.6.0` | Phase 6 | Analytics |
| `v1.0.0` | Phase 7 | MVP Complete |
