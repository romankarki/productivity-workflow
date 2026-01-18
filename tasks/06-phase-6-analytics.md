# Phase 6: Analytics

## Overview
Build the analytics dashboard with charts and insights for time tracking data.

---

## Commit 6.1: Install Recharts & Create Analytics API

### Description
Setup charting library and create analytics data endpoints.

### Commands
```bash
npm install recharts
```

### Files Created
- `app/api/analytics/week/route.ts`
- `app/api/analytics/month/route.ts`
- `app/api/analytics/labels/route.ts`
- `lib/types/analytics.ts`

### Analytics Types
```typescript
interface DailyStats {
  date: string
  totalTime: number // milliseconds
  taskCount: number
  completedCount: number
  labelBreakdown: {
    labelId: string
    labelName: string
    labelColor: string
    time: number
  }[]
}

interface WeeklyAnalytics {
  days: DailyStats[]
  totalTime: number
  averageDaily: number
  mostProductiveDay: string
  taskCompletion: {
    total: number
    completed: number
    rate: number
  }
}

interface LabelAnalytics {
  labels: {
    id: string
    name: string
    color: string
    totalTime: number
    percentage: number
    trend: 'up' | 'down' | 'stable'
    trendValue: number
  }[]
  totalTrackedTime: number
}
```

### API Endpoints

#### `GET /api/analytics/week`
- Query: `?startDate=YYYY-MM-DD` (defaults to 7 days ago)
- Returns daily stats for 7 days

#### `GET /api/analytics/month`
- Query: `?month=YYYY-MM` (defaults to current month)
- Returns daily stats for entire month

#### `GET /api/analytics/labels`
- Query: `?period=week|month` (defaults to week)
- Returns label time breakdown

### Acceptance Criteria
- [ ] Recharts installed
- [ ] API routes return correct data
- [ ] Time calculations accurate
- [ ] Label breakdown correct

---

## Commit 6.2: Create Analytics Page Layout

### Description
Build the analytics dashboard page structure.

### Files Created
- `app/analytics/page.tsx`
- `app/analytics/loading.tsx`
- `components/analytics/analytics-header.tsx`
- `components/analytics/date-range-selector.tsx`

### Page Layout
```
┌─────────────────────────────────────────────────────┐
│  Analytics                    [This Week ▼]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │         Weekly Time Chart                    │   │
│  │         (Bar/Area chart)                     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ Total Hours │ │ Daily Avg   │ │ Best Day    │   │
│  │   12.5h     │ │   1.8h      │ │   Monday    │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                     │
│  ┌──────────────────┐ ┌────────────────────────┐   │
│  │  Label Breakdown │ │  Task Completion       │   │
│  │  (Pie chart)     │ │  (Progress stats)      │   │
│  └──────────────────┘ └────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Date Range Selector
- Preset options: This Week, Last Week, This Month
- Custom date range (optional)
- Updates all charts on change

### Acceptance Criteria
- [ ] Page structure complete
- [ ] Date selector works
- [ ] Loading states show
- [ ] Responsive layout

---

## Commit 6.3: Create Analytics React Query Hooks

### Description
Build hooks for fetching analytics data.

### Files Created
- `lib/hooks/use-analytics.ts`

### Hooks

#### `useWeeklyAnalytics(startDate?: string)`
```typescript
// Fetch weekly analytics data
// Returns: { data: WeeklyAnalytics, isLoading, error }
```

#### `useMonthlyAnalytics(month?: string)`
```typescript
// Fetch monthly analytics data
```

#### `useLabelAnalytics(period: 'week' | 'month')`
```typescript
// Fetch label breakdown data
```

### Acceptance Criteria
- [ ] Hooks return correct types
- [ ] Caching works properly
- [ ] Refetch on date change

---

## Commit 6.4: Create Weekly Time Chart

### Description
Build the main bar/area chart showing daily time tracked.

### Files Created
- `components/analytics/weekly-chart.tsx`
- `components/analytics/chart-tooltip.tsx`

### Chart Features
- X-axis: Days of week (Mon-Sun)
- Y-axis: Hours tracked
- Stacked bars by label
- Hover tooltip with details
- Dark theme colors

### Chart Configuration
```typescript
// Using Recharts BarChart or AreaChart
// Stacked by label for breakdown
// Custom tooltip showing:
// - Date
// - Total time
// - Breakdown by label
```

### Visual Design
- Dark background compatible
- Label colors match user's labels
- Smooth animations
- Responsive sizing

### Acceptance Criteria
- [ ] Chart renders correctly
- [ ] Labels stack correctly
- [ ] Tooltip shows details
- [ ] Dark theme compatible
- [ ] Responsive on mobile

---

## Commit 6.5: Create Summary Stats Cards

### Description
Build the summary statistics display cards.

### Files Created
- `components/analytics/stats-card.tsx`
- `components/analytics/stats-grid.tsx`

### Stats Cards
1. **Total Time**
   - Total hours tracked in period
   - Compare to previous period (+/-%)

2. **Daily Average**
   - Average hours per day
   - Trend indicator

3. **Most Productive Day**
   - Day with most time tracked
   - Time tracked that day

4. **Task Completion**
   - Tasks completed / total
   - Completion rate %

### Card Design
```
┌─────────────────────────┐
│  📊 Total Time          │
│                         │
│     12.5 hours         │
│     ↑ 15% from last wk │
└─────────────────────────┘
```

### Acceptance Criteria
- [ ] All stat cards render
- [ ] Numbers format correctly
- [ ] Trends calculate right
- [ ] Cards responsive

---

## Commit 6.6: Create Label Breakdown Pie Chart

### Description
Build pie/donut chart showing time distribution by label.

### Files Created
- `components/analytics/label-pie-chart.tsx`
- `components/analytics/label-legend.tsx`

### Chart Features
- Donut chart style
- Each label as a segment
- Colors match label colors
- Center shows total time
- Legend with percentages

### Legend Display
```
┌─────────────────────────────┐
│     [Donut Chart]           │
│                             │
│  ● Work       45%   5.6h   │
│  ● Learning   30%   3.7h   │
│  ● Personal   15%   1.9h   │
│  ● Health     10%   1.2h   │
└─────────────────────────────┘
```

### Acceptance Criteria
- [ ] Chart renders correctly
- [ ] Colors match labels
- [ ] Percentages accurate
- [ ] Legend displays properly

---

## Commit 6.7: Create Label Insights Panel

### Description
Build detailed label analytics with trends.

### Files Created
- `components/analytics/label-insights.tsx`
- `components/analytics/label-trend.tsx`

### Insights Display
```
┌─────────────────────────────────────────────┐
│  Label Insights                             │
├─────────────────────────────────────────────┤
│  🟢 Work                                    │
│     5.6 hours  •  45%  •  ↑ 12%            │
│     ████████████████░░░░                    │
├─────────────────────────────────────────────┤
│  🔵 Learning                                │
│     3.7 hours  •  30%  •  ↓ 5%             │
│     ██████████░░░░░░░░░░                    │
├─────────────────────────────────────────────┤
│  (more labels...)                           │
└─────────────────────────────────────────────┘
```

### Features
- Ranked by time spent
- Progress bar visualization
- Trend from previous period
- Click to filter by label

### Acceptance Criteria
- [ ] Labels ranked correctly
- [ ] Trends calculate right
- [ ] Visual bars accurate
- [ ] Interactive filtering

---

## Commit 6.8: Add Analytics Empty States & Polish

### Description
Handle empty states and polish the analytics experience.

### Files Modified
- Multiple analytics components

### Files Created
- `components/analytics/empty-analytics.tsx`
- `components/analytics/analytics-skeleton.tsx`

### Empty States
- No time tracked: Encouraging message + CTA to track time
- No tasks: Prompt to create tasks
- No labels: Suggest creating labels for better insights

### Polish
- Loading skeletons for charts
- Smooth transitions between date ranges
- Chart animations
- Mobile optimizations (scrollable charts)
- Print/export styles (optional)

### Accessibility
- Screen reader descriptions for charts
- Keyboard navigation
- High contrast support

### Acceptance Criteria
- [ ] Empty states helpful
- [ ] Loading states smooth
- [ ] Mobile experience good
- [ ] Charts accessible

---

## Phase 6 Checklist

- [ ] Commit 6.1: Recharts & analytics API
- [ ] Commit 6.2: Analytics page layout
- [ ] Commit 6.3: React Query hooks
- [ ] Commit 6.4: Weekly time chart
- [ ] Commit 6.5: Summary stats cards
- [ ] Commit 6.6: Label pie chart
- [ ] Commit 6.7: Label insights panel
- [ ] Commit 6.8: Empty states & polish

## Next Phase
Proceed to [Phase 7: Polish & Optimization](./07-phase-7-polish-optimization.md)
