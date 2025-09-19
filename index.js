// index.js
const express = require("express");
const cors = require("cors");
const app = express();
const routerApi = require('./routes');
require('./db'); // Solo necesitas importarlo para que se inicialice

app.use(express.json());
app.use(cors());

// Conecta todas las rutas a la aplicación
routerApi(app);

// Conexión al servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));