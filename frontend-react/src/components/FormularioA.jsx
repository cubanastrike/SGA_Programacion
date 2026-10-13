import { useState } from "react";

function FormularioA() {
    const [legajo, setLegajo] = useState("");
    const [carrera, setCarrera] = useState("");

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");

    function guardar(e) {
        e.preventDefault();
        console.log(legajo, carrera, nombre, correo);
    }
    return (
        <><form onSubmit={guardar}>
            <input value={legajo} onChange={e => setLegajo(e.target.value)} /> <br />
            <input value={carrera} onChange={e => setCarrera(e.target.value)} /> <br />
            <input value={nombre} onChange={e => setNombre(e.target.value)} /> <br />
            <input value={correo} onChange={e => setCorreo(e.target.value)} /> <br />
            <button type="submit">Guardar</button>
        </form>
        <h3>Legajo: {legajo}</h3>
        <h3>Carrera: {carrera}</h3>
        <h3>Nombre: {nombre}</h3>
        <h3>Correo: {correo}</h3>
        </>
    );
    

}

export default FormularioA;