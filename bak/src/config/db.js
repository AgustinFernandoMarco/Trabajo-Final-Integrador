// Conexión a SQL Server. Los datos salen del archivo .env (nunca van en el código).
require("dotenv").config();
const sql = require("mssql");

const config = {
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "CelularesVR",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  options: {
    useUTC: false,
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT !== "false",
    instanceName: process.env.DB_INSTANCE || undefined,
  },
};

// Un único pool de conexiones compartido por toda la aplicación
let poolPromise = null;

function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .catch((error) => {
        poolPromise = null; // si falla, se reintenta en el próximo pedido
        throw error;
      });
  }
  return poolPromise;
}

module.exports = { sql, getPool };
