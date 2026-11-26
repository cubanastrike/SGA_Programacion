import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
const API_CURSOS = "http://localhost:3000/cursos";

export function ListaCursos({
  actualizar,
  onCursoCreado,
  onEditarCurso,
}) {
  const { token } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function eliminarCurso(codigo) {
    const confirmar = window.confirm("¿Seguro que querés eliminar este curso?");
    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await fetch(`${API_CURSOS}/${codigo}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!respuesta.ok) {
        throw new Error(`No se pudo eliminar. Estado HTTP: ${respuesta.status}`);
      }

      if (onCursoCreado) {
        onCursoCreado();
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert(error.message || "No se pudo eliminar curso");
    }
  }

  useEffect(() => {
    async function cargarCursos() {
      setCargando(true);
      setError("");

      try {
        const respuesta = await fetch(API_CURSOS, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!respuesta.ok) {
          throw new Error(
            `No se pudo obtener la lista. Estado HTTP: ${respuesta.status}`
          );
        }

        const datos = await respuesta.json();
        setCursos(datos);
      } catch (error) {
        console.error("Error de conexión:", error);
        setError("No se pudo cargar la lista de cursos.");
      } finally {
        setCargando(false);
      }
    }

    cargarCursos();
  }, [actualizar, token]);

  if (cargando) {
    return <p className="list-message">Cargando cursos...</p>;
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
        <h2>Cursos</h2>
        <p>Consultá y administrá los cursos registrados.</p>
      </div>

      {cursos.length === 0 ? (
        <p className="list-message">No hay cursos registrados.</p>
      ) : (
        <ul className="student-list__items">
          {cursos.map((curso) => (
            <li className="student-card" key={curso.codigo}>
              <div className="student-card__details">
                <span className="student-card__id">{curso.codigo}</span>
                <span className="student-card__name">{curso.nombre}</span>
                <span className="student-card__career">{curso.descripcion} - {curso.duracion} hs</span>
              </div>

              <div className="student-card__actions">
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => onEditarCurso(curso)}
                >
                  Editar
                </button>
                <button
                  className="button button--danger"
                  type="button"
                  onClick={() => eliminarCurso(curso.codigo)}
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