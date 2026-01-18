# Phase 3: Calendar & Navigation

## Overview
Build the interactive calendar view with streak tracking and goal management.

---

## Commit 3.1: Create Main Navigation Layout

### Description
Build the persistent navigation sidebar/header for the app.

### Files Created
- `components/layout/sidebar.tsx`
- `components/layout/nav-item.tsx`
- `components/layout/mobile-nav.tsx`

### Files Modified
- `app/layout.tsx`

### Navigation Items
- 🏠 Home (Dashboard)
- 📅 Calendar
- 📊 Analytics
- 🏷️ Labels
- ⚙️ Settings

### Layout Structure
```
Desktop:
┌──────┬────────────────────────────────────┐
│ Nav  │                                    │
│      │         Main Content               │
│ Home │                                    │
│ Cal  │                                    │
│ Ana  │                                    │
│ Lab  │                                    │
│ Set  │                                    │
└──────┴────────────────────────────────────┘

Mobile:
┌────────────────────────────────────────────┐
│  ☰  Pomodoro Todo                          │
├────────────────────────────────────────────┤
│                                            │
│           Main Content                     │
│                                            │
├────────────────────────────────────────────┤
│  🏠    📅    📊    🏷️    ⚙️               │
└────────────────────────────────────────────┘
```

### Features
- Collapsible sidebar on desktop
- Bottom navigation on mobile
- Active state indicators
- Smooth transitions
- App logo/branding

### Acceptance Criteria
- [ ] Navigation renders on all pages
- [ ] Active page highlighted
- [ ] Responsive layout works
- [ ] Mobile nav accessible

---

## Commit 3.2: Create Calendar Page Layout

### Description
Build the calendar page with month view structure.

### Files Created
- `app/calendar/page.tsx`
- `app/calendar/loading.tsx`
- `components/calendar/calendar-header.tsx`

### Page Structure
```
┌─────────────────────────────────────────────┐
│  ←  March 2024  →       [Today] [Week/Mon]  │
├─────────────────────────────────────────────┤
│  Sun  Mon  Tue  Wed  Thu  Fri  Sat          │
├─────────────────────────────────────────────┤
│                                             │
│           Calendar Grid                     │
│                                             │
└─────────────────────────────────────────────┘
```

### Calendar Header Features
- Month/year display
- Previous/next month navigation
- "Today" button to jump to current date
- Current streak badge

### Acceptance Criteria
- [ ] Month navigation works
- [ ] Today button works
- [ ] Header is responsive
- [ ] Loading state shows skeleton

---

## Commit 3.3: Build Custom Calendar Grid Component

### Description
Create the month calendar grid with day cells.

### Files Created
- `components/calendar/calendar-grid.tsx`
- `components/calendar/calendar-day.tsx`
- `lib/utils/date.ts`

### Date Utilities
```typescript
// lib/utils/date.ts
export function getMonthDays(year: number, month: number): Date[]
export function formatDate(date: Date): string // YYYY-MM-DD
export function isSameDay(date1: Date, date2: Date): boolean
export function isToday(date: Date): boolean
export function getWeekNumber(date: Date): number
```

### Calendar Grid Features
- 7-column grid (Sun-Sat or Mon-Sun)
- Fills previous/next month days (grayed out)
- Highlights today
- Click day to navigate to day view

### Calendar Day Cell
- Day number
- Task count indicator (dot or number)
- Completed task ratio visual
- Streak indicator (if part of streak)
- Hover state with preview

### Acceptance Criteria
- [ ] Correct days display for any month
- [ ] Today highlighted
- [ ] Click navigates to day view
- [ ] Previous/next month days shown grayed

---

## Commit 3.4: Add Task Indicators to Calendar Days

### Description
Show task information on calendar day cells.

### Files Modified
- `components/calendar/calendar-day.tsx`
- `lib/hooks/use-tasklist.ts`

### Features
- Fetch task lists for visible month
- Show dot indicator if tasks exist
- Show completion progress (e.g., "3/5")
- Color coding based on completion:
  - Empty: No indicator
  - Has tasks: Dot
  - All complete: Green checkmark
  - Partial: Progress indicator

### Visual Design
```
┌─────┐  ┌─────┐  ┌─────┐
│  12 │  │  13 │  │  14 │
│     │  │  •  │  │ ✓  │
└─────┘  └─────┘  └─────┘
 (empty)  (tasks)  (done)
```

### Acceptance Criteria
- [ ] Task indicators show correctly
- [ ] Data fetches efficiently (batch by month)
- [ ] Real-time updates when tasks change
- [ ] Visual distinction between states

---

## Commit 3.5: Implement Streak Calculation Logic

### Description
Create utility functions and API for streak tracking.

### Files Created
- `lib/utils/streak.ts`
- `app/api/streaks/route.ts`

### Streak Logic
```typescript
interface StreakData {
  currentStreak: number
  longestStreak: number
  streakDates: string[] // Array of date strings in current streak
  lastCompletedDate: string | null
}

// A day counts toward streak if:
// - Has at least one completed task
// - No break in consecutive days
```

### API Endpoint
```
GET /api/streaks
Returns: { currentStreak, longestStreak, streakDates, lastCompletedDate }
```

### Calculation Rules
1. Start from today and count backwards
2. Day counts if has ≥1 completed task
3. Break in chain = streak ends
4. Track longest streak ever

### Acceptance Criteria
- [ ] Streak calculates correctly
- [ ] Handles edge cases (new user, missed days)
- [ ] API returns streak data
- [ ] Longest streak tracked

---

## Commit 3.6: Display Streak Visuals on Calendar

### Description
Add streak visualization to calendar view.

### Files Created
- `components/calendar/streak-badge.tsx`
- `components/calendar/streak-highlight.tsx`

### Files Modified
- `components/calendar/calendar-day.tsx`
- `components/calendar/calendar-header.tsx`

### Streak Badge (Header)
- 🔥 icon with streak count
- Shows current streak prominently
- Tooltip shows longest streak

### Streak Day Highlighting
- Streak days connected visually
- Special border/background color
- Fire icon on streak days
- Today highlighted if part of streak

### Visual Design
```
┌─────────────────────────────────────────────┐
│  March 2024                    🔥 7 days    │
├─────────────────────────────────────────────┤
│         ...calendar grid...                 │
│  ┌─────┬─────┬─────┬─────┬─────┐          │
│  │  10 │  11 │  12 │  13 │  14 │          │
│  │ 🔥 │ 🔥 │ 🔥 │ 🔥 │ 🔥 │          │
│  └─────┴─────┴─────┴─────┴─────┘          │
│      (streak days connected)                │
└─────────────────────────────────────────────┘
```

### Acceptance Criteria
- [ ] Streak badge shows correct count
- [ ] Streak days visually connected
- [ ] Today shows if streak continues
- [ ] Motivational UI on long streaks

---

## Commit 3.7: Add Weekly/Monthly Goals UI

### Description
Implement goal setting and progress display.

### Files Created
- `components/goals/goal-dialog.tsx`
- `components/goals/goal-progress.tsx`
- `app/api/goals/route.ts`

### Goal Dialog
- Set weekly task completion goal
- Set monthly task completion goal
- Simple number input
- Save to task list record

### Goal Progress Component
```
Weekly Progress
[████████░░░░] 8/12 tasks
     67% complete

Monthly Progress
[██████░░░░░░░] 24/50 tasks
     48% complete
```

### API Endpoint
```
GET /api/goals?week=2024-W12&month=2024-03
Returns: { weekly: { goal, completed }, monthly: { goal, completed } }

PUT /api/goals
Body: { weeklyGoal?: number, monthlyGoal?: number }
```

### Acceptance Criteria
- [ ] Goals can be set/updated
- [ ] Progress calculates correctly
- [ ] Visual progress bars work
- [ ] Accessible from day view and calendar

---

## Commit 3.8: Polish Calendar Interactions

### Description
Add final polish to calendar interactions and mobile experience.

### Files Modified
- Multiple calendar components

### Enhancements
- Hover preview showing task list
- Keyboard navigation (arrow keys)
- Touch gestures for month swipe
- Loading states for data fetch
- Empty month message
- Smooth animations on month change

### Keyboard Controls
- `←` / `→`: Previous/next month
- `Enter`: Open selected day
- `T`: Jump to today

### Mobile Optimizations
- Larger touch targets
- Swipe between months
- Compact day cells
- Sheet for day preview instead of navigate

### Acceptance Criteria
- [ ] Smooth month transitions
- [ ] Keyboard fully functional
- [ ] Mobile gestures work
- [ ] Hover previews on desktop
- [ ] Performance smooth with many tasks

---

## Phase 3 Checklist

- [ ] Commit 3.1: Main navigation layout
- [ ] Commit 3.2: Calendar page layout
- [ ] Commit 3.3: Calendar grid component
- [ ] Commit 3.4: Task indicators
- [ ] Commit 3.5: Streak calculation
- [ ] Commit 3.6: Streak visuals
- [ ] Commit 3.7: Goals UI
- [ ] Commit 3.8: Polish interactions

## Next Phase
Proceed to [Phase 4: Time Tracking](./04-phase-4-time-tracking.md)
