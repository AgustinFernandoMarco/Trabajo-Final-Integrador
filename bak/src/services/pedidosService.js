// Capa de servicio: habla con la base. Solo ejecuta funciones y procedimientos almacenados.
// Si un SP recibe datos del usuario, SIEMPRE con parámetros $1, $2 (nunca concatenar SQL).
const { consultar } = require("../config/db");

// Listado con JOIN (usp_Pedidos_Listar)
async function listar() {
  return consultar("SELECT * FROM usp_Pedidos_Listar()");
}

// Búsqueda con filtros opcionales (usp_Pedidos_Buscar). Un filtro vacío viaja como null.
async function buscar({ texto, estado, desde, hasta }) {
  return consultar(
    "SELECT * FROM usp_Pedidos_Buscar($1::varchar, $2::varchar, $3::date, $4::date)",
    [texto || null, estado || null, desde || null, hasta || null]
  );
}

// Cambio de estado (usp_Pedidos_CambiarEstado). Es un PROCEDURE, por eso se llama con CALL.
async function cambiarEstado(pedidoId, nuevoEstado) {
  return consultar("CALL usp_Pedidos_CambiarEstado($1::int, $2::varchar)", [
    pedidoId,
    nuevoEstado,
  ]);
}

module.exports = { listar, buscar, cambiarEstado };