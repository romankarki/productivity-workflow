# Phase 2: Task Management

## Overview
Build the core task management system with CRUD operations and Notion-style inline editing.

---

## Commit 2.1: Create TaskList API Routes

### Description
Implement API endpoints for task list operations.

### Files Created
- `app/api/tasklists/route.ts`
- `app/api/tasklists/[date]/route.ts`
- `app/api/tasklists/[id]/route.ts`

### Endpoints

#### `GET /api/tasklists`
- Returns all task lists for current user
- Include task count for each list
- Query params: `month`, `year` for filtering

#### `GET /api/tasklists/[date]`
- Returns task list for specific date (YYYY-MM-DD format)
- Creates empty task list if none exists
- Include all tasks with labels

#### `POST /api/tasklists`
- Create new task list for a date
- Body: `{ date: string, weeklyGoal?: number, monthlyGoal?: number }`

#### `PUT /api/tasklists/[id]`
- Update task list goals
- Body: `{ weeklyGoal?: number, monthlyGoal?: number }`

### Acceptance Criteria
- [ ] All CRUD operations work
- [ ] Date validation in place
- [ ] Proper error responses
- [ ] User scoping enforced

---

## Commit 2.2: Create Task API Routes

### Description
Implement API endpoints for individual task operations.

### Files Created
- `app/api/tasklists/[taskListId]/tasks/route.ts`
- `app/api/tasks/[id]/route.ts`
- `app/api/tasks/[id]/order/route.ts`

### Endpoints

#### `POST /api/tasklists/[taskListId]/tasks`
- Create new task in task list
- Auto-assign next order number
- Body: `{ title: string, description?: string }`

#### `PUT /api/tasks/[id]`
- Update task title, description, or completed status
- Body: `{ title?: string, description?: string, completed?: boolean }`

#### `DELETE /api/tasks/[id]`
- Delete task
- Cascade delete stopwatches and labels

#### `PATCH /api/tasks/[id]/order`
- Update task order for reordering
- Body: `{ order: number }`

### Acceptance Criteria
- [ ] Tasks create with auto-incrementing order
- [ ] Updates work for all fields
- [ ] Delete properly cascades
- [ ] Order updates work correctly

---

## Commit 2.3: Create Task React Query Hooks

### Description
Build custom hooks for task data fetching and mutations.

### Files Created
- `lib/hooks/use-tasklist.ts`
- `lib/hooks/use-tasks.ts`
- `lib/types/task.ts`

### Hook: `useTaskList(date: string)`
```typescript
// Fetch task list for specific date
// Returns: { taskList, tasks, isLoading, error }
```

### Hook: `useTaskLists(month: number, year: number)`
```typescript
// Fetch all task lists for a month
// Used by calendar view
```

### Hook: `useCreateTask()`
```typescript
// Mutation hook for creating tasks
// Optimistic updates
// Invalidates task list query on success
```

### Hook: `useUpdateTask()`
```typescript
// Mutation hook for updating tasks
// Optimistic updates for completed toggle
```

### Hook: `useDeleteTask()`
```typescript
// Mutation hook for deleting tasks
// Optimistic removal from list
```

### Acceptance Criteria
- [ ] All hooks typed correctly
- [ ] Optimistic updates work
- [ ] Cache invalidation proper
- [ ] Error handling in place

---

## Commit 2.4: Create Day View Page Layout

### Description
Build the daily task list page structure.

### Files Created
- `app/day/[date]/page.tsx`
- `app/day/[date]/loading.tsx`
- `components/tasks/day-header.tsx`

### Page Structure
```
┌─────────────────────────────────────┐
│  ← Back    March 15, 2024    Goals  │
├─────────────────────────────────────┤
│                                     │
│  Task List Area                     │
│                                     │
│                                     │
│  [+ Add task input at bottom]       │
│                                     │
└─────────────────────────────────────┘
```

### Day Header Component
- Navigation back button
- Formatted date display (e.g., "Saturday, March 15, 2024")
- Goals indicator (weekly/monthly progress)
- Navigation to prev/next day

### Acceptance Criteria
- [ ] Dynamic route works with date param
- [ ] Loading state with skeleton
- [ ] Header shows correct date
- [ ] Navigation works

---

## Commit 2.5: Create Task Item Component

### Description
Build the individual task row component with inline editing.

### Files Created
- `components/tasks/task-item.tsx`
- `components/tasks/task-checkbox.tsx`

### Task Item Features
- Checkbox for completion (animated)
- Task title display
- Inline edit on click
- Delete button (appears on hover)
- Stopwatch indicator (time tracked)
- Labels badges display
- Smooth hover states

### Visual States
- Default: Clean, minimal row
- Hover: Show action buttons
- Editing: Input field replaces title
- Completed: Strikethrough + muted opacity
- With timer: Subtle glow/indicator

### Code Structure
```typescript
interface TaskItemProps {
  task: Task
  onUpdate: (data: Partial<Task>) => void
  onDelete: () => void
  onStartTimer: () => void
}
```

### Acceptance Criteria
- [ ] Checkbox toggles completion
- [ ] Inline edit works (Enter saves, Escape cancels)
- [ ] Delete removes task
- [ ] Completed tasks show visual distinction
- [ ] Smooth transitions

---

## Commit 2.6: Create Task List Component

### Description
Build the container component that renders all tasks.

### Files Created
- `components/tasks/task-list.tsx`

### Features
- Renders list of TaskItem components
- Sorted by order field
- Empty state message
- Scroll area for long lists
- Loading skeletons

### Code Structure
```typescript
interface TaskListProps {
  tasks: Task[]
  taskListId: string
  isLoading: boolean
}
```

### Acceptance Criteria
- [ ] Tasks render in correct order
- [ ] Empty state shows helpful message
- [ ] Loading shows skeleton items
- [ ] Smooth animations on add/remove

---

## Commit 2.7: Create Notion-Style Task Input

### Description
Build the always-visible task input at bottom of list.

### Files Created
- `components/tasks/task-input.tsx`

### Features
- Always visible at list bottom
- Placeholder: "Add a task..."
- Enter key creates task immediately
- Input clears but keeps focus after creation
- Escape clears input
- Subtle + icon on left
- Loading state while creating

### Behavior Flow
1. User clicks input or starts typing
2. Input expands slightly (visual feedback)
3. User types task title
4. Press Enter → Task created, input clears, focus stays
5. Press Escape → Input clears
6. Can rapidly add multiple tasks

### Code Structure
```typescript
interface TaskInputProps {
  taskListId: string
  onTaskCreated?: (task: Task) => void
}
```

### Acceptance Criteria
- [ ] Input always visible
- [ ] Enter creates task instantly
- [ ] Focus maintained after creation
- [ ] Escape clears without creating
- [ ] Loading indicator during API call
- [ ] Works with keyboard only

---

## Commit 2.8: Integrate Task Components on Day Page

### Description
Wire up all task components on the day view page.

### Files Modified
- `app/day/[date]/page.tsx`

### Integration
- Fetch task list with hook
- Render TaskList component
- Render TaskInput at bottom
- Handle all mutations
- Show loading/error states
- Add toast notifications for actions

### Acceptance Criteria
- [ ] Full CRUD operations work on page
- [ ] Data persists to database
- [ ] Optimistic updates feel instant
- [ ] Error states handled gracefully
- [ ] Toast notifications on actions

---

## Commit 2.9: Add Drag-and-Drop Reordering

### Description
Implement drag-and-drop task reordering.

### Commands
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Files Modified
- `components/tasks/task-list.tsx`
- `components/tasks/task-item.tsx`

### Features
- Drag handle on left of task
- Smooth drag animation
- Drop indicator
- Order persists to database
- Optimistic reorder

### Acceptance Criteria
- [ ] Tasks can be dragged to reorder
- [ ] Visual feedback during drag
- [ ] Order saves to database
- [ ] Works on touch devices

---

## Commit 2.10: Create Dashboard Home Page

### Description
Build the home page with today's tasks quick view.

### Files Modified
- `app/page.tsx`

### Files Created
- `components/dashboard/today-summary.tsx`
- `components/dashboard/quick-stats.tsx`

### Dashboard Layout
```
┌─────────────────────────────────────────────────────┐
│  Welcome back, [Username]!                          │
│  Today is Saturday, March 15, 2024                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │ Today's Tasks   │  │ Quick Stats             │  │
│  │ ☐ Task 1        │  │ 🔥 5 day streak         │  │
│  │ ☑ Task 2        │  │ ✓ 12 tasks this week    │  │
│  │ ☐ Task 3        │  │ ⏱ 4h 30m tracked        │  │
│  │ [+ Add task]    │  └─────────────────────────┘  │
│  └─────────────────┘                               │
│                                                     │
│  [View Calendar]  [View Analytics]                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Acceptance Criteria
- [ ] Shows today's task list
- [ ] Quick add task works
- [ ] Stats display (placeholder data ok for now)
- [ ] Navigation links to other pages
- [ ] Personalized greeting with username

---

## Phase 2 Checklist

- [ ] Commit 2.1: TaskList API routes
- [ ] Commit 2.2: Task API routes
- [ ] Commit 2.3: React Query hooks
- [ ] Commit 2.4: Day view page layout
- [ ] Commit 2.5: Task item component
- [ ] Commit 2.6: Task list component
- [ ] Commit 2.7: Notion-style input
- [ ] Commit 2.8: Day page integration
- [ ] Commit 2.9: Drag-and-drop
- [ ] Commit 2.10: Dashboard home

## Next Phase
Proceed to [Phase 3: Calendar & Navigation](./03-phase-3-calendar-navigation.md)
