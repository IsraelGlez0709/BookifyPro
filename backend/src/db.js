// src/db.js
import 'dotenv/config';
import mysql from 'mysql2/promise';

function parseMysqlUrl(u) {
  const url = new URL(u);
  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    user: url.username,
    password: url.password,
    database: url.pathname.replace(/^\//, ''),
  };
}

const cfg = (process.env.MYSQL_URL || process.env.DATABASE_URL)
  ? parseMysqlUrl(process.env.MYSQL_URL || process.env.DATABASE_URL)
  : {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };

export const db = await mysql.createPool({
  ...cfg,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
  // namedPlaceholders: true, // opcional
});

// pequeño sanity check opcional:
// await db.query('SELECT 1');
