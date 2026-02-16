-- CreateTable
CREATE TABLE "TrackedRepo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackedRepo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrackedRepo_userId_idx" ON "TrackedRepo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackedRepo_userId_owner_name_key" ON "TrackedRepo"("userId", "owner", "name");

-- AddForeignKey
ALTER TABLE "TrackedRepo" ADD CONSTRAINT "TrackedRepo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
