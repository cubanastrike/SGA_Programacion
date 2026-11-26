import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import API_URL from "../config/api"

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"))
    const [usuario, setUsuario] = useState(() => {
        const usuarioGuardado = localStorage.getItem("usuario")
        if (!usuarioGuardado) {
            return null
        }

        try {
            return JSON.parse(usuarioGuardado)
        } catch {
            localStorage.removeItem("usuario")
            return null
        }
    })
    const [cargando, setCargando] = useState(true)

    function cerrarSesion() {
        localStorage.removeItem("token")
        localStorage.removeItem("usuario")
        setToken(null)
        setUsuario(null)
    }

    useEffect(() => {
        let activo = true

        async function verificarSesion() {
            const tokenGuardado = localStorage.getItem("token")

            if (!tokenGuardado) {
                if (activo) {
                    setToken(null)
                    setUsuario(null)
                    setCargando(false)
                }
                return
            }

            try {
                const respuesta = await fetch(`${API_URL}/alumnos`, {
                    headers: { Authorization: `Bearer ${tokenGuardado}` },
                })

                if (!respuesta.ok) {
                    throw new Error("La sesión guardada no es válida")
                }

                if (activo) {
                    setToken(tokenGuardado)
                }
            } catch (error) {
                console.error("Error al verificar la sesión:", error)
                localStorage.removeItem("token")
                localStorage.removeItem("usuario")
                if (activo) {
                    setToken(null)
                    setUsuario(null)
                }
            } finally {
                if (activo) {
                    setCargando(false)
                }
            }
        }

        verificarSesion()
        return () => {
            activo = false
        }
    }, [])

    return (
        <AuthContext.Provider value={{ token, setToken, usuario, setUsuario, cargando, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
