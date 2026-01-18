# Phase 5: Labels & Organization

## Overview
Build the custom labels system for task categorization and time tracking organization.

---

## Commit 5.1: Create Labels API Routes

### Description
Implement API endpoints for label management.

### Files Created
- `app/api/labels/route.ts`
- `app/api/labels/[id]/route.ts`
- `app/api/tasks/[id]/labels/route.ts`

### Endpoints

#### `GET /api/labels`
- Get all labels for current user
- Include usage count (number of tasks)
- Sorted by name or usage

#### `POST /api/labels`
- Create new label
- Body: `{ name: string, color: string }`
- Validate unique name per user

#### `PUT /api/labels/[id]`
- Update label name or color
- Body: `{ name?: string, color?: string }`
- Updates cascade to task associations

#### `DELETE /api/labels/[id]`
- Delete label
- Remove from all task associations
- Stopwatch laps keep null reference

#### `POST /api/tasks/[id]/labels`
- Add label to task
- Body: `{ labelId: string }`

#### `DELETE /api/tasks/[id]/labels/[labelId]`
- Remove label from task

### Acceptance Criteria
- [ ] All CRUD operations work
- [ ] Unique name validation
- [ ] Cascade updates work
- [ ] Usage count accurate

---

## Commit 5.2: Create Label React Query Hooks

### Description
Build custom hooks for label data management.

### Files Created
- `lib/hooks/use-labels.ts`
- `lib/types/label.ts`

### Hooks

#### `useLabels()`
```typescript
// Fetch all user labels
// Returns: { labels, isLoading, error }
```

#### `useCreateLabel()`
```typescript
// Mutation for creating labels
// Optimistic updates
```

#### `useUpdateLabel()`
```typescript
// Mutation for updating labels
// Invalidates affected queries
```

#### `useDeleteLabel()`
```typescript
// Mutation for deleting labels
// Confirms before delete
```

#### `useTaskLabels(taskId: string)`
```typescript
// Get labels for specific task
```

#### `useToggleTaskLabel()`
```typescript
// Add/remove label from task
```

### Acceptance Criteria
- [ ] All hooks typed correctly
- [ ] Optimistic updates work
- [ ] Cache invalidation proper

---

## Commit 5.3: Create Labels Management Page

### Description
Build the dedicated page for managing labels.

### Files Created
- `app/labels/page.tsx`
- `app/labels/loading.tsx`
- `components/labels/labels-header.tsx`

### Page Layout
```
┌─────────────────────────────────────────────┐
│  Labels                     [+ New Label]   │
├─────────────────────────────────────────────┤
│                                             │
│  🟢 Work                    12 tasks   ⋮   │
│  🔵 Learning                8 tasks    ⋮   │
│  🟣 Personal                5 tasks    ⋮   │
│  🟡 Health                  3 tasks    ⋮   │
│  🔴 Urgent                  2 tasks    ⋮   │
│                                             │
│  (Empty state if no labels)                 │
│                                             │
└─────────────────────────────────────────────┘
```

### Features
- List all labels with color
- Show task count per label
- Edit/delete options in menu
- Add new label button
- Empty state with CTA

### Acceptance Criteria
- [ ] Labels display correctly
- [ ] Task counts accurate
- [ ] Navigation works
- [ ] Empty state helpful

---

## Commit 5.4: Create Label Form Dialog

### Description
Build the dialog for creating/editing labels.

### Files Created
- `components/labels/label-dialog.tsx`
- `components/labels/color-picker.tsx`

### Label Dialog
- Name input field
- Color picker component
- Preview of label appearance
- Create/Update button

### Color Picker
- Preset color palette
- Custom hex input
- Preview swatch
- Accessible color selection

### Preset Colors
```typescript
const PRESET_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#6b7280', // Gray
]
```

### Acceptance Criteria
- [ ] Dialog opens for create/edit
- [ ] Color picker works
- [ ] Validation prevents empty names
- [ ] Preview accurate

---

## Commit 5.5: Create Label Badge Component

### Description
Build reusable label badge for display throughout app.

### Files Created
- `components/labels/label-badge.tsx`
- `components/labels/label-list.tsx`

### Label Badge
```typescript
interface LabelBadgeProps {
  label: Label
  size?: 'sm' | 'md'
  removable?: boolean
  onRemove?: () => void
}
```

### Features
- Shows label name with color
- Color as background or border
- Remove button (optional)
- Hover state
- Multiple sizes

### Label List Component
```typescript
interface LabelListProps {
  labels: Label[]
  size?: 'sm' | 'md'
  max?: number // Show "+N more" if exceeds
  onRemove?: (labelId: string) => void
}
```

### Acceptance Criteria
- [ ] Badge displays correctly
- [ ] Colors render properly
- [ ] Remove button works
- [ ] "+N more" truncation works

---

## Commit 5.6: Integrate Labels into Task Item

### Description
Add label display and management to task items.

### Files Modified
- `components/tasks/task-item.tsx`

### Files Created
- `components/labels/label-selector.tsx`
- `components/labels/label-popover.tsx`

### Label Selector
- Dropdown/popover with all labels
- Checkboxes for multi-select
- Search/filter labels
- Quick create new label
- Shows currently selected

### Task Item Integration
```
┌─────────────────────────────────────────────┐
│  ☐  Task Title                        ⏱ ⋮  │
│     🏷️ Work  🏷️ Urgent  [+]                │
└─────────────────────────────────────────────┘
```

### Features
- Labels display below title
- Click [+] to add labels
- Click label to open selector
- Inline add/remove

### Acceptance Criteria
- [ ] Labels show on tasks
- [ ] Selector popover works
- [ ] Add/remove labels works
- [ ] UI doesn't get cluttered

---

## Commit 5.7: Add Label Filtering to Task List

### Description
Enable filtering tasks by label.

### Files Created
- `components/tasks/task-filters.tsx`
- `components/labels/label-filter.tsx`

### Files Modified
- `app/day/[date]/page.tsx`
- `components/tasks/task-list.tsx`

### Filter UI
```
┌─────────────────────────────────────────────┐
│  Filter: [All] [🏷️ Work] [🏷️ Learning]  ✕  │
├─────────────────────────────────────────────┤
│  (Filtered task list)                       │
└─────────────────────────────────────────────┘
```

### Features
- Label filter chips
- Multi-select filter
- Clear all filters
- URL state for filters (shareable)
- Show count per filter

### Filter Logic
- "All" shows all tasks
- Single label: tasks with that label
- Multiple labels: tasks with ANY selected label

### Acceptance Criteria
- [ ] Filter buttons work
- [ ] Multi-select works
- [ ] Clear filters works
- [ ] URL reflects filter state

---

## Phase 5 Checklist

- [ ] Commit 5.1: Labels API routes
- [ ] Commit 5.2: React Query hooks
- [ ] Commit 5.3: Labels management page
- [ ] Commit 5.4: Label form dialog
- [ ] Commit 5.5: Label badge component
- [ ] Commit 5.6: Task item integration
- [ ] Commit 5.7: Label filtering

## Next Phase
Proceed to [Phase 6: Analytics](./06-phase-6-analytics.md)
