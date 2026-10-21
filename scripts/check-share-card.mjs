import "dotenv/config";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import pg from "pg";

// Exercise the compiled route in-process; this does not start a local server.
process.env.NODE_ENV = "production";
const require = createRequire(import.meta.url);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
try {
  const { rows } = await pool.query('SELECT "id" FROM "Catch" ORDER BY ("imageUrl" IS NOT NULL) DESC, "createdAt" DESC LIMIT 1');
  if (!rows[0]) throw new Error("A real capture is required to check the generated card.");
  const route = require("../.next/server/app/catches/[id]/card/route.js");
  await route.routeModule.ensureUserland();
  const response = await route.routeModule.userland.GET(new Request(`https://fishlog-cnc2.vercel.app/catches/${rows[0].id}/card`), { params: Promise.resolve({ id: rows[0].id }) });
  assert.equal(response.status, 200);
  const png = Buffer.from(await response.arrayBuffer());
  assert.equal(png.subarray(1, 4).toString(), "PNG");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  const output = new URL("../.next/qa/", import.meta.url);
  await mkdir(output, { recursive: true });
  await writeFile(new URL("share-card.png", output), png);
  console.log(JSON.stringify({ status: 200, image: "PNG", width: 1200, height: 630, bytes: png.length, output: ".next/qa/share-card.png" }));
} finally { await pool.end(); }
process.exit(0);
