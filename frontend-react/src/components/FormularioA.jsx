import { useState } from "react";
const API_ALUMNOS = "http://localhost:3000/alumnos";
export function FormularioA( {onAlumnoCreado, alumnoEditar, onCancelar} ) {
    // const [legajo, setLegajo] = useState("");
    // const [carrera, setCarrera] = useState("");

    // const [nombre, setNombre] = useState("");
    // const [correo, setCorreo] = useState("");

const [formulario, setformulario] = useState({

    legajo: String(alumnoEditar?.legajo??""),
    carrera: alumnoEditar?.carrera??"",
    nombre: alumnoEditar?.nombre??"",
    correo: alumnoEditar?.correo??""
});
const [error, setError] = useState("");

const [guardando, setGuardando] = useState(false);

function manejarcambio(e) {
    const {name, value} = e.target;
    setformulario({ 
        ...formulario,
        [name]: value
    });
}




    async function guardar(e) {
        e.preventDefault();
        setError("");
        setGuardando(true);

        const editando = Boolean(alumnoEditar);
        const url = editando ? `${API_ALUMNOS}/${alumnoEditar.legajo}` : API_ALUMNOS;
        try {
            const alumno = {
                ...formulario,
                legajo: Number(formulario.legajo)
            }
            const respuesta = await fetch(url, { 
                method: editando ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(alumno)
            });

            if (!respuesta.ok) {
                throw new Error("Error al guardar el alumno. Estado HTTP: " + respuesta.status);
            }
            setformulario({
                legajo: "",
                carrera: "",
                nombre: "",
                correo: ""
            });
            onAlumnoCreado();
        } catch (error) {
            console.error("Error al guardar el alumno:", error);
            setError(error.message || "Error desconocido al guardar el alumno.");
        } finally {
            setGuardando(false);
        }
    }
    function cancelar(){
        onCancelar()
    }

    return (
        <h2>{alumnoEditar ? "Editar Alumno" : "Nuevo Alumno"}</h2>,
        <><form onSubmit={guardar}>
            <label htmlFor="legajo">Legajo:</label> <br />
            <input  id="legajo" name="legajo" value={formulario.legajo} onChange={manejarcambio} required /> <br />
            <label htmlFor="carrera">Carrera:</label> <br />
            <input id="carrera" name="carrera" value={formulario.carrera} onChange={manejarcambio} required /> <br />
            <label htmlFor="nombre">Nombre:</label> <br />
            <input id="nombre" name="nombre" value={formulario.nombre} onChange={manejarcambio} required /> <br />
            <label htmlFor="correo">Correo:</label> <br />
            <input id="correo" name="correo" value={formulario.correo} onChange={manejarcambio} required /> <br />
            <button type="submit" disabled={guardando}>
                {guardando ? "Guardando..." : alumnoEditar ? "Guardar Cambios" : "Guardar"}

            </button>

            {alumnoEditar && (
                <button
                type="button"
                onClick={cancelar}
                disabled={guardando}
                >
                    Cancelar
                </button>
            )}
            <br />
            {error && <p role="alert">{error}</p>}
        </form>
        
        </>
    )
    

}