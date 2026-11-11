const { consultar } = require("../config/db");

// Ventas agrupadas por categoría (función usp_Estadisticas_VentasPorCategoria de la base)
async function ventasPorCategoria() {
  return consultar("select * from usp_estadisticas_ventasporcategoria()");
}

module.exports = { ventasPorCategoria };