const Materia = require("../models/Materia")

async function obtenerMaterias(req, res) {
    const materias = await Materia.find()
    res.json(materias)
}

async function obtenerMateria(req, res) {
    const materia = await Materia.findOne({
        codigo: req.params.codigo
    })

    if (!materia) {
        return res.status(404).json({
            mensaje: "Materia no encontrada"
        })
    }

    res.json(materia)
}

async function crearMateria(req, res) {
    const { codigo, nombre, descripcion, cargaHoraria, estado } = req.body || {}

    if (!codigo || !nombre || cargaHoraria === undefined || !estado) {
        return res.status(400).json({
            mensaje: "Completá los campos obligatorios"
        })
    }

    if (typeof codigo !== "string" || typeof nombre !== "string") {
        return res.status(400).json({
            mensaje: "El código y el nombre deben ser texto"
        })
    }

    if (codigo !== codigo.trim() || !nombre.trim()) {
        return res.status(400).json({
            mensaje: "Revisá el código y el nombre"
        })
    }

    if (descripcion !== undefined && typeof descripcion !== "string") {
        return res.status(400).json({
            mensaje: "La descripción debe ser un texto"
        })
    }

    if (descripcion && !descripcion.trim()) {
        return res.status(400).json({
            mensaje: "La descripción no puede contener solo espacios"
        })
    }

    const carga = Number(cargaHoraria)
    if (!Number.isInteger(carga) || carga <= 0) {
        return res.status(400).json({
            mensaje: "La carga horaria debe ser un número entero mayor que cero"
        })
    }

    if (estado !== "activa" && estado !== "inactiva") {
        return res.status(400).json({
            mensaje: "El estado debe ser activa o inactiva"
        })
    }

    const existe = await Materia.findOne({ codigo })
    if (existe) {
        return res.status(400).json({
            mensaje: "Ya existe una materia con ese código"
        })
    }

    const nuevaMateria = await Materia.create({
        codigo,
        nombre: nombre.trim(),
        descripcion: descripcion ? descripcion.trim() : "",
        cargaHoraria: carga,
        estado
    })

    res.status(201).json(nuevaMateria)
}

async function actualizarMateria(req, res) {
    const codigoOriginal = req.params.codigo
    const { codigo, nombre, descripcion, cargaHoraria, estado } = req.body || {}
    const materiaExistente = await Materia.findOne({ codigo: codigoOriginal })

    if (!materiaExistente) {
        return res.status(404).json({
            mensaje: "Materia no encontrada"
        })
    }

    const codigoNuevo = codigo === undefined ? materiaExistente.codigo : codigo
    const nombreNuevo = nombre === undefined ? materiaExistente.nombre : nombre
    const descripcionNueva = descripcion === undefined ? materiaExistente.descripcion : descripcion
    const cargaNueva = cargaHoraria === undefined
        ? materiaExistente.cargaHoraria
        : Number(cargaHoraria)
    const estadoNuevo = estado === undefined ? materiaExistente.estado : estado

    if (typeof codigoNuevo !== "string" || codigoNuevo !== codigoNuevo.trim()) {
        return res.status(400).json({
            mensaje: "El código no puede tener espacios al comienzo o al final"
        })
    }

    if (typeof nombreNuevo !== "string" || !nombreNuevo.trim()) {
        return res.status(400).json({
            mensaje: "El nombre es obligatorio"
        })
    }

    if (typeof descripcionNueva !== "string" || (descripcionNueva && !descripcionNueva.trim())) {
        return res.status(400).json({
            mensaje: "La descripción debe ser un texto válido"
        })
    }

    if (!Number.isInteger(cargaNueva) || cargaNueva <= 0) {
        return res.status(400).json({
            mensaje: "La carga horaria debe ser un número entero mayor que cero"
        })
    }

    if (estadoNuevo !== "activa" && estadoNuevo !== "inactiva") {
        return res.status(400).json({
            mensaje: "El estado debe ser activa o inactiva"
        })
    }

    if (codigoNuevo !== codigoOriginal) {
        const existe = await Materia.findOne({ codigo: codigoNuevo })
        if (existe) {
            return res.status(400).json({
                mensaje: "El código ya existe"
            })
        }
    }

    const materia = await Materia.findOneAndUpdate(
        { codigo: codigoOriginal },
        {
            codigo: codigoNuevo,
            nombre: nombreNuevo.trim(),
            descripcion: descripcionNueva.trim(),
            cargaHoraria: cargaNueva,
            estado: estadoNuevo
        },
        { returnDocument: "after" }
    )

    if (!materia) {
        return res.status(404).json({
            mensaje: "Materia no encontrada"
        })
    }

    res.json(materia)
}

async function eliminarMateria(req, res) {
    const materia = await Materia.findOneAndDelete({
        codigo: req.params.codigo
    })

    if (!materia) {
        return res.status(404).json({
            mensaje: "Materia no encontrada"
        })
    }

    res.json({
        mensaje: "Materia eliminada correctamente"
    })
}

module.exports = {
    obtenerMaterias,
    obtenerMateria,
    crearMateria,
    actualizarMateria,
    eliminarMateria
}
