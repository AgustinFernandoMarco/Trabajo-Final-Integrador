// Middleware de gestión de errores centralizado para Express

// Códigos de Postgres que significan "No encontrado" (ej: RAISE EXCEPTION 'P0004')
const CODIGOS_404 = new Set(["P0004", "P0006"]);

// Códigos de Postgres/App para datos inválidos o violaciones de restricciones:
// P0001-P0005: Errores personalizados del script SQL
// 23503: Violación de llave foránea (Foreign Key)
// 23514: Violación de restricción Check (Check Constraint)
const CODIGOS_400 = new Set(["P0001", "P0002", "P0003", "P0005", "23503", "23514"]);

/**
 * Middleware para capturar rutas inexistentes (404 Not Found).
 */
function noEncontrado(req, res) {
  res.status(404).json({
    ok: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Crea una instancia de Error con un código de estado HTTP personalizado.
 * Utilízalo en tus controladores para lanzar errores controlados con 'throw'.
 * 
 * @param {number} status - Código de estado HTTP (ej: 400, 401, 403)
 * @param {string} mensaje - Mensaje descriptivo para el cliente
 * @returns {Error} Instancia de Error configurada
 */
function errorHttp(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

/**
 * Middleware global de manejo de errores de Express.
 * Debe registrarse al final de todas las rutas de la aplicación.
 */
function errorHandler(err, req, res, _next) {
  const codigo = err.code; // Postgres expone su código de error en err.code

  // 1. Errores de Base de Datos mapeados a 404 (No encontrado)
  if (CODIGOS_404.has(codigo)) {
    return res.status(404).json({ ok: false, codigo, mensaje: err.message });
  }

  // 2. Errores de Base de Datos mapeados a 400 (Bad Request)
  if (CODIGOS_400.has(codigo)) {
    return res.status(400).json({ ok: false, codigo, mensaje: err.message });
  }

  // 3. Error específico de Postgres para tipos de datos inválidos (ej: pasar texto a un UUID/Integer)
  if (codigo === "22P02") {
    return res.status(400).json({ 
      ok: false, 
      codigo, 
      mensaje: "Algún dato tiene un formato inválido" 
    });
  }

  // 4. Errores manuales lanzados desde controladores usando errorHttp()
  if (err.status) {
    return res.status(err.status).json({ ok: false, mensaje: err.message });
  }

  // 5. Errores inesperados o bugs del sistema (500) - No exponen detalles internos
  console.error("--- ERROR NO CONTROLADO ---");
  console.error(err);
  console.error("---------------------------");
  
  return res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
}

module.exports = { errorHandler, noEncontrado, errorHttp };
