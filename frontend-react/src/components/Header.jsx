import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import "../App.css"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import logo from "../assets/sga-logo.png"
import SelectorTema from "./SelectorTema"
import { useAuth } from "../context/useAuth"

export default function Header() {
    const { cerrarSesion } = useAuth()
    const navigate = useNavigate()

    function logout() {
        cerrarSesion()
        navigate("/login")
    }

    return (
        <header className="site-header">
            <div className="site-header__inner">
                <div className="brand">
                    <Box
                        component="img"
                        className="brand__icon"
                        src={logo}
                        alt="Logo SGA"
                        sx={(theme) => ({
                            width: 42,
                            height: 42,
                            objectFit: "contain",
                            ...theme.applyStyles("dark", {
                                filter: "invert(1)"
                            })
                        })}
                    />
                    <span className="brand__name">SGA</span>
                </div>
                <nav className="site-nav" aria-label="Navegación principal">
                    <Link to="/">Inicio</Link>
                    <Link to="/alumnos">Alumnos</Link>
                    <Link to="/docentes">Docente</Link>
                    <Link to="/materias">Materias</Link>
                    <Link to="/ayuda" aria-label="Ayuda">?</Link>
                    <Button
                        type="button"
                        color="inherit"
                        variant="outlined"
                        onClick={logout}
                        sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                        Cerrar sesión
                    </Button>
                </nav>
                <div className="site-header__theme">
                    <SelectorTema />
                </div>
            </div>
        </header>
    )
}