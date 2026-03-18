Write tests for: $ARGUMENTS

## Steps

1. **Read the source file** to understand exports, logic branches, and edge cases
2. **Detect the type** of code:
   - Utility function (`lib/utils/*`) -- pure function tests
   - API route (`app/api/*`) -- mock Prisma, test auth/404/success flows
   - Hook (`lib/hooks/*`) -- `renderHook` with QueryClient wrapper
   - Component (`components/*`) -- render tests with testing-library
3. **Create the test file** at the mirror path under `todo-app/test/`
4. **Write tests** covering:
   - Happy path
   - Error/edge cases (empty input, missing auth, not found)
   - Boundary conditions
5. **Run tests**: `cd todo-app && pnpm test`
6. **Fix** any failures until all tests pass

## Mock patterns

**Prisma** (API routes):
```typescript
const mockPrisma = { model: { method: vi.fn() } };
vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));
```

**API route context** (dynamic routes):
```typescript
const ctx = { params: Promise.resolve({ id: "test-id" }) };
```

**NextRequest**:
```typescript
const req = new NextRequest("http://localhost:3000/api/resource", {
  method: "GET",
  headers: { "x-user-id": "user-1" },
});
```

Report: number of tests written, all passing, and any uncovered branches.
