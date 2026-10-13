import { useEffect, useState } from "react";
const API_ALUMNOS = "http://localhost:3000/alumnos"; 

export function ListaAlumno() {
    const [alumnos, setAlumnos] = useState([]);

    useEffect(() => {
        async function cargarAlumnos() {
            try{
            const respuesta = await fetch(API_ALUMNOS);

            if (!respuesta.ok){
                throw new Error("no se puedo obtener la lista", respuesta.status)
            }
            const datos = await respuesta.json();
            setAlumnos(datos);
        } catch(error){
            console.error("error de conexion", error)
        }
    }

        cargarAlumnos();
    }, []);

    return (
        
            <>  
            <h2>Listado de Alumnos</h2>
            {

alumnos.map(alumno => (
    <p key={alumno.legajo}>
        {alumno.legajo} - {alumno.nombre} - {alumno.carrera}
    </p>
))
            }
            
            </>
        
    );
}
