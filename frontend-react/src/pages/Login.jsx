import { useState } from "react"
import { Box, Button, TextField, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

export default function Login() {
    const theme = useTheme()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function login(event) {
        event.preventDefault()
    }

    return (
        <Box
            component="main"
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Box
                component="form"
                onSubmit={login}
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    p: 4,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: `0 12px 32px ${theme.palette.divider}`,
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        mb: 3,
                        textAlign: "center",
                        color: theme.palette.text.primary,
                        fontWeight: 700,
                    }}
                >
                    Iniciar sesión
                </Typography>
                <TextField
                    label="Correo electrónico"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="username"
                    required
                    fullWidth
                    margin="normal"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <TextField
                    type="password"
                    label="Contraseña"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    fullWidth
                    margin="normal"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, py: 1.5, borderRadius: 2, fontWeight: 700 }}
                >
                    Ingresar
                </Button>
            </Box>
        </Box>
    )
}