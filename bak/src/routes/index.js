// Agrupa todas las rutas de la API bajo /api
const { Router } = require("express");
const pedidosRoutes = require("./pedidosRoutes");

const router = Router();

router.use("/pedidos", pedidosRoutes);
// router.use("/productos", productosRoutes);       // integrante A
// router.use("/estadisticas", estadisticasRoutes); // integrante C

module.exports = router;
