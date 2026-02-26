-- Add daily wins field for per-day motivation notes
ALTER TABLE "TaskList"
ADD COLUMN "dailyWins" TEXT;
