// Componente puro: recibe un estado y devuelve el HTML de su etiqueta.
import { escapeHtml } from "./util.js";

export function badgeEstado(estado) {
  const clase = String(estado).toLowerCase();
  return `<span class="badge badge-${escapeHtml(clase)}">${escapeHtml(estado)}</span>`;
}
