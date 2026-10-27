import { useEffect, useState } from "react";
const API_DOCENTES = "http://localhost:3000/docentes";

export function ListaDocentes({
  actualizar,
  ondodocenteCreado,
  onEditardodocente,
  onDocenteCreado = ondodocenteCreado,
  onEditarDocente = onEditardodocente,
}) {
  const [docentes, setDocentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function eliminarDocente(dni) {
    const confirmar = window.confirm("¿Seguro que querés eliminar este docente?");
    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await fetch(`${API_DOCENTES}/${dni}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error(`No se pudo eliminar. Estado HTTP: ${respuesta.status}`);
      }

      if (onDocenteCreado) {
        onDocenteCreado();
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert(error.message || "No se pudo eliminar docente");
    }
  }

  useEffect(() => {
    async function cargarDocentes() {
      setCargando(true);
      setError("");

      try {
        const respuesta = await fetch(API_DOCENTES);

        if (!respuesta.ok) {
          throw new Error(
            `No se pudo obtener la lista. Estado HTTP: ${respuesta.status}`
          );
        }

        const datos = await respuesta.json();
        setDocentes(datos);
      } catch (error) {
        console.error("Error de conexión:", error);
        setError("No se pudo cargar la lista de docentes.");
      } finally {
        setCargando(false);
      }
    }

    cargarDocentes();
  }, [actualizar]);

  if (cargando) {
    return <p className="list-message">Cargando docentes...</p>;
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
        <span className="section-heading__eyebrow">Alumnado</span>
        <h2>Docentes</h2>
        <p>Consultá y administrá los docentes registrados.</p>
      </div>

      {docentes.length === 0 ? (
        <p className="list-message">No hay docentes registrados.</p>
      ) : (
        <ul className="student-list__items">
          {docentes.map((docente) => (
            <li className="student-card" key={docente.dni}>
              <div className="student-card__details">
                <span className="student-card__id">Legajo {docente.dni}</span>
                <span className="student-card__name">{docente.nombre}</span>
                <span className="student-card__career">{docente.carrera}</span>
              </div>

              <div className="student-card__actions">
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => onEditarDocente?.(docente)}
                >
                  Editar
                </button>
                <button
                  className="button button--danger"
                  type="button"
                  onClick={() => eliminarDocente(docente.dni)}
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