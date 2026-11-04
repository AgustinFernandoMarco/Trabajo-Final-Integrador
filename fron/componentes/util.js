// Utilidades compartidas por los componentes.

// Precios en pesos argentinos
export const formatoPrecio = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

// Fechas en formato local
export const formatoFecha = new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" });

// Evita que un texto de la base se interprete como HTML
export function escapeHtml(texto) {
  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
