---
description: TypeScript conventions for the productivity-workflow codebase
globs: ["todo-app/**/*.ts", "todo-app/**/*.tsx"]
---

- Never use `any`. Use proper types or `unknown` with a type guard.
- Type all API request bodies with explicit interfaces.
- Scope all Prisma queries to the authenticated user via `taskList.userId` or equivalent join.
- TanStack Query keys follow `["resource", id?, filters?]`. Never use `invalidateQueries({ queryKey: [] })`.
- Use `"use client"` only on components that use browser APIs or React hooks.
- No `console.log` in committed code.
