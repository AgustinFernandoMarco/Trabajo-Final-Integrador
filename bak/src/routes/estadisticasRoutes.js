// Rutas de /api/estadisticas
const { Router } = require("express");
const controller = require("../controllers/estadisticasController");

const router = Router();

router.get("/ventas-por-categoria", controller.ventasPorCategoria);

module.exports = router;