-- Additive update for the existing database (which has no Prisma migration baseline).
-- Applied transactionally by scripts/apply-fishing-update.mjs. No existing records are removed.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'USER';
ALTER TABLE "Catch" ADD COLUMN IF NOT EXISTS "lureType" TEXT;
CREATE TABLE IF NOT EXISTS "Shop" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "address" TEXT,
  "website" TEXT,
  "locationLat" DOUBLE PRECISION NOT NULL,
  "locationLng" DOUBLE PRECISION NOT NULL,
  "createdById" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- These tables are accessed through the authenticated Next.js/Prisma server only.
-- Supabase's default grants must not expose role changes or shop management via REST.
REVOKE ALL PRIVILEGES ON TABLE "User", "Shop" FROM PUBLIC, anon, authenticated;
