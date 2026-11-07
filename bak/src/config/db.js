require("dotenv").config();
const { Pool, types } = require("pg");

// 1. Configuraciones de tipos de datos de Postgres a JavaScript
types.setTypeParser(1700, (valor) => parseFloat(valor)); // NUMERIC a Float
types.setTypeParser(20, (valor) => parseInt(valor, 10));  // BIGINT a Int

// 2. Inicialización del Pool de conexiones para Supabase
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }, 
  max: 5,
});

// 3. Diccionario de mapeo de snake_case/lowercase a PascalCase
const NOMBRES = [
  "PedidoId", "ClienteId", "ProductoId", "CategoriaId", "DetalleId",
  "Fecha", "Estado", "Total", "Cliente", "Productos", "Nombre",
  "Marca", "Precio", "Stock", "Categoria", "Telefono", "Email",
  "CantPedidos", "Unidades", "TotalVendido", "Producto", "Cantidad",
  "PrecioUnitario", "Subtotal",
];

const MAPA_COLUMNAS = Object.fromEntries(
  NOMBRES.map((nombre) => [nombre.toLowerCase(), nombre])
);

/**
 * Normaliza las llaves de un objeto fila al formato PascalCase definido en el mapa.
 */
function formatearFila(fila) {
  return Object.fromEntries(
    Object.entries(fila).map(([clave, valor]) => [
      MAPA_COLUMNAS[clave] ?? clave, 
      valor
    ])
  );
}

/**
 * Ejecuta consultas SQL de forma segura parametrizada.
 * @param {string} textoSql 
 * @param {Array} parametros 
 * @returns {Promise<Array>} Filas resultantes mapeadas a PascalCase
 */
async function consultar(textoSql, parametros = []) {
  const resultado = await pool.query(textoSql, parametros);
  return resultado.rows.map(formatearFila);
}

module.exports = { 
  pool, 
  consultar 
};
