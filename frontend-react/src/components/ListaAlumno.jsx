import { useEffect, useState } from "react";
const API_ALUMNOS = "http://localhost:3000/alumnos"; 

export function ListaAlumno({ actualizar, onAlumnoCreado, onEditarAlumno }) {
    const [alumnos, setAlumnos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
async function eliminarAlumno(legajo) {
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar este alumno?");
    if (!confirmar) return;

    try {
        const respuesta = await fetch(`${API_ALUMNOS}/${legajo}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            throw new Error("Error al eliminar el alumno. Estado HTTP: " + respuesta.status);
        }
        onAlumnoCreado(); // Llamar a la función para actualizar la lista de alumnos después de eliminar
    } catch (error) {
        console.error("Error al eliminar el alumno", error);
        alert(error.message || "No se pudo eliminar el alumno.");
    }
}

    useEffect(() => {
        async function cargarAlumnos() {
            setCargando(true);
            

            try{
            const respuesta = await fetch(API_ALUMNOS);

            if (!respuesta.ok){
                throw new Error("no se puedo obtener la lista", respuesta.status)
            }
            const datos = await respuesta.json();
            setAlumnos(datos);
        } catch(error){
            console.error("error de conexion", error)
            setError("No se pudo cargar la lista de alumnos");
        } finally {
            setCargando(false);
        }
    }

        cargarAlumnos();
    }, [actualizar]);

    if (cargando) {
        return <p>Cargando alumnos...</p>;
    }
    if (error) {
        return <p>{error}</p>;
    }
    return (
        <section>
            <h2>Alumnos</h2>
            {alumnos.length === 0 ? (
                <p>No hay alumnos registrados.</p>
            ) : (

                <ul style={{ listStyleType: "none"}}>
                    {alumnos.map(alumno => (
                        <li key={alumno.legajo}>
                            {alumno.legajo} - {alumno.nombre} - {alumno.carrera}- {alumno.correo}
                            <br />
                            <button type="button" onClick={() => eliminarAlumno(alumno.legajo)}>
                                Eliminar
                            </button>
                            <button type="button" onClick={() => onEditarAlumno(alumno)}>
                                Editar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
        
    );
}
