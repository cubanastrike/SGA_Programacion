
const { verifyToken } = require("../middlewares/authMiddleware")
const express = require("express")

const {
    obtenerCursos,
    obtenerCurso,
    crearCurso,
    actualizarCurso,
    eliminarCurso } = require("../controllers/cursos.controller")
const router = express.Router()

router.get("/", verifyToken, obtenerCursos)

router.get("/:id", verifyToken, obtenerCurso)

router.post("/", verifyToken, crearCurso)

router.put("/:id", verifyToken, actualizarCurso)

router.delete("/:id", verifyToken, eliminarCurso)

module.exports = router