-- CreateTable
CREATE TABLE "Contest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contestName" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "rank" INTEGER,
    "score" INTEGER,
    "ratingBefore" INTEGER,
    "ratingAfter" INTEGER,
    "problemsSolved" INTEGER,
    "totalProblems" INTEGER,
    "finishTime" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Contest_userId_idx" ON "Contest"("userId");

-- AddForeignKey
ALTER TABLE "Contest" ADD CONSTRAINT "Contest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
