const { consultar } = require("../config/db");

// Lista las categorías llamando a la función de la base
async function listarCategorias() {
  return consultar("select * from usp_categorias_listar()");
}

// Lista productos activos; la categoría es opcional (NULL = todas)
async function listarProductos(categoriaId) {
  return consultar("select * from usp_productos_listar($1::int)", [categoriaId || null]);
}

// Lista los clientes para el selector del pedido
async function listarClientes() {
  return consultar("select * from usp_clientes_listar()");
}

module.exports = { listarCategorias, listarProductos, listarClientes };