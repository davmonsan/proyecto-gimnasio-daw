const bcrypt = require("bcrypt");
const db = require("../db/connection");

// Registro
exports.register = (req, res) => {
  const {
    full_name,
    email,
    phone,
    password,
    confirmPassword,
    termsAccepted
  } = req.body;

  // Validaciones básicas
  if (!full_name || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Las contraseñas no coinciden" });
  }

  if (!termsAccepted) {
    return res.status(400).json({ error: "Debes aceptar los términos" });
  }

  // Comprobar si el email ya existe
  const checkEmail = "SELECT id FROM users WHERE email = ?";

  db.query(checkEmail, [email], async (err, results) => {

    if (err) {
      console.error("Error SQL (checkEmail):", err);
      return res.status(500).json({ error: "Error del servidor" });
    }

    if (results && results.length > 0) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    try {
      // Cifrar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar usuario
      const insertUser = `
        INSERT INTO users (full_name, email, phone, password)
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        insertUser,
        [full_name, email, phone, hashedPassword],
        (err, result) => {

          if (err) {
            console.error("Error SQL (insertUser):", err);
            return res.status(500).json({ error: "Error al registrar usuario" });
          }

          res.status(201).json({ message: "Usuario registrado correctamente" });
        }
      );

    } catch (error) {
      console.error("Error bcrypt:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }

  });
};


// Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña obligatorios" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {

    if (err) {
      console.error("Error SQL (login):", err);
      return res.status(500).json({ error: "Error del servidor" });
    }

    if (!results || results.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const user = results[0];

    try {
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
      }

      res.json({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile_image: user.profile_image,
        created_at: user.created_at
      });

    } catch (error) {
      console.error("Error bcrypt (login):", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }

  });
};