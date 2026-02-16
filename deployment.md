# Local Deployment Guide (Windows)

Run the Pomodoro Todo app as a **production build** on your Windows machine,
auto-starting on boot so it is always available at `http://localhost:3000`.

---

## Architecture

```
┌────────────────────────────────────┐
│         Windows Boot               │
│                                    │
│  Docker Desktop (auto-start)       │
│    └─ pomodoro-postgres container  │
│       └─ volume: pomodoro-pgdata   │
│                                    │
│  Windows Service (NSSM)            │
│    └─ next start (port 3000)       │
└────────────────────────────────────┘
```

- **Database** – PostgreSQL 15 in Docker, using the existing `pomodoro-pgdata` volume (your dev data carries over).
- **App server** – Next.js production build, managed as a Windows service via NSSM.
- **Restart survival** – Docker Desktop auto-launches the container; NSSM auto-launches the app.

---

## Prerequisites

| Tool            | Version used | Check               |
|-----------------|-------------|----------------------|
| Node.js         | v24.12.0    | `node -v`            |
| pnpm            | 10.3.0      | `pnpm -v`            |
| Docker Desktop  | any recent  | `docker --version`   |

> Docker Desktop should already be set to **Start Docker Desktop when you sign in**
> (Settings → General → "Start Docker Desktop when you sign in to your computer").

---

## Step 1 – Ensure Postgres container restarts on boot

Your existing container is named `pomodoro-postgres` and uses the
`pomodoro-pgdata` volume. Set its restart policy so Docker brings it back
automatically after every reboot:

```powershell
docker update --restart unless-stopped pomodoro-postgres
```

Verify:

```powershell
docker inspect pomodoro-postgres --format "{{.HostConfig.RestartPolicy.Name}}"
# Should print: unless-stopped
```

> **Your data is safe.** The `pomodoro-pgdata` volume persists across container
> restarts and even `docker rm`. Never run `docker volume rm pomodoro-pgdata`
> unless you truly want to wipe the database.

---

## Step 2 – Build the production app

From the project root:

```powershell
cd C:\Users\ASUS\Desktop\productivity-workflow\todo-app

# Install deps (if not already up-to-date)
pnpm install

# Generate Prisma client
pnpm prisma generate

# Create the optimised production build
pnpm build
```

This produces a `.next` folder with the compiled app. You will re-run
`pnpm build` each time you finish a feature and want to deploy it (see
[Updating the build](#updating-the-build) below).

---

## Step 3 – Quick sanity check

Start the production server manually first to make sure everything works:

```powershell
pnpm start
```

Open `http://localhost:3000` – you should see the app with all your existing
data. Press `Ctrl+C` to stop once confirmed.

---

## Step 4 – Install NSSM (one-time)

[NSSM](https://nssm.cc/) (Non-Sucking Service Manager) lets you run any
executable as a Windows service with automatic restart.

### Option A – Install via winget (recommended)

```powershell
winget install --id nssm.nssm
```

### Option B – Install via Chocolatey

```powershell
choco install nssm
```

### Option C – Manual download

1. Download from https://nssm.cc/download
2. Extract and add the folder containing `nssm.exe` to your system `PATH`.

Verify:

```powershell
nssm version
```

---

## Step 5 – Create the Windows service

Run **PowerShell as Administrator**:

```powershell
# Path to node executable
$nodePath = (Get-Command node).Source

# App directory
$appDir = "C:\Users\ASUS\Desktop\productivity-workflow\todo-app"

# Create the service
nssm install PomodoroTodo $nodePath "$appDir\node_modules\next\dist\bin\next" start

# Configure working directory
nssm set PomodoroTodo AppDirectory $appDir

# Set environment variables (DATABASE_URL must match your .env)
nssm set PomodoroTodo AppEnvironmentExtra `
    "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pomodoro_todo?schema=public" `
    "NODE_ENV=production" `
    "PORT=3000"

# Log stdout/stderr for debugging
nssm set PomodoroTodo AppStdout "$appDir\logs\service-stdout.log"
nssm set PomodoroTodo AppStderr "$appDir\logs\service-stderr.log"
nssm set PomodoroTodo AppStdoutCreationDisposition 4
nssm set PomodoroTodo AppStderrCreationDisposition 4
nssm set PomodoroTodo AppRotateFiles 1
nssm set PomodoroTodo AppRotateBytes 1048576

# Wait for Postgres to be ready before starting (30s delay)
nssm set PomodoroTodo AppThrottle 30000

# Set to auto-start on boot
nssm set PomodoroTodo Start SERVICE_AUTO_START

# Create logs directory
New-Item -ItemType Directory -Force -Path "$appDir\logs"
```

---

## Step 6 – Start the service

```powershell
nssm start PomodoroTodo
```

Verify it is running:

```powershell
nssm status PomodoroTodo
# Should print: SERVICE_RUNNING
```

Open `http://localhost:3000` – the app is now served from the Windows service.

---

## Managing the service

All commands require an **Administrator** PowerShell.

| Action              | Command                              |
|---------------------|--------------------------------------|
| Start               | `nssm start PomodoroTodo`            |
| Stop                | `nssm stop PomodoroTodo`             |
| Restart             | `nssm restart PomodoroTodo`          |
| Check status        | `nssm status PomodoroTodo`           |
| View config GUI     | `nssm edit PomodoroTodo`             |
| Remove service      | `nssm remove PomodoroTodo confirm`   |
| View logs           | `Get-Content "$appDir\logs\service-stdout.log" -Tail 50` |

---

## Updating the build

After you code a new feature and are ready to deploy it:

```powershell
cd C:\Users\ASUS\Desktop\productivity-workflow\todo-app

# 1. Build the new version
pnpm build

# 2. Run any pending database migrations (if schema changed)
pnpm prisma migrate deploy

# 3. Restart the service to pick up the new build
nssm restart PomodoroTodo
```

That's it – three commands. No container rebuild, no downtime beyond a
few seconds for the restart.

---

## Database operations

### Run migrations (after schema changes)

```powershell
cd C:\Users\ASUS\Desktop\productivity-workflow\todo-app
pnpm prisma migrate deploy
```

### Open Prisma Studio (GUI database browser)

```powershell
pnpm prisma studio
```

### Backup the database

```powershell
docker exec pomodoro-postgres pg_dump -U postgres pomodoro_todo > backup.sql
```

### Restore from backup

```powershell
Get-Content backup.sql | docker exec -i pomodoro-postgres psql -U postgres pomodoro_todo
```

---

## Troubleshooting

### App won't start after reboot

The service may start before Docker/Postgres is ready. NSSM will
automatically retry. Check logs:

```powershell
Get-Content "C:\Users\ASUS\Desktop\productivity-workflow\todo-app\logs\service-stderr.log" -Tail 30
```

If it consistently fails, increase the throttle delay:

```powershell
nssm set PomodoroTodo AppThrottle 60000
nssm restart PomodoroTodo
```

### Port 3000 is already in use

Find what is using it:

```powershell
netstat -ano | findstr :3000
```

Either kill that process or change the app port:

```powershell
nssm set PomodoroTodo AppEnvironmentExtra `
    "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pomodoro_todo?schema=public" `
    "NODE_ENV=production" `
    "PORT=4000"
nssm restart PomodoroTodo
```

### Check if Postgres is running

```powershell
docker ps --filter name=pomodoro-postgres
```

If it's not running:

```powershell
docker start pomodoro-postgres
```

### Reset everything (nuclear option)

```powershell
# Stop and remove the Windows service
nssm stop PomodoroTodo
nssm remove PomodoroTodo confirm

# App is now only running via `pnpm dev` or `pnpm start` manually
# Database and volume are untouched
```

---

## Summary

| Component     | How it runs                              | Survives reboot? |
|---------------|------------------------------------------|-------------------|
| PostgreSQL    | Docker container (`unless-stopped`)      | Yes               |
| Data volume   | `pomodoro-pgdata` Docker volume          | Yes               |
| Next.js app   | Windows service via NSSM                 | Yes               |
| Docker itself | Docker Desktop auto-start on login       | Yes               |



