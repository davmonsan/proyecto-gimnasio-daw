const db = require("../db/connection");

//GET reservas por usuario
exports.getReservasByUser = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT
      r.id AS reservation_id,
      c.id AS class_id,
      c.name,
      c.trainer,
      c.class_date,
      c.class_time,
      c.max_capacity,
      c.available_capacity
    FROM reservas r
    JOIN clases c ON r.class_id = c.id
    WHERE r.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error obteniendo reservas:", err);
      return res.status(500).json({ error: "Error obteniendo reservas" });
    }

    res.json(results);
  });
};

//POST crear reserva
exports.createReserva = (req, res) => {
  const { userId, classId } = req.body;

  if (!userId || !classId) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  //Comprobar plazas disponibles
  const checkCapacity =
    "SELECT available_capacity FROM clases WHERE id = ?";

  db.query(checkCapacity, [classId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ error: "Clase no encontrada" });
    }

    if (results[0].available_capacity <= 0) {
      return res.status(400).json({ error: "No hay plazas disponibles" });
    }

    //Insertar reserva
    const insertReservation =
      "INSERT INTO reservas (user_id, class_id) VALUES (?, ?)";

    db.query(insertReservation, [userId, classId], err => {
      if (err) {
        return res
          .status(400)
          .json({ error: "Ya estás apuntado a esta clase" });
      }

      //Restar plaza
      const updateCapacity =
        "UPDATE clases SET available_capacity = available_capacity - 1 WHERE id = ?";

      db.query(updateCapacity, [classId], err => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error actualizando plazas" });
        }

        res.json({ message: "Reserva realizada correctamente" });
      });
    });
  });
};

//DELETE cancelar reserva
exports.deleteReserva = (req, res) => {
  const reservationId = req.params.id;

  //Obtener la reserva
  const selectSql = "SELECT class_id FROM reservas WHERE id = ?";

  db.query(selectSql, [reservationId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error obteniendo reserva" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    const classId = rows[0].class_id;

    //Sumar plaza
    const updateSql = `
      UPDATE clases
      SET available_capacity = available_capacity + 1
      WHERE id = ?
    `;

    db.query(updateSql, [classId], err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error actualizando plazas" });
      }

      //Borrar reserva
      const deleteSql = "DELETE FROM reservas WHERE id = ?";

      db.query(deleteSql, [reservationId], err => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error eliminando reserva" });
        }

        res.json({ message: "Reserva cancelada correctamente" });
      });
    });
  });
};
