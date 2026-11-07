// Conexión a PostgreSQL (Supabase). Los datos salen del archivo .env (nunca van en el código).
require("dotenv").config();
const { Pool, types } = require("pg");

// NUMERIC (precios, totales) y BIGINT (conteos) llegan como texto: los pasamos a número
types.setTypeParser(1700, (valor) => parseFloat(valor));
types.setTypeParser(20, (valor) => parseInt(valor, 10));

// Un único pool de conexiones compartido por toda la aplicación
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }, // Supabase exige conexión segura
  max: 5,
});

// Postgres devuelve los nombres de columna en minúscula (pedidoid).
// Los pasamos a PascalCase (PedidoId) para que el front y los componentes no cambien.
const NOMBRES = [
  "PedidoId",
  "ClienteId",
  "ProductoId",
  "CategoriaId",
  "DetalleId",
  "Fecha",
  "Estado",
  "Total",
  "Cliente",
  "Productos",
  "Nombre",
  "Marca",
  "Precio",
  "Stock",
  "Categoria",
  "Telefono",
  "Email",
  "CantPedidos",
  "Unidades",
  "TotalVendido",
  "Producto",
  "Cantidad",
  "PrecioUnitario",
  "Subtotal",
];

const MAPA = Object.fromEntries(
  NOMBRES.map((nombre) => [nombre.toLowerCase(), nombre])
);

// Ejecuta una consulta con parámetros ($1, $2...) y devuelve las filas.
// Los datos del usuario SIEMPRE viajan en el arreglo de parámetros, nunca dentro del texto SQL.
async function consultar(textoSql, parametros = []) {
  const resultado = await pool.query(textoSql, parametros);
  return resultado.rows.map((fila) =>
    Object.fromEntries(
      Object.entries(fila).map(([clave, valor]) => [
        MAPA[clave] ?? clave,
        valor,
      ])
    )
  );
}

module.exports = { pool, consultar };