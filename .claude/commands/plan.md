Plan the implementation of a feature or change: $ARGUMENTS

Before writing any code, produce a structured implementation plan:

## 1. Understand the request
- Clarify what the feature does and its acceptance criteria
- Identify edge cases and constraints

## 2. Identify affected layers
For each layer, list the specific files that need changes:

- **Database**: Prisma schema changes? New models or fields?
- **API**: New or modified routes in `app/api/`? Request/response shapes?
- **Hooks**: New TanStack Query hooks in `lib/hooks/`? Query keys and invalidation?
- **Components**: Which components in `components/` change? New ones needed?
- **Types**: New interfaces in `lib/types/`?

## 3. Define query keys and data flow
- List all new query keys following `["resource", id?, filters?]`
- Map which mutations invalidate which queries
- Identify `staleTime` requirements

## 4. Schema changes (if any)
- Show the Prisma schema diff
- Note migration name: `pnpm prisma migrate dev --name <description>`

## 5. Implementation order
Number the steps in dependency order (schema first, then API, then hooks, then UI).

## 6. Test plan
- Which utility functions need unit tests?
- Which API routes need route tests?
- Any edge cases to cover?

Output the plan in markdown. Do not write any code until the plan is approved.
