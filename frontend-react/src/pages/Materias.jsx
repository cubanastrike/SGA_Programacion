import { useState } from "react";
import FormularioMateria from "../components/FormularioMateria";
import { ListaMaterias } from "../components/ListaMaterias";

export default function Materias() {
  const [actualizar, setActualizar] = useState(0);
  const [materiaEditar, setMateriaEditar] = useState(null);

  function materiaModificada() {
    setActualizar((valor) => valor + 1);
    setMateriaEditar(null);
  }

  function seleccionarMateria(materia) {
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