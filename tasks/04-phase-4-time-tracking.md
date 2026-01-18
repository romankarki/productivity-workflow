# Phase 4: Time Tracking

## Overview
Implement the stopwatch feature with lap timing and label association.

---

## Commit 4.1: Create Stopwatch API Routes

### Description
Build API endpoints for stopwatch operations.

### Files Created
- `app/api/stopwatches/route.ts`
- `app/api/stopwatches/[id]/route.ts`
- `app/api/stopwatches/[id]/laps/route.ts`
- `app/api/tasks/[taskId]/stopwatches/route.ts`

### Endpoints

#### `POST /api/stopwatches`
- Create new stopwatch for a task
- Body: `{ taskId: string }`
- Sets startTime to now, isActive to true

#### `PUT /api/stopwatches/[id]`
- Update stopwatch (pause, resume, stop)
- Body: `{ action: 'pause' | 'resume' | 'stop' }`
- Pause: Set isActive false, update totalDuration
- Resume: Set isActive true, update startTime
- Stop: Set isActive false, endTime, final totalDuration

#### `GET /api/tasks/[taskId]/stopwatches`
- Get stopwatch history for a task
- Include laps with label info

#### `POST /api/stopwatches/[id]/laps`
- Create a new lap
- Body: `{ labelId?: string }`
- Auto-calculate duration from previous lap or start

### Acceptance Criteria
- [ ] CRUD operations work correctly
- [ ] Time calculations accurate
- [ ] Laps associate with labels
- [ ] History retrieval works

---

## Commit 4.2: Create Stopwatch State Hook

### Description
Build custom hook for managing stopwatch state with real-time updates.

### Files Created
- `lib/hooks/use-stopwatch.ts`
- `lib/types/stopwatch.ts`

### Hook Interface
```typescript
interface UseStopwatchReturn {
  // State
  isRunning: boolean
  isPaused: boolean
  elapsedTime: number // milliseconds
  laps: Lap[]
  
  // Actions
  start: () => Promise<void>
  pause: () => Promise<void>
  resume: () => Promise<void>
  stop: () => Promise<void>
  addLap: (labelId?: string) => Promise<void>
  reset: () => void
  
  // Status
  isLoading: boolean
  error: Error | null
}

function useStopwatch(taskId: string): UseStopwatchReturn
```

### Implementation Details
- Uses `useRef` for interval tracking
- Updates every 100ms for smooth display
- Persists state to API on pause/stop
- Recovers running state on page reload
- Handles browser tab switching

### Acceptance Criteria
- [ ] Timer counts accurately
- [ ] State persists across refresh
- [ ] Actions work correctly
- [ ] Multiple stopwatches don't conflict

---

## Commit 4.3: Create Stopwatch Display Component

### Description
Build the main stopwatch UI component.

### Files Created
- `components/stopwatch/stopwatch-display.tsx`
- `components/stopwatch/time-display.tsx`

### Time Display Component
```typescript
interface TimeDisplayProps {
  milliseconds: number
  size?: 'sm' | 'md' | 'lg'
}

// Displays: HH:MM:SS or MM:SS.ms
```

### Stopwatch Display Features
- Large time display (HH:MM:SS)
- Start/Pause button (primary action)
- Stop button (ends session)
- Lap button (records lap)
- Visual states:
  - Idle: Muted, ready to start
  - Running: Active color, pulsing indicator
  - Paused: Warning color, waiting state

### Visual Design
```
┌─────────────────────────────────────┐
│                                     │
│           01:23:45                  │
│                                     │
│     [▶ Start]  [⏹ Stop]  [🏁 Lap]   │
│                                     │
└─────────────────────────────────────┘
```

### Acceptance Criteria
- [ ] Time displays correctly formatted
- [ ] All buttons work
- [ ] Visual feedback on state change
- [ ] Animations smooth

---

## Commit 4.4: Create Lap Recording Component

### Description
Build the lap management UI with label selection.

### Files Created
- `components/stopwatch/lap-list.tsx`
- `components/stopwatch/lap-item.tsx`
- `components/stopwatch/lap-dialog.tsx`

### Lap Dialog
- Opens when lap button clicked
- Label dropdown selection (optional)
- Shows lap number and duration
- Quick save option

### Lap List Component
- Shows all laps for current session
- Displays: Lap #, Duration, Label badge
- Total time summary
- Scrollable for many laps

### Lap Item Display
```
┌─────────────────────────────────────────────┐
│  Lap 3                              05:23   │
│  🏷️ Work                                    │
├─────────────────────────────────────────────┤
│  Lap 2                              12:45   │
│  🏷️ Research                                │
├─────────────────────────────────────────────┤
│  Lap 1                              08:17   │
│  (no label)                                 │
└─────────────────────────────────────────────┘
```

### Acceptance Criteria
- [ ] Lap creates with correct duration
- [ ] Label assignment works
- [ ] Lap list displays correctly
- [ ] Durations calculate properly

---

## Commit 4.5: Integrate Stopwatch into Task Item

### Description
Add stopwatch controls directly to task items.

### Files Modified
- `components/tasks/task-item.tsx`

### Files Created
- `components/stopwatch/mini-stopwatch.tsx`

### Mini Stopwatch Component
- Compact inline timer display
- Play/pause toggle button
- Shows elapsed time
- Expands to full stopwatch on click

### Task Item Integration
```
┌─────────────────────────────────────────────┐
│  ☐  Task Title              ⏱ 01:23  ▶    │
│     🏷️ Work  🏷️ Focus                       │
└─────────────────────────────────────────────┘
```

### Behavior
- Timer visible if stopwatch exists
- Play button starts/resumes
- Click time opens full stopwatch modal
- Active task highlighted

### Acceptance Criteria
- [ ] Mini stopwatch shows on tasks
- [ ] Controls work from task row
- [ ] Modal opens on time click
- [ ] Active task visually distinct

---

## Commit 4.6: Create Full Stopwatch Modal/Panel

### Description
Build expanded stopwatch view with all features.

### Files Created
- `components/stopwatch/stopwatch-modal.tsx`
- `components/stopwatch/stopwatch-panel.tsx`

### Modal Contents
```
┌─────────────────────────────────────────────┐
│  Task: Review pull requests            ✕   │
├─────────────────────────────────────────────┤
│                                             │
│              02:34:17                       │
│                                             │
│        [⏸ Pause]  [⏹ Stop]  [🏁 Lap]       │
│                                             │
├─────────────────────────────────────────────┤
│  Laps                                       │
│  ┌─────────────────────────────────────┐   │
│  │ Lap 2  |  00:45:23  |  🏷️ Coding    │   │
│  │ Lap 1  |  01:48:54  |  🏷️ Review    │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Total Time Today: 02:34:17                 │
│  All Time on Task: 05:45:33                 │
└─────────────────────────────────────────────┘
```

### Features
- Large timer display
- Full control buttons
- Lap history
- Statistics summary
- Keyboard shortcuts (Space for pause, L for lap)

### Acceptance Criteria
- [ ] Modal displays all info
- [ ] All controls functional
- [ ] Lap list scrollable
- [ ] Stats calculate correctly
- [ ] Keyboard shortcuts work

---

## Commit 4.7: Handle Active Stopwatch Persistence

### Description
Ensure stopwatch state survives page refresh and navigation.

### Files Created
- `lib/hooks/use-active-stopwatch.ts`
- `lib/context/stopwatch-context.tsx`

### Context Provider
- Global state for active stopwatch
- Checks for running stopwatch on app load
- Provides active stopwatch info to all components
- Shows floating indicator when timer running

### Floating Indicator
```
┌─────────────────────────────────┐
│  ⏱ 01:23:45  "Task Name"  [▶]  │
└─────────────────────────────────┘
(Fixed position, bottom right)
```

### Persistence Logic
1. On app load, check API for active stopwatches
2. If found, restore running state
3. Calculate elapsed time from startTime
4. Continue counting from correct position

### Acceptance Criteria
- [ ] Timer continues after refresh
- [ ] Floating indicator shows
- [ ] Can control from indicator
- [ ] Multiple tabs sync correctly

---

## Commit 4.8: Add Stopwatch History View

### Description
Show historical stopwatch sessions for a task.

### Files Created
- `components/stopwatch/stopwatch-history.tsx`
- `components/stopwatch/session-card.tsx`

### History View
- List of past stopwatch sessions
- Date, duration, lap count
- Expand to see lap details
- Total time tracked

### Session Card
```
┌─────────────────────────────────────────────┐
│  March 15, 2024                    2:34:17  │
│  3 laps                              ▼      │
├─────────────────────────────────────────────┤
│  (Expanded lap details)                     │
│  Lap 1: 00:45:23 - Work                     │
│  Lap 2: 01:12:30 - Research                 │
│  Lap 3: 00:36:24 - Writing                  │
└─────────────────────────────────────────────┘
```

### Acceptance Criteria
- [ ] History shows all sessions
- [ ] Expandable lap details
- [ ] Total time calculates correctly
- [ ] Sorted by date descending

---

## Commit 4.9: Polish Stopwatch UX

### Description
Final polish for stopwatch experience.

### Enhancements

#### Visual Feedback
- Pulse animation when running
- Color transitions on state change
- Sound option for lap/stop (optional)
- Vibration on mobile (optional)

#### Edge Cases
- Warn before closing tab with active timer
- Handle very long durations (>24h)
- Recover from browser sleep
- Handle timezone changes

#### Performance
- Optimize re-renders
- Efficient interval management
- Lazy load stopwatch history

#### Accessibility
- Screen reader announcements
- Keyboard navigation complete
- Focus management in modal

### Acceptance Criteria
- [ ] Smooth animations
- [ ] Edge cases handled
- [ ] Performance optimized
- [ ] Accessible experience

---

## Phase 4 Checklist

- [ ] Commit 4.1: Stopwatch API routes
- [ ] Commit 4.2: Stopwatch state hook
- [ ] Commit 4.3: Stopwatch display component
- [ ] Commit 4.4: Lap recording component
- [ ] Commit 4.5: Task item integration
- [ ] Commit 4.6: Full stopwatch modal
- [ ] Commit 4.7: Persistence handling
- [ ] Commit 4.8: History view
- [ ] Commit 4.9: Polish UX

## Next Phase
Proceed to [Phase 5: Labels & Organization](./05-phase-5-labels-organization.md)
