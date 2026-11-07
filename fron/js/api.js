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
// (Santino reemplaza esta línea por sus funciones)
// ===== Marlumile: estadísticas y cambio de estado =====
// (Marlumile reemplaza esta línea por sus funciones)