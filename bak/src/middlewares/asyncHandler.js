// Envuelve un controller async: cualquier error va a next() y lo atiende el middleware de errores.
// Así los controllers no repiten try/catch.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
