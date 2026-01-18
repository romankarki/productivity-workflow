# Phase 7: Polish & Optimization

## Overview
Final polish, performance optimization, mobile refinement, and documentation.

---

## Commit 7.1: Create Settings Page

### Description
Build the user settings page for username management and preferences.

### Files Created
- `app/settings/page.tsx`
- `components/settings/settings-form.tsx`
- `components/settings/danger-zone.tsx`

### Settings Page Layout
```
┌─────────────────────────────────────────────┐
│  Settings                                   │
├─────────────────────────────────────────────┤
│                                             │
│  Profile                                    │
│  ┌─────────────────────────────────────┐   │
│  │ Username                             │   │
│  │ [_____________________] [Save]       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Preferences                                │
│  ┌─────────────────────────────────────┐   │
│  │ Week starts on: [Sunday ▼]          │   │
│  │ Time format: [24h ▼]                │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Data                                       │
│  ┌─────────────────────────────────────┐   │
│  │ Export Data  [Download JSON]        │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Danger Zone                                │
│  ┌─────────────────────────────────────┐   │
│  │ Delete all data                      │   │
│  │ [Delete Everything]                  │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### Features
- Update username
- Preferences (week start, time format)
- Export data as JSON
- Delete all data (with confirmation)

### Acceptance Criteria
- [ ] Username updates work
- [ ] Preferences save properly
- [ ] Export downloads JSON
- [ ] Delete has confirmation

---

## Commit 7.2: Implement Toast Notifications

### Description
Add toast notifications throughout the app for user feedback.

### Files Created
- `lib/hooks/use-toast-actions.ts`

### Files Modified
- `app/layout.tsx` - Add Toaster component
- Multiple components - Add toast calls

### Toast Scenarios
- Task created: "Task added"
- Task completed: "Nice work! Task completed"
- Task deleted: "Task deleted" (with undo option)
- Label created/updated/deleted
- Timer started/stopped
- Error states: "Something went wrong. Please try again."
- Network errors: "Connection lost. Changes saved locally."

### Toast Styling
- Dark theme compatible
- Position: bottom-right
- Auto-dismiss after 3-5 seconds
- Action buttons (Undo, Dismiss)

### Acceptance Criteria
- [ ] Toaster renders in layout
- [ ] All actions show feedback
- [ ] Undo works where applicable
- [ ] Errors display helpfully

---

## Commit 7.3: Add Loading & Error States

### Description
Implement comprehensive loading and error handling.

### Files Created
- `components/ui/loading-spinner.tsx`
- `components/ui/error-boundary.tsx`
- `components/ui/error-message.tsx`
- `app/error.tsx`
- `app/not-found.tsx`

### Loading States
- Full page skeleton for initial load
- Inline skeletons for data refresh
- Button loading states
- Optimistic UI updates

### Error Handling
- Global error boundary
- Per-component error states
- Retry mechanisms
- Helpful error messages

### 404 Page
- Friendly "not found" message
- Navigation back to home
- Search suggestion

### Acceptance Criteria
- [ ] Loading states everywhere
- [ ] Errors caught and displayed
- [ ] 404 page styled
- [ ] Retry buttons work

---

## Commit 7.4: Mobile Responsiveness Polish

### Description
Ensure all pages work beautifully on mobile devices.

### Files Modified
- Multiple components across the app

### Mobile Optimizations

#### Navigation
- Bottom tab bar on mobile
- Hamburger menu if needed
- Touch-friendly tap targets (min 44px)

#### Calendar
- Compact day cells
- Horizontal scroll if needed
- Touch gestures for navigation

#### Task List
- Full-width cards
- Swipe actions (complete, delete)
- Pull to refresh

#### Stopwatch
- Large touch targets for controls
- Full-screen timer option
- Simplified lap view

#### Analytics
- Scrollable charts
- Stacked layout instead of grid
- Collapsible sections

### Breakpoint Guidelines
```css
/* Mobile: < 640px */
/* Tablet: 640px - 1024px */
/* Desktop: > 1024px */
```

### Acceptance Criteria
- [ ] All pages usable on mobile
- [ ] No horizontal scroll issues
- [ ] Touch interactions smooth
- [ ] Text readable at all sizes

---

## Commit 7.5: Performance Optimization

### Description
Optimize app performance for fast, smooth experience.

### Optimizations

#### React Query
- Proper stale times
- Query invalidation optimization
- Prefetching on hover
- Pagination for long lists

#### Component Optimization
- React.memo for expensive components
- useMemo for computed values
- useCallback for handlers
- Lazy loading for routes

#### Bundle Size
- Analyze with `next/bundle-analyzer`
- Tree-shake unused code
- Dynamic imports for charts
- Optimize images

#### Database
- Proper indexes in Prisma
- Efficient queries
- Connection pooling

### Files Created
- `next.config.js` - Bundle analyzer config

### Code Optimization
```typescript
// Lazy load heavy components
const AnalyticsChart = dynamic(
  () => import('@/components/analytics/weekly-chart'),
  { loading: () => <ChartSkeleton /> }
)
```

### Acceptance Criteria
- [ ] First load < 3 seconds
- [ ] Page transitions smooth
- [ ] No layout shifts
- [ ] Bundle size reasonable

---

## Commit 7.6: Create README & Documentation

### Description
Write comprehensive README for setup and usage.

### Files Created
- `README.md`
- `.env.example`
- `CONTRIBUTING.md` (optional)

### README Contents

```markdown
# Pomodoro Todo App

A productivity application for task management with time tracking.

## Features
- Daily task lists with Notion-style editing
- Pomodoro-style stopwatch timer
- Custom labels for categorization
- Calendar view with streak tracking
- Analytics dashboard

## Tech Stack
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS + Shadcn UI
- Prisma + PostgreSQL
- TanStack Query

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repo-url>
   cd pomodoro-todo
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```

4. Configure your database URL in `.env`
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/pomodoro_todo"
   ```

5. Run database migrations
   ```bash
   npx prisma migrate dev
   ```

6. Start the development server
   ```bash
   npm run dev
   ```

7. Open http://localhost:3000

### Database Setup (Local PostgreSQL)

#### Option 1: Docker
```bash
docker run --name pomodoro-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=pomodoro_todo \
  -p 5432:5432 \
  -d postgres:15
```

#### Option 2: Local PostgreSQL
1. Install PostgreSQL
2. Create database: `createdb pomodoro_todo`
3. Update DATABASE_URL in .env

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Run migrations

## Project Structure
[Include file structure overview]

## Contributing
[Guidelines for contributing]

## License
MIT
```

### .env.example
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pomodoro_todo"

# Optional: Analytics (if added)
# NEXT_PUBLIC_ANALYTICS_ID=""
```

### Acceptance Criteria
- [ ] README comprehensive
- [ ] Setup instructions work
- [ ] .env.example complete
- [ ] All scripts documented

---

## Phase 7 Checklist

- [ ] Commit 7.1: Settings page
- [ ] Commit 7.2: Toast notifications
- [ ] Commit 7.3: Loading & error states
- [ ] Commit 7.4: Mobile responsiveness
- [ ] Commit 7.5: Performance optimization
- [ ] Commit 7.6: README & documentation

---

## Final Launch Checklist

### Pre-Launch
- [ ] All features implemented per requirements
- [ ] All phases complete
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Manual testing on all pages
- [ ] Mobile testing complete
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

### Database
- [ ] Migrations finalized
- [ ] Indexes optimized
- [ ] Test with realistic data volume

### Performance
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] No memory leaks

### Documentation
- [ ] README complete
- [ ] .env.example updated
- [ ] API documented (optional)

---

## Future Enhancements (Post-MVP)

Not included in current scope, but potential future additions:

1. **Authentication**
   - OAuth providers (Google, GitHub)
   - Magic link login
   - Team/shared workspaces

2. **Advanced Features**
   - Recurring tasks
   - Task templates
   - Subtasks/checklists
   - Task priorities
   - Due dates/reminders

3. **Integrations**
   - Calendar sync (Google, Outlook)
   - Slack notifications
   - Webhook support

4. **Enhanced Analytics**
   - Custom date ranges
   - Export to CSV/PDF
   - Comparison periods
   - Goal tracking charts

5. **Collaboration**
   - Shared task lists
   - Comments on tasks
   - Activity feed

6. **Mobile App**
   - React Native version
   - Push notifications
   - Offline sync
