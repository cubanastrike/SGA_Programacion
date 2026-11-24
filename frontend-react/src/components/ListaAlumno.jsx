import { useEffect, useState } from "react"
import { useAuth } from "../context/useAuth"
const API_ALUMNOS = "http://localhost:3000/alumnos"

export function ListaAlumnos({ actualizar, onAlumnoCreado, onEditarAlumno }) {
    const { token } = useAuth()
    const [alumnos, setAlumnos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState("")

    async function eliminarAlumno(legajo){
        const confirmar = window.confirm("¿Seguro que querés eliminar este alumno?")
        if (!confirmar) {
            return
        }
        try {
            const respuesta = await fetch(`${API_ALUMNOS}/${legajo}`, 
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            if (!respuesta.ok) {
                throw new Error(`No se pudo eliminar. Estado HTTP: ${respuesta.status}`)
            }
            onAlumnoCreado()
        } catch (error) {
            console.error("Error al eliminar: ", error)
            alert(error.message || "No se pudo elimnar alumno")
        }
    }
    useEffect(() => {
        async function cargarAlumnos(){
            setCargando(true)
            setError("")

            try {
            const respuesta = await fetch(API_ALUMNOS, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!respuesta.ok){
                throw new Error("No se pudo obtener la lista", respuesta.status)
            }

            const datos = await respuesta.json()
            setAlumnos(datos)
        } catch(error) {
            console.error("Error de conexión", error)
            setError("No se pudo cargar la lista de alumnos.")
        } finally {
            setCargando(false)
        }
    }
        cargarAlumnos()
    }, [actualizar, token])

    if (cargando) {
        return <p className="list-message">Cargando alumnos...</p>
    }
    if (error) {
        return <p className="list-message list-message--error" role="alert">{error}</p>
    }
    return (
        <section className="student-list">
            <div className="section-heading">
                <span className="section-heading__eyebrow">Alumnado</span>
                <h2>Alumnos</h2>
                <p>Consultá y administrá los alumnos registrados.</p>
            </div>
            {alumnos.length === 0
                ? <p className="list-message">No hay alumnos registrados.</p>
                : (
                    <ul className="student-list__items">
                        {alumnos.map(alumno => (
                            <li className="student-card" key={alumno.legajo}>
                                <div className="student-card__details">
                                    <span className="student-card__id">Legajo {alumno.legajo}</span>
                                    <span className="student-card__name">{alumno.nombre}</span>
                                    <span className="student-card__career">{alumno.carrera}</span>
                                </div>
                                <div className="student-card__actions">
                                    <button
                                        className="button button--secondary"
                                        type="button"
                                        onClick={() => onEditarAlumno(alumno)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="button button--danger"
                                        type="button"
                                        onClick={() => eliminarAlumno(alumno.legajo)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
        </section>
    )
}