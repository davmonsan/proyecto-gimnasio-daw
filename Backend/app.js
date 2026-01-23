const express = require("express");
const cors = require("cors");
const path = require("path");

//Conexión BBDD
const db = require("./db/connection");

//Rutas
const authRoutes = require("./routes/auth.routes");
const reservasRoutes = require("./routes/reservas.routes");
const usersRoutes = require("./routes/users.routes");
const classesRoutes = require("./routes/classes.routes");

const app = express();

app.use(cors());
app.use(express.json());

//Permite acceder a /uploads/...
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

//Rutas API
app.use("/api", authRoutes);
app.use("/api", reservasRoutes);
app.use("/api", usersRoutes);
app.use("/api", classesRoutes);

//Prueba
app.get("/", (req, res) => {
  res.json({ mensaje: "Backend funcionando correctamente" });
});

//Arrancar server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});
