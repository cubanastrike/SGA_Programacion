import { useState } from "react";
import { useAuth } from "../context/useAuth";
const API_CURSOS = "http://localhost:3000/cursos"

function FormularioC({ onCursoCreado, cursoEditar, onCancelar }){
    const { token } = useAuth()
    const [formulario, setFormulario] = useState({
        codigo: cursoEditar?.codigo ?? "",
        nombre: cursoEditar?.nombre ?? "",
        descripcion: cursoEditar?.descripcion ?? "",
        duracion: String(cursoEditar?.duracion ?? "")
    })
    const [error, setError] = useState("")
    const [guardando, setGuardando] = useState(false)

    function manejarCambio(e) {
        const { name, value} = e.target

        setFormulario({
            ...formulario,
            [name]: value
        })
    }

    async function guardar(e) {
        e.preventDefault()
        setError("")
        setGuardando(true)

    const curso = {
        ...formulario,
        duracion: Number(formulario.duracion)
    }
    const editando = Boolean(cursoEditar)
    const url = editando
                ? `${API_CURSOS}/${cursoEditar.codigo}`
                : API_CURSOS
        try {
            const respuesta = await fetch(url, {
                method: editando ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(curso)
            })

            if (!respuesta.ok) {
                throw new Error(`No se pudo guardar el Curso. Estado HTTP: ${respuesta.status}`)
            }

            setFormulario({
                codigo: "",
                nombre: "",
                descripcion: "",
                duracion: ""
            })
            onCursoCreado()
        } catch (error) {
            console.error("Error al guardar:", error)
            setError(error.message || "No se pudo conectar con el servidor")
        } finally {
            setGuardando(false)
        }
    }
    function cancelar(){
        onCancelar()
    }
    return(
        <section className="form-card">
            <div className="section-heading">
                <span className="section-heading__eyebrow">Gestión académica</span>
                <h2>{cursoEditar ? "Editar curso" : "Nuevo curso"}</h2>
                <p>Completá los datos para registrar o actualizar un Curso.</p>
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
                    disabled={Boolean(cursoEditar)}
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
                    <input
                    id="descripcion"
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={manejarCambio}
                    required
                    />
                </div>
                <div className="student-form__field">
                    <label htmlFor="duracion">Duración (horas)</label>
                    <input
                    id="duracion"
                    name="duracion"
                    value={formulario.duracion}
                    onChange={manejarCambio}
                    required
                    />
                </div>
                <div className="student-form__actions">
                    <button className="button button--primary" type="submit" disabled={guardando}>
                        {guardando
                        ? "Guardando..."
                        : cursoEditar
                            ? "Guardar cambios"
                            : "Guardar"}
                    </button>
                    {cursoEditar && (
                        <button
                        className="button button--secondary"
                        type="button"
                        onClick={cancelar}
                        disabled={guardando}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
                {error && <p className="form-error" role="alert">{error}</p>}
            </form>
        </section>
    )
}
export default FormularioC