// src/view/sections/FeaturesGrid/index.jsx
import { Box, Typography, Grid, Container } from '@mui/material';
import PageRenderer from '../../../builder/Renderer';

const FeaturesGrid = ({
    // Props de Columnas
    columns_desktop = 3,
    columns_tablet = 2,
    columns_mobile = 1,
    gap = 3,

    // Props de Contenido
    title,
    background_color = '#ffffff',
    padding_y = 8,

    children = []
}) => {

    // Función de cálculo ultra-segura
    const getSpan = (val) => {
        const n = Number(val);
        if (!n || n <= 0) return 12; // Fallback a 1 columna
        return Math.max(1, Math.floor(12 / n));
    };

    // Calculamos los breakpoints una sola vez
    const gridSpans = {
        xs: getSpan(columns_mobile),
        sm: getSpan(columns_tablet),
        md: getSpan(columns_desktop)
    };

    return (
        <Box
            // Combinación de Tailwind (w-full) y MUI (sx)
            className="w-full"
            sx={{
                bgcolor: background_color,
                py: padding_y,
                overflow: 'hidden'
            }}
        >
            <Container className='max-w-[initial!important] p-[0!important]'>
                {title && (
                    <Typography
                        variant="h4"
                        className="font-bold mb-8 text-center"
                        sx={{ color: 'inherit' }}
                    >
                        {title}
                    </Typography>
                )}

                <Grid
                    container
                    spacing={gap}
                    // Tailwind: Aseguramos que el contenedor no tenga desbordamiento
                    className="flex flex-wrap"
                >
                    {children && children.length > 0 ? (
                        children.map((child) => (
                            <Grid
                                item
                                key={child.id}
                                // Aquí está el corazón de la responsividad
                                size={{ xs: gridSpans.xs, sm: gridSpans.sm, md: gridSpans.md }}
                                // Tailwind: aseguramos que el item se comporte bien
                                className="flex"
                            >
                                <Box className="w-full flex flex-col">
                                    {/* Pasamos el hijo individual al Renderer */}
                                    <PageRenderer sections={[child]} />
                                </Box>
                            </Grid>
                        ))
                    ) : (
                        /* Estado vacío para el editor */
                        <Grid item xs={12}>
                            <Box className="w-full p-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50/50">
                                <Typography className="text-gray-400 font-medium">
                                    Grid Vacío: Agregue elementos desde el panel de capas (+)
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default FeaturesGrid;