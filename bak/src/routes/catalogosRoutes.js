const router = require("express").Router();
const c = require("../controllers/catalogosController");

router.get("/categorias", c.categorias);
router.get("/productos", c.productos);
router.get("/clientes", c.clientes);

module.exports = router;