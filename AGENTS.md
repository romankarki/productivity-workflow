# AGENT.md — Agentic task instructions

All rules in `CLAUDE.md` apply. This file adds guidance for multi-step agentic tasks.

---

## Before writing any code

1. Read the relevant existing files first. Understand the pattern before adding to it.
2. Identify which theme tokens are in use and confirm the change will work across all four themes (`light`, `dark`, `pitch-black`, `monokai`).
3. If the task touches the API layer, confirm the Prisma schema supports it before writing route code.
4. If adding a new query, define the query key and decide what invalidates it before writing the hook.

---

## File creation rules

- Do not create a new component file if the change fits cleanly inside an existing one.
- Do not create a new hook if the logic can be added to an existing hook without making it unwieldy.
- New API routes go in `app/api/[resource]/` — never inline fetch logic inside components.
- New hooks go in `lib/hooks/use-[feature].ts`.
- New types go in `lib/types/[feature].ts`.

---

## Design drift prevention

When adding any UI, verify each of these before finishing:

- [ ] Uses semantic color tokens, not hardcoded hex or raw Tailwind palette colors (except `zinc-*` in focus-mode surfaces, which is intentional).
- [ ] Card/container styling matches the standard surface patterns in `CLAUDE.md`.
- [ ] No glassmorphism introduced (`backdrop-blur` on sidebar/navbar is acceptable; on card content is not).
- [ ] Buttons use the approved variant + size table from `CLAUDE.md`.
- [ ] Text sizes, weights, and tracking follow the typography scale.
- [ ] State colors (running, paused, stopped, success, error) use the consistent palette.
- [ ] Transitions use the correct duration tier (700 for slow color, 500 for medium, 300 for interactive).
- [ ] No emojis, no decorative comments.

---

## Stopwatch / timer work

- Timer font in focus mode: `font-mono tabular-nums font-thin` — do not revert to serif or italic.
- Always use `transition-colors duration-700` on timer text color.
- Crossfade icons (Play/Pause) using overlaid `absolute` elements with opacity + scale transitions — do not hard-swap.
- The sidebar "Today" widget must always show `completedTotal + elapsedTime` (never gated on `isActive`).
- Paused sessions must remain in the active stopwatch context (query by `endTime: null`, not `isActive: true`).

---

## Database / Prisma

- Docker container `pomodoro-postgres` is always running. Do not include start instructions.
- After schema changes: `pnpm prisma generate` then `pnpm prisma migrate dev --name <description>`.
- Always scope queries to the authenticated user via `task.taskList.userId` or equivalent join.
- `totalDuration` is stored in **milliseconds** as an `Int`.

---

## Query / mutation patterns

```typescript
// Standard query
useQuery({
  queryKey: ["resource", id],
  queryFn: () => fetchResource(id),
  staleTime: 30 * 1000,
})

// Mutation with targeted invalidation
useMutation({
  mutationFn: updateResource,
  onSuccess: (data) => {
    queryClient.setQueryData(["resource", id], data)
    queryClient.invalidateQueries({ queryKey: ["parent-resource"] })
  },
})
```

Do not use `invalidateQueries({ queryKey: [] })` (invalidates everything). Always be specific.

---

## What not to do

- Do not run `pnpm install` unless a package is genuinely missing.
- Do not run `pnpm dev` or restart any server.
- Do not run `prisma migrate reset` — it destroys data.
- Do not add `console.log` statements to committed code.
- Do not use `any` in TypeScript.
- Do not add fallback UI for impossible states.
- Do not write comments explaining what a line of code does — only why, and only when non-obvious.
- Do not use emojis anywhere in code, comments, or commit messages unless explicitly requested.
- Do not create abstraction layers (helpers, wrappers, HOCs) for one-off use.

---

## Testing conventions

- **Runner**: Vitest with globals enabled. Config at `todo-app/vitest.config.ts`.
- **Test location**: `todo-app/test/` mirrors the source tree (e.g., `lib/utils/date.ts` -> `test/lib/utils/date.test.ts`).
- **Scripts**: `pnpm test` (single run), `pnpm test:watch` (watch mode), `pnpm test:coverage` (with v8 coverage).
- **Mock Prisma**: `vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }))` where `mockPrisma` has `vi.fn()` stubs for each model method.
- **API route tests**: construct `NextRequest`, pass `{ params: Promise.resolve({ id }) }` as route context, assert status codes and JSON bodies.
- **Date-dependent tests**: use `vi.useFakeTimers()` + `vi.setSystemTime()`, restore in `afterEach`.
- **What to test**: utility functions (pure logic), API routes (auth, not-found, success), hooks (with `renderHook` + QueryClient wrapper).
- **What not to test**: Shadcn UI primitives, third-party library internals, trivial pass-through components.
