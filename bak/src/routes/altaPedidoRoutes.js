const router = require("express").Router();
const c = require("../controllers/altaPedidoController");

router.post("/", c.crear);

module.exports = router;