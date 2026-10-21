import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
const client = await pool.connect();
const tag = randomUUID();
const user1 = `test-${tag}`, user2 = `test2-${tag}`, catchId = `catch-${tag}`, spotId = `spot-${tag}`, hazardId = `hazard-${tag}`;
try {
  await client.query("BEGIN");
  await client.query('INSERT INTO "User" ("id","email") VALUES ($1,$2),($3,$4)', [user1, `${tag}@example.invalid`, user2, `2-${tag}@example.invalid`]);
  await client.query('INSERT INTO "Catch" ("id","userId","species","updatedAt") VALUES ($1,$2,$3,NOW())', [catchId, user1, "Transactional test"]);
  await client.query('INSERT INTO "Spot" ("id","userId","name","locationLat","locationLng","updatedAt") VALUES ($1,$2,$3,0,0,NOW())', [spotId, user1, "Transactional test"]);
  await client.query('INSERT INTO "Hazard" ("id","userId","name","locationLat","locationLng","updatedAt") VALUES ($1,$2,$3,0,0,NOW())', [hazardId, user1, "Transactional test"]);
  for (const userId of [user1, user1, user2]) await client.query('INSERT INTO "CatchReaction" ("catchId","userId") VALUES ($1,$2) ON CONFLICT DO NOTHING', [catchId, userId]);
  assert.equal((await client.query('SELECT count(*)::int AS count FROM "CatchReaction" WHERE "catchId"=$1', [catchId])).rows[0].count, 2);
  await client.query('DELETE FROM "CatchReaction" WHERE "catchId"=$1 AND "userId"=$2', [catchId, user1]);
  assert.equal((await client.query('SELECT "userId" FROM "CatchReaction" WHERE "catchId"=$1', [catchId])).rows[0].userId, user2);
  for (const targets of [[null, null], [spotId, hazardId]]) {
    await client.query("SAVEPOINT invalid_comment");
    let rejected = false;
    try { await client.query('INSERT INTO "PointComment" ("id","userId","spotId","hazardId","body") VALUES ($1,$2,$3,$4,$5)', [randomUUID(), user1, ...targets, "test"]); } catch (error) { rejected = error.code === "23514"; }
    await client.query("ROLLBACK TO SAVEPOINT invalid_comment");
    assert.equal(rejected, true);
  }
  await client.query('INSERT INTO "PointComment" ("id","userId","spotId","body") VALUES ($1,$2,$3,$4)', [randomUUID(), user1, spotId, "test"]);
  await client.query('DELETE FROM "Spot" WHERE "id"=$1', [spotId]);
  assert.equal((await client.query('SELECT count(*)::int AS count FROM "PointComment" WHERE "spotId"=$1', [spotId])).rows[0].count, 0);
  await client.query('DELETE FROM "Catch" WHERE "id"=$1', [catchId]);
  assert.equal((await client.query('SELECT count(*)::int AS count FROM "CatchReaction" WHERE "catchId"=$1', [catchId])).rows[0].count, 0);
  const grants = await client.query("SELECT grantee FROM information_schema.role_table_grants WHERE table_schema='public' AND table_name IN ('CatchReaction','PointComment') AND grantee IN ('PUBLIC','anon','authenticated')");
  assert.equal(grants.rows.length, 0);
  console.log(JSON.stringify({ uniqueReactions: true, ownerScopedRemoval: true, exclusiveCommentTarget: true, cascadingCleanup: true, directClientAccessBlocked: true, testDataCommitted: false }));
} finally {
  await client.query("ROLLBACK");
  client.release();
  await pool.end();
}
