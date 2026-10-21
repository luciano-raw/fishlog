import "dotenv/config";
import { readFile } from "node:fs/promises";
import pg from "pg";

// Only run after independently verifying this exact account in Clerk.
const [userId, email, mode] = process.argv.slice(2);
if (!userId?.startsWith("user_") || !email?.includes("@") || !["--check", "--apply"].includes(mode)) {
  throw new Error("Usage: node scripts/apply-fishing-update.mjs <verified-clerk-id> <verified-email> --check|--apply");
}
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
const client = await pool.connect();
try {
  const { rows } = await client.query('SELECT "id", "email" FROM "User" WHERE "id" = $1 AND lower("email") = lower($2)', [userId, email]);
  if (rows.length !== 1) throw new Error("The verified account does not match an existing Fishlog user. No changes applied.");
  if (mode === "--check") {
    const schema = await client.query("SELECT table_name, column_name FROM information_schema.columns WHERE table_schema='public' AND ((table_name='User' AND column_name='role') OR (table_name='Catch' AND column_name='lureType') OR table_name='Shop')");
    console.log(JSON.stringify({ accountMatched: true, existingAdditions: schema.rows }));
  } else {
    await client.query("BEGIN");
    await client.query(await readFile(new URL("../prisma/changes/20261020_lures_admin_shops.sql", import.meta.url), "utf8"));
    const result = await client.query('UPDATE "User" SET "role" = $1 WHERE "id" = $2 AND lower("email") = lower($3) RETURNING "id", "role"', ["ADMIN", userId, email]);
    if (result.rowCount !== 1) throw new Error("Admin assignment failed.");
    await client.query("COMMIT");
    console.log(JSON.stringify({ applied: true, admin: result.rows[0] }));
  }
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
