import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Paper
} from '@mui/material';
import {
    FileQuestion,
    ArrowLeft,
    Home,
    SearchX
} from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f8fafc', // Fondo muy suave (gris azulado casi blanco)
                p: 2
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        textAlign: 'center',
                        borderRadius: 4,
                        border: '1px solid #e2e8f0',
                        bgcolor: 'white'
                    }}
                >
                    {/* --- ÍCONO ILUSTRATIVO --- */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            p: 3,
                            bgcolor: '#fef2f2', // Rojo muy suave de fondo
                            borderRadius: '50%',
                            mb: 4,
                            color: '#dc2626' // Tu rojo corporativo
                        }}
                    >
                        <FileQuestion size={64} strokeWidth={1.5} />
                    </Box>

                    {/* --- TÍTULO --- */}
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            fontWeight: 800,
                            color: '#1e293b',
                            mb: 1
                        }}
                    >
                        404
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            color: '#334155',
                            mb: 2
                        }}
                    >
                        Investigación no encontrada
                    </Typography>

                    {/* --- DESCRIPCIÓN --- */}
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#64748b',
                            mb: 5,
                            lineHeight: 1.6
                        }}
                    >
                        Lo sentimos, el recurso académico o la institución que intentas consultar no está disponible en nuestros archivos. Es posible que la URL sea incorrecta o que la investigación haya sido retirada.
                    </Typography>

                    {/* --- BOTONES DE ACCIÓN --- */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<ArrowLeft size={20} />}
                            onClick={() => navigate(-1)}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                borderColor: '#cbd5e1',
                                color: '#475569',
                                '&:hover': { borderColor: '#94a3b8', bgcolor: '#f1f5f9' }
                            }}
                        >
                            Regresar
                        </Button>

                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Home size={20} />}
                            onClick={() => navigate('/')}
                            disableElevation
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                bgcolor: '#dc2626', // Rojo
                                '&:hover': { bgcolor: '#b91c1c' }
                            }}
                        >
                            Ir al Inicio
                        </Button>
                    </Box>

                    {/* --- FOOTER PEQUEÑO --- */}
                    <Typography variant="caption" display="block" sx={{ mt: 6, color: '#94a3b8' }}>
                        Código de error: RESOURCE_NOT_FOUND
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default NotFoundPage;