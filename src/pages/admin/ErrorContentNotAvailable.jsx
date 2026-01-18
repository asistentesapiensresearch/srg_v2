import { Box, Typography, Button, Paper, useTheme } from '@mui/material';
import { AlertCircle, Home } from 'lucide-react'; // Importa los íconos necesarios
import { Link } from 'react-router-dom'; // Para navegar (asumiendo que usas react-router-dom)

/**
 * Componente de vista de error para "Contenido no disponible"
 */
const ErrorContentNotAvailable = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh', // Ocupa casi toda la altura visible
                p: 3,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: theme.shape.borderRadius * 2, // Bordes más redondeados
                    maxWidth: 500,
                    width: '100%',
                    boxShadow: '0px 10px 30px rgba(0,0,0,0.05)'
                }}
            >
                <AlertCircle size={60} color={theme.palette.warning.main} style={{ marginBottom: theme.spacing(3) }} />

                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Contenido no disponible
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                    Lo sentimos, el contenido que estás buscando no está disponible en este momento.
                    Puede que se haya eliminado, sea privado o haya ocurrido un error temporal.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Home size={20} />}
                    component={Link} // Usa Link de react-router-dom
                    to="/admin"          // Redirige a la página principal
                    sx={{ mt: 3, borderRadius: theme.shape.borderRadius }}
                >
                    Volver al inicio
                </Button>
            </Paper>
        </Box>
    );
};

export default ErrorContentNotAvailable;