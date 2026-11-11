// Configuración de Express: middlewares, API y sitio estático.
const path = require("path");
const express = require("express");
const rutas = require("./routes");
const { errorHandler, noEncontrado } = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

// El back sirve el front: todo el sistema se abre en http://localhost:3000
app.use(express.static(path.join(__dirname, "..", "..", "fron")));

app.use("/api", rutas);
app.use("/api", noEncontrado);
app.use(errorHandler);

module.exports = app;

