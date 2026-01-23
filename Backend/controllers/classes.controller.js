const db = require("../db/connection");


//GET todas las clases
exports.getAllClasses = (req, res) => {
  db.query("SELECT * FROM clases", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error obteniendo clases" });
    }
    res.json(results);
  });
};

//GET una clase
exports.getClassById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM clases WHERE id = ?", [id], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).json({ error: "Clase no encontrada" });
    }
    res.json(rows[0]);
  });
};

//POST crear clase
exports.createClass = (req, res) => {
  const {
    name,
    trainer,
    class_date,
    class_time,
    max_capacity,
    description
  } = req.body;

  const sql = `
    INSERT INTO clases
    (name, trainer, class_date, class_time, max_capacity, available_capacity, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      trainer,
      class_date,
      class_time,
      max_capacity,
      max_capacity,
      description
    ],
    err => {
      if (err) {
        return res.status(500).json({ error: "Error creando clase" });
      }
      res.json({ message: "Clase creada correctamente" });
    }
  );
};

//PUT actualizar clase
exports.updateClass = (req, res) => {
  const { id } = req.params;
  const {
    name,
    trainer,
    class_date,
    class_time,
    max_capacity,
    description
  } = req.body;

  const sql = `
    UPDATE clases
    SET name=?, trainer=?, class_date=?, class_time=?, max_capacity=?, description=?
    WHERE id=?
  `;

  db.query(
    sql,
    [name, trainer, class_date, class_time, max_capacity, description, id],
    err => {
      if (err) {
        return res.status(500).json({ error: "Error actualizando clase" });
      }
      res.json({ message: "Clase actualizada correctamente" });
    }
  );
};

//DELETE eliminar clase
exports.deleteClass = (req, res) => {
  const { id } = req.params;

  //Borrar reservas asociadas
  const deleteReservas = "DELETE FROM reservas WHERE class_id = ?";

  db.query(deleteReservas, [id], err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error eliminando reservas" });
    }

    //Borrar la clase
    const deleteClase = "DELETE FROM clases WHERE id = ?";

    db.query(deleteClase, [id], err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error eliminando clase" });
      }

      res.json({ message: "Clase eliminada correctamente" });
    });
  });
};
