import "dotenv/config";
import { readFile } from "node:fs/promises";
import pg from "pg";

const mode = process.argv[2];
if (!["--check", "--apply"].includes(mode)) throw new Error("Use --check or --apply");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
try {
  if (mode === "--apply") await pool.query(await readFile(new URL("../prisma/changes/20261022_point_photos.sql", import.meta.url), "utf8"));
  const result = await pool.query(`SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema='public' AND ((table_name='Spot' AND column_name='thumbnailUrl')
    OR (table_name='Hazard' AND column_name IN ('imageUrl','thumbnailUrl'))) ORDER BY table_name, column_name`);
  console.log(JSON.stringify({ mode, columns: result.rows }));
} finally { await pool.end(); }
