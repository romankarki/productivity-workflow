---
description: API route conventions
globs: ["todo-app/app/api/**/*.ts"]
---

- Extract `userId` from the `x-user-id` request header. Return 401 if missing.
- Response shape: `{ data }` on success, `{ error: string }` on failure with appropriate HTTP status.
- Verify resource ownership before any mutation: check `task.taskList.userId === userId`.
- Route files: `app/api/[resource]/route.ts` for collections, `app/api/[resource]/[id]/route.ts` for single items.
- Use `NextRequest` and `NextResponse` from `next/server`.
- Dynamic params are async: `{ params }: { params: Promise<{ id: string }> }`.
