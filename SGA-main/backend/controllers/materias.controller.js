const Materia = require("../models/Materia");

// Valida los datos en la capa de negocio para devolver mensajes claros antes de consultar/guardar.
function validarDatosMateria(data = {}) {
  const {
    codigo,
    nombre,
    descripcion,
    cargaHoraria,
    estado
  } = data;

  if (codigo === undefined || codigo === null || String(codigo).trim() === "") {
    return "El código es obligatorio.";
  }

  if (typeof codigo !== "string" || codigo !== codigo.trim()) {
    return "El código no puede tener espacios al comienzo o al final.";
  }

  if (nombre === undefined || nombre === null || String(nombre).trim() === "") {
    return "El nombre es obligatorio.";
  }

  if (descripcion !== undefined && descripcion !== null && typeof descripcion !== "string") {
    return "La descripción debe ser un texto.";
  }

  if (descripcion !== undefined && descripcion !== null && descripcion.trim() === "" && descripcion !== "") {
    return "La descripción no puede contener solo espacios.";
  }

  if (cargaHoraria === undefined || cargaHoraria === null || cargaHoraria === "") {
    return "La carga horaria es obligatoria.";
  }

  const carga = Number(cargaHoraria);

  if (!Number.isInteger(carga) || carga <= 0) {
    return "La carga horaria debe ser un número entero mayor que cero.";
  }

  if (!["activa", "inactiva"].includes(estado)) {
    return "El estado debe ser activa o inactiva.";
  }

  return null;
}

async function obtenerMaterias(req, res) {
  try {
    // find() consulta todos los documentos; sort() organiza el resultado por nombre.
    const materias = await Materia.find().sort({ nombre: 1 });
    res.json(materias);
  } catch (error) {
    // Se registra el detalle en el servidor, pero al cliente solo se le envía un mensaje general.
    console.error(error);
    res.status(500).json({
      mensaje: "No se pudieron obtener las materias."
    });
  }
}

async function obtenerMateria(req, res) {
  try {
    const { codigo } = req.params;
    // La búsqueda usa el código de negocio, nunca el identificador interno de MongoDB.
    const materia = await Materia.findOne({ codigo });

    if (!materia) {
      return res.status(404).json({
        mensaje: "Materia no encontrada."
      });
    }

    res.json(materia);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "No se pudo consultar la materia."
    });
  }
}

async function crearMateria(req, res) {
  try {
    const cuerpo = req.body || {};
    const errorValidacion = validarDatosMateria(cuerpo);

    if (errorValidacion) {
      return res.status(400).json({
        mensaje: errorValidacion
      });
    }

    const codigo = String(cuerpo.codigo).trim();
    const nombre = String(cuerpo.nombre).trim();
    const descripcion = cuerpo.descripcion === undefined ? "" : String(cuerpo.descripcion).trim();
    const cargaHoraria = Number(cuerpo.cargaHoraria);
    const estado = cuerpo.estado;

    // Esta consulta permite responder pronto al duplicado; el índice único cubre carreras concurrentes.
    const existe = await Materia.findOne({ codigo });

    if (existe) {
      return res.status(409).json({
        mensaje: "Ya existe una materia con ese código."
      });
    }

    const nuevaMateria = await Materia.create({
      codigo,
      nombre,
      descripcion,
      cargaHoraria,
      estado
    });

    res.status(201).json(nuevaMateria);
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "Ya existe una materia con ese código."
      });
    }

    res.status(400).json({
      mensaje: "No se pudo registrar la materia."
    });
  }
}

async function actualizarMateria(req, res) {
  try {
    const { codigo: codigoOriginal } = req.params;
    const cuerpo = req.body || {};

    // Primero se obtiene la materia para confirmar que existe y completar los campos omitidos.
    const materiaExistente = await Materia.findOne({ codigo: codigoOriginal });
    if (!materiaExistente) {
      return res.status(404).json({
        mensaje: "Materia no encontrada."
      });
    }

    // PUT puede enviar solo algunos campos; se combinan con los actuales para validar el resultado completo.
    const materiaPropuesta = {
      codigo: cuerpo.codigo !== undefined ? cuerpo.codigo : materiaExistente.codigo,
      nombre: cuerpo.nombre !== undefined ? cuerpo.nombre : materiaExistente.nombre,
      descripcion: cuerpo.descripcion !== undefined ? cuerpo.descripcion : materiaExistente.descripcion,
      cargaHoraria: cuerpo.cargaHoraria !== undefined ? cuerpo.cargaHoraria : materiaExistente.cargaHoraria,
      estado: cuerpo.estado !== undefined ? cuerpo.estado : materiaExistente.estado
    };

    const validacion = validarDatosMateria(materiaPropuesta);

    if (validacion) {
      return res.status(400).json({
        mensaje: validacion
      });
    }

    // El código puede cambiar, pero se busca el registro usando siempre el código anterior de la URL.
    const codigoNuevo = materiaPropuesta.codigo;
    if (codigoNuevo !== codigoOriginal) {
      const existeCodigo = await Materia.findOne({ codigo: codigoNuevo });
      if (existeCodigo) {
        return res.status(409).json({
          mensaje: "El código ya está en uso por otra materia."
        });
      }
    }

    const datosActualizados = {
      ...materiaPropuesta,
      nombre: materiaPropuesta.nombre.trim(),
      descripcion: materiaPropuesta.descripcion.trim(),
      cargaHoraria: Number(materiaPropuesta.cargaHoraria)
    };

    // runValidators hace que las reglas del esquema también se ejecuten durante la actualización.
    const materiaActualizada = await Materia.findOneAndUpdate(
      { codigo: codigoOriginal },
      datosActualizados,
      {
        new: true,
        runValidators: true
      }
    );

    if (!materiaActualizada) {
      return res.status(404).json({
        mensaje: "Materia no encontrada."
      });
    }

    res.json(materiaActualizada);
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "Ya existe una materia con ese código."
      });
    }

    res.status(400).json({
      mensaje: "No se pudo actualizar la materia."
    });
  }
}

async function eliminarMateria(req, res) {
  try {
    const { codigo } = req.params;
    // findOneAndDelete elimina por código y devuelve null si no había una materia coincidente.
    const materia = await Materia.findOneAndDelete({ codigo });

    if (!materia) {
      return res.status(404).json({
        mensaje: "Materia no encontrada."
      });
    }

    res.json({
      mensaje: "Materia eliminada correctamente."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "No se pudo eliminar la materia."
    });
  }
}

module.exports = {
  obtenerMaterias,
  obtenerMateria,
  crearMateria,
  actualizarMateria,
  eliminarMateria
};