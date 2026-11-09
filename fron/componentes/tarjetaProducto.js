// Formateador de pesos argentinos (si util.js ya tiene uno, usá ese)
const pesos = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

// Recibe un producto y devuelve la tarjeta con su botón de agregar
export const tarjetaProducto = (p) => `
  <article class="tarjeta">
    <h3>${p.Nombre}</h3>
    <p class="marca">${p.Marca}</p>
    <p class="precio">${pesos.format(p.Precio)}</p>
    <button class="btn-agregar" data-id="${p.ProductoId}">Agregar</button>
  </article>`;