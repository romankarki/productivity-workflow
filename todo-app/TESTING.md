# Testing Guide

## Setup

- **Runner**: [Vitest](https://vitest.dev/) with jsdom environment
- **Config**: `vitest.config.ts` (path alias `@/`, globals, setup file)
- **Setup**: `test/setup.ts` registers jest-dom matchers

## Scripts

```bash
pnpm test            # single run
pnpm test:watch      # watch mode
pnpm test:coverage   # with v8 coverage report
```

Run a specific test file:
```bash
pnpm test test/lib/utils/date.test.ts
```

## Test file location

Tests live in `todo-app/test/` mirroring the source structure:

| Source | Test |
|--------|------|
| `lib/utils/date.ts` | `test/lib/utils/date.test.ts` |
| `lib/utils/streak.ts` | `test/lib/utils/streak.test.ts` |
| `app/api/tasks/[id]/route.ts` | `test/app/api/tasks/route.test.ts` |

## Writing a utility test

```typescript
import { describe, it, expect } from "vitest";
import { formatDate } from "@/lib/utils/date";

describe("formatDate", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(formatDate(new Date(2024, 2, 15))).toBe("2024-03-15");
  });
});
```

## Writing an API route test

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/tasks/[id]/route";

const mockPrisma = {
  task: { findFirst: vi.fn() },
};
vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

describe("GET /api/tasks/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 without x-user-id", async () => {
    const req = new NextRequest("http://localhost:3000/api/tasks/1");
    const res = await GET(req, { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(401);
  });

  it("returns the task on success", async () => {
    mockPrisma.task.findFirst.mockResolvedValue({ id: "1", title: "Test" });
    const req = new NextRequest("http://localhost:3000/api/tasks/1", {
      headers: { "x-user-id": "user-1" },
    });
    const res = await GET(req, { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(200);
  });
});
```

## Mocking patterns

### Prisma
```typescript
const mockPrisma = { model: { method: vi.fn() } };
vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));
```

### Fake timers (date-dependent logic)
```typescript
vi.useFakeTimers();
vi.setSystemTime(new Date(2024, 2, 15));
// ... test ...
vi.useRealTimers();
```

### Fetch
```typescript
globalThis.fetch = vi.fn().mockResolvedValue(
  new Response(JSON.stringify({ data: "test" }))
);
```

### localStorage
```typescript
const store: Record<string, string> = {};
vi.stubGlobal("localStorage", {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, val: string) => { store[key] = val; },
  removeItem: (key: string) => { delete store[key]; },
});
```
