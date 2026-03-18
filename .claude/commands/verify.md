Run the full verification pipeline for the productivity-workflow codebase.

Execute these checks sequentially from `todo-app/`:

## 1. Lint
```
cd todo-app && pnpm lint
```

## 2. Type check
```
cd todo-app && npx tsc --noEmit
```

## 3. Tests
```
cd todo-app && pnpm test
```

## 4. Build
```
cd todo-app && pnpm build
```

Report the result of each step as PASS or FAIL. If any step fails, show the relevant error output and suggest a fix. Stop at the first failure unless instructed otherwise.

Summary format:
```
Lint:       PASS/FAIL
TypeCheck:  PASS/FAIL
Tests:      PASS/FAIL (X passed, Y failed)
Build:      PASS/FAIL
```
