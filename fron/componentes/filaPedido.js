// Componente puro: recibe un pedido y devuelve una fila <tr>.
import { escapeHtml, formatoPrecio, formatoFecha } from "./util.js";
import { badgeEstado } from "./badgeEstado.js";

export function filaPedido(pedido) {
  return `
    <tr>
      <td>${pedido.PedidoId}</td>
      <td>${formatoFecha.format(new Date(pedido.Fecha))}</td>
      <td>${escapeHtml(pedido.Cliente)}</td>
      <td>${escapeHtml(pedido.Productos)}</td>
      <td class="num">${formatoPrecio.format(pedido.Total)}</td>
      <td>${badgeEstado(pedido.Estado)}</td>
    </tr>`;
}
