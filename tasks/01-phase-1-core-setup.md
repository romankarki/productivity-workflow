# Phase 1: Core Setup

## Overview
Initialize the project with all necessary tooling, database schema, and basic user onboarding.

---

## Commit 1.1: Initialize Next.js Project with TypeScript

### Description
Create a new Next.js 14+ project with TypeScript and App Router.

### Commands
```bash
npx create-next-app@latest productivity-workflow --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

### Files Created
- `package.json`
- `tsconfig.json`
- `next.config.js`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `tailwind.config.ts`
- `.gitignore`
- `.eslintrc.json`

### Acceptance Criteria
- [ ] Project runs with `npm run dev`
- [ ] TypeScript compiles without errors
- [ ] Tailwind CSS works

---

## Commit 1.2: Setup Shadcn UI

### Description
Initialize Shadcn UI with dark theme configuration.

### Commands
```bash
npx shadcn@latest init
```

### Configuration Choices
- Style: Default
- Base color: Slate
- CSS variables: Yes

### Files Created/Modified
- `components.json`
- `lib/utils.ts`
- `app/globals.css` (updated with CSS variables)
- `tailwind.config.ts` (updated)

### Acceptance Criteria
- [ ] Shadcn CLI configured
- [ ] Dark theme CSS variables in place
- [ ] Utils file created with `cn()` function

---

## Commit 1.3: Install Core Shadcn Components

### Description
Add essential Shadcn UI components that will be used throughout the app.

### Commands
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add popover
npx shadcn@latest add calendar
npx shadcn@latest add toast
npx shadcn@latest add skeleton
npx shadcn@latest add scroll-area
npx shadcn@latest add separator
npx shadcn@latest add tooltip
npx shadcn@latest add progress
```

### Files Created
- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/card.tsx`
- `components/ui/badge.tsx`
- `components/ui/dialog.tsx`
- `components/ui/dropdown-menu.tsx`
- `components/ui/popover.tsx`
- `components/ui/calendar.tsx`
- `components/ui/toast.tsx`
- `components/ui/toaster.tsx`
- `components/ui/use-toast.ts`
- `components/ui/skeleton.tsx`
- `components/ui/scroll-area.tsx`
- `components/ui/separator.tsx`
- `components/ui/tooltip.tsx`
- `components/ui/progress.tsx`

### Acceptance Criteria
- [ ] All components import without errors
- [ ] Components render correctly in dark mode

---

## Commit 1.4: Setup Prisma ORM

### Description
Initialize Prisma with PostgreSQL configuration.

### Commands
```bash
npm install prisma @prisma/client
npx prisma init
```

### Files Created
- `prisma/schema.prisma`
- `.env` (with DATABASE_URL placeholder)
- `.env.example` (template without secrets)

### Initial Schema Content
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Acceptance Criteria
- [ ] Prisma initialized
- [ ] `.env` file with DATABASE_URL
- [ ] `.env.example` created for documentation

---

## Commit 1.5: Create Prisma Schema - All Models

### Description
Define complete database schema with all models and relationships.

### Files Modified
- `prisma/schema.prisma`

### Schema Content
```prisma
model User {
  id        String     @id @default(cuid())
  username  String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
  taskLists TaskList[]
  labels    Label[]
}

model TaskList {
  id          String   @id @default(cuid())
  userId      String
  date        DateTime @db.Date
  weeklyGoal  Int?
  monthlyGoal Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user  User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks Task[]
  
  @@unique([userId, date])
}

model Task {
  id          String   @id @default(cuid())
  taskListId  String
  title       String
  description String?
  completed   Boolean  @default(false)
  order       Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  taskList   TaskList    @relation(fields: [taskListId], references: [id], onDelete: Cascade)
  labels     TaskLabel[]
  stopwatches Stopwatch[]
}

model Label {
  id        String   @id @default(cuid())
  userId    String
  name      String
  color     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  taskLabels    TaskLabel[]
  stopwatchLaps StopwatchLap[]
  
  @@unique([userId, name])
}

model TaskLabel {
  id      String @id @default(cuid())
  taskId  String
  labelId String
  
  task  Task  @relation(fields: [taskId], references: [id], onDelete: Cascade)
  label Label @relation(fields: [labelId], references: [id], onDelete: Cascade)
  
  @@unique([taskId, labelId])
}

model Stopwatch {
  id            String    @id @default(cuid())
  taskId        String
  startTime     DateTime
  endTime       DateTime?
  totalDuration Int       @default(0) // milliseconds
  isActive      Boolean   @default(false)
  createdAt     DateTime  @default(now())
  
  task Task           @relation(fields: [taskId], references: [id], onDelete: Cascade)
  laps StopwatchLap[]
}

model StopwatchLap {
  id          String   @id @default(cuid())
  stopwatchId String
  labelId     String?
  startTime   DateTime
  endTime     DateTime
  duration    Int      // milliseconds
  lapNumber   Int
  createdAt   DateTime @default(now())
  
  stopwatch Stopwatch @relation(fields: [stopwatchId], references: [id], onDelete: Cascade)
  label     Label?    @relation(fields: [labelId], references: [id], onDelete: SetNull)
}
```

### Acceptance Criteria
- [ ] All models defined with correct relationships
- [ ] Foreign keys and cascading deletes configured
- [ ] Unique constraints in place

---

## Commit 1.6: Setup Prisma Client Singleton

### Description
Create Prisma client instance with proper singleton pattern for development.

### Files Created
- `lib/prisma.ts`

### Code
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### Acceptance Criteria
- [ ] Prisma client singleton created
- [ ] No multiple instances in development

---

## Commit 1.7: Setup TanStack Query (React Query)

### Description
Configure React Query with provider and devtools.

### Commands
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### Files Created
- `lib/providers/query-provider.tsx`

### Files Modified
- `app/layout.tsx`

### Code for Provider
```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### Acceptance Criteria
- [ ] React Query provider wraps app
- [ ] DevTools visible in development
- [ ] Default options configured

---

## Commit 1.8: Create User Onboarding - API & UI

### Description
Implement simple username entry flow with local storage persistence.

### Files Created
- `app/api/user/route.ts`
- `lib/hooks/use-user.ts`
- `components/onboarding/username-dialog.tsx`
- `lib/types/user.ts`

### API Route (`app/api/user/route.ts`)
```typescript
// GET - Get or create user from session
// POST - Create/update username
```

### Custom Hook (`lib/hooks/use-user.ts`)
```typescript
// useUser hook with React Query
// - Check localStorage for userId
// - Fetch user data if exists
// - Handle username creation/update
```

### Onboarding Dialog
- Full-screen dialog on first visit
- Username input with validation
- Submit saves to database and localStorage
- Minimal, clean dark UI

### Files Modified
- `app/layout.tsx` - Add onboarding check
- `app/page.tsx` - Basic dashboard placeholder

### Acceptance Criteria
- [ ] First-time users see username prompt
- [ ] Username saves to database
- [ ] userId persists in localStorage
- [ ] Returning users bypass onboarding
- [ ] Users can access settings to change username

---

## Phase 1 Checklist

- [ ] Commit 1.1: Next.js initialized
- [ ] Commit 1.2: Shadcn configured
- [ ] Commit 1.3: UI components installed
- [ ] Commit 1.4: Prisma initialized
- [ ] Commit 1.5: Database schema complete
- [ ] Commit 1.6: Prisma client singleton
- [ ] Commit 1.7: React Query configured
- [ ] Commit 1.8: User onboarding working

## Next Phase
Proceed to [Phase 2: Task Management](./02-phase-2-task-management.md)
