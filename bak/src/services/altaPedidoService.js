const { pool } = require("../config/db");

// El detalle viaja como JSON; la base lo abre, valida y calcula el total.
// Es un procedure con parámetro OUT, por eso se llama con CALL.
async function crear(clienteId, detalle) {
  const r = await pool.query("call usp_pedidos_crear($1, $2::jsonb, null)", [
    clienteId,
    JSON.stringify(detalle),
  ]);
  return r.rows[0].p_pedidoid;
}

module.exports = { crear };