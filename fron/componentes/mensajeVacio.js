// Componente puro: fila con un texto para cuando no hay datos (o hubo un error).
import { escapeHtml } from "./util.js";

export function mensajeVacio(texto, columnas) {
  return `<tr><td colspan="${columnas}" class="vacio">${escapeHtml(texto)}</td></tr>`;
}
