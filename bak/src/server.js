// Punto de entrada: levanta el servidor.
require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CelularesVR funcionando en http://localhost:${PORT}`);
});
