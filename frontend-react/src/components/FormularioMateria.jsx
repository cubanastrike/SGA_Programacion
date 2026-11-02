import { useState } from "react";

const API_MATERIAS = "http://localhost:3000/materias";

// El formulario sirve para altas y ediciones; la página le comunica qué materia editar.
function FormularioMateria({
  onMateriaCreada,
  materiaEditar,
  onCancelar,
}) {
  // Inicializa los campos con la materia elegida o con valores vacíos para un alta nueva.
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

    // El atributo name de cada input indica qué propiedad del estado debe actualizarse.
    setFormulario((formularioActual) => ({
      ...formularioActual,
      [name]: value,
    }));
  }

  function validarFormulario() {
    // Estas verificaciones dan respuesta inmediata; el servidor debe repetirlas por seguridad de datos.
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
    // En edición se identifica el recurso por su código actual, no por el _id de MongoDB.
    const url = editando
      ? `${API_MATERIAS}/${encodeURIComponent(materiaEditar.codigo)}`
      : API_MATERIAS;

    try {
      const respuesta = await fetch(url, {
        // POST crea y PUT modifica; el cuerpo transporta los campos como JSON.
        method: editando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materia),
      });

      if (!respuesta.ok) {
        // Se intenta mostrar el mensaje del backend y se usa el estado HTTP como alternativa.
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

      // La página escucha este callback para limpiar el modo edición y actualizar el listado.
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