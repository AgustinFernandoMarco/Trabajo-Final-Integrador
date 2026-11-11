const asyncHandler = require("../middlewares/asyncHandler");
const service = require("../services/estadisticasService");

// Devuelve las ventas agrupadas por categoría
exports.ventasPorCategoria = asyncHandler(async (req, res) => {
  res.json(await service.ventasPorCategoria());
});