// Capa de servicio: habla con la base. Solo ejecuta funciones y procedimientos almacenados.
// Si un SP recibe datos del usuario, SIEMPRE con parámetros $1, $2 (nunca concatenar SQL).
const { consultar } = require("../config/db");

// Listado con JOIN (usp_Pedidos_Listar)
async function listar() {
  return consultar("SELECT * FROM usp_Pedidos_Listar()");
}

module.exports = { listar };