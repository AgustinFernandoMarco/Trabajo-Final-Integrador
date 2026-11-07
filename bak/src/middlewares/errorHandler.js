// Middleware de errores centralizado.
// Traduce los códigos propios de la base (P0001 a P0006, ver db/script.sql) a HTTP 400 / 404.
// Los errores inesperados responden 500 sin exponer detalles internos.

// Códigos que significan "no encontrado"
const CODIGOS_404 = ["P0004", "P0006"];

// Códigos de datos inválidos (los P000x del script, más restricciones de la base)
const CODIGOS_400 = ["P0001", "P0002", "P0003", "P0005", "23503", "23514"];

function noEncontrado(req, res) {
  res.status(404).json({ 
    ok: false, 
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` 
  });
}

// Crea un error con código HTTP para lanzarlo desde un controller.
// Lo atiende errorHandler y responde { ok: false, mensaje }.
function errorHttp(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

function errorHandler(err, req, res, next) {
  const codigo = err.code; // en Postgres el código del RAISE EXCEPTION llega en err.code

  if (CODIGOS_404.includes(codigo)) {
    return res.status(404).json({ ok: false, codigo, mensaje: err.message });
  }

  if (CODIGOS_400.includes(codigo)) {
    return res.status(400).json({ ok: false, codigo, mensaje: err.message });
  }

  if (codigo === "22P02") {
    return res.status(400).json({ ok: false, codigo, mensaje: "Algún dato tiene un formato inválido" });
  }

  // Errores armados a mano con un status (ej. un parámetro faltante)
  if (err.status) {
    return res.status(err.status).json({ ok: false, mensaje: err.message });
  }

  console.error(err);
  res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
}

module.exports = { errorHandler, noEncontrado, errorHttp };