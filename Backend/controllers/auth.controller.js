const bcrypt = require("bcrypt");
const db = require("../db/connection");

exports.register = (req, res) => {
  const {
    full_name,
    email,
    phone,
    password,
    confirmPassword,
    termsAccepted
  } = req.body;

  //Validaciones
  if (
    !full_name ||
    !email ||
    !phone ||
    !password ||
    !confirmPassword
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Las contraseñas no coinciden" });
  }

  if (!termsAccepted) {
    return res.status(400).json({ error: "Debes aceptar los términos" });
  }

  //Comprobar si el email ya existe
  const checkEmail = "SELECT id FROM users WHERE email = ?";
  db.query(checkEmail, [email], async (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    //Cifrar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    //Insertar usuario (role = user)
    const sql = `
      INSERT INTO users (full_name, email, phone, password)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [full_name, email, phone, hashedPassword],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Error al registrar usuario" });
        }

        res.status(201).json({ message: "Usuario registrado correctamente" });
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  //Validar datos
  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña obligatorios" });
  }

  //Buscar usuario
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error del servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const user = results[0];

    //Comparar contraseñas
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    //Responder SIN contraseña
    res.json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile_image: user.profile_image,
      created_at: user.created_at
    });
  });
};

