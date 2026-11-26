const Curso = require("../models/Cursos")

async function obtenerCursos(req, res) {
    const cursos = await Curso.find()
    res.json(cursos)
}

async function obtenerCurso(req, res) {
    const curso = await Curso.findOne({
        codigo: req.params.id
    })
    if (!curso) {
        return res.status(404).json({
            mensaje: "Curso no encontrado"
        })
    }
    res.json(curso)
}

async function crearCurso(req, res) {
    const { codigo, nombre, descripcion, duracion } = req.body
    if (!codigo || !nombre || !descripcion || !duracion) {
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios"
        })
    }
    if (typeof codigo !== "string" || typeof nombre !== "string" || typeof descripcion !== "string") {
        return res.status(400).json({
            mensaje: "El código, el nombre y la descripción deben ser un texto"
        })
    }
    if (typeof duracion !== "number") {
        return res.status(400).json({
            mensaje: "La duración debe ser un número"
        })
    }
    const existe = await Curso.findOne({
        codigo
    })
    if (existe) {
        return res.status(400).json({
            mensaje: "El código ya existe"
        })
    }
    const nuevoCurso = await Curso.create({
        codigo,
        nombre,
        descripcion,
        duracion
    })
    res.status(201).json(nuevoCurso)
}

async function actualizarCurso(req, res) {
    const { nombre, descripcion, duracion } = req.body
    const curso = await Curso.findOneAndUpdate(
        { codigo: req.params.id },
        { nombre, descripcion, duracion },
        { returnDocument: "after" }
    )
    if (!curso) {
        return res.status(404).json({
            mensaje: "Curso no encontrado"
        })
    }

    res.json(curso)
}

async function eliminarCurso(req, res) {
    const curso = await Curso.findOneAndDelete(
        { codigo: req.params.id }
    )
    if (!curso) {
        return res.status(404).json({
            mensaje: "Curso no encontrado"
        })
    }

    res.json({ mensaje: "Curso eliminado correctamente" })
}

module.exports = {
    obtenerCursos,
    obtenerCurso,
    crearCurso,
    actualizarCurso,
    eliminarCurso
}