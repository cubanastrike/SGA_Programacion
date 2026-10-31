import { useEffect, useState } from "react";

const API_MATERIAS = "http://localhost:3000/materias";

export function ListaMaterias({
  actualizar,
  onMateriaCreada,
  onEditarMateria,
}) {
  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function eliminarMateria(codigo) {
    const confirmar = window.confirm(
      `¿Seguro que querés eliminar la materia ${codigo}?`
    );

    if (!confirmar) {
      return;
    }

    setError("");

    try {
      const respuesta = await fetch(
        `${API_MATERIAS}/${encodeURIComponent(codigo)}`,
        { method: "DELETE" }
      );

      if (!respuesta.ok) {
        throw new Error(
          `No se pudo eliminar la materia. Estado HTTP: ${respuesta.status}`
        );
      }

      onMateriaCreada();
    } catch (error) {
      console.error("Error al eliminar la materia:", error);
      setError(error.message || "No se pudo eliminar la materia.");
    }
  }

  useEffect(() => {
    async function cargarMaterias() {
      setCargando(true);
      setError("");

      try {
        const respuesta = await fetch(API_MATERIAS);

        if (!respuesta.ok) {
          throw new Error(
            `No se pudo obtener la lista. Estado HTTP: ${respuesta.status}`
          );
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
          throw new Error("La respuesta del servidor no contiene una lista.");
        }

        setMaterias(datos);
      } catch (error) {
        console.error("Error al cargar las materias:", error);
        setError(error.message || "No se pudo cargar la lista de materias.");
      } finally {
        setCargando(false);
      }
    }

    cargarMaterias();
  }, [actualizar]);

  if (cargando) {
    return <p className="list-message">Cargando materias...</p>;
  }

  if (error) {
    return (
      <p className="list-message list-message--error" role="alert">
        {error}
      </p>
    );
  }

  return (
    <section className="student-list">
      <div className="section-heading">
        <span className="section-heading__eyebrow">Gestión académica</span>
        <h2>Materias</h2>
        <p>Consultá y administrá las materias registradas.</p>
      </div>

      {materias.length === 0 ? (
        <p className="list-message">No hay materias registradas.</p>
      ) : (
        <ul className="student-list__items">
          {materias.map((materia) => (
            <li className="student-card" key={materia.codigo}>
              <div className="student-card__details">
                <span className="student-card__id">
                  Código {materia.codigo}
                </span>
                <span className="student-card__name">{materia.nombre}</span>
                {materia.descripcion && (
                  <span className="student-card__career">
                    {materia.descripcion}
                  </span>
                )}
                <span className="student-card__career">
                  Carga horaria: {materia.cargaHoraria} horas
                </span>
                <span className="student-card__career">
                  Estado: {materia.estado}
                </span>
              </div>

              <div className="student-card__actions">
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => onEditarMateria(materia)}
                >
                  Editar
                </button>
                <button
                  className="button button--danger"
                  type="button"
                  onClick={() => eliminarMateria(materia.codigo)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}