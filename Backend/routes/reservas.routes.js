const express = require("express");
const router = express.Router();
const reservasController = require("../controllers/reservas.controller");

router.get("/reservas/:userId", reservasController.getReservasByUser);
router.post("/reservas", reservasController.createReserva);
router.delete("/reservas/:id", reservasController.deleteReserva);

module.exports = router;
