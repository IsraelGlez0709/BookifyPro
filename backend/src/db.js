// src/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let pool;

if (process.env.MYSQL_URL) {
  // Usa la URL que te da Railway (privada) y configura el pool
  pool = mysql.createPool(process.env.MYSQL_URL + '?connectionLimit=10&waitForConnections=true');
} else {
  // Compatibilidad si estás en local con variables sueltas
  pool = mysql.createPool({
    host: process.env.DB_HOST || process.env.MYSQLHOST || '127.0.0.1',
    port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

export const db = pool;
