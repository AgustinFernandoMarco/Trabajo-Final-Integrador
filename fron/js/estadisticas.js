// Pantalla de estadísticas: ventas agrupadas por categoría (GROUP BY en la base).
import { listarVentasPorCategoria } from "./api.js";
import { escapeHtml, formatoPrecio } from "../componentes/util.js";
import { mensajeVacio } from "../componentes/mensajeVacio.js";

const cuerpo = document.querySelector("#cuerpo-estadisticas");

// Devuelve la fila <tr> de una categoría
function filaCategoria(fila) {
  return `
    <tr>
      <td>${escapeHtml(fila.Categoria)}</td>
      <td class="num">${fila.CantPedidos}</td>
      <td class="num">${fila.Unidades}</td>
      <td class="num">${formatoPrecio.format(fila.TotalVendido)}</td>
      <td>${escapeHtml(fila.Productos)}</td>
    </tr>`;
}

async function cargar() {
  try {
    const categorias = await listarVentasPorCategoria();
    cuerpo.innerHTML = categorias.length
      ? categorias.map(filaCategoria).join("")
      : mensajeVacio("Todavía no hay ventas registradas", 5);
  } catch (error) {
    cuerpo.innerHTML = mensajeVacio(`No se pudieron cargar las estadísticas: ${error.message}`, 5);
  }
}

cargar();