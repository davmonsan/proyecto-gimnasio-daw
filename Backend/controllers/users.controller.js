const db = require("../db/connection");

exports.updateProfileImage = (req, res) => {
  const userId = req.params.userId;

  if (!req.file) {
    return res.status(400).json({ error: "No se ha subido ninguna imagen" });
  }

  const imagePath = `/uploads/profile-images/${req.file.filename}`;

  const sql = "UPDATE users SET profile_image = ? WHERE id = ?";
  db.query(sql, [imagePath, userId], err => {
    if (err) {
      return res.status(500).json({ error: "Error guardando imagen" });
    }

    res.json({ imageUrl: imagePath });
  });
};
