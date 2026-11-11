import { mensajeVacio } from "./mensajeVacio.js";

const pesos = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

// Recibe las líneas derivadas y el total estimado; devuelve el resumen
export const resumenPedido = (lineas, total) => {
  if (!lineas.length) return mensajeVacio("Todavía no agregaste productos");
  const filas = lineas
    .map(
      (l) => `
      <li>
        ${l.cantidad} x ${l.Nombre} — ${pesos.format(l.subtotal)}
        <button class="btn-quitar" data-id="${l.ProductoId}">Quitar</button>
      </li>`
    )
    .join("");
  return `
    <ul class="lista-resumen">${filas}</ul>
    <p class="total">Total estimado: <strong>${pesos.format(total)}</strong></p>`;
};