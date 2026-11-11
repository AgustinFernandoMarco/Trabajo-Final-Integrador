const { consultar } = require("../config/db");

// El detalle viaja como JSON; la base lo abre, valida y calcula el total.
// Es un procedure con parámetro OUT, por eso se llama con CALL.
async function crear(clienteId, detalle) {
  const filas = await consultar("call usp_pedidos_crear($1, $2::jsonb, null)", [
    clienteId,
    JSON.stringify(detalle),
  ]);
  // La columna de salida no está en el diccionario de nombres, así que conserva su clave original
  return filas[0].p_pedidoid;
}

module.exports = { crear };