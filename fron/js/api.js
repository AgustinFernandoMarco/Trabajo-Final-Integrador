// ÚNICO lugar donde viven los fetch. Ninguna página usa URLs sueltas.
const API_URL = "/api";

async function pedirJSON(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    // El back devuelve { ok:false, mensaje } cuando algo sale mal
    throw new Error(datos.mensaje || "Error al comunicarse con el servidor");
  }
  return datos;
}

export const listarPedidos = () => pedirJSON("/pedidos");

// ===== Agus: búsqueda de pedidos y botones de estado =====
export const buscarPedidos = (filtros) =>
  pedirJSON(`/pedidos/buscar?${new URLSearchParams(filtros).toString()}`);
// ===== Santino: catálogos y alta de pedido =====
// Trae el catálogo de productos (la base manda los precios)
// ===== Santino: catálogos y alta de pedido =====
// Trae el catálogo de productos (la base manda los precios)
export const listarProductos = () => pedirJSON("/productos");

// Trae los clientes para el selector
export const listarClientes = () => pedirJSON("/clientes");

// Envía el pedido; si la API devuelve error, pedirJSON lanza el mensaje del back
export const crearPedido = (datos) =>
  pedirJSON("/pedidos", { method: "POST", body: JSON.stringify(datos) });
// ===== Marlumile: estadísticas y cambio de estado =====
export const cambiarEstadoPedido = (pedidoId, estado) =>
  pedirJSON(`/pedidos/${pedidoId}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ estado }),
  });
  export const listarVentasPorCategoria = () => pedirJSON("/estadisticas/ventas-por-categoria");