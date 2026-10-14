import { useState } from "react";
const API_ALUMNOS = "http://localhost:3000/alumnos";
export function FormularioA() {
    // const [legajo, setLegajo] = useState("");
    // const [carrera, setCarrera] = useState("");

    // const [nombre, setNombre] = useState("");
    // const [correo, setCorreo] = useState("");

const [formulario, setformulario] = useState({

    legajo: "",
    carrera: "",
    nombre: "",
    correo: ""
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

        try {
            const alumno = {
                ...formulario,
                legajo: Number(formulario.legajo)

            }
            const respuesta = await fetch(API_ALUMNOS, {
                method: "POST",
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
            
        } catch (error) {
            console.error("Error al guardar el alumno:", error);
            setError(error.message || "Error desconocido al guardar el alumno.");
        } finally {
            setGuardando(false);
        }
    }
    return (
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
                {guardando ? "Guardando..." : "Guardar"}

            </button>
            <br />
            {error && <p role="alert">{error}</p>}
        </form>
        
        </>
    )
    

}