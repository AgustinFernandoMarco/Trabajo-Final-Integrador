// Componente puro: recibe un pedido y devuelve una fila <tr>.
import { escapeHtml, formatoPrecio, formatoFecha } from "./util.js";
import { badgeEstado } from "./badgeEstado.js";

// Cada estado solo puede avanzar al siguiente (la base no deja retroceder ni saltear)
const SIGUIENTE_ESTADO = { Pendiente: "Listo", Listo: "Entregado" };

function celdaAccion(pedido) {
  const siguiente = SIGUIENTE_ESTADO[pedido.Estado];
  if (!siguiente) return "<td>—</td>";
  return `<td><button class="btn-estado" data-id="${pedido.PedidoId}" data-estado="${siguiente}">Pasar a ${siguiente}</button></td>`;
}

export function filaPedido(pedido) {
  return `
    <tr>
      <td>${pedido.PedidoId}</td>
      <td>${formatoFecha.format(new Date(pedido.Fecha))}</td>
      <td>${escapeHtml(pedido.Cliente)}</td>
      <td>${escapeHtml(pedido.Productos)}</td>
      <td class="num">${formatoPrecio.format(pedido.Total)}</td>
      <td>${badgeEstado(pedido.Estado)}</td>
      ${celdaAccion(pedido)}
    </tr>`;
}