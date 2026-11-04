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
