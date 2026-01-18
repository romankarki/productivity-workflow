# Phase 9: Daily Scratchpad / Notes

## Overview
Add a quick notes/scratchpad feature to each day's task list for capturing thoughts, ideas, and quick notes in a simple, unstructured way.

---

## Commit 9.1: Update Database Schema for Notes

### Description
Add a notes field to the TaskList model to store daily scratchpad content.

### Files Modified
- `prisma/schema.prisma`

### Schema Changes
```prisma
model TaskList {
  id          String   @id @default(cuid())
  userId      String
  date        DateTime @db.Date
  weeklyGoal  Int?
  monthlyGoal Int?
  notes       String?  @db.Text  // NEW: Scratchpad content
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  // ... relations
}
```

### Migration
```bash
npx prisma migrate dev --name add_notes_to_tasklist
```

### Acceptance Criteria
- [ ] Notes field added to TaskList model
- [ ] Migration runs successfully
- [ ] Existing data preserved

---

## Commit 9.2: Create Notes API Endpoint

### Description
Add API endpoint to update notes for a task list.

### Files Modified
- `app/api/tasklists/[id]/route.ts`

### Endpoint
```
PUT /api/tasklists/[id]
Body: { notes: string }
```

### Features
- Update notes field
- Auto-save support (debounced)
- Return updated task list

### Acceptance Criteria
- [ ] PUT endpoint accepts notes
- [ ] Notes saved to database
- [ ] Returns updated task list

---

## Commit 9.3: Create Scratchpad Component

### Description
Build the scratchpad UI component with auto-save functionality.

### Files Created
- `components/scratchpad/scratchpad.tsx`
- `components/scratchpad/scratchpad-toggle.tsx`

### Component Features
```
┌─────────────────────────────────────────────┐
│  📝 Notes                            [−]    │
├─────────────────────────────────────────────┤
│                                             │
│  Quick notes for today...                   │
│  - Meeting at 3pm                           │
│  - Call John about project                  │
│  - Ideas: new feature concept               │
│                                             │
│                                             │
│                          Auto-saved ✓       │
└─────────────────────────────────────────────┘
```

### Features
- Textarea with markdown-like styling
- Auto-save with debounce (500ms)
- Saving indicator
- Collapsible panel
- Placeholder text
- Character count (optional)
- Expand/minimize toggle

### Styling
- Dark theme compatible
- Subtle border
- Monospace or clean font option
- Resize handle
- Min/max height constraints

### Acceptance Criteria
- [ ] Textarea renders with notes
- [ ] Auto-save works
- [ ] Saving indicator shows
- [ ] Collapsible works
- [ ] Dark theme styled

---

## Commit 9.4: Create Notes Hook

### Description
Build custom hook for notes state management with optimistic updates.

### Files Created
- `lib/hooks/use-notes.ts`

### Hook Interface
```typescript
interface UseNotesReturn {
  notes: string
  setNotes: (notes: string) => void
  isSaving: boolean
  lastSaved: Date | null
}

function useNotes(taskListId: string): UseNotesReturn
```

### Features
- Debounced auto-save
- Optimistic updates
- Saving state tracking
- Last saved timestamp
- Error handling

### Acceptance Criteria
- [ ] Hook manages notes state
- [ ] Debounced saving works
- [ ] Saving indicator accurate
- [ ] Errors handled gracefully

---

## Commit 9.5: Integrate Scratchpad into Day Page

### Description
Add scratchpad to the daily task list page.

### Files Modified
- `app/day/[date]/page.tsx`

### Layout Options

#### Option A: Below Task List
```
┌─────────────────────────────────────────────┐
│  Tuesday, January 18                        │
├─────────────────────────────────────────────┤
│  [ ] Task 1                                 │
│  [x] Task 2                                 │
│  [ ] Task 3                                 │
├─────────────────────────────────────────────┤
│  + Add task...                              │
├─────────────────────────────────────────────┤
│  📝 Scratchpad                       [−]    │
│  ┌─────────────────────────────────────┐   │
│  │ Notes for today...                   │   │
│  │                                      │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

#### Option B: Side Panel (Desktop)
```
┌────────────────────────┬────────────────────┐
│  Tuesday, January 18   │  📝 Notes          │
├────────────────────────┤                    │
│  [ ] Task 1            │  Quick notes...    │
│  [x] Task 2            │                    │
│  [ ] Task 3            │                    │
│                        │                    │
│  + Add task...         │                    │
└────────────────────────┴────────────────────┘
```

### Responsive Behavior
- **Mobile**: Collapsible section below tasks
- **Tablet**: Collapsible section below tasks
- **Desktop**: Optional side panel or below tasks

### Acceptance Criteria
- [ ] Scratchpad visible on day page
- [ ] Layout responsive
- [ ] Notes persist per day
- [ ] Integrates with existing UI

---

## Commit 9.6: Add Scratchpad Toggle & Persistence

### Description
Add toggle to show/hide scratchpad and persist preference.

### Files Created
- `lib/hooks/use-scratchpad-preferences.ts`

### Features
- Toggle button in header or floating
- Remember collapsed/expanded state
- Keyboard shortcut (Ctrl+Shift+N)
- Smooth animation

### LocalStorage Key
```typescript
'pomodoro_scratchpad_expanded' // boolean
```

### Acceptance Criteria
- [ ] Toggle shows/hides scratchpad
- [ ] State persists in localStorage
- [ ] Animation smooth
- [ ] Keyboard shortcut works

---

## Commit 9.7: Polish Scratchpad UX

### Description
Final polish and enhancements for scratchpad experience.

### Enhancements

#### Visual
- Subtle gradient background
- Focus ring styling
- Smooth transitions
- Icon for notes section

#### Functional
- Placeholder suggestions
- Empty state message
- Word/character count
- "Last saved" timestamp

#### Mobile
- Full-width on mobile
- Touch-friendly resize
- Collapse by default on mobile

### Acceptance Criteria
- [ ] Polished visual design
- [ ] Mobile experience smooth
- [ ] All edge cases handled

---

## Phase 9 Checklist

- [ ] Commit 9.1: Database schema update
- [ ] Commit 9.2: Notes API endpoint
- [ ] Commit 9.3: Scratchpad component
- [ ] Commit 9.4: Notes hook
- [ ] Commit 9.5: Day page integration
- [ ] Commit 9.6: Toggle & persistence
- [ ] Commit 9.7: Polish UX

---

## Data Model

### TaskList (Updated)
```typescript
interface TaskList {
  id: string
  userId: string
  date: Date
  weeklyGoal: number | null
  monthlyGoal: number | null
  notes: string | null  // NEW
  createdAt: Date
  updatedAt: Date
  tasks: Task[]
}
```

---

## API Changes

### Updated Endpoint
```
PUT /api/tasklists/[id]
Body: { 
  weeklyGoal?: number,
  monthlyGoal?: number,
  notes?: string  // NEW
}
```

---

## Component Props

### Scratchpad
```typescript
interface ScratchpadProps {
  taskListId: string
  initialNotes?: string
  defaultExpanded?: boolean
  onToggle?: (expanded: boolean) => void
}
```

---

## Future Enhancements (Not in Scope)

- Rich text / Markdown rendering
- Note templates
- Search across all notes
- Export notes
- Note history/versions
- Attach notes to specific tasks
- Voice notes
- Note sharing
