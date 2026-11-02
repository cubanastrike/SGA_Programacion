import { useState } from "react";
import FormularioMateria from "../components/FormularioMateria";
import { ListaMaterias } from "../components/ListaMaterias";

export default function Materias() {
  // actualizar funciona como señal para que la lista vuelva a consultar la API.
  const [actualizar, setActualizar] = useState(0);
  // materiaEditar comparte la selección entre el listado y el formulario.
  const [materiaEditar, setMateriaEditar] = useState(null);

  function materiaModificada() {
    // Después de guardar o borrar, refresca la lista y sale del modo edición.
    setActualizar((valor) => valor + 1);
    setMateriaEditar(null);
  }

  function seleccionarMateria(materia) {
    // La materia seleccionada se pasa como prop al formulario para cargar sus campos.
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