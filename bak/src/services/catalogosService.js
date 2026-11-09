const { pool } = require("../config/db");

// Lista las categorías llamando a la función de la base
async function listarCategorias() {
  const r = await pool.query("select * from usp_categorias_listar()");
  return r.rows;
}

// Lista productos activos; la categoría es opcional (NULL = todas)
async function listarProductos(categoriaId) {
  const r = await pool.query("select * from usp_productos_listar($1::int)", [categoriaId || null]);
  return r.rows;
}

// Lista los clientes para el selector del pedido
async function listarClientes() {
  const r = await pool.query("select * from usp_clientes_listar()");
  return r.rows;
}

module.exports = { listarCategorias, listarProductos, listarClientes };