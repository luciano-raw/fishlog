import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
const client = await pool.connect();
const tag = `test-${randomUUID()}`;
try {
  await client.query("BEGIN");
  await client.query('INSERT INTO "User" ("id","email") VALUES ($1,$2)', [tag, `${tag}@example.invalid`]);
  for (const table of ["Spot", "Hazard"]) {
    for (const photo of [false, true]) {
      const { rows } = await client.query(`INSERT INTO "${table}" ("id","userId","name","locationLat","locationLng","imageUrl","thumbnailUrl","updatedAt") VALUES ($1,$2,$3,0,0,$4,$5,NOW()) RETURNING "imageUrl","thumbnailUrl"`, [`${tag}-${table}-${photo}`, tag, "Rollback test", photo ? "full.jpg" : null, photo ? "preview.jpg" : null]);
      assert.equal(rows[0].imageUrl, photo ? "full.jpg" : null);
      assert.equal(rows[0].thumbnailUrl, photo ? "preview.jpg" : null);
    }
  }
  console.log("Spot and hazard saves with and without photos passed. All test records rolled back.");
} finally { await client.query("ROLLBACK"); client.release(); await pool.end(); }
