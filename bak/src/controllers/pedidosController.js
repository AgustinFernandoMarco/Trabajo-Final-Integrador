// Capa de controller: recibe la request, llama al service y responde. Sin try/catch (lo maneja asyncHandler).
const asyncHandler = require("../middlewares/asyncHandler");
const pedidosService = require("../services/pedidosService");

const listar = asyncHandler(async (req, res) => {
  const pedidos = await pedidosService.listar();
  res.json(pedidos);
});

module.exports = { listar };
