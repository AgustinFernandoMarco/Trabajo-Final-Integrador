const asyncHandler = require("../middlewares/asyncHandler");
const service = require("../services/altaPedidoService");

// Crea el pedido y responde 201 con el id generado por la base
exports.crear = asyncHandler(async (req, res) => {
  const { clienteId, detalle } = req.body;
  const pedidoId = await service.crear(clienteId, detalle);
  res.status(201).json({ pedidoId });
});