BEGIN;
CREATE TABLE IF NOT EXISTS "CatchReaction" (
 "catchId" TEXT NOT NULL REFERENCES "Catch"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY ("catchId", "userId")
);
CREATE INDEX IF NOT EXISTS "CatchReaction_userId_idx" ON "CatchReaction"("userId");
CREATE TABLE IF NOT EXISTS "PointComment" (
 "id" TEXT PRIMARY KEY,
 "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 "spotId" TEXT REFERENCES "Spot"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 "hazardId" TEXT REFERENCES "Hazard"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 "body" TEXT NOT NULL CHECK (char_length(trim("body")) BETWEEN 1 AND 1000),
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "PointComment_one_target" CHECK (("spotId" IS NOT NULL)::int + ("hazardId" IS NOT NULL)::int = 1)
);
CREATE INDEX IF NOT EXISTS "PointComment_spotId_createdAt_idx" ON "PointComment"("spotId", "createdAt");
CREATE INDEX IF NOT EXISTS "PointComment_hazardId_createdAt_idx" ON "PointComment"("hazardId", "createdAt");
CREATE INDEX IF NOT EXISTS "PointComment_userId_createdAt_idx" ON "PointComment"("userId", "createdAt");
REVOKE ALL PRIVILEGES ON TABLE "CatchReaction", "PointComment" FROM PUBLIC, anon, authenticated;
COMMIT;
