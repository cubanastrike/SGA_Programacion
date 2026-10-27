import Alumnos from "./pages/Alumnos"
import Docentes from "./pages/Docentes"
import { FAQ } from "./components/ejemplos/FAQ"
import { Routes, Route } from "react-router-dom"
import LayoutPpal from "./layouts/LayoutPpal"
import Inicio from "./pages/inicio"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutPpal />}>
        <Route index element={<Inicio />} />
        <Route path="/alumnos" element={<Alumnos />} />
      <Route path="docentes" element={<Docentes />} />
      <Route path="/ayuda" element={<FAQ />} />




      </Route>
    </Routes>
  )
}

export default App