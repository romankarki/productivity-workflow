Review the current changes against the project conventions for `$ARGUMENTS`.

Run `cd todo-app && git diff` to see staged and unstaged changes, then check each item:

## TypeScript
- [ ] No `any` types -- use proper types or `unknown` with a type guard
- [ ] API request bodies are typed
- [ ] No unnecessary type assertions

## Styling
- [ ] Uses semantic tokens (`bg-card`, `text-foreground`, `border-border`) -- no hardcoded colors
- [ ] Card/surface styles match CLAUDE.md patterns
- [ ] No glassmorphism or decorative blur blobs
- [ ] Buttons use approved Shadcn variants
- [ ] Transitions use correct duration tiers (700/500/300)

## API routes
- [ ] Reads `userId` from `x-user-id` header
- [ ] Returns `{ data }` on success, `{ error }` on failure
- [ ] Verifies resource ownership via `taskList.userId`
- [ ] No `console.log` in committed code

## Data fetching
- [ ] Query keys follow `["resource", id?, filters?]` pattern
- [ ] Mutations invalidate specific query keys (not all)
- [ ] `staleTime` is set appropriately

## General
- [ ] No emojis in code or comments
- [ ] No unnecessary comments or docstrings
- [ ] No backwards-compatibility shims
- [ ] No over-engineering or premature abstractions

Report findings as a checklist with pass/fail for each item. Suggest specific fixes for any failures.
