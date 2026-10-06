import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    const res = await pool.query('SELECT NOW()');
    console.log("Conectado! Hora del server:", res.rows[0]);
  } catch (err) {
    console.error("Error conectando con pg:", err);
  } finally {
    await pool.end();
  }
}

test();
