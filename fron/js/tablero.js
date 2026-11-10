// Pantalla del tablero: listado con JOIN y búsqueda con filtros.
import { listarPedidos, buscarPedidos } from "./api.js";
import { filaPedido } from "../componentes/filaPedido.js";
import { mensajeVacio } from "../componentes/mensajeVacio.js";

const cuerpo = document.querySelector("#cuerpo-pedidos");
const formulario = document.querySelector("#filtros");

// Devuelve solo los filtros que tienen valor
function leerFiltros() {
  const filtros = {
    texto: document.querySelector("#texto").value.trim(),
    estado: document.querySelector("#estado").value,
    desde: document.querySelector("#desde").value,
    hasta: document.querySelector("#hasta").value,
  };
  return Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor));
}

// Trae los pedidos (con o sin filtros) y los dibuja en la tabla
async function cargar() {
  try {
    const filtros = leerFiltros();
    const hayFiltros = Object.keys(filtros).length > 0;
    const pedidos = hayFiltros ? await buscarPedidos(filtros) : await listarPedidos();
    cuerpo.innerHTML = pedidos.length
      ? pedidos.map(filaPedido).join("")
      : mensajeVacio(
          hayFiltros ? "No hay pedidos que coincidan con la búsqueda" : "Todavía no hay pedidos cargados",
          6
        );
  } catch (error) {
    cuerpo.innerHTML = mensajeVacio(`No se pudo cargar el listado: ${error.message}`, 6);
  }
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  cargar();
});

document.querySelector("#limpiar").addEventListener("click", () => {
  formulario.reset();
  cargar();
});

cargar();