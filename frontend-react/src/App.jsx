// en apps.jsx se importa el componente Titulo y se renderiza dentro del componente App

// import Titulo from './components/Titulo';
// import Navbar from './components/Navbar';
// import {Footer} from './components/Footer';
// import TarjetaAlumno from './components/TerjetaAlumno';

// import Incrementar from './components/ejemplos/incrementar';
// import CambiarTitulo from './components/ejemplos/CambiarTitulo';
// import Adivina from './components/ejemplos/Adivina';
// import Mensaje from "./components/ejemplos/Mensaje"
// import { useState } from "react";


// import FormularioA from "./components/FormularioA"

import { useState } from "react";
import { FormularioA } from "./components/FormularioA.jsx";
import { ListaAlumno } from "./components/ListaAlumno.jsx";

// import TamanioTexto from "./components/ejemplos/TamanioTexto"
function App() {

  const [actualizar, setActualizar] = useState(0);
  const [alumnoEditar, setAlumnoEditar] = useState(null);

  function AlumnoCreado() {
    setActualizar(valor => valor + 1);
    setAlumnoEditar(null);
  }
  function seleccionarAlumno(alumno) {
    setAlumnoEditar(alumno);
  }


  // function guardar(e) {
  //   e.preventDefault();
  //   console.log("Formulario enviado");
  // }

  return (
    
    <main>
      <FormularioA key={alumnoEditar?.legajo??"nuevo"} onAlumnoCreado={AlumnoCreado} alumnoEditar={alumnoEditar}onCancelar={() => setAlumnoEditar(null)}/>
      <ListaAlumno actualizar={actualizar}
      onAlumnoCreado={AlumnoCreado} 
      onEditarAlumno={seleccionarAlumno}
      />
    </main>

    
  );
}

export default App; 
