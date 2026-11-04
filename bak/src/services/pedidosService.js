// Capa de servicio: habla con la base. Solo ejecuta procedimientos almacenados.
// Si un SP recibe datos del usuario, SIEMPRE con .input() (nunca concatenar SQL).
const { getPool } = require("../config/db");

// Circuito de referencia: listado con JOIN (usp_Pedidos_Listar)
async function listar() {
  const pool = await getPool();
  const resultado = await pool.request().execute("usp_Pedidos_Listar");
  return resultado.recordset;
}

/* Ejemplo de cómo se pasa un parámetro (para las demás funcionalidades):

   const { sql } = require("../config/db");
   const resultado = await pool.request()
     .input("PedidoId", sql.Int, id)
     .execute("usp_Pedidos_Obtener");
*/

module.exports = { listar };
