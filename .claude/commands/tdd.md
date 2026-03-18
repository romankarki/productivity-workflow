You are working in TDD mode for the productivity-workflow codebase.

Follow this strict red-green-refactor cycle:

## 1. RED: Write a failing test first

- Create or update a test file in `todo-app/test/` mirroring the source path
- Write a test that describes the expected behavior of `$ARGUMENTS`
- Run `cd todo-app && pnpm test` to confirm the test fails
- If the test passes already, the behavior exists -- skip to the next case

## 2. GREEN: Write the minimum code to pass

- Implement only enough code to make the failing test pass
- Do not add extra logic, error handling, or features beyond what the test requires
- Run `cd todo-app && pnpm test` to confirm all tests pass

## 3. REFACTOR: Clean up while green

- Improve naming, reduce duplication, simplify logic
- Run tests again after every change to ensure nothing breaks
- Follow project conventions: no `any`, semantic color tokens, Prisma scoped to userId

## Conventions

- Test runner: Vitest with globals (`describe`, `it`, `expect` are global)
- Test location: `todo-app/test/` mirrors `todo-app/` source structure
- Mock Prisma: `vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }))`
- API route tests: use `NextRequest` + pass `{ params: Promise.resolve({ id }) }` as context
- Utility tests: import directly from `@/lib/utils/*`

After each cycle, report: which test was added, what code changed, and whether all tests pass.
