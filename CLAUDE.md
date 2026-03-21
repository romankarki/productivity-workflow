# CLAUDE.md — Productivity Workflow

## Environment assumptions

- **Package manager**: `pnpm` exclusively. Never use `npm` or `yarn`.
- **Dev server**: always running at `http://localhost:3000`. Do not start or restart it.
- **Database**: PostgreSQL Docker container (`pomodoro-postgres`) is always up. Do not start or restart it.
- **App directory**: all source lives in `todo-app/`. Run all commands from there unless stated otherwise.

```bash
cd todo-app
pnpm dev          # dev server (already running)
pnpm build        # production build
pnpm lint         # ESLint
pnpm prisma generate          # regenerate Prisma client after schema changes
pnpm prisma migrate dev       # run new migrations
pnpm prisma studio            # database GUI
```

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16, App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + Shadcn UI |
| State / data fetching | TanStack Query v5 |
| Database | PostgreSQL 15 (Docker) |
| ORM | Prisma 5 |
| Charts | Recharts |

---

## Project structure

```
todo-app/
├── app/
│   ├── api/                   # Route handlers — one file per resource
│   ├── (pages)/               # Page components
│   ├── globals.css            # CSS custom properties + theme classes
│   └── layout.tsx
├── components/
│   ├── ui/                    # Shadcn primitives — do not modify
│   ├── layout/                # Sidebar, mobile nav
│   ├── tasks/                 # Task list, task item, focus mode
│   ├── stopwatch/             # Timer components
│   ├── analytics/             # Charts and stats
│   ├── calendar/
│   ├── labels/
│   ├── settings/
│   └── dashboard/
├── lib/
│   ├── context/               # React contexts (stopwatch, etc.)
│   ├── hooks/                 # Custom hooks — use-[feature].ts
│   ├── types/                 # TypeScript interfaces
│   └── utils.ts
└── prisma/
    └── schema.prisma
```

---

## Themes

Four themes are defined as CSS class names on `<html>`. All use Tailwind semantic tokens — never hardcode colors that would break across themes.

| Class | Description |
|-------|-------------|
| `:root` (no class) | Light |
| `.dark` | Dark (default) |
| `.pitch-black` | OLED black |
| `.monokai` | Monokai warm |

Every theme exposes the same CSS custom properties: `--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--muted-foreground`, `--border`, `--destructive`, `--accent`, `--ring`, plus chart and sidebar variants.

**Rule**: use semantic tokens (`bg-card`, `text-foreground`, `border-border`, `text-muted-foreground`, `text-primary`, `text-destructive`) so components render correctly in all four themes without conditional logic.

---

## Design language

### Surfaces and cards

```
Standard card:       rounded-xl border border-border/40 bg-card/50
Task row:            rounded-lg border border-border/20 bg-card/60
Section container:   rounded-xl border border-border/30 bg-muted/20
Sidebar:             border-r border-border/40 bg-card/50 backdrop-blur-xl
Focus mode surface:  bg-zinc-950 border border-zinc-800/60 rounded-2xl
```

No glassmorphism. No `ring-white/*` halos. No decorative blur blobs (`absolute rounded-full blur-3xl`). No heavy `shadow-[0_20px_60px...]` unless it is the only way to separate a floating element.

### Typography

```
Section label:   text-[11px] font-semibold uppercase tracking-widest text-muted-foreground
Body text:       text-sm text-foreground
Dim / secondary: text-sm text-muted-foreground
Timer display:   font-mono tabular-nums leading-none tracking-tight (weight varies by context)
```

### Spacing rhythm

- Card internal padding: `p-4` or `p-3` — not `p-6`/`p-8` unless the component is a full-page panel.
- Gap between stacked items: `gap-1.5` or `gap-2`.
- Section gaps: `space-y-1.5` inside groups, `space-y-5` between groups.

### Buttons

Use Shadcn `Button` with these variants. Do not invent new large solid-color pill buttons.

| State | Style |
|-------|-------|
| Primary action | `variant="default"` or `size="sm"` outline with tinted bg |
| Running (timer) | `border-yellow-500/30 bg-yellow-500/10 text-yellow-400` |
| Start / resume | `border-primary/30 bg-primary/10 text-primary` |
| Stop | `border-destructive/30 bg-destructive/10 text-destructive/80` |
| Ghost / icon | `variant="ghost" size="icon"` |

Circular controls (focus mode only): `h-16 w-16 rounded-full` with tinted backgrounds.

### State colors (consistent across all themes)

```
Running:   text-primary  (theme-aware)
Paused:    text-amber-400 / text-amber-300
Stopped:   text-muted-foreground/50  or  text-zinc-700
Success:   text-emerald-400 / text-emerald-500
Error:     text-destructive
```

### Transitions

```
Color change (slow):  transition-colors duration-700 ease-in-out   (timer text)
Color change (medium):transition-colors duration-500 ease-in-out   (status labels)
Interactive (fast):   transition-all duration-300                  (buttons, badges)
```

---

## API conventions

- Authentication: every API route reads `userId` from the `x-user-id` request header.
- Route files: `app/api/[resource]/route.ts` for collections, `app/api/[resource]/[id]/route.ts` for single items.
- Response shape: `{ data }` on success, `{ error: string }` on failure with the appropriate HTTP status.
- Prisma: always verify resource ownership before mutation (check `task.taskList.userId === userId`).

## Data fetching conventions

- All server state lives in TanStack Query.
- Query keys follow the pattern `["resource", id?, filters?]`.
- Mutations invalidate their own query key and any parent query keys they affect.
- `staleTime` default: 30 seconds for frequently updated data, 5 minutes for mostly static data.

---

## Testing policy

- **Do NOT create, modify, or delete test files** (`todo-app/test/**`) during feature development or bug fix tasks.
- Tests are user-managed. Only touch test files when the user **explicitly** asks for test work (e.g., "write tests for X", "update the tests", "fix the failing test").
- Running `pnpm test` to verify nothing is broken is fine — just don't write or edit test code unless asked.

---

## Code style rules

- No emojis in code or comments unless the user explicitly asks.
- No excessive comments. Only comment when the logic is genuinely non-obvious; do not comment what the code already says.
- No docstrings on internal functions.
- No backwards-compatibility shims for removed code.
- Prefer editing existing files over creating new ones.
- Do not add error handling, fallbacks, or validation for scenarios that cannot happen.
- `"use client"` only on components that use browser APIs or React hooks — API routes and server components do not need it.
- TypeScript: no `any`. Use proper types or `unknown` with a guard.

---

## Stopwatch data model (reference)

```
Stopwatch
  isActive: true            → running
  isActive: false, endTime: null  → paused
  isActive: false, endTime: set   → stopped (completed)
  totalDuration             → milliseconds accumulated (excludes live portion when active)
```

The live elapsed time for an active session is `totalDuration + (Date.now() - startTime)`.

The `GET /api/stopwatches` endpoint returns the current session if `endTime: null` (running or paused). Today's total = completed sessions (from `/api/stopwatches/today`) + `elapsedTime` from context.
