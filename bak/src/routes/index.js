// Agrupa todas las rutas de la API bajo /api
const { Router } = require("express");
const pedidosRoutes = require("./pedidosRoutes");
const router = Router();
// ----- Agus: listado y búsqueda de pedidos -----
router.use("/pedidos", pedidosRoutes);
// ----- Santino: catálogos y alta de pedido -----
// (Santino reemplaza esta línea por sus router.use)
// ----- Marlumile: estadísticas y cambio de estado -----
// (Marlumile reemplaza esta línea por sus router.use)
module.exports = router;