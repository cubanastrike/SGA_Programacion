import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"))
    const [cargando, setCargando] = useState(true)

    function cerrarSesion() {
        localStorage.removeItem("token")
        setToken(null)
    }

    useEffect(() => {
        let activo = true

        async function verificarSesion() {
            const tokenGuardado = localStorage.getItem("token")

            if (!tokenGuardado) {
                if (activo) {
                    setToken(null)
                    setCargando(false)
                }
                return
            }

            try {
                const respuesta = await fetch("http://localhost:3000/alumnos", {
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
                if (activo) {
                    setToken(null)
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
        <AuthContext.Provider value={{ token, setToken, cargando, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
