// Rutas de /api/pedidos
const { Router } = require("express");
const pedidosController = require("../controllers/pedidosController");

const router = Router();

router.get("/", pedidosController.listar);
// OJO: las rutas fijas (ej. /buscar) van ANTES de /:id
router.get("/buscar", pedidosController.buscar);

module.exports = router;