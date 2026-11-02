# Trabajo práctico: Módulo de Materias

**Alumno:** Matías Baru
**Profesora:** Irina Agretti

---

## Alcance

El módulo permite registrar, consultar, modificar y eliminar materias. La aplicación React consume una API REST construida con Express y guarda los datos en MongoDB mediante Mongoose.

Cada materia utiliza un código como identificador funcional y contiene nombre, descripción, carga horaria y estado. El estado admite los valores `activa` e `inactiva`.

## Archivos y responsabilidades

### `SGA-main/backend/models/Materia.js`

Define el esquema de MongoDB y las reglas de validación de una materia. Establece un índice único para el código y omite el identificador interno de MongoDB en las respuestas JSON.

```js
const mongoose = require("mongoose");

const materiaSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: [true, "El código es obligatorio."],
      validate: {
        validator: (valor) =>
          typeof valor === "string" &&
          valor.length > 0 &&
          valor === valor.trim(),
        message: "El código no puede estar vacío ni tener espacios al comienzo o al final.",
      },
    },
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio."],
      trim: true,
      maxlength: [100, "El nombre no puede superar los 100 caracteres."],
    },
    descripcion: {
      type: String,
      default: "",
      validate: {
        validator: (valor) =>
          typeof valor !== "string" ||
          valor.length === 0 ||
          valor.trim().length > 0,
        message: "La descripción no puede contener únicamente espacios.",
      },
    },
    cargaHoraria: {
      type: Number,
      required: [true, "La carga horaria es obligatoria."],
      min: [1, "La carga horaria debe ser mayor que cero."],
      validate: {
        validator: Number.isInteger,
        message: "La carga horaria debe ser un número entero.",
      },
    },
    estado: {
      type: String,
      required: [true, "El estado es obligatorio."],
      enum: {
        values: ["activa", "inactiva"],
        message: "El estado debe ser activa o inactiva.",
      },
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_documento, resultado) {
        delete resultado._id;
        return resultado;
      },
    },
  }
);

materiaSchema.index({ codigo: 1 }, { unique: true });

const Materia = mongoose.model("Materia", materiaSchema);

module.exports = Materia;
```

### `SGA-main/backend/controllers/materias.controller.js`

Implementa las operaciones de la API y la validación de los datos recibidos. Responde con códigos HTTP adecuados para errores de validación, recursos inexistentes y códigos duplicados.

```js
const Materia = require("../models/Materia");

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
    const materias = await Materia.find().sort({ nombre: 1 });
    res.json(materias);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "No se pudieron obtener las materias."
    });
  }
}

async function obtenerMateria(req, res) {
  try {
    const { codigo } = req.params;
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

    const materiaExistente = await Materia.findOne({ codigo: codigoOriginal });
    if (!materiaExistente) {
      return res.status(404).json({
        mensaje: "Materia no encontrada."
      });
    }

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
```

### `SGA-main/backend/routes/materias.routes.js`

Asocia los métodos HTTP y las rutas del recurso con sus funciones de controlador. El parámetro `:codigo` identifica la materia en las consultas, modificaciones y eliminaciones.

```js
const express = require("express");
const {
  obtenerMaterias,
  obtenerMateria,
  crearMateria,
  actualizarMateria,
  eliminarMateria
} = require("../controllers/materias.controller");

const router = express.Router();

router.get("/", obtenerMaterias);
router.get("/:codigo", obtenerMateria);
router.post("/", crearMateria);
router.put("/:codigo", actualizarMateria);
router.delete("/:codigo", eliminarMateria);

module.exports = router;
```

### `SGA-main/backend/server.js`

Registra el router de Materias en el servidor Express bajo el prefijo `/materias`. Según lo solicitado para este archivo, se incluyen solamente las líneas de importación e integración del módulo, no el contenido completo del servidor.

```js
const materiasRoutes = require("./routes/materias.routes")
app.use("/materias", materiasRoutes)
```

### `frontend-react/src/components/FormularioMateria.jsx`

Presenta el formulario de alta y edición. Valida los campos antes de enviarlos y utiliza `POST` para crear o `PUT` para actualizar; los errores del servidor se muestran junto al formulario.

```jsx
import { useState } from "react";

const API_MATERIAS = "http://localhost:3000/materias";

function FormularioMateria({
  onMateriaCreada,
  materiaEditar,
  onCancelar,
}) {
  const [formulario, setFormulario] = useState({
    codigo: materiaEditar?.codigo ?? "",
    nombre: materiaEditar?.nombre ?? "",
    descripcion: materiaEditar?.descripcion ?? "",
    cargaHoraria: String(materiaEditar?.cargaHoraria ?? ""),
    estado: materiaEditar?.estado ?? "activa",
  });
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function manejarCambio(e) {
    const { name, value } = e.target;

    setFormulario((formularioActual) => ({
      ...formularioActual,
      [name]: value,
    }));
  }

  function validarFormulario() {
    if (!formulario.codigo.trim()) {
      return "El código es obligatorio.";
    }

    if (formulario.codigo !== formulario.codigo.trim()) {
      return "El código no puede tener espacios al comienzo o al final.";
    }

    if (!formulario.nombre.trim()) {
      return "El nombre es obligatorio.";
    }

    if (formulario.descripcion && !formulario.descripcion.trim()) {
      return "La descripción no puede contener únicamente espacios.";
    }

    const cargaHoraria = Number(formulario.cargaHoraria);
    if (!Number.isInteger(cargaHoraria) || cargaHoraria <= 0) {
      return "La carga horaria debe ser un número entero mayor que cero.";
    }

    if (!["activa", "inactiva"].includes(formulario.estado)) {
      return "Seleccioná un estado válido.";
    }

    return "";
  }

  async function guardar(e) {
    e.preventDefault();
    setError("");

    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setGuardando(true);

    const materia = {
      codigo: formulario.codigo,
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      cargaHoraria: Number(formulario.cargaHoraria),
      estado: formulario.estado,
    };

    const editando = Boolean(materiaEditar);
    const url = editando
      ? `${API_MATERIAS}/${encodeURIComponent(materiaEditar.codigo)}`
      : API_MATERIAS;

    try {
      const respuesta = await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materia),
      });

      if (!respuesta.ok) {
        let mensaje = `No se pudo guardar la materia. Estado HTTP: ${respuesta.status}`;
        const tipoContenido = respuesta.headers.get("content-type") ?? "";

        if (tipoContenido.includes("application/json")) {
          const datosError = await respuesta.json();
          mensaje = datosError.mensaje ?? datosError.error ?? mensaje;
        } else {
          const textoError = await respuesta.text();
          if (textoError) {
            mensaje = textoError;
          }
        }

        throw new Error(mensaje);
      }

      onMateriaCreada();
    } catch (error) {
      console.error("Error al guardar la materia:", error);
      setError(error.message || "No se pudo conectar con el servidor.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="form-card">
      <div className="section-heading">
        <span className="section-heading__eyebrow">Gestión académica</span>
        <h2>{materiaEditar ? "Editar materia" : "Nueva materia"}</h2>
        <p>Completá los datos para registrar o actualizar una materia.</p>
      </div>

      <form className="student-form" onSubmit={guardar}>
        <div className="student-form__field">
          <label htmlFor="codigo">Código</label>
          <input
            id="codigo"
            name="codigo"
            value={formulario.codigo}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="student-form__field">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="student-form__field">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCambio}
          />
        </div>

        <div className="student-form__field">
          <label htmlFor="cargaHoraria">Carga horaria</label>
          <input
            id="cargaHoraria"
            name="cargaHoraria"
            type="number"
            min="1"
            step="1"
            value={formulario.cargaHoraria}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="student-form__field">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={formulario.estado}
            onChange={manejarCambio}
            required
          >
            <option value="activa">Activa</option>
            <option value="inactiva">Inactiva</option>
          </select>
        </div>

        <div className="student-form__actions">
          <button
            className="button button--primary"
            type="submit"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : materiaEditar
                ? "Guardar cambios"
                : "Guardar"}
          </button>

          {materiaEditar && (
            <button
              className="button button--secondary"
              type="button"
              onClick={onCancelar}
              disabled={guardando}
            >
              Cancelar
            </button>
          )}
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}

export default FormularioMateria;
```

### `frontend-react/src/components/ListaMaterias.jsx`

Consulta y presenta las materias registradas. Permite iniciar la edición de una materia y solicitar su eliminación, y vuelve a cargar los datos cuando la página informa que hubo un cambio.

```jsx
import { useEffect, useState } from "react";

const API_MATERIAS = "http://localhost:3000/materias";

export function ListaMaterias({
  actualizar,
  onMateriaCreada,
  onEditarMateria,
}) {
  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function eliminarMateria(codigo) {
    const confirmar = window.confirm(
      `¿Seguro que querés eliminar la materia ${codigo}?`
    );

    if (!confirmar) {
      return;
    }

    setError("");

    try {
      const respuesta = await fetch(
        `${API_MATERIAS}/${encodeURIComponent(codigo)}`,
        { method: "DELETE" }
      );

      if (!respuesta.ok) {
        throw new Error(
          `No se pudo eliminar la materia. Estado HTTP: ${respuesta.status}`
        );
      }

      onMateriaCreada();
    } catch (error) {
      console.error("Error al eliminar la materia:", error);
      setError(error.message || "No se pudo eliminar la materia.");
    }
  }

  useEffect(() => {
    async function cargarMaterias() {
      setCargando(true);
      setError("");

      try {
        const respuesta = await fetch(API_MATERIAS);

        if (!respuesta.ok) {
          throw new Error(
            `No se pudo obtener la lista. Estado HTTP: ${respuesta.status}`
          );
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
          throw new Error("La respuesta del servidor no contiene una lista.");
        }

        setMaterias(datos);
      } catch (error) {
        console.error("Error al cargar las materias:", error);
        setError(error.message || "No se pudo cargar la lista de materias.");
      } finally {
        setCargando(false);
      }
    }

    cargarMaterias();
  }, [actualizar]);

  if (cargando) {
    return <p className="list-message">Cargando materias...</p>;
  }

  if (error) {
    return (
      <p className="list-message list-message--error" role="alert">
        {error}
      </p>
    );
  }

  return (
    <section className="student-list">
      <div className="section-heading">
        <span className="section-heading__eyebrow">Gestión académica</span>
        <h2>Materias</h2>
        <p>Consultá y administrá las materias registradas.</p>
      </div>

      {materias.length === 0 ? (
        <p className="list-message">No hay materias registradas.</p>
      ) : (
        <ul className="student-list__items">
          {materias.map((materia) => (
            <li className="student-card" key={materia.codigo}>
              <div className="student-card__details">
                <span className="student-card__id">
                  Código {materia.codigo}
                </span>
                <span className="student-card__name">{materia.nombre}</span>
                {materia.descripcion && (
                  <span className="student-card__career">
                    {materia.descripcion}
                  </span>
                )}
                <span className="student-card__career">
                  Carga horaria: {materia.cargaHoraria} horas
                </span>
                <span className="student-card__career">
                  Estado: {materia.estado}
                </span>
              </div>

              <div className="student-card__actions">
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => onEditarMateria(materia)}
                >
                  Editar
                </button>
                <button
                  className="button button--danger"
                  type="button"
                  onClick={() => eliminarMateria(materia.codigo)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

### `frontend-react/src/pages/Materias.jsx`

Coordina el formulario y el listado. Conserva la materia seleccionada para editarla y actualiza la lista después de guardar o eliminar un registro.

```jsx
import { useState } from "react";
import FormularioMateria from "../components/FormularioMateria";
import { ListaMaterias } from "../components/ListaMaterias";

export default function Materias() {
  const [actualizar, setActualizar] = useState(0);
  const [materiaEditar, setMateriaEditar] = useState(null);

  function materiaModificada() {
    setActualizar((valor) => valor + 1);
    setMateriaEditar(null);
  }

  function seleccionarMateria(materia) {
    setMateriaEditar(materia);
  }

  return (
    <>
      <FormularioMateria
        key={materiaEditar?.codigo ?? "nueva"}
        onMateriaCreada={materiaModificada}
        materiaEditar={materiaEditar}
        onCancelar={() => setMateriaEditar(null)}
      />

      <ListaMaterias
        actualizar={actualizar}
        onMateriaCreada={materiaModificada}
        onEditarMateria={seleccionarMateria}
      />
    </>
  );
}
```

## Endpoints disponibles

| Método | Ruta | Operación |
|---|---|---|
| `GET` | `/materias` | Lista las materias ordenadas por nombre. |
| `GET` | `/materias/:codigo` | Consulta una materia por su código. |
| `POST` | `/materias` | Registra una materia. |
| `PUT` | `/materias/:codigo` | Actualiza una materia identificada por su código actual. |
| `DELETE` | `/materias/:codigo` | Elimina una materia por su código. |

## Conclusión

Para desarrollar el módulo Materias se siguió la estructura y la organización ya establecidas en el proyecto. Las responsabilidades se distribuyeron entre el modelo, el controlador y las rutas del backend, mientras que en el frontend se utilizaron componentes y una página para registrar, editar y consultar materias. Esta organización permite mantener el código claro y facilita futuras modificaciones.

La integración entre React, la API REST y MongoDB permite realizar las operaciones de alta, consulta, actualización y eliminación, con validaciones para mantener la consistencia de los datos. De esta manera, el módulo se incorpora al sistema de forma coherente con sus demás secciones.
