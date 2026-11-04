// Pantalla del tablero: base → API → pantalla (circuito de referencia).
import { listarPedidos } from "./api.js";
import { filaPedido } from "../componentes/filaPedido.js";
import { mensajeVacio } from "../componentes/mensajeVacio.js";

const cuerpo = document.querySelector("#cuerpo-pedidos");

async function cargar() {
  try {
    const pedidos = await listarPedidos();
    cuerpo.innerHTML = pedidos.length
      ? pedidos.map(filaPedido).join("")
      : mensajeVacio("Todavía no hay pedidos cargados", 6);
  } catch (error) {
    cuerpo.innerHTML = mensajeVacio(`No se pudo cargar el listado: ${error.message}`, 6);
  }
}

cargar();
