---
description: Testing conventions for vitest tests
globs: ["todo-app/test/**/*.test.ts", "todo-app/test/**/*.test.tsx"]
---

- Test runner: Vitest with globals enabled (`describe`, `it`, `expect` are global).
- Test files live in `todo-app/test/` mirroring the source structure.
- Name test files `<source-name>.test.ts`.
- Mock Prisma: `vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }))` with individual method mocks.
- API route tests: construct `NextRequest` and pass `{ params: Promise.resolve({ id }) }`.
- Call `vi.clearAllMocks()` in `beforeEach` to prevent state leakage.
- Use `vi.useFakeTimers()` + `vi.setSystemTime()` for date-dependent tests; restore with `vi.useRealTimers()` in `afterEach`.
- Test auth (401), not-found (404), and success paths for every API route handler.
- Do not test implementation details -- test inputs and outputs.
