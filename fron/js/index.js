import { listarProductos, listarClientes, crearPedido } from "./api.js";
import { tarjetaProducto } from "../componentes/tarjetaProducto.js";
import { resumenPedido } from "../componentes/resumenPedido.js";
import { mensajeVacio } from "../componentes/mensajeVacio.js";

// Estado mínimo: solo ids y cantidades
let estado = { clienteId: null, carrito: [] }; // carrito: [{ productoId, cantidad }]
let productos = []; // catálogo que llega de la API (no es parte del pedido)
let clientes = [];

// Derivados: se calculan cada vez, no se guardan en el estado
const lineas = () =>
  estado.carrito.map((item) => {
    const p = productos.find((x) => x.ProductoId === item.productoId);
    return { ...p, cantidad: item.cantidad, subtotal: p.Precio * item.cantidad };
  });
const totalEstimado = () => lineas().reduce((acc, l) => acc + l.subtotal, 0);

// Agrega un producto o suma una unidad si ya estaba
function agregar(productoId) {
  const existe = estado.carrito.some((i) => i.productoId === productoId);
  estado = {
    ...estado,
    carrito: existe
      ? estado.carrito.map((i) =>
          i.productoId === productoId ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      : [...estado.carrito, { productoId, cantidad: 1 }],
  };
  render();
}

// Resta una unidad y elimina la línea si llega a cero
function quitar(productoId) {
  estado = {
    ...estado,
    carrito: estado.carrito
      .map((i) => (i.productoId === productoId ? { ...i, cantidad: i.cantidad - 1 } : i))
      .filter((i) => i.cantidad > 0),
  };
  render();
}

// Muestra un mensaje de éxito o error en pantalla
function mostrarMensaje(texto, esError = false) {
  const el = document.querySelector("#mensaje");
  el.textContent = texto;
  el.className = esError ? "mensaje error" : "mensaje ok";
}

// Dibuja catálogo, selector de cliente y resumen
function render() {
  const cat = document.querySelector("#catalogo");
  cat.innerHTML = productos.length
    ? productos.map(tarjetaProducto).join("")
    : mensajeVacio("Todavía no hay productos cargados");

  document.querySelector("#resumen").innerHTML = resumenPedido(lineas(), totalEstimado());

  // El botón confirmar solo se habilita con cliente y al menos una línea
  document.querySelector("#btn-confirmar").disabled =
    !estado.clienteId || estado.carrito.length === 0;
}

// Envía el pedido; el total real lo calcula la base
async function confirmar() {
  try {
    const { pedidoId } = await crearPedido({
      clienteId: estado.clienteId,
      detalle: estado.carrito,
    });
    estado = { ...estado, carrito: [] };
    render();
    mostrarMensaje(`Pedido #${pedidoId} creado correctamente`);
  } catch (e) {
    mostrarMensaje(e.message, true); // stock insuficiente, etc.
  }
}

// Carga inicial: catálogos y eventos
async function iniciar() {
  try {
    [productos, clientes] = await Promise.all([listarProductos(), listarClientes()]);
  } catch (e) {
    mostrarMensaje(e.message, true);
    return;
  }

  const select = document.querySelector("#select-cliente");
  select.innerHTML =
    `<option value="">Elegí un cliente</option>` +
    clientes.map((c) => `<option value="${c.ClienteId}">${c.Nombre}</option>`).join("");
  select.addEventListener("change", () => {
    estado = { ...estado, clienteId: select.value ? Number(select.value) : null };
    render();
  });

  // Delegación de eventos: un solo listener por contenedor
  document.querySelector("#catalogo").addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-agregar");
    if (btn) agregar(Number(btn.dataset.id));
  });
  document.querySelector("#resumen").addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-quitar");
    if (btn) quitar(Number(btn.dataset.id));
  });
  document.querySelector("#btn-confirmar").addEventListener("click", confirmar);

  render();
}

iniciar();