const express = require("express");
const router = express.Router();
const classesController = require("../controllers/classes.controller");

router.get("/clases", classesController.getAllClasses);
router.post("/clases", classesController.createClass);
router.get("/clases/:id", classesController.getClassById);
router.put("/clases/:id", classesController.updateClass);
router.delete("/clases/:id", classesController.deleteClass);

module.exports = router;