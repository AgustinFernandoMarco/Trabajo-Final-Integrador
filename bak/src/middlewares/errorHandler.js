// Middleware de errores centralizado.
// Traduce los códigos propios de SQL Server (50001 a 50999) a HTTP 400 / 404.
// Los errores inesperados responden 500 sin exponer detalles internos.

// Códigos que significan "no encontrado" (ver script.sql)
const CODIGOS_404 = [50004, 50006];

function noEncontrado(req, res) {
  res.status(404).json({ ok: false, mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  const codigo = err.number ?? err.originalError?.info?.number;

  if (codigo >= 50000 && codigo < 51000) {
    const status = CODIGOS_404.includes(codigo) ? 404 : 400;
    return res.status(status).json({ ok: false, codigo, mensaje: err.message });
  }

  // Errores armados a mano con un status (ej. un parámetro faltante)
  if (err.status) {
    return res.status(err.status).json({ ok: false, mensaje: err.message });
  }

  console.error(err);
  res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
}

module.exports = { errorHandler, noEncontrado };
