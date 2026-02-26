const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "powergym_app",
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Forzar UTF8 en la sesión
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
  } else {
    connection.query("SET NAMES utf8mb4");
    console.log("Conectado a MySQL correctamente con UTF8MB4");
    connection.release();
  }
});

module.exports = pool;