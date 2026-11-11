const asyncHandler = require("../middlewares/asyncHandler");
const service = require("../services/catalogosService");

// Devuelve todas las categorías
exports.categorias = asyncHandler(async (req, res) => {
  res.json(await service.listarCategorias());
});

// Devuelve productos, filtrando por categoría si viene en la query
exports.productos = asyncHandler(async (req, res) => {
  const categoriaId = req.query.categoriaId ? Number(req.query.categoriaId) : null;
  res.json(await service.listarProductos(categoriaId));
});

// Devuelve todos los clientes
exports.clientes = asyncHandler(async (req, res) => {
  res.json(await service.listarClientes());
});