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
// (Agus reemplaza esta línea por sus funciones)
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
// (Marlumile reemplaza esta línea por sus funciones)