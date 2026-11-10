// Capa de controller: recibe la request, llama al service y responde. Sin try/catch (lo maneja asyncHandler).
const asyncHandler = require("../middlewares/asyncHandler");
const { errorHttp } = require("../middlewares/errorHandler");
const pedidosService = require("../services/pedidosService");

const ESTADOS = ["Pendiente", "Listo", "Entregado"];

const listar = asyncHandler(async (req, res) => {
  const pedidos = await pedidosService.listar();
  res.json(pedidos);
});

// Los filtros llegan por query string: /api/pedidos/buscar?texto=&estado=&desde=&hasta=
const buscar = asyncHandler(async (req, res) => {
  const { texto, estado, desde, hasta } = req.query;
  if (estado && !ESTADOS.includes(estado)) {
    throw errorHttp(400, "El estado debe ser Pendiente, Listo o Entregado.");
  }
  if ((desde && Number.isNaN(Date.parse(desde))) || (hasta && Number.isNaN(Date.parse(hasta)))) {
    throw errorHttp(400, "Las fechas deben tener formato AAAA-MM-DD.");
  }
  const pedidos = await pedidosService.buscar({ texto, estado, desde, hasta });
  res.json(pedidos);
});

// El id llega por la URL y el nuevo estado por el body: PATCH /api/pedidos/:id/estado { "estado": "Listo" }
const cambiarEstado = asyncHandler(async (req, res) => {
  const pedidoId = Number(req.params.id);
  const { estado } = req.body;
  if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
    throw errorHttp(400, "El id del pedido no es válido.");
  }
  if (!ESTADOS.includes(estado)) {
    throw errorHttp(400, "El estado debe ser Pendiente, Listo o Entregado.");
  }
  await pedidosService.cambiarEstado(pedidoId, estado);
  res.json({ ok: true, mensaje: `El pedido ${pedidoId} pasó a ${estado}.` });
});

module.exports = { listar, buscar, cambiarEstado };