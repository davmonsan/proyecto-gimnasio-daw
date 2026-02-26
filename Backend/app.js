const express = require("express");
const cors = require("cors");
const path = require("path");

// Conexión BBDD
const db = require("./db/connection");

// Rutas API
const authRoutes = require("./routes/auth.routes");
const reservasRoutes = require("./routes/reservas.routes");
const usersRoutes = require("./routes/users.routes");
const classesRoutes = require("./routes/classes.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Servir carpeta uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// 🔥 Servir carpeta Frontend completa (HTML, CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, "../Frontend")));

// 🔥 Página inicial → login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/pages/login.html"));
});

// Rutas API
app.use("/api", authRoutes);
app.use("/api", reservasRoutes);
app.use("/api", usersRoutes);
app.use("/api", classesRoutes);

// Arrancar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend en puerto ${PORT}`);
});