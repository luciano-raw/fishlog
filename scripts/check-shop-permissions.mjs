import "dotenv/config";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
try {
  const tables = await pool.query(`SELECT relname, relrowsecurity FROM pg_class JOIN pg_namespace ON pg_namespace.oid=pg_class.relnamespace WHERE nspname='public' AND relname IN ('User','Shop')`);
  const grants = await pool.query(`SELECT grantee, table_name, privilege_type FROM information_schema.role_table_grants WHERE table_schema='public' AND table_name IN ('User','Shop') AND grantee IN ('PUBLIC','anon','authenticated')`);
  console.log(JSON.stringify({ tables: tables.rows, clientWriteGrants: grants.rows }));
  if (grants.rows.length) throw new Error("Client-facing Supabase roles must not access server-managed user roles or shops directly.");
} finally { await pool.end(); }
