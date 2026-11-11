// Componente puro: devuelve el botón que lleva el pedido al siguiente estado.
// Pendiente pasa a Listo, Listo pasa a Entregado y Entregado ya no tiene acción.
const SIGUIENTE = { Pendiente: "Listo", Listo: "Entregado" };

export function botonEstado(pedido) {
  const siguiente = SIGUIENTE[pedido.Estado];
  if (!siguiente) {
    return `<span class="sin-accion">—</span>`;
  }
  return `<button class="btn-estado" data-id="${pedido.PedidoId}" data-estado="${siguiente}">Marcar ${siguiente}</button>`;
}